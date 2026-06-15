import { getAuthErrorMessage, useAuth } from '@/features/auth/model/useAuth'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
	email: z.string().trim().email('Enter a valid email').max(255),
	password: z.string().min(1, 'Password is required').max(255),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
	const { loginMutation } = useAuth()
	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = (values: LoginFormValues) => {
		loginMutation.mutate(values)
	}

	return (
		<form className='mt-6 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
			<Input
				label='Email'
				type='email'
				placeholder='you@team.com'
				error={errors.email?.message}
				{...register('email')}
			/>
			<Input
				label='Password'
				type='password'
				placeholder='Enter your password'
				error={errors.password?.message}
				{...register('password')}
			/>
			{loginMutation.isError && (
				<p className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
					{getAuthErrorMessage(loginMutation.error)}
				</p>
			)}
			<Button className='w-full' disabled={loginMutation.isPending} type='submit'>
				{loginMutation.isPending ? 'Signing in...' : 'Continue'}
			</Button>
		</form>
	)
}
