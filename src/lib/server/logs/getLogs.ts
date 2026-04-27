import type { Prisma } from '@prisma/client'
import { prisma } from '$lib/server/db'
import type { LogWithAll } from '$lib/logs'

export async function getLogs(where: Prisma.LogWhereInput): Promise<LogWithAll[]> {
	const memberInclude: Prisma.MemberInclude = {
		contact: {
			select: {
				id: true,
				firstName: true,
				lastName: true
			}
		}
	}
	return prisma.log.findMany({
		where,
		orderBy: { createdAt: 'asc' },
		include: {
			org: true,
			member: { include: memberInclude },
			createdBy: { include: { ...memberInclude, org: { select: { name: true } } } }
		}
	})
}
