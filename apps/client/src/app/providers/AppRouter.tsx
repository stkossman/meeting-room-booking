import { getToken, removeToken } from '@/features/auth/model/auth.storage'
import { useAuth } from '@/features/auth/model/useAuth'
import { LoginPage } from '@/pages/login/LoginPage'
import { RegisterPage } from '@/pages/register/RegisterPage'
import { RoomDetailsPage } from '@/pages/room-details/RoomDetailsPage'
import { RoomsPage } from '@/pages/rooms/RoomsPage'
import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

type RouteGuardProps = {
	children: ReactNode
}

const ProtectedRoute = ({ children }: RouteGuardProps) => {
	const token = getToken()
	const { meQuery } = useAuth()

	if (!token) {
		return <Navigate to='/login' replace />
	}

	if (meQuery.isLoading) {
		return (
			<div className='grid min-h-screen place-items-center text-sm text-stone-600'>
				Loading workspace...
			</div>
		)
	}

	if (meQuery.isError) {
		removeToken()
		return <Navigate to='/login' replace />
	}

	return children
}

const PublicOnlyRoute = ({ children }: RouteGuardProps) => {
	const token = getToken()

	if (token) {
		return <Navigate to='/rooms' replace />
	}

	return children
}

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Navigate to='/rooms' replace />} />
				<Route
					path='/login'
					element={
						<PublicOnlyRoute>
							<LoginPage />
						</PublicOnlyRoute>
					}
				/>
				<Route
					path='/register'
					element={
						<PublicOnlyRoute>
							<RegisterPage />
						</PublicOnlyRoute>
					}
				/>
				<Route
					path='/rooms'
					element={
						<ProtectedRoute>
							<RoomsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/rooms/:id'
					element={
						<ProtectedRoute>
							<RoomDetailsPage />
						</ProtectedRoute>
					}
				/>
				<Route path='*' element={<Navigate to='/rooms' replace />} />
			</Routes>
		</BrowserRouter>
	)
}
