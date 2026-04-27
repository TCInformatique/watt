import type { Handle } from '@sveltejs/kit'
import * as auth from '$lib/server/auth'
import { sequence } from '@sveltejs/kit/hooks'

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName)
	if (!sessionToken) {
		event.locals.session = null
		return resolve(event)
	}
	const session = await auth.validateSessionToken(sessionToken)
	if (!session) {
		auth.deleteSessionTokenCookie(event)
		return resolve(event)
	}
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)

	event.locals.session = session
	return resolve(event)
}

export const handle: Handle = sequence(handleAuth)
