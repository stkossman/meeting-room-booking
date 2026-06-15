import type { RequestHandler } from 'express'
import { AppError } from '../errors/AppError'
import { prisma } from '../../config/prisma'
import { verifyToken } from '../utils/jwt'

export const authMiddleware: RequestHandler = async (req, _res, next) => {
	try {
		const authorizationHeader = req.header('Authorization')
		const [scheme, token] = authorizationHeader?.split(' ') ?? []

		if (scheme !== 'Bearer' || !token) {
			throw new AppError('Unauthorized', 401)
		}

		const { userId } = verifyToken(token)
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				name: true,
			},
		})

		if (!user) {
			throw new AppError('Unauthorized', 401)
		}

		req.user = user
		next()
	} catch {
		next(new AppError('Unauthorized', 401))
	}
}
