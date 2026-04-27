import z from 'zod'
import { formAction } from 'fuma/server'
import { prisma } from '$lib/server/db/index.js'
import { permission } from '$lib/server/permission.js'
import type { ShapeOf } from '$lib/server/schema.js'
import type { Contact, Prisma } from '@prisma/client'
import { logger } from '$lib/server/logs/logger'
import { redirect } from '@sveltejs/kit'

export const load = () => {
	redirect(302, `/logs`)
}

const schemaId = { id: z.coerce.number() }
const schemaCreate = {
	name: z.string().min(3).max(32)
} satisfies ShapeOf<Prisma.OrgUncheckedCreateInput>
const schemaUpdate = { ...schemaCreate, ...schemaId }

export const actions = {
	org_create: formAction(
		schemaCreate,
		async ({ data, locals }) => {
			const { user, ...session } = permission.user.admin(locals)
			const {
				members: [admin],
				...org
			} = await prisma.org.create({
				data: {
					...data,
					members: {
						create: {
							contactId: user.contactId,
							role: 'admin'
						}
					}
				},
				include: { members: { select: { id: true } } }
			})
			await logger('org_create', org, admin.id)
			await prisma.session.update({
				where: { id: session.id },
				data: { orgId: org.id }
			})
			return org
		},
		{
			redirectTo: () => '/'
		}
	),
	org_update: formAction(schemaUpdate, async ({ data: { id, ...data }, locals }) => {
		const { logger } = await permission.member.admin(locals)
		const before = await prisma.org.findUniqueOrThrow({ where: { id } })
		const after = await prisma.org.update({
			where: { id },
			data
		})
		await logger('org_update', { before, after })
	}),
	org_delete: formAction(schemaId, async ({ data, locals }) => {
		await permission.member.admin(locals)
		await prisma.org.delete({ where: { id: data.id } })
	}),
	invitation_declined: formAction(schemaId, async ({ data, locals }) => {
		const { user } = permission.user.basic(locals)
		return prisma.contact.update({
			where: { id: data.id, email: user.email, isInvitation: true },
			data: { isInvitation: false }
		})
	}),
	invitation_accept: formAction(schemaId, async ({ data, locals }) => {
		const { user } = permission.user.basic(locals)

		const [a, b] = await Promise.all([
			prisma.user.findUniqueOrThrow({ where: { id: user.id } }).contact(),
			prisma.contact.findUniqueOrThrow({
				where: { id: data.id, email: user.email, isInvitation: true }
			})
		])
		const merged = mergeContact(a, b)
		await prisma.$transaction([
			prisma.contact.update({ where: { id: merged.id }, data: merged }),
			prisma.member.updateMany({ where: { contactId: b.id }, data: { contactId: merged.id } }),
			prisma.contact.delete({ where: { id: b.id } })
		])
		// TODO: log for each member updated
	})
}

function mergeContact(a: Contact, b: Contact): Contact {
	const isIntresting = (k: keyof Contact) => !a[k] && b[k]
	function take<K extends keyof Contact>(k: K) {
		a[k] = b[k]
	}
	for (const key in a) {
		if (isIntresting(key as keyof Contact)) {
			take(key as keyof Contact)
		}
	}
	a.isInvitation = false
	return a
}
