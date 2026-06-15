import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes'
import { roomRouter } from '../modules/rooms/room.routes'

export const apiRouter = Router()

apiRouter.get('/', (_req, res) => {
	res.json({ status: 'ok' })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/rooms', roomRouter)
