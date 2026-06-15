import { clsx } from 'clsx'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = PropsWithChildren<
	ButtonHTMLAttributes<HTMLButtonElement> & {
		variant?: ButtonVariant
	}
>

const variantClassName: Record<ButtonVariant, string> = {
	primary: 'bg-stone-900 text-white hover:bg-stone-800',
	secondary: 'border border-stone-300 bg-white text-stone-900 hover:bg-stone-100',
	ghost: 'text-stone-700 hover:bg-stone-100',
}

export const Button = ({
	children,
	className,
	variant = 'primary',
	type = 'button',
	...props
}: ButtonProps) => {
	return (
		<button
			type={type}
			className={clsx(
				'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors',
				'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500',
				'disabled:pointer-events-none disabled:opacity-50',
				variantClassName[variant],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	)
}
