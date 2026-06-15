import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../../config/env'

export type JwtPayload = {
	userId: string
}

export const signToken = (userId: string): string => {
	const options: SignOptions = {
		expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
	}

	return jwt.sign({ userId }, env.jwtSecret, options)
}

export const verifyToken = (token: string): JwtPayload => {
	const payload = jwt.verify(token, env.jwtSecret)

	if (
		typeof payload !== 'object' ||
		payload === null ||
		typeof payload.userId !== 'string'
	) {
		throw new Error('Invalid token payload')
	}

	return { userId: payload.userId }
}
