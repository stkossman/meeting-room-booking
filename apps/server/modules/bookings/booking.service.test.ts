import { afterEach, describe, expect, test } from 'bun:test'
import { BookingStatus, RoomRole } from '@prisma/client'
import { AppError } from '../../common/errors/AppError'
import {
	bookingRepository,
	isOverlappingActiveBooking,
	type BookingDetails,
	type BookingMembership,
	type BookingParticipantDetails,
} from './booking.repository'
import { bookingService } from './booking.service'
import {
	createBookingSchema,
	updateBookingSchema,
} from './booking.schemas'

const ROOM_ID = 'room-1'
const ADMIN_ID = 'admin-1'
const USER_ID = 'user-1'
const OUTSIDER_ID = 'outsider-1'

const adminUser: Express.User = {
	id: ADMIN_ID,
	email: 'admin@test.com',
	name: 'Admin User',
}

const memberUser: Express.User = {
	id: USER_ID,
	email: 'user@test.com',
	name: 'Member User',
}

const outsiderUser: Express.User = {
	id: OUTSIDER_ID,
	email: 'outsider@test.com',
	name: 'Outsider User',
}

const originalBookingRepository = { ...bookingRepository }

const date = (value: string): Date => new Date(value)

const makeMembership = (
	userId: string,
	role: RoomRole,
): BookingMembership => ({
	id: `membership-${userId}`,
	roomId: ROOM_ID,
	userId,
	role,
})

const makeBooking = (
	overrides: Partial<BookingDetails> = {},
): BookingDetails => ({
	id: 'booking-1',
	roomId: ROOM_ID,
	createdById: ADMIN_ID,
	description: 'Planning',
	status: BookingStatus.ACTIVE,
	startTime: date('2026-06-15T10:00:00.000Z'),
	endTime: date('2026-06-15T11:00:00.000Z'),
	createdAt: date('2026-06-15T09:00:00.000Z'),
	updatedAt: date('2026-06-15T09:00:00.000Z'),
	createdBy: {
		id: ADMIN_ID,
		name: 'Admin User',
		email: 'admin@test.com',
	},
	participants: [],
	...overrides,
})

const makeParticipant = (
	bookingId: string,
	userId: string,
): BookingParticipantDetails => ({
	id: `participant-${bookingId}-${userId}`,
	bookingId,
	userId,
	createdAt: date('2026-06-15T09:05:00.000Z'),
	user: {
		id: userId,
		name: 'Member User',
		email: 'user@test.com',
	},
})

const expectAppError = async (
	action: () => Promise<unknown>,
	statusCode: number,
): Promise<void> => {
	try {
		await action()
		throw new Error('Expected action to throw')
	} catch (error) {
		expect(error).toBeInstanceOf(AppError)
		expect((error as AppError).statusCode).toBe(statusCode)
	}
}

