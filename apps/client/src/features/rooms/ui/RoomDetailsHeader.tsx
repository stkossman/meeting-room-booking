import type { Room } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { Link } from 'react-router-dom'

type RoomDetailsHeaderProps = {
	room: Room
	onLogout: () => void
}

export const RoomDetailsHeader = ({
	onLogout,
	room,
}: RoomDetailsHeaderProps) => {
	return (
		<header className='flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-start sm:justify-between'>
			<div>
				<Link className='text-sm font-medium text-stone-600 underline' to='/rooms'>
					Back to rooms
				</Link>
				<div className='mt-4 flex flex-wrap items-center gap-3'>
					<h1 className='text-3xl font-semibold text-stone-950'>{room.name}</h1>
					<span className='rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600'>
						{room.role}
					</span>
				</div>
				<p className='mt-3 max-w-2xl text-sm leading-6 text-stone-600'>
					{room.description || 'No description yet.'}
				</p>
			</div>
			<Button variant='secondary' onClick={onLogout}>
				Logout
			</Button>
		</header>
	)
}
