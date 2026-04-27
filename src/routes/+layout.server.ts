import { prisma } from '$lib/server/db'
import { useFormData } from '$lib/server/useFormData'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals: { session }, url }) => {
	if (!session && url.pathname !== '/auth') {
		redirect(302, '/auth')
	}
	if (session && !session.orgId && url.pathname !== '/home') {
		redirect(302, '/home')
	}
	return {
		formDataOrg: await useFormData(url, 'form_org', (id) =>
			prisma.org.findFirstOrThrow({ where: { id } })
		)
	}
}
