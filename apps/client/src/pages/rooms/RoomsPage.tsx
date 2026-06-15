import { useAuth } from '@/features/auth/model/useAuth'
import {
	getRoomFormValues,
	RoomForm,
	RoomList,
} from '@/features/rooms/ui'
import {
	useCreateRoom,
	useDeleteRoom,
	useRooms,
	useUpdateRoom,
} from '@/features/rooms/model'
import { getAuthErrorMessage } from '@/features/auth/model'
import type { Room, RoomFormValues } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Modal } from '@/shared/ui/Modal'
import { useState } from 'react'

export const RoomsPage = () => {
	const { logout, meQuery } = useAuth()
	const roomsQuery = useRooms()
	const createRoomMutation = useCreateRoom()
	const updateRoomMutation = useUpdateRoom()
	const deleteRoomMutation = useDeleteRoom()
	const [isCreateModalOpen, setCreateModalOpen] = useState(false)
	const [editingRoom, setEditingRoom] = useState<Room | null>(null)

	const handleCreateRoom = (values: RoomFormValues) => {
		createRoomMutation.mutate(values, {
			onSuccess: () => setCreateModalOpen(false),
		})
	}

	const handleUpdateRoom = (values: RoomFormValues) => {
		if (!editingRoom) {
			return
		}

		updateRoomMutation.mutate(
			{
				id: editingRoom.id,
				payload: values,
			},
			{
				onSuccess: () => setEditingRoom(null),
			},
		)
	}

	const handleDeleteRoom = (room: Room) => {
		if (!window.confirm(`Delete "${room.name}"?`)) {
			return
		}

		deleteRoomMutation.mutate(room.id)
	}

	return (
		<main className='mx-auto w-full max-w-5xl px-6 py-10'>
			<header className='flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<p className='text-sm font-medium text-stone-500'>
						{meQuery.data ? meQuery.data.email : 'Workspace'}
					</p>
					<h1 className='mt-2 text-3xl font-semibold text-stone-950'>Rooms</h1>
				</div>
				<div className='flex items-center gap-3'>
					<Button variant='secondary' onClick={logout}>
						Logout
					</Button>
					<Button onClick={() => setCreateModalOpen(true)}>Create room</Button>
				</div>
			</header>
			<section className='mt-8'>
				{roomsQuery.isLoading && (
					<div className='rounded-lg border border-stone-200 bg-white/70 p-8 text-sm text-stone-600'>
						Loading rooms...
					</div>
				)}
				{roomsQuery.isError && (
					<EmptyState
						title='Could not load rooms'
						description='Please check your connection and try again.'
						action={
							<Button
								variant='secondary'
								onClick={() => void roomsQuery.refetch()}
							>
								Retry
							</Button>
						}
					/>
				)}
				{roomsQuery.data && (
					<RoomList
						rooms={roomsQuery.data}
						deletingRoomId={deleteRoomMutation.variables}
						onCreate={() => setCreateModalOpen(true)}
						onDelete={handleDeleteRoom}
						onEdit={setEditingRoom}
					/>
				)}
			</section>
			<Modal
				isOpen={isCreateModalOpen}
				title='Create room'
				onClose={() => setCreateModalOpen(false)}
			>
				<RoomForm
					submitLabel='Create room'
					isSubmitting={createRoomMutation.isPending}
					onCancel={() => setCreateModalOpen(false)}
					onSubmit={handleCreateRoom}
				/>
				{createRoomMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getAuthErrorMessage(createRoomMutation.error)}
					</p>
				)}
			</Modal>
			<Modal
				isOpen={Boolean(editingRoom)}
				title='Edit room'
				onClose={() => setEditingRoom(null)}
			>
				{editingRoom && (
					<RoomForm
						defaultValues={getRoomFormValues(editingRoom)}
						submitLabel='Save changes'
						isSubmitting={updateRoomMutation.isPending}
						onCancel={() => setEditingRoom(null)}
						onSubmit={handleUpdateRoom}
					/>
				)}
				{updateRoomMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getAuthErrorMessage(updateRoomMutation.error)}
					</p>
				)}
			</Modal>
		</main>
	)
}
