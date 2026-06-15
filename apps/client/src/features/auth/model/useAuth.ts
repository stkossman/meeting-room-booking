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
	details?: {
		message: string
	}[]
}

export const getAuthErrorMessage = (error: unknown): string => {
	if (isAxiosError<ApiErrorResponse>(error)) {
		const status = error.response?.status
		const message = error.response?.data.message
		const validationMessage = error.response?.data.details?.[0]?.message

		if (status === 400) {
			return validationMessage ?? 'Please check the entered values.'
		}

		if (status === 401) {
			return message === 'Unauthorized'
				? 'Please log in to continue.'
				: 'Invalid email or password.'
		}

		if (status === 403) {
			return 'You do not have permission to do this.'
		}

		if (status === 404) {
			return message ?? 'The requested resource was not found.'
		}

		if (status === 409) {
			return message ?? 'This action conflicts with existing data.'
		}

		return message ?? 'Request failed'
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
