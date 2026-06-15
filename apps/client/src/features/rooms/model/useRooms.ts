import { roomsApi } from '@/features/rooms/api/roomsApi'
import type { RoomFormValues } from '@/shared/types/room'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const roomsQueryKey = ['rooms'] as const

export const useRooms = () => {
	return useQuery({
		queryKey: roomsQueryKey,
		queryFn: roomsApi.getRooms,
	})
}

export const useRoom = (id: string | undefined) => {
	return useQuery({
		queryKey: [...roomsQueryKey, id],
		queryFn: () => roomsApi.getRoom(id ?? ''),
		enabled: Boolean(id),
	})
}

export const useCreateRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: RoomFormValues) => roomsApi.createRoom(payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: roomsQueryKey })
		},
	})
}

export const useUpdateRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string
			payload: RoomFormValues
		}) => roomsApi.updateRoom(id, payload),
		onSuccess: (room) => {
			void queryClient.invalidateQueries({ queryKey: roomsQueryKey })
			void queryClient.invalidateQueries({ queryKey: [...roomsQueryKey, room.id] })
		},
	})
}

export const useDeleteRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => roomsApi.deleteRoom(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: roomsQueryKey })
		},
	})
}
