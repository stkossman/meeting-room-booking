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
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { format } from 'date-fns'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

type BookingsPanelProps = {
	room: Room
}

export const BookingsPanel = ({ room }: BookingsPanelProps) => {
	const { meQuery } = useAuth()
	const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
	const bookingsQuery = useBookings(room.id, selectedDate)
	const createBookingMutation = useCreateBooking(room.id)
	const updateBookingMutation = useUpdateBooking(room.id)
	const cancelBookingMutation = useCancelBooking(room.id)
	const joinBookingMutation = useJoinBooking(room.id)
	const [isCreateModalOpen, setCreateModalOpen] = useState(false)
	const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
	const [createResetSignal, setCreateResetSignal] = useState(0)
	const isAdmin = room.role === 'ADMIN'

	const getBookingErrorMessage = (error: unknown): string => {
		if (isAxiosError(error) && error.response?.status === 409) {
			return 'This room is already booked for the selected time.'
		}

		return getAuthErrorMessage(error)
	}

	const handleCreateBooking = (values: BookingFormValues) => {
		createBookingMutation.mutate(values, {
			onSuccess: () => {
				toast.success('Booking created')
				setCreateResetSignal((value) => value + 1)
			},
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
				onSuccess: () => {
					toast.success('Booking updated')
					setEditingBooking(null)
				},
			},
		)
	}

	const handleCancelBooking = (booking: Booking) => {
		if (!window.confirm('Cancel this booking?')) {
			return
		}

		cancelBookingMutation.mutate(booking.id, {
			onSuccess: () => toast.success('Booking cancelled'),
		})
	}

	const handleJoinBooking = (booking: Booking) => {
		joinBookingMutation.mutate(booking.id, {
			onSuccess: () => toast.success('Joined booking'),
		})
	}

	return (
		<section className='rounded-lg border border-stone-200 bg-white/60 p-5 shadow-sm'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div>
					<h2 className='text-lg font-semibold text-stone-950'>Bookings</h2>
					<p className='mt-1 text-sm text-stone-600'>
						Active bookings for the selected date.
					</p>
				</div>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
					<Input
						label='Date'
						type='date'
						value={selectedDate}
						onChange={(event) => setSelectedDate(event.target.value)}
					/>
					{isAdmin && (
						<Button onClick={() => setCreateModalOpen(true)}>
							Create booking
						</Button>
					)}
				</div>
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
						selectedDate={selectedDate}
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
						{getBookingErrorMessage(cancelBookingMutation.error)}
					</p>
				)}
				{joinBookingMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getBookingErrorMessage(joinBookingMutation.error)}
					</p>
				)}
			</div>
			<Modal
				isOpen={isCreateModalOpen}
				title='Create booking'
				onClose={() => setCreateModalOpen(false)}
			>
				<BookingForm
					defaultDate={selectedDate}
					submitLabel='Create booking'
					isSubmitting={createBookingMutation.isPending}
					resetSignal={createResetSignal}
					onCancel={() => setCreateModalOpen(false)}
					onSubmit={handleCreateBooking}
				/>
				{createBookingMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getBookingErrorMessage(createBookingMutation.error)}
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
						{getBookingErrorMessage(updateBookingMutation.error)}
					</p>
				)}
			</Modal>
		</section>
	)
}
