import { error } from '@sveltejs/kit'
import { prisma } from '$lib/server/db'
import { useLogger } from '$lib/server/logs/logger'

function permissionSession(locals: App.Locals) {
	if (!locals.session) error(401)
	return locals.session
}

async function permissionMember(locals: App.Locals) {
	const { user, orgId, id: sessionId } = permissionSession(locals)
	if (!orgId) {
		error(401, `session.OrgId need to be defined`)
	}
	const member = await prisma.member.findUnique({
		where: { orgId_contactId: { orgId, contactId: user.contactId } }
	})
	if (!member) error(403)
	return { ...member, user, sessionId, logger: useLogger(member.id) }
}

export const permission = {
	userId: (locals: App.Locals) => permissionSession(locals).user.id,
	user: {
		basic: permissionSession,
		admin: (locals: App.Locals) => {
			const session = permissionSession(locals)
			if (session.user.role !== 'root' && session.user.role !== 'admin') {
				error(403)
			}
			return session
		},
		root: (locals: App.Locals) => {
			const session = permissionSession(locals)
			if (session.user.role !== 'root') {
				error(403)
			}
			return session
		}
	},
	member: {
		basic: permissionMember,
		admin: async (locals: App.Locals) => {
			const member = await permissionMember(locals)
			if (member.role === 'admin') return member
			error(403)
		},
		manager: async (locals: App.Locals) => {
			const member = await permissionMember(locals)
			if (member.role === 'admin') return member
			if (member.role === 'manager') return member
			error(403)
		}
	}
}
