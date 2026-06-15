import type { Room } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { RoomCard } from '@/features/rooms/ui/RoomCard'

type RoomListProps = {
	rooms: Room[]
	deletingRoomId?: string
	onCreate: () => void
	onDelete: (room: Room) => void
	onEdit: (room: Room) => void
}

export const RoomList = ({
	deletingRoomId,
	onCreate,
	onDelete,
	onEdit,
	rooms,
}: RoomListProps) => {
	if (rooms.length === 0) {
		return (
			<EmptyState
				title='No rooms yet'
				description='Create the first room for your team and keep bookings in one quiet place.'
				action={
					<Button variant='secondary' onClick={onCreate}>
						Create room
					</Button>
				}
			/>
		)
	}

	return (
		<div className='grid gap-4 md:grid-cols-2'>
			{rooms.map((room) => (
				<RoomCard
					key={room.id}
					room={room}
					isDeleting={deletingRoomId === room.id}
					onDelete={onDelete}
					onEdit={onEdit}
				/>
			))}
		</div>
	)
}
