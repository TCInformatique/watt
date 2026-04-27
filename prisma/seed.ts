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
		data: generateContacts(500)
	})
	const contacts = await prisma.contact.findMany({ where: { email: { not: email } } })

	await prisma.member.createMany({
		data: contacts.map((c) => ({ orgId: org.id, role: 'client', contactId: c.id }))
	})

	// ───────────────────────────────────────────────────────────────
	//  Données de démo — Compteurs Connectés
	// ───────────────────────────────────────────────────────────────

	console.log('Création des sites...')
	const sites = await Promise.all([
		prisma.site.create({
			data: {
				orgId: org.id,
				name: 'Résidence Les Alpes',
				address: faker.location.streetAddress(),
				city: faker.location.city(),
				zipCode: faker.location.zipCode()
			}
		}),
		prisma.site.create({
			data: {
				orgId: org.id,
				name: 'Immeuble du Lac',
				address: faker.location.streetAddress(),
				city: faker.location.city(),
				zipCode: faker.location.zipCode()
			}
		})
	])

	console.log('Création des locations...')
	const locations: { id: number; siteId: number }[] = []
	for (const site of sites) {
		for (let i = 1; i <= 5; i++) {
			const loc = await prisma.location.create({
				data: {
					siteId: site.id,
					name: `Appartement ${String(i).padStart(2, '0')}`
				}
			})
			locations.push(loc)
		}
	}

	console.log('Création des tarifs...')
	const tariffs = await Promise.all([
		prisma.tariff.create({
			data: {
				orgId: org.id,
				name: 'Tarif simple électricité',
				type: 'flat_rate',
				unitPrice: 0.25,
				currency: 'CHF',
				activeFrom: dayjs().subtract(1, 'year').toDate()
			}
		}),
		prisma.tariff.create({
			data: {
				orgId: org.id,
				name: 'Abonnement + conso',
				type: 'subscription_plus_usage',
				baseAmount: 120,
				annualPlatformFee: 50,
				unitPrice: 0.2,
				currency: 'CHF',
				activeFrom: dayjs().subtract(1, 'year').toDate()
			}
		}),
		prisma.tariff.create({
			data: {
				orgId: org.id,
				name: 'Tarif progressif eau',
				type: 'tiered',
				currency: 'CHF',
				activeFrom: dayjs().subtract(1, 'year').toDate()
			}
		})
	])

	await prisma.tariffTier.createMany({
		data: [
			{ tariffId: tariffs[2].id, minConsumption: 0, maxConsumption: 100, unitPrice: 0.015 },
			{ tariffId: tariffs[2].id, minConsumption: 100, maxConsumption: 500, unitPrice: 0.012 },
			{ tariffId: tariffs[2].id, minConsumption: 500, maxConsumption: 999999, unitPrice: 0.01 }
		]
	})

	console.log('Création des compteurs...')
	const meterTypes = ['electricity', 'hot_water', 'cold_water', 'heating', 'gas'] as const
	const meters = await Promise.all(
		Array.from({ length: 10 }).map((_, i) => {
			const loc = locations[i % locations.length]
			return prisma.meter.create({
				data: {
					orgId: org.id,
					siteId: loc.siteId,
					locationId: loc.id,
					serialNumber: faker.string.alphanumeric(12).toUpperCase(),
					model: faker.helpers.arrayElement(['SmartMeter V2', 'EcoCount Pro', 'SIM-Watt 3000']),
					simNumber: faker.string.numeric(15),
					status: faker.helpers.arrayElement(['online', 'offline', 'maintenance']),
					type: faker.helpers.arrayElement(meterTypes)
				}
			})
		})
	)

	console.log('Création des contrats...')
	const contractCount = Math.min(50, contacts.length)
	const contracts = await Promise.all(
		contacts.slice(0, contractCount).map((contact, i) => {
			const site = sites[i % sites.length]
			const tariff = tariffs[i % tariffs.length]
			return prisma.contract.create({
				data: {
					orgId: org.id,
					clientContactId: contact.id,
					tariffId: tariff.id,
					siteId: site.id,
					startDate: dayjs()
						.subtract(faker.number.int({ min: 6, max: 24 }), 'month')
						.toDate(),
					endDate: faker.helpers.maybe(
						() => dayjs().add(faker.number.int({ min: 6, max: 12 }), 'month').toDate(),
						{ probability: 0.8 }
					),
					status: 'active'
				}
			})
		})
	)

	console.log('Création des points de facturation...')
	const billingPoints = await Promise.all(
		contracts.map((contract, i) => {
			const meter = meters[i % meters.length]
			const location = locations.find((l) => l.id === meter.locationId)!
			return prisma.billingPoint.create({
				data: {
					orgId: org.id,
					contactId: contract.clientContactId,
					locationId: location.id,
					meterId: meter.id,
					contractId: contract.id,
					label: `Facturation ${faker.helpers.arrayElement(['mensuelle', 'trimestrielle'])}`
				}
			})
		})
	)

	console.log('Création des consommations...')
	const consumptionData: Prisma.ConsumptionCreateManyInput[] = []
	for (const meter of meters) {
		let indexValue = faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 })
		for (let d = 90; d >= 0; d--) {
			const timestamp = dayjs().subtract(d, 'day').toDate()
			const daily = faker.number.float({ min: 1, max: 20, fractionDigits: 3 })
			indexValue += daily
			consumptionData.push({
				meterId: meter.id,
				timestamp,
				indexValue,
				instantPower:
					faker.helpers.maybe(
						() => faker.number.float({ min: 0.5, max: 10, fractionDigits: 3 }),
						{ probability: 0.7 }
					) ?? null,
				voltage:
					faker.helpers.maybe(
						() => faker.number.float({ min: 220, max: 240, fractionDigits: 1 }),
						{ probability: 0.5 }
					) ?? null,
				current:
					faker.helpers.maybe(
						() => faker.number.float({ min: 1, max: 30, fractionDigits: 2 }),
						{ probability: 0.5 }
					) ?? null,
				alertStatus:
					faker.helpers.maybe(
						() => faker.helpers.arrayElement(['low_signal', 'high_consumption']),
						{ probability: 0.05 }
					) ?? null
			})
		}
	}
	await prisma.consumption.createMany({ data: consumptionData })

	console.log('Création des factures...')
	for (let i = 0; i < billingPoints.length; i++) {
		const bp = billingPoints[i]
		const contract = contracts[i]
		const periodStart = dayjs().subtract(1, 'month').startOf('month').toDate()
		const periodEnd = dayjs().subtract(1, 'month').endOf('month').toDate()
		const totalAmount = faker.number.float({ min: 50, max: 500, fractionDigits: 2 })

		const paymentData = faker.helpers.arrayElement([
			[],
			[
				{
					amount: totalAmount,
					method: 'virement',
					status: 'completed' as const,
					paidAt: dayjs().subtract(faker.number.int({ min: 1, max: 10 }), 'day').toDate()
				}
			],
			[
				{
					amount: totalAmount / 2,
					method: 'carte',
					status: 'pending' as const,
					paidAt: null
				}
			]
		])

		await prisma.invoice.create({
			data: {
				orgId: org.id,
				billingPointId: bp.id,
				contactId: bp.contactId,
				contractId: contract.id,
				periodStart,
				periodEnd,
				totalAmount,
				status: faker.helpers.arrayElement(['draft', 'sent', 'paid', 'overdue']),
				lines: {
					create: [
						{
							description: 'Consommation période',
							quantity: faker.number.float({ min: 50, max: 400, fractionDigits: 2 }),
							unitPrice: faker.number.float({ min: 0.15, max: 0.3, fractionDigits: 3 }),
							total: faker.number.float({ min: 30, max: 300, fractionDigits: 2 })
						},
						{
							description: 'Frais fixes',
							quantity: 1,
							unitPrice: faker.number.float({ min: 20, max: 50, fractionDigits: 2 }),
							total: faker.number.float({ min: 20, max: 50, fractionDigits: 2 })
						}
					]
				},
				payments: {
					create: paymentData
				}
			}
		})
	}

	console.log('Seed terminé avec succès !')
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
