import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type EmptyStateProps = {
	title: string
	description?: string
	action?: ReactNode
	className?: string
}

export const EmptyState = ({
	action,
	className,
	description,
	title,
}: EmptyStateProps) => {
	return (
		<div
			className={clsx(
				'flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white/60 px-6 py-10 text-center',
				className,
			)}
		>
			<h2 className='text-base font-semibold text-stone-950'>{title}</h2>
			{description && (
				<p className='mt-2 max-w-md text-sm leading-6 text-stone-600'>
					{description}
				</p>
			)}
			{action && <div className='mt-5'>{action}</div>}
		</div>
	)
}
