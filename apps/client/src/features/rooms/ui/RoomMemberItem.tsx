import type { RoomMember, RoomRole } from '@/shared/types/room'
import { Button } from '@/shared/ui/Button'
import { Select } from '@/shared/ui/Select'

type RoomMemberItemProps = {
	member: RoomMember
	canManage: boolean
	isUpdating?: boolean
	isRemoving?: boolean
	onRemove: (member: RoomMember) => void
	onRoleChange: (member: RoomMember, role: RoomRole) => void
}

export const RoomMemberItem = ({
	canManage,
	isRemoving = false,
	isUpdating = false,
	member,
	onRemove,
	onRoleChange,
}: RoomMemberItemProps) => {
	return (
		<li className='flex flex-col gap-3 rounded-md border border-stone-200 bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between'>
			<div className='min-w-0'>
				<div className='flex flex-wrap items-center gap-2'>
					<p className='truncate text-sm font-semibold text-stone-950'>
						{member.user.name}
					</p>
					{!canManage && (
						<span className='rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-600'>
							{member.role}
						</span>
					)}
				</div>
				<p className='truncate text-sm text-stone-500'>{member.user.email}</p>
			</div>
			{canManage && (
				<div className='flex items-center gap-2'>
					<Select
						aria-label={`Role for ${member.user.email}`}
						className='h-9 w-28'
						value={member.role}
						disabled={isUpdating || isRemoving}
						onChange={(event) =>
							onRoleChange(member, event.target.value as RoomRole)
						}
					>
						<option value='USER'>USER</option>
						<option value='ADMIN'>ADMIN</option>
					</Select>
					<Button
						variant='ghost'
						disabled={isRemoving || isUpdating}
						onClick={() => onRemove(member)}
					>
						{isRemoving ? 'Removing...' : 'Remove'}
					</Button>
				</div>
			)}
		</li>
	)
}
