import { BookingCard } from '@/features/bookings/ui/BookingCard'
import type { Booking } from '@/shared/types/booking'
import type { Room } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'

type BookingListProps = {
	bookings: Booking[]
	cancellingBookingId?: string
	currentUserId?: string
	joiningBookingId?: string
	room: Room
	selectedDate: string
	onCancel: (booking: Booking) => void
	onCreate: () => void
	onEdit: (booking: Booking) => void
	onJoin: (booking: Booking) => void
}

export const BookingList = ({
	bookings,
	cancellingBookingId,
	currentUserId,
	joiningBookingId,
	onCancel,
	onCreate,
	onEdit,
	onJoin,
	room,
	selectedDate,
}: BookingListProps) => {
	if (bookings.length === 0) {
		return (
			<EmptyState
				title='No bookings for this date'
				description={`This room is open on ${selectedDate}.`}
				action={
					room.role === 'ADMIN' ? (
						<Button variant='secondary' onClick={onCreate}>
							Create booking
						</Button>
					) : undefined
				}
			/>
		)
	}

	return (
		<div className='grid gap-4'>
			{bookings.map((booking) => (
				<BookingCard
					key={booking.id}
					booking={booking}
					currentUserId={currentUserId}
					room={room}
					isCancelling={cancellingBookingId === booking.id}
					isJoining={joiningBookingId === booking.id}
					onCancel={onCancel}
					onEdit={onEdit}
					onJoin={onJoin}
				/>
			))}
		</div>
	)
}
