import { authApi } from '@/features/auth/api/authApi'
import {
	getToken,
	removeToken,
	setToken,
} from '@/features/auth/model/auth.storage'
import type { LoginRequest, RegisterRequest } from '@/shared/types/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

type ApiErrorResponse = {
	message?: string
}

export const getAuthErrorMessage = (error: unknown): string => {
	if (isAxiosError<ApiErrorResponse>(error)) {
		return error.response?.data.message ?? 'Request failed'
	}

	return 'Something went wrong'
}

export const useAuth = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const token = getToken()

	const meQuery = useQuery({
		queryKey: ['auth', 'me'],
		queryFn: authApi.me,
		enabled: Boolean(token),
		retry: false,
	})

	const loginMutation = useMutation({
		mutationFn: (payload: LoginRequest) => authApi.login(payload),
		onSuccess: async (data) => {
			setToken(data.token)
			queryClient.setQueryData(['auth', 'me'], data.user)
			await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
			navigate('/rooms', { replace: true })
		},
	})

	const registerMutation = useMutation({
		mutationFn: (payload: RegisterRequest) => authApi.register(payload),
		onSuccess: async (data) => {
			setToken(data.token)
			queryClient.setQueryData(['auth', 'me'], data.user)
			await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
			navigate('/rooms', { replace: true })
		},
	})

	const logout = () => {
		removeToken()
		queryClient.removeQueries({ queryKey: ['auth'] })
		navigate('/login', { replace: true })
	}

	return {
		isAuthenticated: Boolean(token),
		loginMutation,
		logout,
		meQuery,
		registerMutation,
	}
}
