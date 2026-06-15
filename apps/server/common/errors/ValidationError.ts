import { AppError, type ErrorDetail } from './AppError'

export class ValidationError extends AppError {
	constructor(message = 'Validation Failed', details?: ErrorDetail[]) {
		super(message, 400, details)
	}
}
