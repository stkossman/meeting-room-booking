import { z } from 'zod'

export const roomParamsSchema = z.object({
	id: z.string().uuid(),
})

export const createRoomSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(120),
	description: z.string().trim().max(500).optional(),
})

export const updateRoomSchema = z
	.object({
		name: z.string().trim().min(1, 'Name is required').max(120).optional(),
		description: z.string().trim().max(500).optional(),
	})
	.refine((data) => data.name !== undefined || data.description !== undefined, {
		message: 'At least one field is required',
	})

export type RoomParams = z.infer<typeof roomParamsSchema>
export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>
