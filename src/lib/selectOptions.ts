import {
	mdiGenderFemale,
	mdiGenderMale,
	mdiGenderNonBinary,
	mdiShieldCrownOutline,
	mdiAccountCogOutline,
	mdiAccountOutline
} from '@mdi/js'
import type { ContactGender, MemberRole } from '@prisma/client'
import type { OptionRecord } from 'fuma'

export const optionsContactGender = {
	female: { label: 'Femme', icon: mdiGenderFemale },
	male: { label: 'Homme', icon: mdiGenderMale },
	other: { label: 'Autre', icon: mdiGenderNonBinary }
} satisfies OptionRecord<ContactGender>

export const optionsMemberRole = {
	admin: { label: 'Administrateur·rice', icon: mdiShieldCrownOutline },
	manager: { label: 'Gestionnaire', icon: mdiAccountCogOutline },
	client: { label: 'CLient·e', icon: mdiAccountOutline }
} satisfies OptionRecord<MemberRole>

export const optionsWeekday = {
	'1': 'Lundi',
	'2': 'Mardi',
	'3': 'Mercredi',
	'4': 'Jeudi',
	'5': 'Vendredi',
	'6': 'Samedi',
	'0': 'Dimanche'
}
