import { getAuthErrorMessage } from '@/features/auth/model'
import {
	useAddRoomMember,
	useRemoveRoomMember,
	useRoomMembers,
	useUpdateRoomMember,
} from '@/features/rooms/model'
import { AddRoomMemberForm } from '@/features/rooms/ui/AddRoomMemberForm'
import { RoomMemberItem } from '@/features/rooms/ui/RoomMemberItem'
import type {
	AddRoomMemberValues,
	Room,
	RoomMember,
	RoomRole,
} from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'

type RoomMembersPanelProps = {
	room: Room
}

export const RoomMembersPanel = ({ room }: RoomMembersPanelProps) => {
	const canManage = room.role === 'ADMIN'
	const membersQuery = useRoomMembers(room.id)
	const addMemberMutation = useAddRoomMember(room.id)
	const updateMemberMutation = useUpdateRoomMember(room.id)
	const removeMemberMutation = useRemoveRoomMember(room.id)

	const handleAddMember = (values: AddRoomMemberValues) => {
		addMemberMutation.mutate(values)
	}

	const handleRoleChange = (member: RoomMember, role: RoomRole) => {
		if (member.role === role) {
			return
		}

		updateMemberMutation.mutate({
			memberId: member.id,
			payload: { role },
		})
	}

	const handleRemoveMember = (member: RoomMember) => {
		if (!window.confirm(`Remove ${member.user.email} from this room?`)) {
			return
		}

		removeMemberMutation.mutate(member.id)
	}

	return (
		<aside className='rounded-lg border border-stone-200 bg-white/70 p-5 shadow-sm'>
			<div className='flex items-start justify-between gap-4'>
				<div>
					<h2 className='text-lg font-semibold text-stone-950'>Members</h2>
					<p className='mt-1 text-sm text-stone-600'>
						People who can view this room.
					</p>
				</div>
				{membersQuery.data && (
					<span className='rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600'>
						{membersQuery.data.length}
					</span>
				)}
			</div>
			{canManage && (
				<div className='mt-5 border-t border-stone-200 pt-5'>
					<AddRoomMemberForm
						isSubmitting={addMemberMutation.isPending}
						onSubmit={handleAddMember}
					/>
					{addMemberMutation.isError && (
						<p className='mt-3 text-sm text-red-600'>
							{getAuthErrorMessage(addMemberMutation.error)}
						</p>
					)}
				</div>
			)}
			<div className='mt-5'>
				{membersQuery.isLoading && (
					<p className='rounded-md border border-stone-200 bg-white/70 p-4 text-sm text-stone-600'>
						Loading members...
					</p>
				)}
				{membersQuery.isError && (
					<EmptyState
						className='min-h-40'
						title='Could not load members'
						description='Please try again in a moment.'
						action={
							<Button
								variant='secondary'
								onClick={() => void membersQuery.refetch()}
							>
								Retry
							</Button>
						}
					/>
				)}
				{membersQuery.data && membersQuery.data.length === 0 && (
					<EmptyState
						className='min-h-40'
						title='No members'
						description='This room has no members yet.'
					/>
				)}
				{membersQuery.data && membersQuery.data.length > 0 && (
					<ul className='grid gap-3'>
						{membersQuery.data.map((member) => (
							<RoomMemberItem
								key={member.id}
								member={member}
								canManage={canManage}
								isUpdating={updateMemberMutation.variables?.memberId === member.id}
								isRemoving={removeMemberMutation.variables === member.id}
								onRemove={handleRemoveMember}
								onRoleChange={handleRoleChange}
							/>
						))}
					</ul>
				)}
				{updateMemberMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getAuthErrorMessage(updateMemberMutation.error)}
					</p>
				)}
				{removeMemberMutation.isError && (
					<p className='mt-3 text-sm text-red-600'>
						{getAuthErrorMessage(removeMemberMutation.error)}
					</p>
				)}
			</div>
		</aside>
	)
}
