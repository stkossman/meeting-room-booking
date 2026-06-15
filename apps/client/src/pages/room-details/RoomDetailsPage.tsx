import { useAuth } from '@/features/auth/model/useAuth'
import { BookingsPanel } from '@/features/bookings/ui'
import { useRoom } from '@/features/rooms/model'
import {
	RoomDetailsHeader,
	RoomMembersPanel,
} from '@/features/rooms/ui'
import { useParams } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'

export const RoomDetailsPage = () => {
	const { id } = useParams<{ id: string }>()
	const { logout } = useAuth()
	const roomQuery = useRoom(id)

	return (
		<main className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10'>
			{roomQuery.isLoading && (
				<div className='rounded-lg border border-stone-200 bg-white/70 p-8 text-sm text-stone-600'>
					Loading room...
				</div>
			)}
			{roomQuery.isError && (
				<EmptyState
					title='Room not found'
					description='The room may have been deleted or you may not have access to it.'
					action={
						<Button variant='secondary' onClick={() => void roomQuery.refetch()}>
							Retry
						</Button>
					}
				/>
			)}
			{roomQuery.data && (
				<>
					<RoomDetailsHeader room={roomQuery.data} onLogout={logout} />
					<section className='mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]'>
						<BookingsPanel room={roomQuery.data} />
						<RoomMembersPanel room={roomQuery.data} />
					</section>
				</>
			)}
		</main>
	)
}
