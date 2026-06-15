import { RoomRole } from '@prisma/client'
import { AppError } from '../../common/errors/AppError'
import {
	roomRepository,
	type RoomWithCurrentUserRole,
} from './room.repository'
import type { CreateRoomInput, UpdateRoomInput } from './room.schemas'

type RoomDetails = RoomWithCurrentUserRole

type UpdatedRoom = Omit<RoomWithCurrentUserRole, 'role'> & {
	role: RoomRole
}

const getUserId = (user: Express.User | undefined): string => {
	if (!user) {
		throw new AppError('Unauthorized', 401)
	}

	return user.id
}

const ensureAdmin = async (roomId: string, userId: string): Promise<void> => {
	const membership = await roomRepository.findMembership(roomId, userId)

	if (!membership) {
		throw new AppError('Room not found', 404)
	}

	if (membership.role !== RoomRole.ADMIN) {
		throw new AppError('Forbidden', 403)
	}
}

export const roomService = {
	listRooms(user: Express.User | undefined): Promise<RoomWithCurrentUserRole[]> {
		return roomRepository.findRoomsByUserId(getUserId(user))
	},

	async getRoom(
		roomId: string,
		user: Express.User | undefined,
	): Promise<RoomDetails> {
		const room = await roomRepository.findRoomForUser(roomId, getUserId(user))

		if (!room) {
			throw new AppError('Room not found', 404)
		}

		return room
	},

	createRoom(
		input: CreateRoomInput,
		user: Express.User | undefined,
	): Promise<RoomWithCurrentUserRole> {
		return roomRepository.createRoom(input, getUserId(user))
	},

	async updateRoom(
		roomId: string,
		input: UpdateRoomInput,
		user: Express.User | undefined,
	): Promise<UpdatedRoom> {
		const userId = getUserId(user)

		await ensureAdmin(roomId, userId)

		const room = await roomRepository.updateRoom(roomId, input)

		return {
			...room,
			role: RoomRole.ADMIN,
		}
	},

	async deleteRoom(
		roomId: string,
		user: Express.User | undefined,
	): Promise<void> {
		const userId = getUserId(user)

		await ensureAdmin(roomId, userId)
		await roomRepository.deleteRoom(roomId)
	},
}
