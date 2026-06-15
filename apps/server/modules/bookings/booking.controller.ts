import type { RequestHandler } from 'express'
import { bookingService } from './booking.service'
import type {
	BookingListQuery,
	BookingParams,
	CreateBookingInput,
	RoomBookingParams,
	UpdateBookingInput,
} from './booking.schemas'

export const listRoomBookings: RequestHandler = async (req, res, next) => {
	try {
		const { roomId } = req.params as RoomBookingParams
		const bookings = await bookingService.listRoomBookings(
			roomId,
			req.query as BookingListQuery,
			req.user,
		)

		res.json({ bookings })
	} catch (error) {
		next(error)
	}
}

export const createBooking: RequestHandler = async (req, res, next) => {
	try {
		const { roomId } = req.params as RoomBookingParams
		const booking = await bookingService.createBooking(
			roomId,
			req.body as CreateBookingInput,
			req.user,
		)

		res.status(201).json({ booking })
	} catch (error) {
		next(error)
	}
}

export const updateBooking: RequestHandler = async (req, res, next) => {
	try {
		const { bookingId } = req.params as BookingParams
		const booking = await bookingService.updateBooking(
			bookingId,
			req.body as UpdateBookingInput,
			req.user,
		)

		res.json({ booking })
	} catch (error) {
		next(error)
	}
}

export const cancelBooking: RequestHandler = async (req, res, next) => {
	try {
		const { bookingId } = req.params as BookingParams
		const booking = await bookingService.cancelBooking(bookingId, req.user)

		res.json({ booking })
	} catch (error) {
		next(error)
	}
}

export const joinBooking: RequestHandler = async (req, res, next) => {
	try {
		const { bookingId } = req.params as BookingParams
		const participant = await bookingService.joinBooking(bookingId, req.user)

		res.status(201).json({ participant })
	} catch (error) {
		next(error)
	}
}
