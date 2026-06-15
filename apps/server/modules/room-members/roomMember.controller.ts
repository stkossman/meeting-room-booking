import type { RequestHandler } from 'express'
import { roomMemberService } from './roomMember.service'
import type {
	AddRoomMemberInput,
	RoomMemberByIdParams,
	RoomMemberParams,
	UpdateRoomMemberInput,
} from './roomMember.schemas'

export const listRoomMembers: RequestHandler = async (req, res, next) => {
	try {
		const { roomId } = req.params as RoomMemberParams
		const members = await roomMemberService.listMembers(roomId, req.user)

		res.json({ members })
	} catch (error) {
		next(error)
	}
}

export const addRoomMember: RequestHandler = async (req, res, next) => {
	try {
		const { roomId } = req.params as RoomMemberParams
		const member = await roomMemberService.addMember(
			roomId,
			req.body as AddRoomMemberInput,
			req.user,
		)

		res.status(201).json({ member })
	} catch (error) {
		next(error)
	}
}

export const updateRoomMember: RequestHandler = async (req, res, next) => {
	try {
		const { roomId, memberId } = req.params as RoomMemberByIdParams
		const member = await roomMemberService.updateMember(
			roomId,
			memberId,
			req.body as UpdateRoomMemberInput,
			req.user,
		)

		res.json({ member })
	} catch (error) {
		next(error)
	}
}

export const removeRoomMember: RequestHandler = async (req, res, next) => {
	try {
		const { roomId, memberId } = req.params as RoomMemberByIdParams

		await roomMemberService.removeMember(roomId, memberId, req.user)

		res.status(204).send()
	} catch (error) {
		next(error)
	}
}
