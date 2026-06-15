import cors from 'cors'
import express from 'express'
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

app.use(errorMiddleware)
