import { prisma } from '$lib/server/db'
import type { API } from '$lib/api'
import { stringify } from 'devalue'
import { error, json, type RequestHandler } from '@sveltejs/kit'
import { parseQuery } from 'fuma/server'
import z from 'zod'
import type { ShapeOf } from '$lib/server/schema'
import { permission } from '$lib/server/permission'
import type { Prisma } from '@prisma/client'

type APIServer = {
	[K in keyof API]: {
		schemaQuery: ShapeOf<API[K]['query']>
		getData: (
			query: API[K]['query'] & { take: number; skip: number; locals: App.Locals }
		) => Promise<API[K]['data']>
	}
}

const apiServer = {
	org: {
		schemaQuery: { search: z.string().default(''), excludeOrgId: z.coerce.number().optional() },
		getData: ({ search, take, skip, excludeOrgId }) =>
			prisma.org.findMany({
				where: { name: { contains: search }, id: { not: excludeOrgId } },
				take,
				skip
			})
	},
	contact: {
		schemaQuery: { search: z.string().default('') },
		async getData({ search, take, skip, locals }) {
			const { orgId } = await permission.member.basic(locals)

			const AND: Prisma.ContactWhereInput[] = [{ members: { some: { orgId } } }]
			for (const token of search.split(' ').slice(0, 4)) {
				AND.push({
					OR: [
						{ firstName: { contains: token } },
						{ lastName: { contains: token } },
						{ email: { contains: token } },
						{ phone: { contains: token } },
						{ birthdayAsString: { contains: token } }
					]
				})
			}

			return prisma.contact.findMany({
				where: { AND },
				take,
				skip
			})
		}
	}
} satisfies APIServer

const schemaBase = {
	resource: z.enum(['org', 'contact']),
	take: z.coerce.number().default(6),
	skip: z.coerce.number().default(0)
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const { resource, take, skip } = parseQuery(url, schemaBase)
	const { schemaQuery, getData } = apiServer[resource]
	const query = parseQuery(url, schemaQuery)
	try {
		// TODO: correct, mais pas le temps pour faire propre
		// @ts-ignore
		const data = await getData({ ...query, take, skip, locals })
		return json({ data: stringify(data) })
	} catch (err: unknown) {
		if (err instanceof Error) {
			error(500, err.message)
		}
		error(500)
	}
}
