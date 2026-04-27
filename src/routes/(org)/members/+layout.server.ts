import { prisma } from '$lib/server/db'
import { permission } from '$lib/server/permission'

export const load = async ({ locals }) => {
	const { orgId } = await permission.member.manager(locals)
	return {
		membersCount: await prisma.member.count({
			where: { orgId }
		})
	}
}
