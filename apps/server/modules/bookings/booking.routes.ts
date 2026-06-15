import { Router } from 'express'
import { authMiddleware } from '../../common/middlewares/auth.middleware'
import { validate } from '../../common/middlewares/validate.middleware'
import {
	cancelBooking,
	createBooking,
	joinBooking,
	listRoomBookings,
	updateBooking,
} from './booking.controller'
import {
	bookingListQuerySchema,
	bookingParamsSchema,
	createBookingSchema,
	roomBookingParamsSchema,
	updateBookingSchema,
} from './booking.schemas'

export const roomBookingRouter = Router({ mergeParams: true })
export const bookingRouter = Router()

roomBookingRouter.use(authMiddleware)
bookingRouter.use(authMiddleware)

roomBookingRouter.get(
	'/',
	validate({ params: roomBookingParamsSchema, query: bookingListQuerySchema }),
	listRoomBookings,
)
roomBookingRouter.post(
	'/',
	validate({ params: roomBookingParamsSchema, body: createBookingSchema }),
	createBooking,
)

bookingRouter.patch(
	'/:bookingId',
	validate({ params: bookingParamsSchema, body: updateBookingSchema }),
	updateBooking,
)
bookingRouter.delete(
	'/:bookingId',
	validate({ params: bookingParamsSchema }),
	cancelBooking,
)
bookingRouter.post(
	'/:bookingId/join',
	validate({ params: bookingParamsSchema }),
	joinBooking,
)
