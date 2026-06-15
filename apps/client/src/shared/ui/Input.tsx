import { clsx } from 'clsx'
import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string
	error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, error, id, label, ...props }, ref) => {
		const inputId = id ?? props.name

		return (
			<label className='grid gap-1.5 text-sm text-stone-700' htmlFor={inputId}>
				{label && <span className='font-medium'>{label}</span>}
				<input
					ref={ref}
					id={inputId}
					className={clsx(
						'h-10 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 shadow-sm transition',
						'placeholder:text-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500',
						error && 'border-red-400 focus-visible:outline-red-500',
						className,
					)}
					{...props}
				/>
				{error && <span className='text-xs text-red-600'>{error}</span>}
			</label>
		)
	},
)

Input.displayName = 'Input'
