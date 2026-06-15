import type { ErrorRequestHandler } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'
import { ValidationError } from '../errors/ValidationError'

const isDev = process.env.NODE_ENV !== 'production'

const getPrismaErrorResponse = (
	error: Prisma.PrismaClientKnownRequestError,
): { statusCode: number; message: string } => {
	switch (error.code) {
		case 'P2002':
			return { statusCode: 409, message: 'Resource already exists' }
		case 'P2025':
			return { statusCode: 404, message: 'Resource not found' }
		default:
			return { statusCode: 400, message: 'Invalid database request' }
	}
}

export const errorMiddleware: ErrorRequestHandler = (
	error,
	_req,
	res,
	_next,
) => {
	if (isDev) {
		console.error(error)
	}

	if (error instanceof AppError || error instanceof ValidationError) {
		res.status(error.statusCode).json({
			success: false,
			message: error.message,
			...(error.details && { details: error.details }),
		})
		return
	}

	if (error instanceof ZodError) {
		res.status(400).json({
			success: false,
			message: 'Validation failed',
			details: error.issues.map((issue) => ({
				field: issue.path.join('.'),
				message: issue.message,
			})),
		})
		return
	}

	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		const { statusCode, message } = getPrismaErrorResponse(error)

		res.status(statusCode).json({
			success: false,
			message,
		})
		return
	}

	res.status(500).json({
		success: false,
		message: 'Internal server error',
	})
}
