export type ErrorDetail = {
	field?: string
	message: string
}

export class AppError extends Error {
	public readonly isOperational = true

	constructor(
		message: string,
		public readonly statusCode: number = 500,
		public readonly details?: ErrorDetail[],
	) {
		super(message)

		this.name = this.constructor.name
	}
}
