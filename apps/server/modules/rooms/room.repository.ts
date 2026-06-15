import { Prisma, RoomRole } from '@prisma/client'
import { prisma } from '../../config/prisma'
import type { CreateRoomInput, UpdateRoomInput } from './room.schemas'

const roomSelect = {
	id: true,
	name: true,
	description: true,
	createdById: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.RoomSelect

const membershipSelect = {
	id: true,
	role: true,
} satisfies Prisma.RoomMemberSelect

export type RoomWithCurrentUserRole = Prisma.RoomGetPayload<{
	select: typeof roomSelect
}> & {
	role: RoomRole
}

export type RoomMembership = Prisma.RoomMemberGetPayload<{
	select: typeof membershipSelect
}>

const toRoomWithRole = (
	roomMember: Prisma.RoomMemberGetPayload<{
		select: {
			role: true
			room: {
				select: typeof roomSelect
			}
		}
	}>,
): RoomWithCurrentUserRole => ({
	...roomMember.room,
	role: roomMember.role,
})

export const roomRepository = {
	async findRoomsByUserId(userId: string): Promise<RoomWithCurrentUserRole[]> {
		const roomMembers = await prisma.roomMember.findMany({
			where: { userId },
			select: {
				role: true,
				room: {
					select: roomSelect,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return roomMembers.map(toRoomWithRole)
	},

	async findRoomForUser(
		roomId: string,
		userId: string,
	): Promise<RoomWithCurrentUserRole | null> {
		const roomMember = await prisma.roomMember.findUnique({
			where: {
				roomId_userId: {
					roomId,
					userId,
				},
			},
			select: {
				role: true,
				room: {
					select: roomSelect,
				},
			},
		})

		return roomMember ? toRoomWithRole(roomMember) : null
	},

	findMembership(roomId: string, userId: string): Promise<RoomMembership | null> {
		return prisma.roomMember.findUnique({
			where: {
				roomId_userId: {
					roomId,
					userId,
				},
			},
			select: membershipSelect,
		})
	},

	async createRoom(
		input: CreateRoomInput,
		createdById: string,
	): Promise<RoomWithCurrentUserRole> {
		return prisma.$transaction(async (tx) => {
			const room = await tx.room.create({
				data: {
					name: input.name.trim(),
					description: input.description?.trim(),
					createdById,
				},
				select: roomSelect,
			})

			await tx.roomMember.create({
				data: {
					roomId: room.id,
					userId: createdById,
					role: RoomRole.ADMIN,
				},
			})

			return {
				...room,
				role: RoomRole.ADMIN,
			}
		})
	},

	updateRoom(roomId: string, input: UpdateRoomInput) {
		return prisma.room.update({
			where: { id: roomId },
			data: {
				name: input.name?.trim(),
				description: input.description?.trim(),
			},
			select: roomSelect,
		})
	},

	deleteRoom(roomId: string) {
		return prisma.room.delete({
			where: { id: roomId },
			select: { id: true },
		})
	},
}
