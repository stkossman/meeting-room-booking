import { httpClient } from '@/shared/api/httpClient'
import type {
	Booking,
	BookingFormValues,
	BookingParticipant,
} from '@/shared/types/booking'

export const bookingsApi = {
	async getBookings(roomId: string): Promise<Booking[]> {
		const { data } = await httpClient.get<{ bookings: Booking[] }>(
			`/rooms/${roomId}/bookings`,
		)

		return data.bookings
	},

	async createBooking(
		roomId: string,
		payload: BookingFormValues,
	): Promise<Booking> {
		const { data } = await httpClient.post<{ booking: Booking }>(
			`/rooms/${roomId}/bookings`,
			payload,
		)

		return data.booking
	},

	async updateBooking(
		bookingId: string,
		payload: BookingFormValues,
	): Promise<Booking> {
		const { data } = await httpClient.patch<{ booking: Booking }>(
			`/bookings/${bookingId}`,
			payload,
		)

		return data.booking
	},

	async cancelBooking(bookingId: string): Promise<Booking> {
		const { data } = await httpClient.delete<{ booking: Booking }>(
			`/bookings/${bookingId}`,
		)

		return data.booking
	},

	async joinBooking(bookingId: string): Promise<BookingParticipant> {
		const { data } = await httpClient.post<{ participant: BookingParticipant }>(
			`/bookings/${bookingId}/join`,
		)

		return data.participant
	},
}
