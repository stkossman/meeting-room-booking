import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes'

export const apiRouter = Router()

apiRouter.get('/', (_req, res) => {
	res.json({ status: 'ok' })
})

apiRouter.use('/auth', authRouter)
