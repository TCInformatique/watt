import { formAction, parseQuery } from 'fuma/server'
import z from 'zod'
import { prisma } from '$lib/server/db/index.js'
import { permission } from '$lib/server/permission.js'
import { schemaPagination } from '$lib/schemaPagination'

export const load = async ({ url }) => {
	const page = parseQuery(url, schemaPagination)
	return {
		users: await prisma.user.findMany({
			...page,
			include: { contact: true }
		})
	}
}

export const actions = {
	user_create: ({ locals }) => {
		permission.user.root(locals)
		console.log('TODO: is a good idea ?')
	},
	user_update: formAction(
		{ id: z.coerce.number(), role: z.enum(['admin', 'basic']) },
		async ({ locals, data }) => {
			permission.user.root(locals)

			return prisma.user.update({
				where: { id: data.id, role: { not: 'root' } },
				data: { role: data.role }
			})
		}
	)
}
