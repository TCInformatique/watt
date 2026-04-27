import { getLogs } from '$lib/server/logs/getLogs'
import { permission } from '$lib/server/permission.js'
import { formAction } from 'fuma/server'
import z from 'zod'

export const load = async ({ parent }) => {
	const { org } = await parent()

	return {
		logs: await getLogs({
			OR: [{ orgId: org.id }, { contact: { members: { some: { orgId: org.id } } } }]
		})
	}
}

const schemaMessage = {
	memberId: z.coerce.number().optional(),
	contactId: z.coerce.number().optional(),
	message: z.string()
}

export const actions = {
	message_create: formAction(schemaMessage, async ({ data, locals }) => {
		const { orgId, logger } = await permission.member.manager(locals)
		await logger('message_create', {
			orgId,
			memberId: data.memberId,
			contactId: data.contactId,
			data: { message: data.message }
		})
	})
}
