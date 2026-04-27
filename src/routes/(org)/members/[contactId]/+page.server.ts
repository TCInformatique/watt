import { prisma } from '$lib/server/db'
import { getLogs } from '$lib/server/logs/getLogs'

export const load = async ({ params, parent }) => {
	const contactId = +params.contactId
	const { org } = await parent()

	const member = await prisma.member.findUniqueOrThrow({
		where: { orgId_contactId: { orgId: org.id, contactId } },
		include: {
			contact: {
				include: {
					members: { where: { orgId: { not: org.id } }, include: { org: true } }
				}
			}
		}
	})

	return {
		member,
		contactLogs: await getLogs({ OR: [{ createdById: member.id }, { contactId }] })
	}
}
