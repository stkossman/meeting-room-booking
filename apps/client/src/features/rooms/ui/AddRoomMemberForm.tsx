import type { AddRoomMemberValues } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const addRoomMemberSchema = z.object({
	email: z.string().trim().email('Enter a valid email').max(255),
	role: z.enum(['ADMIN', 'USER']),
})

type AddRoomMemberFormProps = {
	isSubmitting?: boolean
	resetSignal?: number
	onSubmit: (values: AddRoomMemberValues) => void
}

export const AddRoomMemberForm = ({
	isSubmitting = false,
	resetSignal,
	onSubmit,
}: AddRoomMemberFormProps) => {
	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
	} = useForm<AddRoomMemberValues>({
		resolver: zodResolver(addRoomMemberSchema),
		defaultValues: {
			email: '',
			role: 'USER',
		},
	})

	useEffect(() => {
		if (resetSignal === undefined) {
			return
		}

		reset({
			email: '',
			role: 'USER',
		})
	}, [reset, resetSignal])

	const submit = (values: AddRoomMemberValues) => {
		onSubmit(values)
	}

	return (
		<form className='grid gap-3' onSubmit={handleSubmit(submit)}>
			<Input
				label='Email'
				type='email'
				maxLength={255}
				placeholder='teammate@company.com'
				error={errors.email?.message}
				{...register('email')}
			/>
			<Select label='Role' error={errors.role?.message} {...register('role')}>
				<option value='USER'>USER</option>
				<option value='ADMIN'>ADMIN</option>
			</Select>
			<Button type='submit' disabled={isSubmitting}>
				{isSubmitting ? 'Adding...' : 'Add member'}
			</Button>
		</form>
	)
}
