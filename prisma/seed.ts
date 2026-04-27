import { hash } from '@node-rs/argon2'
import { fakerFR_CH as faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
	const email = 'jonas.voisard@gmail.com'
	const birthday = new Date(1994, 7, 28)
	const rootUser = await prisma.user.create({
		data: {
			passwordHash: await hash('12341234'),
			email,
			role: 'root',
			contact: {
				create: {
					email,
					firstName: 'Jonas',
					lastName: 'Voisard',
					birthday,
					birthdayAsString: dayjs(birthday).format('DD.MM.YYYY'),
					phone: '079 542 42 42',
					gender: 'male',
					street: 'Rue du bonheur 42',
					zipCode: '3000',
					city: 'Atlantis'
				}
			}
		}
	})

	const org = await prisma.org.create({
		data: {
			name: 'Mon organisation',
			members: {
				create: {
					contactId: rootUser.contactId,
					role: 'admin'
				}
			}
		},
		include: { members: { select: { id: true } } }
	})

	await prisma.contact.createMany({
		data: generateContacts(5000)
	})
	const contacts = await prisma.contact.findMany({ where: { email: { not: email } } })

	await prisma.member.createMany({
		data: contacts.map((c) => ({ orgId: org.id, role: 'student', contactId: c.id }))
	})
}

seed()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})

function generateContacts(n: number): Prisma.ContactCreateInput[] {
	const contacts: Prisma.ContactCreateInput[] = []
	while (0 < n--) {
		const birthday = faker.date.birthdate()
		contacts.push({
			email: faker.internet.email(),
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			birthday,
			birthdayAsString: dayjs(birthday).format('DD.MM.YYYY'),
			phone: faker.phone.number(),
			gender: faker.person.sexType(),
			street: faker.location.streetAddress(),
			zipCode: faker.location.zipCode(),
			city: faker.location.city()
		})
	}
	return contacts
}
