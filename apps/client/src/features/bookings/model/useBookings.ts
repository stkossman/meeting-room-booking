import { bookingsApi } from '@/features/bookings/api/bookingsApi'
import type { BookingFormValues } from '@/shared/types/booking'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const bookingsQueryKey = (
	roomId: string | undefined,
	date?: string,
) => ['rooms', roomId, 'bookings', date] as const

export const useBookings = (roomId: string | undefined, date?: string) => {
	return useQuery({
		queryKey: bookingsQueryKey(roomId, date),
		queryFn: () => bookingsApi.getBookings(roomId ?? '', date),
		enabled: Boolean(roomId),
	})
}

export const useCreateBooking = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: BookingFormValues) =>
			bookingsApi.createBooking(roomId ?? '', payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ['rooms', roomId, 'bookings'],
			})
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
			void queryClient.invalidateQueries({
				queryKey: ['rooms', roomId, 'bookings'],
			})
		},
	})
}

export const useCancelBooking = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (bookingId: string) => bookingsApi.cancelBooking(bookingId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ['rooms', roomId, 'bookings'],
			})
		},
	})
}

export const useJoinBooking = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (bookingId: string) => bookingsApi.joinBooking(bookingId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ['rooms', roomId, 'bookings'],
			})
		},
	})
}
