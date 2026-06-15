import { RoomRole } from '@prisma/client'
import { z } from 'zod'

export const roomMemberParamsSchema = z.object({
	roomId: z.uuid(),
})

export const roomMemberByIdParamsSchema = roomMemberParamsSchema.extend({
	memberId: z.uuid(),
})

export const addRoomMemberSchema = z.object({
	email: z.email().trim().max(255),
	role: z.enum([RoomRole.ADMIN, RoomRole.USER]),
})

export const updateRoomMemberSchema = z.object({
	role: z.enum([RoomRole.ADMIN, RoomRole.USER]),
})

export type RoomMemberParams = z.infer<typeof roomMemberParamsSchema>
export type RoomMemberByIdParams = z.infer<typeof roomMemberByIdParamsSchema>
export type AddRoomMemberInput = z.infer<typeof addRoomMemberSchema>
export type UpdateRoomMemberInput = z.infer<typeof updateRoomMemberSchema>
