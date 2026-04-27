// See https://svelte.dev/docs/kit/types#app.d.ts
import type { User, Session, Org, LogType } from '@prisma/client'
import type { LogValueMap } from '$lib/logger'
import type { UserRole, MemberRole } from '$lib/types'
import type { LogData } from '$lib/server/logger'
import type { AttendancesCount, AttendancesRate, AttendancesMonitoring } from '$lib/monitoring'
import type { MemberWithContact } from './routes/(org)/members/types'

declare global {
	namespace App {
		interface Locals {
			session: null | (Session & { user: User })
		}
		interface PageData {
			org?: Org
			subscribeRequestsCount?: number
			member?: MemberWithContact
		}
		// interface Error {}
		// interface PageState {}
		// interface Platform {}
	}
	namespace PrismaJson {
		type JsonLogData = LogData<LogType>

		type JsonConsumptionData = {
			// Électricité
			instantPower?: number
			voltage?: number
			current?: number
			powerFactor?: number
			frequency?: number
			// Eau (chaude & froide)
			volume?: number
			flowRate?: number
			temperature?: number
			// Chauffage (énergie calorifique)
			energy?: number
			flowTemperature?: number
			returnTemperature?: number
			// Gaz
			pressure?: number
			// Alertes génériques
			alertStatus?: string
			alertCode?: string
		}
	}
}

export {}
