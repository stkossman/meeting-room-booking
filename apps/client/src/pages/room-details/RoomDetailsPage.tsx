import { useAuth } from '@/features/auth/model/useAuth'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'

export const RoomDetailsPage = () => {
	const { id } = useParams<{ id: string }>()
	const { logout } = useAuth()

	return (
		<main className='mx-auto w-full max-w-5xl px-6 py-10'>
			<header className='flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-start sm:justify-between'>
				<div>
					<Link className='text-sm font-medium text-stone-600 underline' to='/rooms'>
						Back to rooms
					</Link>
					<h1 className='mt-4 text-3xl font-semibold text-stone-950'>
						Room details
					</h1>
					<p className='mt-2 text-sm text-stone-500'>{id}</p>
				</div>
				<Button variant='secondary' onClick={logout}>
					Logout
				</Button>
			</header>
			<section className='mt-8 grid gap-6 md:grid-cols-[1fr_320px]'>
				<EmptyState
					title='No bookings scheduled'
					description='This room is open for planning sessions, interviews, and daily syncs.'
				/>
				<EmptyState
					title='Members'
					description='Invite teammates and decide who can manage the room.'
					action={<Button variant='secondary'>Add member</Button>}
				/>
			</section>
		</main>
	)
}
