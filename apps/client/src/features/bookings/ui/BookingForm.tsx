import type { Booking, BookingFormValues } from '@/shared/types/booking'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const bookingFormSchema = z
	.object({
		description: z.string().trim().max(500).optional(),
		date: z.string().min(1, 'Date is required'),
		startTime: z.string().min(1, 'Start time is required'),
		endTime: z.string().min(1, 'End time is required'),
	})
	.refine(
		(data) =>
			new Date(`${data.date}T${data.endTime}`) >
			new Date(`${data.date}T${data.startTime}`),
		{
			message: 'End time must be later than start time',
			path: ['endTime'],
		},
	)

type BookingFormFields = z.infer<typeof bookingFormSchema>

type BookingFormProps = {
	booking?: Booking
	defaultDate?: string
	isSubmitting?: boolean
	resetSignal?: number
	submitLabel: string
	onCancel?: () => void
	onSubmit: (values: BookingFormValues) => void
}

const getDefaultValues = (
	booking?: Booking,
	defaultDate?: string,
): BookingFormFields => {
	if (!booking) {
		return {
			date: defaultDate ?? format(new Date(), 'yyyy-MM-dd'),
			endTime: '',
			startTime: '',
			description: '',
		}
	}

	const startTime = new Date(booking.startTime)
	const endTime = new Date(booking.endTime)

	return {
		date: format(startTime, 'yyyy-MM-dd'),
		endTime: format(endTime, 'HH:mm'),
		startTime: format(startTime, 'HH:mm'),
		description: booking.description ?? '',
	}
}

const toBookingPayload = (values: BookingFormFields): BookingFormValues => ({
	description: values.description?.trim() || undefined,
	endTime: new Date(`${values.date}T${values.endTime}`).toISOString(),
	startTime: new Date(`${values.date}T${values.startTime}`).toISOString(),
})

export const BookingForm = ({
	booking,
	defaultDate,
	isSubmitting = false,
	onCancel,
	onSubmit,
	resetSignal,
	submitLabel,
}: BookingFormProps) => {
	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
	} = useForm<BookingFormFields>({
		resolver: zodResolver(bookingFormSchema),
		defaultValues: getDefaultValues(booking, defaultDate),
	})

	useEffect(() => {
		reset(getDefaultValues(booking, defaultDate))
	}, [booking, defaultDate, reset])

	useEffect(() => {
		if (resetSignal === undefined || booking) {
			return
		}

		reset(getDefaultValues(undefined, defaultDate))
	}, [booking, defaultDate, reset, resetSignal])

	return (
		<form
			className='grid gap-4'
			onSubmit={handleSubmit((values) => onSubmit(toBookingPayload(values)))}
		>
			<Textarea
				label='Description'
				maxLength={500}
				placeholder='Planning, interview, design review...'
				error={errors.description?.message}
				{...register('description')}
			/>
			<div className='grid gap-3 sm:grid-cols-3'>
				<Input
					label='Date'
					type='date'
					error={errors.date?.message}
					{...register('date')}
				/>
				<Input
					label='Start'
					type='time'
					error={errors.startTime?.message}
					{...register('startTime')}
				/>
				<Input
					label='End'
					type='time'
					error={errors.endTime?.message}
					{...register('endTime')}
				/>
			</div>
			<p className='text-xs leading-5 text-stone-500'>
				Bookings are checked for conflicts before saving.
			</p>
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
