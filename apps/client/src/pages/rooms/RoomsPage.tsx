import { useAuth } from '@/features/auth/model/useAuth'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'

export const RoomsPage = () => {
	const { logout, meQuery } = useAuth()

	return (
		<main className='mx-auto w-full max-w-5xl px-6 py-10'>
			<header className='flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<p className='text-sm font-medium text-stone-500'>
						{meQuery.data ? meQuery.data.email : 'Workspace'}
					</p>
					<h1 className='mt-2 text-3xl font-semibold text-stone-950'>Rooms</h1>
				</div>
				<div className='flex items-center gap-3'>
					<Button variant='secondary' onClick={logout}>
						Logout
					</Button>
					<Button>Create room</Button>
				</div>
			</header>
			<section className='mt-8'>
				<EmptyState
					title='No rooms yet'
					description='Create the first room for your team and keep bookings in one quiet place.'
					action={
						<Link to='/rooms/demo-room'>
							<Button variant='secondary'>Open room preview</Button>
						</Link>
					}
				/>
			</section>
		</main>
	)
}
