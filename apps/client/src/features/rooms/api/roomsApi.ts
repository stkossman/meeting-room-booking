import { httpClient } from '@/shared/api/httpClient'
import type { Room, RoomFormValues } from '@/shared/types/room'

export const roomsApi = {
	async getRooms(): Promise<Room[]> {
		const { data } = await httpClient.get<{ rooms: Room[] }>('/rooms')

		return data.rooms
	},

	async getRoom(id: string): Promise<Room> {
		const { data } = await httpClient.get<{ room: Room }>(`/rooms/${id}`)

		return data.room
	},

	async createRoom(payload: RoomFormValues): Promise<Room> {
		const { data } = await httpClient.post<{ room: Room }>('/rooms', payload)

		return data.room
	},

	async updateRoom(id: string, payload: RoomFormValues): Promise<Room> {
		const { data } = await httpClient.patch<{ room: Room }>(
			`/rooms/${id}`,
			payload,
		)

		return data.room
	},

	async deleteRoom(id: string): Promise<void> {
		await httpClient.delete(`/rooms/${id}`)
	},
}
