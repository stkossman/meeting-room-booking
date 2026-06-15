import { BookingStatus, Prisma, RoomRole } from '@prisma/client'
import { prisma } from '../../config/prisma'

const bookingSelect = {
	id: true,
	roomId: true,
	createdById: true,
	startTime: true,
	endTime: true,
	description: true,
	status: true,
	createdAt: true,
	updatedAt: true,
	createdBy: {
		select: {
			id: true,
			name: true,
			email: true,
		},
	},
	participants: {
		select: {
			id: true,
			userId: true,
			createdAt: true,
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
		orderBy: {
			createdAt: 'asc',
		},
	},
} satisfies Prisma.BookingSelect

const membershipSelect = {
	id: true,
	roomId: true,
	userId: true,
	role: true,
} satisfies Prisma.RoomMemberSelect

const participantSelect = {
	id: true,
	bookingId: true,
	userId: true,
	createdAt: true,
	user: {
		select: {
			id: true,
			name: true,
			email: true,
		},
	},
} satisfies Prisma.BookingParticipantSelect

export type BookingDetails = Prisma.BookingGetPayload<{
	select: typeof bookingSelect
}>

export type BookingMembership = Prisma.RoomMemberGetPayload<{
	select: typeof membershipSelect
}>

export type BookingParticipantDetails = Prisma.BookingParticipantGetPayload<{
	select: typeof participantSelect
}>

export const bookingRepository = {
	findRoomById(roomId: string): Promise<{ id: string } | null> {
		return prisma.room.findUnique({
			where: { id: roomId },
			select: { id: true },
		})
	},

	findMembership(
		roomId: string,
		userId: string,
	): Promise<BookingMembership | null> {
		return prisma.roomMember.findUnique({
			where: {
				roomId_userId: {
					roomId,
					userId,
				},
			},
			select: membershipSelect,
		})
	},

	listActiveBookings(
		roomId: string,
		dateRange?: { start: Date; end: Date },
	): Promise<BookingDetails[]> {
		return prisma.booking.findMany({
			where: {
				roomId,
				status: BookingStatus.ACTIVE,
				...(dateRange && {
					startTime: {
						gte: dateRange.start,
						lt: dateRange.end,
					},
				}),
			},
			select: bookingSelect,
			orderBy: {
				startTime: 'asc',
			},
		})
	},

	findById(bookingId: string): Promise<BookingDetails | null> {
		return prisma.booking.findUnique({
			where: { id: bookingId },
			select: bookingSelect,
		})
	},

	findConflictingBooking(
		roomId: string,
		startTime: Date,
		endTime: Date,
		excludeBookingId?: string,
	): Promise<{ id: string } | null> {
		return prisma.booking.findFirst({
			where: {
				roomId,
				status: BookingStatus.ACTIVE,
				startTime: { lt: endTime },
				endTime: { gt: startTime },
				...(excludeBookingId && {
					id: { not: excludeBookingId },
				}),
			},
			select: { id: true },
		})
	},

	createBooking(input: {
		roomId: string
		createdById: string
		description?: string
		startTime: Date
		endTime: Date
	}): Promise<BookingDetails> {
		return prisma.$transaction(async (tx) => {
			const booking = await tx.booking.create({
				data: {
					roomId: input.roomId,
					createdById: input.createdById,
					description: input.description,
					startTime: input.startTime,
					endTime: input.endTime,
				},
				select: {
					id: true,
				},
			})

			await tx.bookingParticipant.create({
				data: {
					bookingId: booking.id,
					userId: input.createdById,
				},
			})

			const createdBooking = await tx.booking.findUniqueOrThrow({
				where: { id: booking.id },
				select: bookingSelect,
			})

			return createdBooking
		})
	},

	updateBooking(
		bookingId: string,
		input: {
			description?: string
			startTime?: Date
			endTime?: Date
		},
	): Promise<BookingDetails> {
		return prisma.booking.update({
			where: { id: bookingId },
			data: input,
			select: bookingSelect,
		})
	},

	cancelBooking(bookingId: string): Promise<BookingDetails> {
		return prisma.booking.update({
			where: { id: bookingId },
			data: { status: BookingStatus.CANCELLED },
			select: bookingSelect,
		})
	},

	findParticipant(
		bookingId: string,
		userId: string,
	): Promise<{ id: string } | null> {
		return prisma.bookingParticipant.findUnique({
			where: {
				bookingId_userId: {
					bookingId,
					userId,
				},
			},
			select: { id: true },
		})
	},

	createParticipant(
		bookingId: string,
		userId: string,
	): Promise<BookingParticipantDetails> {
		return prisma.bookingParticipant.create({
			data: {
				bookingId,
				userId,
			},
			select: participantSelect,
		})
	},
}
