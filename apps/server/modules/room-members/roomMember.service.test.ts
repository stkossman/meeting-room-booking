import { afterEach, describe, expect, test } from 'bun:test'
import { RoomRole } from '@prisma/client'
import { AppError } from '../../common/errors/AppError'
import {
	roomMemberRepository,
	type RoomMemberDetails,
	type RoomMembership,
	type RoomMemberUser,
} from './roomMember.repository'
import { roomMemberService } from './roomMember.service'

const ROOM_ID = 'room-1'
const ADMIN_ID = 'admin-1'
const USER_ID = 'user-1'

const adminUser: Express.User = {
	id: ADMIN_ID,
	email: 'admin@test.com',
	name: 'Admin User',
}

const originalRoomMemberRepository = { ...roomMemberRepository }

const date = (value: string): Date => new Date(value)

const makeMembership = (
	userId: string,
	role: RoomRole,
): RoomMembership => ({
	id: `membership-${userId}`,
	roomId: ROOM_ID,
	userId,
	role,
})

const makeUser = (userId = USER_ID): RoomMemberUser => ({
	id: userId,
	name: 'Member User',
	email: 'member@test.com',
})

const makeMemberDetails = (
	userId: string,
	role: RoomRole,
): RoomMemberDetails => ({
	id: `membership-${userId}`,
	roomId: ROOM_ID,
	userId,
	role,
	createdAt: date('2026-06-15T09:00:00.000Z'),
	updatedAt: date('2026-06-15T09:00:00.000Z'),
	user: {
		id: userId,
		name: 'Member User',
		email: 'member@test.com',
	},
})

const expectAppError = async (
	action: () => Promise<unknown>,
	statusCode: number,
): Promise<void> => {
	try {
		await action()
		throw new Error('Expected action to throw')
	} catch (error) {
		expect(error).toBeInstanceOf(AppError)
		expect((error as AppError).statusCode).toBe(statusCode)
	}
}

const setupRoomMemberRepository = (options?: {
	memberships?: RoomMembership[]
	targetUser?: RoomMemberUser | null
}) => {
	const memberships =
		options?.memberships ?? [makeMembership(ADMIN_ID, RoomRole.ADMIN)]
	const targetUser = options?.targetUser === undefined ? makeUser() : options.targetUser

	roomMemberRepository.findRoomById = async (roomId) =>
		roomId === ROOM_ID ? { id: ROOM_ID } : null

	roomMemberRepository.findUserByEmail = async () => targetUser

	roomMemberRepository.findMembership = async (roomId, userId) =>
		memberships.find(
			(membership) =>
				membership.roomId === roomId && membership.userId === userId,
		) ?? null

	roomMemberRepository.findMemberById = async (roomId, memberId) =>
		memberships.find(
			(membership) =>
				membership.roomId === roomId && membership.id === memberId,
		) ?? null

	roomMemberRepository.listMembers = async () =>
		memberships.map((membership) =>
			makeMemberDetails(membership.userId, membership.role),
		)

	roomMemberRepository.createMember = async (roomId, userId, role) => {
		const membership = makeMembership(userId, role)
		memberships.push(membership)

		return makeMemberDetails(userId, role)
	}

	roomMemberRepository.updateMemberRole = async (memberId, role) => {
		const membership = memberships.find((item) => item.id === memberId)

		if (!membership) {
			throw new Error('Missing membership in test setup')
		}

		membership.role = role

		return makeMemberDetails(membership.userId, role)
	}

	roomMemberRepository.deleteMember = async (memberId) => {
		const index = memberships.findIndex((membership) => membership.id === memberId)

		if (index >= 0) {
			memberships.splice(index, 1)
		}
	}

	roomMemberRepository.countAdmins = async (roomId) =>
		memberships.filter(
			(membership) =>
				membership.roomId === roomId && membership.role === RoomRole.ADMIN,
		).length
}

afterEach(() => {
	Object.assign(roomMemberRepository, originalRoomMemberRepository)
})

describe('room member duplicate handling', () => {
	test('adding the same user to the same room twice returns 409', async () => {
		setupRoomMemberRepository({
			memberships: [
				makeMembership(ADMIN_ID, RoomRole.ADMIN),
				makeMembership(USER_ID, RoomRole.USER),
			],
		})

		await expectAppError(
			() =>
				roomMemberService.addMember(
					ROOM_ID,
					{ email: 'member@test.com', role: RoomRole.USER },
					adminUser,
				),
			409,
		)
	})

	test('missing user email returns 404 when adding member', async () => {
		setupRoomMemberRepository({ targetUser: null })

		await expectAppError(
			() =>
				roomMemberService.addMember(
					ROOM_ID,
					{ email: 'missing@test.com', role: RoomRole.USER },
					adminUser,
				),
			404,
		)
	})
})
