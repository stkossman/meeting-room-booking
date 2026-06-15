import 'dotenv/config'

const isProduction = process.env.NODE_ENV === 'production'

const parsePort = (value: string | undefined): number => {
	const port = Number(value ?? 4000)

	if (!Number.isInteger(port) || port <= 0) {
		throw new Error('PORT must be a positive integer')
	}

	return port
}

const getEnvValue = (name: string, fallback: string): string => {
	const value = process.env[name]

	if (isProduction && !value) {
		throw new Error(`${name} is required in production`)
	}

	return value ?? fallback
}

export const env = {
	port: parsePort(process.env.PORT),
	clientUrl: getEnvValue('CLIENT_URL', 'http://localhost:5173'),
	databaseUrl: getEnvValue(
		'DATABASE_URL',
		'postgresql://booking_user:booking_password@localhost:5432/booking_db',
	),
	jwtSecret: getEnvValue('JWT_SECRET', 'dev_secret'),
	jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
}
