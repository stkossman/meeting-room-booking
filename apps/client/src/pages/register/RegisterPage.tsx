import { RegisterForm } from '@/features/auth/ui/RegisterForm'
import { Link } from 'react-router-dom'

export const RegisterPage = () => {
	return (
		<main className='mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12'>
			<div className='rounded-lg border border-stone-200 bg-white p-6 shadow-sm'>
				<p className='text-sm font-medium text-stone-500'>Meeting Room Booking</p>
				<h1 className='mt-2 text-2xl font-semibold text-stone-950'>
					Create account
				</h1>
				<RegisterForm />
				<p className='mt-5 text-sm text-stone-600'>
					Already have an account?{' '}
					<Link className='font-medium text-stone-950 underline' to='/login'>
						Log in
					</Link>
				</p>
			</div>
		</main>
	)
}
