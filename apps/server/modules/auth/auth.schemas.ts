import { z } from 'zod'

export const registerSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(255),
	email: z.string().trim().email().max(255),
	password: z.string().min(6).max(255),
})

export const loginSchema = z.object({
	email: z.string().trim().email().max(255),
	password: z.string().min(1, 'Password is required').max(255),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
