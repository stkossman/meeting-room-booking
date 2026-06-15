import { httpClient } from '@/shared/api/httpClient'
import type {
	AuthResponse,
	AuthUser,
	LoginRequest,
	RegisterRequest,
} from '@/shared/types/auth'

export const authApi = {
	async login(payload: LoginRequest): Promise<AuthResponse> {
		const { data } = await httpClient.post<AuthResponse>('/auth/login', payload)

		return data
	},

	async register(payload: RegisterRequest): Promise<AuthResponse> {
		const { data } = await httpClient.post<AuthResponse>(
			'/auth/register',
			payload,
		)

		return data
	},

	async me(): Promise<AuthUser> {
		const { data } = await httpClient.get<{ user: AuthUser }>('/auth/me')

		return data.user
	},
}
