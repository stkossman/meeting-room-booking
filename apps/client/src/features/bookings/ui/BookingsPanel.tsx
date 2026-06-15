import { getAuthErrorMessage, useAuth } from '@/features/auth/model'
import {
	useBookings,
	useCancelBooking,
	useCreateBooking,
	useJoinBooking,
	useUpdateBooking,
} from '@/features/bookings/model'
import { BookingForm } from '@/features/bookings/ui/BookingForm'
import { BookingList } from '@/features/bookings/ui/BookingList'
import type { Booking, BookingFormValues } from '@/shared/types/booking'
import type { Room } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Modal } from '@/shared/ui/Modal'
import { useState } from 'react'

type BookingsPanelProps = {
	room: Room
}

export const BookingsPanel = ({ room }: BookingsPanelProps) => {
	const { meQuery } = useAuth()
	const bookingsQuery = useBookings(room.id)
	const createBookingMutation = useCreateBooking(room.id)
	const updateBookingMutation = useUpdateBooking(room.id)
	const cancelBookingMutation = useCancelBooking(room.id)
	const joinBookingMutation = useJoinBooking(room.id)
	const [isCreateModalOpen, setCreateModalOpen] = useState(false)
	const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
	const isAdmin = room.role === 'ADMIN'

	const handleCreateBooking = (values: BookingFormValues) => {
		createBookingMutation.mutate(values, {
			onSuccess: () => setCreateModalOpen(false),
		})
	}

	const handleUpdateBooking = (values: BookingFormValues) => {
		if (!editingBooking) {
			return
		}

		updateBookingMutation.mutate(
			{
				bookingId: editingBooking.id,
				payload: values,
			},
			{
				onSuccess: () => setEditingBooking(null),
			},
		)
	}

	const handleCancelBooking = (booking: Booking) => {
		if (!window.confirm('Cancel this booking?')) {
			return
		}

		cancelBookingMutation.mutate(booking.id)
	}

	const handleJoinBooking = (booking: Booking) => {
		joinBookingMutation.mutate(booking.id)
	}

	return (
		<section className='rounded-lg border border-stone-200 bg-white/60 p-5 shadow-sm'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div>
					<h2 className='text-lg font-semibold text-stone-950'>Bookings</h2>
					<p className='mt-1 text-sm text-stone-600'>
						Upcoming active bookings for this room.
					</p>
				</div>
				{isAdmin && (
					<Button onClick={() => setCreateModalOpen(true)}>Create booking</Button>
				)}
			</div>
			<div className='mt-5'>
				{bookingsQuery.isLoading && (
					<p className='rounded-md border border-stone-200 bg-white/70 p-4 text-sm text-stone-600'>
						Loading bookings...
					</p>
				)}
				{bookingsQuery.isError && (
					<EmptyState
						title='Could not load bookings'
						description='Please try again in a moment.'
						action={
							<Button
								variant='secondary'
								onClick={() => void bookingsQuery.refetch()}
							>
								Retry
							</Button>
						}
					/>
				)}
				{bookingsQuery.data && (
					<BookingList
						bookings={bookingsQuery.data}
						currentUserId={meQuery.data?.id}
						room={room}
						cancellingBookingId={cancelBookingMutation.variables}
						joiningBookingId={joinBookingMutation.variables}
						onCancel={handleCancelBooking}
						onCreate={() => setCreateModalOpen(true)}
						onEdit={setEditingBooking}
						onJoin={handleJoinBooking}
					/>
				)}
				{cancelBookingMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getAuthErrorMessage(cancelBookingMutation.error)}
					</p>
				)}
				{joinBookingMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getAuthErrorMessage(joinBookingMutation.error)}
					</p>
				)}
			</div>
			<Modal
				isOpen={isCreateModalOpen}
				title='Create booking'
				onClose={() => setCreateModalOpen(false)}
			>
				<BookingForm
					submitLabel='Create booking'
					isSubmitting={createBookingMutation.isPending}
					onCancel={() => setCreateModalOpen(false)}
					onSubmit={handleCreateBooking}
				/>
				{createBookingMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getAuthErrorMessage(createBookingMutation.error)}
					</p>
				)}
			</Modal>
			<Modal
				isOpen={Boolean(editingBooking)}
				title='Edit booking'
				onClose={() => setEditingBooking(null)}
			>
				{editingBooking && (
					<BookingForm
						booking={editingBooking}
						submitLabel='Save changes'
						isSubmitting={updateBookingMutation.isPending}
						onCancel={() => setEditingBooking(null)}
						onSubmit={handleUpdateBooking}
					/>
				)}
				{updateBookingMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getAuthErrorMessage(updateBookingMutation.error)}
					</p>
				)}
			</Modal>
		</section>
	)
}
