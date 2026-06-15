import { clsx } from 'clsx'
import { forwardRef, type SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
	label?: string
	error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ children, className, error, id, label, ...props }, ref) => {
		const selectId = id ?? props.name

		return (
			<label className='grid gap-1.5 text-sm text-stone-700' htmlFor={selectId}>
				{label && <span className='font-medium'>{label}</span>}
				<select
					ref={ref}
					id={selectId}
					className={clsx(
						'h-10 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 shadow-sm transition',
						'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500',
						error && 'border-red-400 focus-visible:outline-red-500',
						className,
					)}
					{...props}
				>
					{children}
				</select>
				{error && <span className='text-xs text-red-600'>{error}</span>}
			</label>
		)
	},
)

Select.displayName = 'Select'
