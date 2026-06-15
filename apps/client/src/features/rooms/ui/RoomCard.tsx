import type { Room, RoomFormValues } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { Link } from 'react-router-dom'

type RoomCardProps = {
	room: Room
	isDeleting?: boolean
	onDelete: (room: Room) => void
	onEdit: (room: Room) => void
}

const getInitials = (name: string): string => {
	return name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase()
}

export const getRoomFormValues = (room: Room): RoomFormValues => ({
	description: room.description ?? '',
	name: room.name,
})

export const RoomCard = ({
	isDeleting = false,
	onDelete,
	onEdit,
	room,
}: RoomCardProps) => {
	const isAdmin = room.role === 'ADMIN'

	return (
		<article className='rounded-lg border border-stone-200 bg-white/85 p-5 shadow-sm transition hover:border-stone-300 hover:bg-white'>
			<div className='flex items-start gap-4'>
				<div className='grid size-11 shrink-0 place-items-center rounded-md bg-stone-100 text-sm font-semibold text-stone-700'>
					{getInitials(room.name)}
				</div>
				<div className='min-w-0 flex-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<h2 className='truncate text-lg font-semibold text-stone-950'>
							{room.name}
						</h2>
						<span className='rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-600'>
							{room.role}
						</span>
					</div>
					<p className='mt-2 line-clamp-2 break-words text-sm leading-6 text-stone-600'>
						{room.description || 'No description yet.'}
					</p>
				</div>
			</div>
			<div className='mt-5 flex flex-wrap justify-end gap-2'>
				{isAdmin && (
					<>
						<Button variant='ghost' onClick={() => onEdit(room)}>
							Edit
						</Button>
						<Button
							variant='danger'
							disabled={isDeleting}
							onClick={() => onDelete(room)}
						>
							{isDeleting ? 'Deleting...' : 'Delete'}
						</Button>
					</>
				)}
				<Link to={`/rooms/${room.id}`}>
					<Button variant='secondary'>Open</Button>
				</Link>
			</div>
		</article>
	)
}
