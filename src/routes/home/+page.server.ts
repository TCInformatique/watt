import { prisma, getInvitations, getUserBasic } from '$lib/server/db'
import { permission } from '$lib/server/permission.js'

export const load = async ({ locals }) => {
	const { user } = permission.user.basic(locals)
	return {
		user: await getUserBasic(user.id),
		members: await prisma.member.findMany({
			where: { contactId: user.contactId },
			include: {
				org: {
					include: {
						_count: {
							select: {
								members: true
							}
						}
					}
				}
			}
		}),
		invitations: await getInvitations(user.email)
	}
}
