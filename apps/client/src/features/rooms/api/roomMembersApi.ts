import { httpClient } from '@/shared/api/httpClient'
import type {
	AddRoomMemberValues,
	RoomMember,
	UpdateRoomMemberValues,
} from '@/shared/types/room'

export const roomMembersApi = {
	async getMembers(roomId: string): Promise<RoomMember[]> {
		const { data } = await httpClient.get<{ members: RoomMember[] }>(
			`/rooms/${roomId}/members`,
		)

		return data.members
	},

	async addMember(
		roomId: string,
		payload: AddRoomMemberValues,
	): Promise<RoomMember> {
		const { data } = await httpClient.post<{ member: RoomMember }>(
			`/rooms/${roomId}/members`,
			payload,
		)

		return data.member
	},

	async updateMember(
		roomId: string,
		memberId: string,
		payload: UpdateRoomMemberValues,
	): Promise<RoomMember> {
		const { data } = await httpClient.patch<{ member: RoomMember }>(
			`/rooms/${roomId}/members/${memberId}`,
			payload,
		)

		return data.member
	},

	async removeMember(roomId: string, memberId: string): Promise<void> {
		await httpClient.delete(`/rooms/${roomId}/members/${memberId}`)
	},
}
