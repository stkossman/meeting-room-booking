import { clsx } from 'clsx'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { Button } from '@/shared/ui/Button'

type ModalProps = PropsWithChildren<{
	isOpen: boolean
	title: string
	onClose: () => void
	className?: string
}>

export const Modal = ({
	children,
	className,
	isOpen,
	onClose,
	title,
}: ModalProps) => {
	useEffect(() => {
		if (!isOpen) {
			return
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	if (!isOpen) {
		return null
	}

	return (
		<div className='fixed inset-0 z-50 grid place-items-center bg-stone-950/30 px-4'>
			<div
				className={clsx(
					'w-full max-w-lg rounded-lg border border-stone-200 bg-white p-5 shadow-xl',
					className,
				)}
				role='dialog'
				aria-modal='true'
				aria-labelledby='modal-title'
			>
				<div className='flex items-start justify-between gap-4'>
					<h2 id='modal-title' className='text-lg font-semibold text-stone-950'>
						{title}
					</h2>
					<Button variant='ghost' onClick={onClose} aria-label='Close modal'>
						Close
					</Button>
				</div>
				<div className='mt-4'>{children}</div>
			</div>
		</div>
	)
}
