import { LoginPage } from '@/pages/login/LoginPage'
import { RegisterPage } from '@/pages/register/RegisterPage'
import { RoomDetailsPage } from '@/pages/room-details/RoomDetailsPage'
import { RoomsPage } from '@/pages/rooms/RoomsPage'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Navigate to='/rooms' replace />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/rooms' element={<RoomsPage />} />
				<Route path='/rooms/:id' element={<RoomDetailsPage />} />
				<Route path='*' element={<Navigate to='/rooms' replace />} />
			</Routes>
		</BrowserRouter>
	)
}
