import { env } from '$env/dynamic/private'
import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

export * from './requests'

const adapter = new PrismaPg(env.DATABASE_URL)

export const prisma = new PrismaClient({ adapter }).$extends({
	query: {
		contact: {
			async update({ args, query }) {
				if (typeof args.data.email === 'string') {
					const contact = await prisma.contact.findUniqueOrThrow({
						where: args.where,
						include: { user: true }
					})
					if (contact.user) {
						await prisma.user.update({
							where: { id: contact.user.id },
							data: { email: args.data.email }
						})
					}
				}
				updateBirthdayAsString(args.data)
				return query(args)
			},
			create({ args, query }) {
				updateBirthdayAsString(args.data)
				return query(args)
			},
			createMany({ args, query }) {
				if (!Array.isArray(args.data)) updateBirthdayAsString(args.data)
				else args.data.forEach(updateBirthdayAsString)
				return query(args)
			},
			updateMany({ args, query }) {
				if (!Array.isArray(args.data)) updateBirthdayAsString(args.data)
				else args.data.forEach(updateBirthdayAsString)
				return query(args)
			}
		},
		member: {
			create({ args, query }) {
				if (args.data.contact?.create) updateBirthdayAsString(args.data.contact.create)
				return query(args)
			},
			update({ args, query }) {
				if (args.data.contact?.update) updateBirthdayAsString(args.data.contact.update)
				return query(args)
			}
		}
	}
})

function updateBirthdayAsString(
	contact: Pick<Prisma.ContactUpdateInput, 'birthday' | 'birthdayAsString'>
) {
	if (
		contact.birthday === null ||
		typeof contact.birthday === 'string' ||
		contact.birthday instanceof Date
	) {
		if (contact.birthday === null) contact.birthdayAsString = null
		else contact.birthdayAsString = dayjs(contact.birthday).format('DD.MM.YYYY')
	}
}
