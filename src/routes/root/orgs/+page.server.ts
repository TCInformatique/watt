import { parseQuery } from 'fuma/server'
import { prisma } from '$lib/server/db/index.js'
import { schemaPagination } from '$lib/schemaPagination'

export const load = async ({ url }) => {
	const page = parseQuery(url, schemaPagination)
	return {
		orgs: await prisma.org.findMany({
			...page,
			include: { members: { where: { role: 'admin' }, include: { contact: true } } }
		})
	}
}
