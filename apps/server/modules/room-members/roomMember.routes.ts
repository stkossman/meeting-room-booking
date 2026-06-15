import { Router } from 'express'
import { authMiddleware } from '../../common/middlewares/auth.middleware'
import { validate } from '../../common/middlewares/validate.middleware'
import {
	addRoomMember,
	listRoomMembers,
	removeRoomMember,
	updateRoomMember,
} from './roomMember.controller'
import {
	addRoomMemberSchema,
	roomMemberByIdParamsSchema,
	roomMemberParamsSchema,
	updateRoomMemberSchema,
} from './roomMember.schemas'

export const roomMemberRouter = Router({ mergeParams: true })

roomMemberRouter.use(authMiddleware)

roomMemberRouter.get(
	'/',
	validate({ params: roomMemberParamsSchema }),
	listRoomMembers,
)
roomMemberRouter.post(
	'/',
	validate({ params: roomMemberParamsSchema, body: addRoomMemberSchema }),
	addRoomMember,
)
roomMemberRouter.patch(
	'/:memberId',
	validate({
		params: roomMemberByIdParamsSchema,
		body: updateRoomMemberSchema,
	}),
	updateRoomMember,
)
roomMemberRouter.delete(
	'/:memberId',
	validate({ params: roomMemberByIdParamsSchema }),
	removeRoomMember,
)
