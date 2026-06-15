import { AppRouter } from '@/app/providers/AppRouter'
import { QueryProvider } from '@/app/providers/QueryProvider'

export const AppProviders = () => {
	return (
		<QueryProvider>
			<AppRouter />
		</QueryProvider>
	)
}
