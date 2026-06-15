import { Prisma, RoomRole } from '@prisma/client'
import { prisma } from '../../config/prisma'

const roomMemberSelect = {
	id: true,
	roomId: true,
	userId: true,
	role: true,
	createdAt: true,
	updatedAt: true,
	user: {
		select: {
			id: true,
			name: true,
			email: true,
		},
	},
} satisfies Prisma.RoomMemberSelect

const membershipSelect = {
	id: true,
	roomId: true,
	userId: true,
	role: true,
} satisfies Prisma.RoomMemberSelect

const userSelect = {
	id: true,
	name: true,
	email: true,
} satisfies Prisma.UserSelect

export type RoomMemberDetails = Prisma.RoomMemberGetPayload<{
	select: typeof roomMemberSelect
}>

export type RoomMembership = Prisma.RoomMemberGetPayload<{
	select: typeof membershipSelect
}>

export type RoomMemberUser = Prisma.UserGetPayload<{
	select: typeof userSelect
}>

export const roomMemberRepository = {
	findRoomById(roomId: string): Promise<{ id: string } | null> {
		return prisma.room.findUnique({
			where: { id: roomId },
			select: { id: true },
		})
	},

	findUserByEmail(email: string): Promise<RoomMemberUser | null> {
		return prisma.user.findUnique({
			where: { email },
			select: userSelect,
		})
	},

	findMembership(
		roomId: string,
		userId: string,
	): Promise<RoomMembership | null> {
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

	findMemberById(
		roomId: string,
		memberId: string,
	): Promise<RoomMembership | null> {
		return prisma.roomMember.findFirst({
			where: {
				id: memberId,
				roomId,
			},
			select: membershipSelect,
		})
	},

	listMembers(roomId: string): Promise<RoomMemberDetails[]> {
		return prisma.roomMember.findMany({
			where: { roomId },
			select: roomMemberSelect,
			orderBy: {
				createdAt: 'asc',
			},
		})
	},

	createMember(
		roomId: string,
		userId: string,
		role: RoomRole,
	): Promise<RoomMemberDetails> {
		return prisma.roomMember.create({
			data: {
				roomId,
				userId,
				role,
			},
			select: roomMemberSelect,
		})
	},

	updateMemberRole(
		memberId: string,
		role: RoomRole,
	): Promise<RoomMemberDetails> {
		return prisma.roomMember.update({
			where: { id: memberId },
			data: { role },
			select: roomMemberSelect,
		})
	},

	deleteMember(memberId: string): Promise<void> {
		return prisma.roomMember
			.delete({
				where: { id: memberId },
				select: { id: true },
			})
			.then(() => undefined)
	},

	countAdmins(roomId: string): Promise<number> {
		return prisma.roomMember.count({
			where: {
				roomId,
				role: RoomRole.ADMIN,
			},
		})
	},
}
