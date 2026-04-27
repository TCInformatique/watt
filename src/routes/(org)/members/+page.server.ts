import z from 'zod'
import { error } from '@sveltejs/kit'
import type { Prisma } from '@prisma/client'
import { formAction, parseQuery } from 'fuma/server'
import { prisma } from '$lib/server/db'
import { permission } from '$lib/server/permission'
import type { ShapeOf } from '$lib/server/schema'
import { schemaPagination } from '$lib/schemaPagination'

export const load = async ({ url, parent }) => {
	const { org } = await parent()
	const pagination = parseQuery(url, schemaPagination)
	return {
		members: await prisma.member.findMany({
			where: { orgId: org.id },
			include: { contact: true },
			...pagination
		})
	}
}

const schemaContactCreate = {
	firstName: z.string().min(3).max(32),
	lastName: z.string().min(3).max(32),
	email: z.union([z.string().max(0), z.email()]).nullish(),
	phone: z.string().nullish(),
	city: z.string().nullish(),
	zipCode: z.string().nullish(),
	street: z.string().nullish(),
	birthday: z.date().nullish(),
	gender: z.union([
		z.literal('').transform(() => null),
		z.enum(['male', 'female', 'other']).nullish()
	]),
	isInvitation: z.boolean().default(false)
} satisfies ShapeOf<Prisma.ContactCreateInput>

const schemaCreate = {
	role: z.enum(['admin', 'manager', 'client']),
	contact: z.object(schemaContactCreate)
}

export const actions = {
	member_create: formAction(schemaCreate, async ({ locals, data }) => {
		const { orgId, logger } = await permission.member.admin(locals)
		const member = await prisma.member.create({
			data: {
				org: { connect: { id: orgId } },
				role: data.role,
				contact: { create: data.contact }
			},
			include: { contact: true }
		})
		await logger('member_create', member)
		return member
	}),
	member_update: formAction(
		{
			id: z.coerce.number(),
			...schemaCreate
		},
		async ({ data, locals }) => {
			const { logger, ...member } = await permission.member.manager(locals)
			if (member.id === data.id && member.role !== data.role) {
				error(403, 'You cannot change your role')
			}
			const where: Prisma.MemberWhereUniqueInput = { id: data.id, orgId: member.orgId }
			const before = await prisma.member.findUniqueOrThrow({ where, include: { contact: true } })
			const after = await prisma.member.update({
				where,
				data: {
					role: data.role,
					contact: {
						update: data.contact
					}
				},
				include: { contact: true }
			})
			await logger('member_update', { before, after })
		}
	),
	member_delete: formAction({ id: z.coerce.number() }, async ({ data, locals, params }) => {
		const { logger, ...member } = await permission.member.manager(locals)
		if (member.id === data.id) {
			error(403, 'You cannot remove yourself')
		}
		const deleted = await prisma.member.delete({
			where: { id: data.id, orgId: member.orgId },
			include: { contact: true }
		})
		await logger('member_delete', deleted)
	})
}
