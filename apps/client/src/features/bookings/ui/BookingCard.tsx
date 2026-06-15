import type { Booking } from '@/shared/types/booking'
import type { Room } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { format } from 'date-fns'

type BookingCardProps = {
	booking: Booking
	currentUserId?: string
	isCancelling?: boolean
	isJoining?: boolean
	room: Room
	onCancel: (booking: Booking) => void
	onEdit: (booking: Booking) => void
	onJoin: (booking: Booking) => void
}

const formatTimeRange = (booking: Booking): string => {
	const start = new Date(booking.startTime)
	const end = new Date(booking.endTime)

	return `${format(start, 'MMM d, HH:mm')} - ${format(end, 'HH:mm')}`
}

export const BookingCard = ({
	booking,
	currentUserId,
	isCancelling = false,
	isJoining = false,
	onCancel,
	onEdit,
	onJoin,
	room,
}: BookingCardProps) => {
	const isAdmin = room.role === 'ADMIN'
	const hasJoined = booking.participants.some(
		(participant) => participant.userId === currentUserId,
	)

	return (
		<article className='rounded-lg border border-stone-200 bg-white/85 p-5 shadow-sm'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div className='flex min-w-0 gap-4'>
					<div className='mt-1 h-auto w-1 rounded-full bg-stone-300' />
					<div className='min-w-0'>
						<p className='text-base font-semibold text-stone-950'>
							{formatTimeRange(booking)}
						</p>
						<p className='mt-2 text-sm leading-6 text-stone-600'>
							{booking.description || 'No description.'}
						</p>
						<p className='mt-3 text-xs text-stone-500'>
							Created by {booking.createdBy.name}
						</p>
					</div>
				</div>
				<span className='rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600'>
					{booking.participants.length} joined
				</span>
			</div>
			{booking.participants.length > 0 && (
				<div className='mt-4 flex flex-wrap gap-2'>
					{booking.participants.map((participant) => (
						<span
							key={participant.id}
							className='rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600'
						>
							{participant.user.name}
						</span>
					))}
				</div>
			)}
			<div className='mt-5 flex justify-end gap-2'>
				{isAdmin ? (
					<>
						<Button variant='ghost' onClick={() => onEdit(booking)}>
							Edit
						</Button>
						<Button
							variant='ghost'
							disabled={isCancelling}
							onClick={() => onCancel(booking)}
						>
							{isCancelling ? 'Cancelling...' : 'Cancel'}
						</Button>
					</>
				) : (
					<Button
						variant='secondary'
						disabled={hasJoined || isJoining}
						onClick={() => onJoin(booking)}
					>
						{hasJoined ? 'Joined' : isJoining ? 'Joining...' : 'Join'}
					</Button>
				)}
			</div>
		</article>
	)
}
