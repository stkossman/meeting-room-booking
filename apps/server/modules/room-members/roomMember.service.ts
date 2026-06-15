import { RoomRole } from '@prisma/client'
import { AppError } from '../../common/errors/AppError'
import {
	roomMemberRepository,
	type RoomMemberDetails,
	type RoomMembership,
} from './roomMember.repository'
import type {
	AddRoomMemberInput,
	UpdateRoomMemberInput,
} from './roomMember.schemas'

const getUserId = (user: Express.User | undefined): string => {
	if (!user) {
		throw new AppError('Unauthorized', 401)
	}

	return user.id
}

const ensureRoomExists = async (roomId: string): Promise<void> => {
	const room = await roomMemberRepository.findRoomById(roomId)

	if (!room) {
		throw new AppError('Room not found', 404)
	}
}

const getCurrentMembership = async (
	roomId: string,
	user: Express.User | undefined,
): Promise<RoomMembership> => {
	const userId = getUserId(user)
	const membership = await roomMemberRepository.findMembership(roomId, userId)

	if (!membership) {
		await ensureRoomExists(roomId)
		throw new AppError('Room not found', 404)
	}

	return membership
}

const ensureCurrentUserIsAdmin = async (
	roomId: string,
	user: Express.User | undefined,
): Promise<void> => {
	const membership = await getCurrentMembership(roomId, user)

	if (membership.role !== RoomRole.ADMIN) {
		throw new AppError('Forbidden', 403)
	}
}

const ensureTargetMember = async (
	roomId: string,
	memberId: string,
): Promise<RoomMembership> => {
	const member = await roomMemberRepository.findMemberById(roomId, memberId)

	if (!member) {
		throw new AppError('Member not found', 404)
	}

	return member
}

const ensureNotLastAdmin = async (member: RoomMembership): Promise<void> => {
	if (member.role !== RoomRole.ADMIN) {
		return
	}

	const adminCount = await roomMemberRepository.countAdmins(member.roomId)

	if (adminCount <= 1) {
		throw new AppError('Room must have at least one admin', 409)
	}
}

export const roomMemberService = {
	async listMembers(
		roomId: string,
		user: Express.User | undefined,
	): Promise<RoomMemberDetails[]> {
		await getCurrentMembership(roomId, user)

		return roomMemberRepository.listMembers(roomId)
	},

	async addMember(
		roomId: string,
		input: AddRoomMemberInput,
		user: Express.User | undefined,
	): Promise<RoomMemberDetails> {
		await ensureCurrentUserIsAdmin(roomId, user)

		const email = input.email.trim()
		const targetUser = await roomMemberRepository.findUserByEmail(email)

		if (!targetUser) {
			throw new AppError('User not found', 404)
		}

		const existingMember = await roomMemberRepository.findMembership(
			roomId,
			targetUser.id,
		)

		if (existingMember) {
			throw new AppError('User is already a room member', 409)
		}

		return roomMemberRepository.createMember(roomId, targetUser.id, input.role)
	},

	async updateMember(
		roomId: string,
		memberId: string,
		input: UpdateRoomMemberInput,
		user: Express.User | undefined,
	): Promise<RoomMemberDetails> {
		await ensureCurrentUserIsAdmin(roomId, user)

		const targetMember = await ensureTargetMember(roomId, memberId)

		if (targetMember.role === RoomRole.ADMIN && input.role !== RoomRole.ADMIN) {
			await ensureNotLastAdmin(targetMember)
		}

		return roomMemberRepository.updateMemberRole(memberId, input.role)
	},

	async removeMember(
		roomId: string,
		memberId: string,
		user: Express.User | undefined,
	): Promise<void> {
		await ensureCurrentUserIsAdmin(roomId, user)

		const targetMember = await ensureTargetMember(roomId, memberId)

		await ensureNotLastAdmin(targetMember)
		await roomMemberRepository.deleteMember(memberId)
	},
}
