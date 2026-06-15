import cors from 'cors'
import express from 'express'
import { AppError } from './common/errors/AppError'
import { env } from './config/env'
import { errorMiddleware } from './common/middlewares/error.middleware'
import { apiRouter } from './routes/index'

export const app = express()

app.use(
	cors({
		origin: env.clientUrl,
		credentials: true,
	}),
)
app.use(express.json())

app.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})

app.use('/api', apiRouter)

app.use((_req, _res, next) => {
	next(new AppError('Route not found', 404))
})

app.use(errorMiddleware)
