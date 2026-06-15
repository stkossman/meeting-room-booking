import { bookingsApi } from '@/features/bookings/api/bookingsApi'
import type { BookingFormValues } from '@/shared/types/booking'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const bookingsQueryKey = (roomId: string | undefined) =>
	['rooms', roomId, 'bookings'] as const

export const useBookings = (roomId: string | undefined) => {
	return useQuery({
		queryKey: bookingsQueryKey(roomId),
		queryFn: () => bookingsApi.getBookings(roomId ?? ''),
		enabled: Boolean(roomId),
	})
}

export const useCreateBooking = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: BookingFormValues) =>
			bookingsApi.createBooking(roomId ?? '', payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: bookingsQueryKey(roomId) })
		},
	})
}

export const useUpdateBooking = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			bookingId,
			payload,
		}: {
			bookingId: string
			payload: BookingFormValues
		}) => bookingsApi.updateBooking(bookingId, payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: bookingsQueryKey(roomId) })
		},
	})
}

export const useCancelBooking = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (bookingId: string) => bookingsApi.cancelBooking(bookingId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: bookingsQueryKey(roomId) })
		},
	})
}

export const useJoinBooking = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (bookingId: string) => bookingsApi.joinBooking(bookingId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: bookingsQueryKey(roomId) })
		},
	})
}
