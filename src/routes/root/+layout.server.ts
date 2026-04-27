import { getUserBasic, prisma } from '$lib/server/db'
import { permission } from '$lib/server/permission.js'
import { useFormData } from '$lib/server/useFormData'

export const load = async ({ locals, url }) => {
	const { user } = permission.user.root(locals)

	return {
		user: await getUserBasic(user.id),
		formDataUser: await useFormData(url, 'form_user', (id) =>
			prisma.user.findUnique({
				where: { id },
				include: { contact: true }
			})
		)
	}
}
