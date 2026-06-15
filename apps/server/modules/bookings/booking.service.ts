import { BookingStatus, Prisma, RoomRole } from '@prisma/client'
import { AppError } from '../../common/errors/AppError'
import {
	bookingRepository,
	type BookingDetails,
	type BookingMembership,
	type BookingParticipantDetails,
} from './booking.repository'
import type {
	BookingListQuery,
	CreateBookingInput,
	UpdateBookingInput,
} from './booking.schemas'

const getUserId = (user: Express.User | undefined): string => {
	if (!user) {
		throw new AppError('Unauthorized', 401)
	}

	return user.id
}

const parseDateTime = (value: string): Date => new Date(value)

const getDateRange = (
	query: BookingListQuery,
): { start: Date; end: Date } | undefined => {
	if (!query.date) {
		return undefined
	}

	const start = new Date(`${query.date}T00:00:00.000Z`)
	const end = new Date(start)
	end.setUTCDate(end.getUTCDate() + 1)

	return { start, end }
}

const ensureRoomExists = async (roomId: string): Promise<void> => {
	const room = await bookingRepository.findRoomById(roomId)

	if (!room) {
		throw new AppError('Room not found', 404)
	}
}

const getCurrentMembership = async (
	roomId: string,
	user: Express.User | undefined,
): Promise<BookingMembership> => {
	const userId = getUserId(user)
	const membership = await bookingRepository.findMembership(roomId, userId)

	if (!membership) {
		await ensureRoomExists(roomId)
		throw new AppError('Room not found', 404)
	}

	return membership
}

const ensureCurrentUserIsAdmin = async (
	roomId: string,
	user: Express.User | undefined,
): Promise<string> => {
	const userId = getUserId(user)
	const membership = await getCurrentMembership(roomId, user)

	if (membership.role !== RoomRole.ADMIN) {
		throw new AppError('Forbidden', 403)
	}

	return userId
}

const ensureNoTimeConflict = async (
	roomId: string,
	startTime: Date,
	endTime: Date,
	excludeBookingId?: string,
): Promise<void> => {
	const conflictingBooking = await bookingRepository.findConflictingBooking(
		roomId,
		startTime,
		endTime,
		excludeBookingId,
	)

	if (conflictingBooking) {
		throw new AppError('Booking time conflicts with an existing booking', 409)
	}
}

const getBookingOrThrow = async (bookingId: string): Promise<BookingDetails> => {
	const booking = await bookingRepository.findById(bookingId)

	if (!booking) {
		throw new AppError('Booking not found', 404)
	}

	return booking
}

export const bookingService = {
	async listRoomBookings(
		roomId: string,
		query: BookingListQuery,
		user: Express.User | undefined,
	): Promise<BookingDetails[]> {
		await getCurrentMembership(roomId, user)

		return bookingRepository.listActiveBookings(roomId, getDateRange(query))
	},

	async createBooking(
		roomId: string,
		input: CreateBookingInput,
		user: Express.User | undefined,
	): Promise<BookingDetails> {
		const createdById = await ensureCurrentUserIsAdmin(roomId, user)
		const startTime = parseDateTime(input.startTime)
		const endTime = parseDateTime(input.endTime)

		try {
			const booking = await bookingRepository.createBookingIfNoConflict({
				roomId,
				createdById,
				description: input.description?.trim(),
				startTime,
				endTime,
			})

			if (!booking) {
				throw new AppError('Booking time conflicts with an existing booking', 409)
			}

			return booking
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2034'
			) {
				throw new AppError('Booking time conflicts with an existing booking', 409)
			}

			throw error
		}
	},

	async updateBooking(
		bookingId: string,
		input: UpdateBookingInput,
		user: Express.User | undefined,
	): Promise<BookingDetails> {
		const booking = await getBookingOrThrow(bookingId)

		await ensureCurrentUserIsAdmin(booking.roomId, user)

		if (booking.status === BookingStatus.CANCELLED) {
			throw new AppError('Cancelled booking cannot be edited', 409)
		}

		const startTime = input.startTime
			? parseDateTime(input.startTime)
			: booking.startTime
		const endTime = input.endTime ? parseDateTime(input.endTime) : booking.endTime

		if (endTime <= startTime) {
			throw new AppError('endTime must be later than startTime', 400)
		}

		if (input.startTime !== undefined || input.endTime !== undefined) {
			await ensureNoTimeConflict(booking.roomId, startTime, endTime, booking.id)
		}

		return bookingRepository.updateBooking(booking.id, {
			description: input.description?.trim(),
			startTime: input.startTime !== undefined ? startTime : undefined,
			endTime: input.endTime !== undefined ? endTime : undefined,
		})
	},

	async cancelBooking(
		bookingId: string,
		user: Express.User | undefined,
	): Promise<BookingDetails> {
		const booking = await getBookingOrThrow(bookingId)

		await ensureCurrentUserIsAdmin(booking.roomId, user)

		if (booking.status === BookingStatus.CANCELLED) {
			return booking
		}

		return bookingRepository.cancelBooking(booking.id)
	},

	async joinBooking(
		bookingId: string,
		user: Express.User | undefined,
	): Promise<BookingParticipantDetails> {
		const userId = getUserId(user)
		const booking = await getBookingOrThrow(bookingId)

		await getCurrentMembership(booking.roomId, user)

		if (booking.status === BookingStatus.CANCELLED) {
			throw new AppError('Cancelled booking cannot be joined', 409)
		}

		const existingParticipant = await bookingRepository.findParticipant(
			booking.id,
			userId,
		)

		if (existingParticipant) {
			throw new AppError('User already joined this booking', 409)
		}

		return bookingRepository.createParticipant(booking.id, userId)
	},
}