const setupBookingRepository = (options?: {
	bookings?: BookingDetails[]
	memberships?: BookingMembership[]
	participants?: { bookingId: string; userId: string }[]
}) => {
	const bookings = options?.bookings ?? []
	const memberships =
		options?.memberships ??
		[makeMembership(ADMIN_ID, RoomRole.ADMIN), makeMembership(USER_ID, RoomRole.USER)]
	const participants = options?.participants ?? []

	bookingRepository.findRoomById = async (roomId) =>
		roomId === ROOM_ID ? { id: ROOM_ID } : null

	bookingRepository.findMembership = async (roomId, userId) =>
		memberships.find(
			(membership) =>
				membership.roomId === roomId && membership.userId === userId,
		) ?? null

	bookingRepository.listActiveBookings = async (roomId) =>
		bookings.filter(
			(booking) =>
				booking.roomId === roomId && booking.status === BookingStatus.ACTIVE,
		)

	bookingRepository.findById = async (bookingId) =>
		bookings.find((booking) => booking.id === bookingId) ?? null

	bookingRepository.findConflictingBooking = async (
		roomId,
		startTime,
		endTime,
		excludeBookingId,
	) => {
		const conflictingBooking = bookings.find(
			(booking) =>
				booking.roomId === roomId &&
				isOverlappingActiveBooking(
					booking,
					startTime,
					endTime,
					excludeBookingId,
				),
		)

		return conflictingBooking ? { id: conflictingBooking.id } : null
	}

	bookingRepository.createBookingIfNoConflict = async (input) => {
		const conflictingBooking = bookings.find(
			(booking) =>
				booking.roomId === input.roomId &&
				isOverlappingActiveBooking(booking, input.startTime, input.endTime),
		)

		if (conflictingBooking) {
			return null
		}

		const booking = makeBooking({
			id: `created-${bookings.length + 1}`,
			roomId: input.roomId,
			createdById: input.createdById,
			description: input.description ?? null,
			startTime: input.startTime,
			endTime: input.endTime,
		})

		bookings.push(booking)

		return booking
	}

	bookingRepository.updateBooking = async (bookingId, input) => {
		const booking = bookings.find((item) => item.id === bookingId)

		if (!booking) {
			throw new Error('Missing booking in test setup')
		}

		const updatedBooking = {
			...booking,
			description: input.description ?? booking.description,
			startTime: input.startTime ?? booking.startTime,
			endTime: input.endTime ?? booking.endTime,
		}
		const index = bookings.indexOf(booking)
		bookings[index] = updatedBooking

		return updatedBooking
	}

	bookingRepository.cancelBooking = async (bookingId) => {
		const booking = bookings.find((item) => item.id === bookingId)

		if (!booking) {
			throw new Error('Missing booking in test setup')
		}

		const cancelledBooking = {
			...booking,
			status: BookingStatus.CANCELLED,
		}
		const index = bookings.indexOf(booking)
		bookings[index] = cancelledBooking

		return cancelledBooking
	}

	bookingRepository.findParticipant = async (bookingId, userId) =>
		participants.some(
			(participant) =>
				participant.bookingId === bookingId && participant.userId === userId,
		)
			? { id: `participant-${bookingId}-${userId}` }
			: null

	bookingRepository.createParticipant = async (bookingId, userId) => {
		participants.push({ bookingId, userId })

		return makeParticipant(bookingId, userId)
	}

	return { bookings, participants }
}

afterEach(() => {
	Object.assign(bookingRepository, originalBookingRepository)
})

describe('booking conflict validation', () => {
	test.each([
		['same time', '2026-06-15T10:00:00.000Z', '2026-06-15T11:00:00.000Z', true],
		['overlaps end', '2026-06-15T10:30:00.000Z', '2026-06-15T11:30:00.000Z', true],
		['overlaps start', '2026-06-15T09:30:00.000Z', '2026-06-15T10:30:00.000Z', true],
		['touches start boundary', '2026-06-15T09:00:00.000Z', '2026-06-15T10:00:00.000Z', false],
		['touches end boundary', '2026-06-15T11:00:00.000Z', '2026-06-15T12:00:00.000Z', false],
	])('%s', (_name, startTime, endTime, shouldConflict) => {
		const existingBooking = makeBooking()

		expect(
			isOverlappingActiveBooking(
				existingBooking,
				date(startTime),
				date(endTime),
			),
		).toBe(shouldConflict)
	})

	test('cancelled booking does not block a new booking', () => {
		const existingBooking = makeBooking({ status: BookingStatus.CANCELLED })

		expect(
			isOverlappingActiveBooking(
				existingBooking,
				date('2026-06-15T10:00:00.000Z'),
				date('2026-06-15T11:00:00.000Z'),
			),
		).toBe(false)
	})

	test('creating overlapping booking returns 409', async () => {
		setupBookingRepository({ bookings: [makeBooking()] })

		await expectAppError(
			() =>
				bookingService.createBooking(
					ROOM_ID,
					{
						description: 'Conflict',
						startTime: '2026-06-15T10:30:00.000Z',
						endTime: '2026-06-15T11:30:00.000Z',
					},
					adminUser,
				),
			409,
		)
	})
})

describe('booking update validation', () => {
	test('updating a booking ignores itself when checking conflicts', async () => {
		const booking = makeBooking({ id: 'booking-self' })
		setupBookingRepository({ bookings: [booking] })

		const updatedBooking = await bookingService.updateBooking(
			booking.id,
			{
				description: 'Updated',
				startTime: '2026-06-15T10:00:00.000Z',
				endTime: '2026-06-15T11:00:00.000Z',
			},
			adminUser,
		)

		expect(updatedBooking.description).toBe('Updated')
	})

	test('updating into another active booking returns 409', async () => {
		const booking = makeBooking({
			id: 'booking-edit',
			startTime: date('2026-06-15T12:00:00.000Z'),
			endTime: date('2026-06-15T13:00:00.000Z'),
		})
		const otherBooking = makeBooking({ id: 'booking-other' })
		setupBookingRepository({ bookings: [booking, otherBooking] })

		await expectAppError(
			() =>
				bookingService.updateBooking(
					booking.id,
					{
						startTime: '2026-06-15T10:30:00.000Z',
						endTime: '2026-06-15T11:30:00.000Z',
					},
					adminUser,
				),
			409,
		)
	})

	test('cancelled booking cannot be edited', async () => {
		const booking = makeBooking({ status: BookingStatus.CANCELLED })
		setupBookingRepository({ bookings: [booking] })

		await expectAppError(
			() =>
				bookingService.updateBooking(
					booking.id,
					{ description: 'Nope' },
					adminUser,
				),
			409,
		)
	})
})

