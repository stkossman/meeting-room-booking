import type { AddRoomMemberValues } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const addRoomMemberSchema = z.object({
	email: z.string().trim().email('Enter a valid email').max(255),
	role: z.enum(['ADMIN', 'USER']),
})

type AddRoomMemberFormProps = {
	isSubmitting?: boolean
	onSubmit: (values: AddRoomMemberValues) => void
}

export const AddRoomMemberForm = ({
	isSubmitting = false,
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

	const submit = (values: AddRoomMemberValues) => {
		onSubmit(values)
		reset({
			email: '',
			role: values.role,
		})
	}

	return (
		<form className='grid gap-3' onSubmit={handleSubmit(submit)}>
			<Input
				label='Email'
				type='email'
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
