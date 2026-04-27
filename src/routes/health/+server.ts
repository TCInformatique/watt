import { json } from '@sveltejs/kit'

export const GET = () => {
	return json({ success: true }, { status: 200 })
}