describe('booking permissions and duplicate actions', () => {
	test('only room admin can create booking', async () => {
		setupBookingRepository()

		await expectAppError(
			() =>
				bookingService.createBooking(
					ROOM_ID,
					{
						startTime: '2026-06-15T12:00:00.000Z',
						endTime: '2026-06-15T13:00:00.000Z',
					},
					memberUser,
				),
			403,
		)
	})

	test('room user can view bookings', async () => {
		setupBookingRepository({ bookings: [makeBooking()] })

		const bookings = await bookingService.listRoomBookings(
			ROOM_ID,
			{},
			memberUser,
		)

		expect(bookings).toHaveLength(1)
	})

	test('non-member cannot view bookings', async () => {
		setupBookingRepository()

		await expectAppError(
			() => bookingService.listRoomBookings(ROOM_ID, {}, outsiderUser),
			404,
		)
	})

	test('room user can join booking once', async () => {
		const booking = makeBooking()
		setupBookingRepository({ bookings: [booking] })

		const participant = await bookingService.joinBooking(booking.id, memberUser)

		expect(participant.userId).toBe(USER_ID)
	})

	test('joining booking twice returns 409', async () => {
		const booking = makeBooking()
		setupBookingRepository({
			bookings: [booking],
			participants: [{ bookingId: booking.id, userId: USER_ID }],
		})

		await expectAppError(
			() => bookingService.joinBooking(booking.id, memberUser),
			409,
		)
	})

	test('non-member cannot join booking', async () => {
		const booking = makeBooking()
		setupBookingRepository({ bookings: [booking] })

		await expectAppError(
			() => bookingService.joinBooking(booking.id, outsiderUser),
			404,
		)
	})

	test('room user cannot edit or cancel booking', async () => {
		const booking = makeBooking()
		setupBookingRepository({ bookings: [booking] })

		await expectAppError(
			() =>
				bookingService.updateBooking(
					booking.id,
					{ description: 'Denied' },
					memberUser,
				),
			403,
		)
		await expectAppError(
			() => bookingService.cancelBooking(booking.id, memberUser),
			403,
		)
	})
})

describe('concurrent booking attempts', () => {
	test('only one overlapping booking is created when two admins book the same time', async () => {
		const { bookings } = setupBookingRepository()

		const results = await Promise.allSettled([
			bookingService.createBooking(
				ROOM_ID,
				{
					startTime: '2026-06-15T10:00:00.000Z',
					endTime: '2026-06-15T11:00:00.000Z',
				},
				adminUser,
			),
			bookingService.createBooking(
				ROOM_ID,
				{
					startTime: '2026-06-15T10:00:00.000Z',
					endTime: '2026-06-15T11:00:00.000Z',
				},
				adminUser,
			),
		])

		expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
		expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1)
		expect(
			bookings.filter((booking) => booking.status === BookingStatus.ACTIVE),
		).toHaveLength(1)
	})
})

describe('booking schema validation', () => {
	test('endTime must be later than startTime', () => {
		const result = createBookingSchema.safeParse({
			startTime: '2026-06-15T10:00:00.000Z',
			endTime: '2026-06-15T10:00:00.000Z',
		})

		expect(result.success).toBe(false)
	})

	test('invalid ISO date is rejected', () => {
		const result = createBookingSchema.safeParse({
			startTime: 'not-a-date',
			endTime: '2026-06-15T11:00:00.000Z',
		})

		expect(result.success).toBe(false)
	})

	test('description longer than 500 chars is rejected', () => {
		const result = updateBookingSchema.safeParse({
			description: 'x'.repeat(501),
		})

		expect(result.success).toBe(false)
	})
})
