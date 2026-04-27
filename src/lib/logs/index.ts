import type { LogDataMap } from '$lib/server/logs/logger'
import type { Contact, Log, LogType, Member, Org } from '@prisma/client'

export { default as Logs } from './Logs.svelte'

type MemberContactBasic = Member & {
	org: { name: string }
	contact: Pick<Contact, 'id' | 'firstName' | 'lastName'>
}

export type LogWithAll = Log & {
	createdBy: MemberContactBasic | null
	org: Org
	member: MemberContactBasic | null
}

export type LogTyped<T extends LogType> = Omit<LogWithAll, 'type' | 'data'> & {
	type: T
	data: LogDataMap[T]
}
