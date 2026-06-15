import { z } from 'zod'

const isoDateTimeSchema = z.iso.datetime()

export const roomBookingParamsSchema = z.object({
	roomId: z.uuid(),
})

export const bookingParamsSchema = z.object({
	bookingId: z.uuid(),
})

export const bookingListQuerySchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected date in YYYY-MM-DD format')
		.optional(),
})

export const createBookingSchema = z
	.object({
		description: z.string().trim().max(500).optional(),
		startTime: isoDateTimeSchema,
		endTime: isoDateTimeSchema,
	})
	.refine((data) => new Date(data.endTime) > new Date(data.startTime), {
		message: 'endTime must be later than startTime',
		path: ['endTime'],
	})

export const updateBookingSchema = z
	.object({
		description: z.string().trim().max(500).optional(),
		startTime: isoDateTimeSchema.optional(),
		endTime: isoDateTimeSchema.optional(),
	})
	.refine(
		(data) =>
			data.description !== undefined ||
			data.startTime !== undefined ||
			data.endTime !== undefined,
		{
			message: 'At least one field is required',
		},
	)

export type RoomBookingParams = z.infer<typeof roomBookingParamsSchema>
export type BookingParams = z.infer<typeof bookingParamsSchema>
export type BookingListQuery = z.infer<typeof bookingListQuerySchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
