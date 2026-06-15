export type RoomRole = 'ADMIN' | 'USER'

export type Room = {
	id: string
	name: string
	description: string | null
	createdById: string
	createdAt: string
	updatedAt: string
	role: RoomRole
}

export type RoomFormValues = {
	name: string
	description?: string
}

export type RoomMember = {
	id: string
	roomId: string
	userId: string
	role: RoomRole
	createdAt: string
	updatedAt: string
	user: {
		id: string
		name: string
		email: string
	}
}
