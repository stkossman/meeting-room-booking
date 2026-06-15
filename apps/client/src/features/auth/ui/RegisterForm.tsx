import { getAuthErrorMessage, useAuth } from '@/features/auth/model/useAuth'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const registerSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(255),
	email: z.string().trim().email('Enter a valid email').max(255),
	password: z.string().min(6, 'Password must be at least 6 characters').max(255),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export const RegisterForm = () => {
	const { registerMutation } = useAuth()
	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			name: '',
			password: '',
		},
	})

	const onSubmit = (values: RegisterFormValues) => {
		registerMutation.mutate(values)
	}

	return (
		<form className='mt-6 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
			<Input
				label='Name'
				placeholder='Alex Morgan'
				error={errors.name?.message}
				{...register('name')}
			/>
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
				placeholder='At least 6 characters'
				error={errors.password?.message}
				{...register('password')}
			/>
			{registerMutation.isError && (
				<p className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
					{getAuthErrorMessage(registerMutation.error)}
				</p>
			)}
			<Button
				className='w-full'
				disabled={registerMutation.isPending}
				type='submit'
			>
				{registerMutation.isPending ? 'Creating account...' : 'Create account'}
			</Button>
		</form>
	)
}
