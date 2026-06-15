import axios from 'axios'
import { getToken } from '@/features/auth/model/auth.storage'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export const httpClient = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

httpClient.interceptors.request.use((config) => {
	const token = getToken()

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})
