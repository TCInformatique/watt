import type { Contact } from '@prisma/client'

const baseLabels = {
	id: 'ID',
	createdAt: 'Création',
	updatedAt: 'Mise à jour'
}

export const contactLabels: Record<keyof Contact, string> = {
	firstName: 'Prénom',
	lastName: 'Nom',
	email: 'Email',
	phone: 'Téléphone',
	street: 'Rue et numéro',
	zipCode: 'NPA',
	city: 'Localité',
	birthday: 'Date de naissance',
	birthdayAsString: 'Date de naissance',
	gender: 'Genre',
	isInvitation: 'Invitation',
	...baseLabels
}
