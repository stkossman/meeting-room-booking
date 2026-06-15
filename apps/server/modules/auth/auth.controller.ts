import type { RequestHandler } from 'express'
import { authService } from './auth.service'
import type { LoginInput, RegisterInput } from './auth.schemas'

export const register: RequestHandler = async (req, res, next) => {
	try {
		const result = await authService.register(req.body as RegisterInput)

		res.status(201).json(result)
	} catch (error) {
		next(error)
	}
}

export const login: RequestHandler = async (req, res, next) => {
	try {
		const result = await authService.login(req.body as LoginInput)

		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const me: RequestHandler = (req, res, next) => {
	try {
		const user = authService.getMe(req.user)

		res.json({ user })
	} catch (error) {
		next(error)
	}
}
