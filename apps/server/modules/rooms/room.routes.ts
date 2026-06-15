import { Router } from 'express'
import { authMiddleware } from '../../common/middlewares/auth.middleware'
import { validate } from '../../common/middlewares/validate.middleware'
import {
	createRoom,
	deleteRoom,
	getRoom,
	listRooms,
	updateRoom,
} from './room.controller'
import {
	createRoomSchema,
	roomParamsSchema,
	updateRoomSchema,
} from './room.schemas'

export const roomRouter = Router()

roomRouter.use(authMiddleware)

roomRouter.get('/', listRooms)
roomRouter.get('/:id', validate({ params: roomParamsSchema }), getRoom)
roomRouter.post('/', validate({ body: createRoomSchema }), createRoom)
roomRouter.patch(
	'/:id',
	validate({ params: roomParamsSchema, body: updateRoomSchema }),
	updateRoom,
)
roomRouter.delete('/:id', validate({ params: roomParamsSchema }), deleteRoom)
