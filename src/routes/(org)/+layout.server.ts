import { prisma, getInvitations, getUserBasic } from '$lib/server/db'
import { permission } from '$lib/server/permission.js'
import { useFormData } from '$lib/server/useFormData'
import { error, redirect } from '@sveltejs/kit'
import { parseQuery } from 'fuma/server'
import z from 'zod'

export const load = async ({ url, locals }) => {
	const { orgId, contactId, user, sessionId } = await permission.member.basic(locals)
	await handleOrgIdParam()
	const userMembers = await prisma.member.findMany({
		where: { contactId },
		include: { org: true }
	})
	const org = userMembers?.find(({ org }) => org.id === orgId)?.org
	if (!org) error(404) // TODO: fallback instead ?

	return {
		org,
		userMembers,
		user: await getUserBasic(user.id),
		invitations: await getInvitations(user.email),
		formDataMember: await useFormData(url, 'form_member', (id) =>
			prisma.member.findUnique({
				where: { id },
				include: { contact: { include: { user: { select: { id: true } } } } }
			})
		)
	}

	async function handleOrgIdParam() {
		const query = parseQuery(url, { orgId: z.coerce.number().optional() })
		if (query.orgId && query.orgId !== orgId) {
			await prisma.session.update({
				where: { id: sessionId },
				data: { orgId: query.orgId }
			})
			url.searchParams.delete('orgId')
			url.searchParams.set('invalidateAll', '1')
			redirect(302, url)
		}
	}
}
