import { AppRouter } from '@/app/providers/AppRouter'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { Toaster } from 'sonner'

export const AppProviders = () => {
	return (
		<QueryProvider>
			<AppRouter />
			<Toaster richColors position='bottom-right' />
		</QueryProvider>
	)
}
