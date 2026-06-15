import { roomMembersApi } from '@/features/rooms/api/roomMembersApi'
import type {
	AddRoomMemberValues,
	UpdateRoomMemberValues,
} from '@/shared/types/room'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const roomMembersQueryKey = (roomId: string | undefined) =>
	['rooms', roomId, 'members'] as const

export const useRoomMembers = (roomId: string | undefined) => {
	return useQuery({
		queryKey: roomMembersQueryKey(roomId),
		queryFn: () => roomMembersApi.getMembers(roomId ?? ''),
		enabled: Boolean(roomId),
	})
}

export const useAddRoomMember = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: AddRoomMemberValues) =>
			roomMembersApi.addMember(roomId ?? '', payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: roomMembersQueryKey(roomId),
			})
		},
	})
}

export const useUpdateRoomMember = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			memberId,
			payload,
		}: {
			memberId: string
			payload: UpdateRoomMemberValues
		}) => roomMembersApi.updateMember(roomId ?? '', memberId, payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: roomMembersQueryKey(roomId),
			})
		},
	})
}

export const useRemoveRoomMember = (roomId: string | undefined) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (memberId: string) =>
			roomMembersApi.removeMember(roomId ?? '', memberId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: roomMembersQueryKey(roomId),
			})
		},
	})
}
