export type BookingStatus = 'ACTIVE' | 'CANCELLED'

export type BookingParticipant = {
	id: string
	userId: string
	createdAt: string
	user: {
		id: string
		name: string
		email: string
	}
}

export type Booking = {
	id: string
	roomId: string
	createdById: string
	description: string | null
	startTime: string
	endTime: string
	status: BookingStatus
	createdAt: string
	updatedAt: string
	participants: BookingParticipant[]
	createdBy: {
		id: string
		name: string
		email: string
	}
}
