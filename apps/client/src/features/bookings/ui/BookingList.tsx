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
}: BookingListProps) => {
	if (bookings.length === 0) {
		return (
			<EmptyState
				title='No bookings scheduled'
				description='This room is open for planning sessions, interviews, and daily syncs.'
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
