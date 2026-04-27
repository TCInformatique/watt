import type { Contact, Org } from '@prisma/client'
import { toast } from 'svelte-sonner'
import { parse } from 'devalue'

export type API = {
	org: { data: Org[]; query: { search: string; excludeOrgId?: number } }
	contact: { data: Contact[]; query: { search: string } }
}

type APIClient = { [K in keyof API]: (query: API[K]['query']) => Promise<API[K]['data']> }

function useGetApi<K extends keyof API>(resource: K) {
	return async (query: API[K]['query'] & { take?: number; limit?: number }) => {
		const url = new URL('/api', document.location.origin)
		url.searchParams.set('resource', resource)
		for (const [key, value] of Object.entries(query)) {
			url.searchParams.set(key, value.toString())
		}
		const res = await fetch(url)
		const contentType = res.headers.get('content-type')
		if (contentType !== 'application/json') {
			throw new Error(`Response Content-type is '${contentType}' instead 'application/json'`)
		}
		const json = await res.json()
		if (!res.ok) {
			console.warn(json.message)
			toast.error(`Error: ${res.status}`)
			throw new Error('Call api failed')
		}
		return parse(json.data) as API[K]['data']
	}
}

export const apiClient = {
	org: useGetApi('org'), // TODO: not used
	contact: useGetApi('contact')
} satisfies APIClient
