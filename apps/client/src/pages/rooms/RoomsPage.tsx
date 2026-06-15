import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'

export const RoomsPage = () => {
	return (
		<main className='mx-auto w-full max-w-5xl px-6 py-10'>
			<header className='flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<p className='text-sm font-medium text-stone-500'>Workspace</p>
					<h1 className='mt-2 text-3xl font-semibold text-stone-950'>Rooms</h1>
				</div>
				<Button>Create room</Button>
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
