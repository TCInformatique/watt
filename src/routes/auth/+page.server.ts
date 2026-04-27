import { hash, verify } from '@node-rs/argon2'
import { error, fail, redirect } from '@sveltejs/kit'
import { formAction } from 'fuma/server'
import z from 'zod'
import * as auth from '$lib/server/auth'
import { prisma } from '$lib/server/db'
import { env } from '$env/dynamic/private'
import type { UserRole } from '@prisma/client'

export const load = async ({ locals, url }) => {
	if (!locals.session) return
	const redirectTo = url.searchParams.get('redirectTo')
	if (redirectTo) redirect(302, redirectTo)
	redirect(302, '/')
}

const shemaLogin = { email: z.email(), password: z.string().min(8) }
const shemaRegister = { ...shemaLogin, firstName: z.string().min(2), lastName: z.string().min(2) }

export const actions = {
	login: formAction(shemaLogin, async ({ event, data }) => {
		const user = await prisma.user.findUnique({ where: { email: data.email } })
		if (!user) {
			error(401, 'User not found')
		}

		const validPassword = await verify(user.passwordHash, data.password)
		if (!validPassword) {
			error(401, 'Incorrect user or password')
		}

		const sessionToken = auth.generateSessionToken()
		const session = await auth.createSession(sessionToken, user.id)
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)
	}),
	register: formAction(shemaRegister, async ({ event, data }) => {
		const { password, email, ...contactData } = data
		const passwordHash = await hash(password)

		async function getRole(): Promise<UserRole> {
			const isAdminUser = env['ADMIN_USERS']?.split(';').includes(email)
			if (!isAdminUser) return 'basic'
			const isFirstUser = !(await prisma.user.findFirst())
			if (isFirstUser) return 'root'
			return 'admin'
		}

		const user = await prisma.user.create({
			data: {
				passwordHash,
				email,
				role: await getRole(),
				contact: {
					create: {
						email,
						...contactData
					}
				}
			}
		})
		const sessionToken = auth.generateSessionToken()
		const session = await auth.createSession(sessionToken, user.id)
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)
	}),
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401)
		}
		await auth.invalidateSession(event.locals.session.id)
		auth.deleteSessionTokenCookie(event)
	}
}
