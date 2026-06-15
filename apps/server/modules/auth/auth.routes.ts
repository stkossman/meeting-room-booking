import { Router } from 'express'
import { authMiddleware } from '../../common/middlewares/auth.middleware'
import { validate } from '../../common/middlewares/validate.middleware'
import { login, me, register } from './auth.controller'
import { loginSchema, registerSchema } from './auth.schemas'

export const authRouter = Router()

authRouter.post('/register', validate({ body: registerSchema }), register)
authRouter.post('/login', validate({ body: loginSchema }), login)
authRouter.get('/me', authMiddleware, me)
