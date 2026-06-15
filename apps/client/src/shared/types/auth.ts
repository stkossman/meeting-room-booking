export type AuthUser = {
	id: string
	name: string
	email: string
}

export type AuthResponse = {
	user: AuthUser
	token: string
}

export type LoginRequest = {
	email: string
	password: string
}

export type RegisterRequest = {
	name: string
	email: string
	password: string
}
