import type { UserBasic } from '$lib/types'
import { prisma } from '.'

export function getInvitations(userEmail: string) {
	return prisma.contact.findMany({
		where: { isInvitation: true, email: userEmail },
		include: {
			members: {
				include: { org: true }
			}
		}
	})
}

export function getUserBasic(userId: number): Promise<UserBasic> {
	return prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: {
			id: true,
			role: true,
			contact: true
		}
	})
}
