import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes'
import { roomMemberRouter } from '../modules/room-members/roomMember.routes'
import { roomRouter } from '../modules/rooms/room.routes'

export const apiRouter = Router()

apiRouter.get('/', (_req, res) => {
	res.json({ status: 'ok' })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/rooms/:roomId/members', roomMemberRouter)
apiRouter.use('/rooms', roomRouter)
