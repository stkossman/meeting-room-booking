import type { RoomFormValues } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const roomFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(120),
	description: z
		.string()
		.trim()
		.max(500)
		.optional()
		.transform((value) => (value ? value : undefined)),
})

type RoomFormProps = {
	defaultValues?: RoomFormValues
	isSubmitting?: boolean
	submitLabel: string
	onCancel?: () => void
	onSubmit: (values: RoomFormValues) => void
}

export const RoomForm = ({
	defaultValues,
	isSubmitting = false,
	onCancel,
	onSubmit,
	submitLabel,
}: RoomFormProps) => {
	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
	} = useForm<RoomFormValues>({
		resolver: zodResolver(roomFormSchema),
		defaultValues: defaultValues ?? {
			description: '',
			name: '',
		},
	})

	useEffect(() => {
		reset(
			defaultValues ?? {
				description: '',
				name: '',
			},
		)
	}, [defaultValues, reset])

	return (
		<form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
			<Input
				label='Room name'
				maxLength={120}
				placeholder='Main meeting room'
				error={errors.name?.message}
				{...register('name')}
			/>
			<Textarea
				label='Description'
				maxLength={500}
				placeholder='A quiet space for planning and team syncs'
				error={errors.description?.message}
				{...register('description')}
			/>
			<div className='flex justify-end gap-3'>
				{onCancel && (
					<Button variant='ghost' onClick={onCancel}>
						Cancel
					</Button>
				)}
				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting ? 'Saving...' : submitLabel}
				</Button>
			</div>
		</form>
	)
}
