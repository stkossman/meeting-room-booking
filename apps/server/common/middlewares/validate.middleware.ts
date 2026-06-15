import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'
import { ValidationError } from '../errors/ValidationError'

type ValidationSchema = {
	body?: ZodType
	params?: ZodType
	query?: ZodType
}

export const validate = (schema: ValidationSchema): RequestHandler => {
	return (req, _res, next) => {
		for (const [key, zodSchema] of Object.entries(schema)) {
			const result = zodSchema.safeParse(req[key as keyof ValidationSchema])

			if (!result.success) {
				next(
					new ValidationError(
						'Validation failed',
						result.error.issues.map((issue) => ({
							field: issue.path.join('.'),
							message: issue.message,
						})),
					),
				)
				return
			}
		}

		next()
	}
}
