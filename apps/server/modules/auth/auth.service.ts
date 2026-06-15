import { Prisma } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { AppError } from '../../common/errors/AppError'
import { comparePassword, hashPassword } from '../../common/utils/password'
import { signToken } from '../../common/utils/jwt'
import type { LoginInput, RegisterInput } from './auth.schemas'

type AuthUser = {
	id: string
	email: string
	name: string
}

type AuthResponse = {
	user: AuthUser
	token: string
}

const userSelect = {
	id: true,
	email: true,
	name: true,
} satisfies Prisma.UserSelect

export const authService = {
	async register(input: RegisterInput): Promise<AuthResponse> {
		const name = input.name.trim()
		const email = input.email.trim()
		const existingUser = await prisma.user.findUnique({
			where: { email },
			select: { id: true },
		})

		if (existingUser) {
			throw new AppError('Email already exists', 409)
		}

		const password = await hashPassword(input.password)
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password,
			},
			select: userSelect,
		})

		return {
			user,
			token: signToken(user.id),
		}
	},

	async login(input: LoginInput): Promise<AuthResponse> {
		const email = input.email.trim()
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				...userSelect,
				password: true,
			},
		})

		if (!user) {
			throw new AppError('Invalid credentials', 401)
		}

		const isPasswordValid = await comparePassword(input.password, user.password)

		if (!isPasswordValid) {
			throw new AppError('Invalid credentials', 401)
		}

		const { password: _password, ...safeUser } = user

		return {
			user: safeUser,
			token: signToken(user.id),
		}
	},

	getMe(user: Express.User | undefined): AuthUser {
		if (!user) {
			throw new AppError('Unauthorized', 401)
		}

		return user
	},
}
