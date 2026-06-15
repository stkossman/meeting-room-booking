import type { RequestHandler } from 'express'
import { roomService } from './room.service'
import type {
	CreateRoomInput,
	RoomParams,
	UpdateRoomInput,
} from './room.schemas'

export const listRooms: RequestHandler = async (req, res, next) => {
	try {
		const rooms = await roomService.listRooms(req.user)

		res.json({ rooms })
	} catch (error) {
		next(error)
	}
}

export const getRoom: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params as RoomParams
		const room = await roomService.getRoom(id, req.user)

		res.json({ room })
	} catch (error) {
		next(error)
	}
}

export const createRoom: RequestHandler = async (req, res, next) => {
	try {
		const room = await roomService.createRoom(
			req.body as CreateRoomInput,
			req.user,
		)

		res.status(201).json({ room })
	} catch (error) {
		next(error)
	}
}

export const updateRoom: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params as RoomParams
		const room = await roomService.updateRoom(
			id,
			req.body as UpdateRoomInput,
			req.user,
		)

		res.json({ room })
	} catch (error) {
		next(error)
	}
}

export const deleteRoom: RequestHandler = async (req, res, next) => {
	try {
		const { id } = req.params as RoomParams

		await roomService.deleteRoom(id, req.user)

		res.status(204).send()
	} catch (error) {
		next(error)
	}
}
