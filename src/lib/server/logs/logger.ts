import { prisma } from '$lib/server/db'
import type { LogType, Org, Prisma } from '@prisma/client'
import type { MemberWithContact } from '$lib/types'

export type LogUpdate<T> = { before: T; after: T }
export type LogDataInput<T extends LogType> = Parameters<(typeof transformLogDataMap)[T]>
export type LogDataInputMap = { [T in LogType]: LogDataInput<T> }
export type LogData<T extends LogType> = ReturnType<(typeof transformLogDataMap)[T]>['data']
export type LogDataMap = { [T in LogType]: LogData<T> }
type LogDataOutput<Data> = Omit<Prisma.LogUncheckedCreateInput, 'type' | 'data'> & { data: Data }

const transformLogDataMap = {
	org_create: (org: Org, createdById: number) => ({ orgId: org.id, data: org, createdById }),
	org_update: (update: LogUpdate<Org>) => ({
		orgId: update.after.id,
		data: update
	}),
	member_create: (member: MemberWithContact) => ({
		orgId: member.orgId,
		memberId: member.id,
		contactId: member.contactId,
		data: member
	}),
	member_update: (update: LogUpdate<MemberWithContact>) => ({
		orgId: update.after.orgId,
		memberId: update.after.id,
		contactId: update.after.contactId,
		data: update
	}),
	member_delete: (member: MemberWithContact) => ({
		orgId: member.orgId,
		contactId: member.contactId,
		data: member
	}),
	invitation_declined: (member: MemberWithContact) => ({
		orgId: member.orgId,
		memberId: member.id,
		contactId: member.contactId,
		data: member
	}),
	invitation_accept: (member: MemberWithContact) => ({
		orgId: member.orgId,
		memberId: member.id,
		contactId: member.contactId,
		data: member
	}),
	message_create: (payload: LogDataOutput<{ message: string }>) => payload
} satisfies {
	[T in LogType]: (...args: any[]) => LogDataOutput<unknown>
}

export function useLogger(memberId: number | null = null) {
	async function logger<T extends LogType>(logType: T, ...args: LogDataInput<T>) {
		// @ts-ignore
		const data = transformLogDataMap[logType](...args)
		return prisma.log.create({
			data: {
				type: logType,
				createdById: memberId,
				...data
			}
		})
	}
	return logger
}

export const logger = useLogger()
