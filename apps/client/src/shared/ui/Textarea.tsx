import { clsx } from 'clsx'
import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string
	error?: string
}

export const Textarea = ({
	className,
	error,
	id,
	label,
	...props
}: TextareaProps) => {
	const textareaId = id ?? props.name

	return (
		<label className='grid gap-1.5 text-sm text-stone-700' htmlFor={textareaId}>
			{label && <span className='font-medium'>{label}</span>}
			<textarea
				id={textareaId}
				className={clsx(
					'min-h-24 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm transition',
					'placeholder:text-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500',
					error && 'border-red-400 focus-visible:outline-red-500',
					className,
				)}
				{...props}
			/>
			{error && <span className='text-xs text-red-600'>{error}</span>}
		</label>
	)
}
