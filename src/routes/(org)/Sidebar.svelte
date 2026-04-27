<script lang="ts">
	import {
		BookUserIcon,
		CheckCheck,
		ClipboardListIcon,
		LockKeyholeOpen,
		Milestone,
		Newspaper
	} from '@lucide/svelte'
	import { tip } from 'fuma'
	import { page } from '$app/state'
	import type { RouteId } from '$app/types'
	import MenuOrg from './MenuOrg.svelte'
	import MenuUser from '../MenuUser.svelte'
	import type { LayoutData } from './$types'

	let { data }: { data: LayoutData } = $props()

	let orgPage = $derived((route: RouteId) => ({
		href: route.replace('/(org)', ''),
		class: page.route.id?.startsWith(route) ? 'menu-active' : ''
	}))
</script>

<aside class="min-w-56 border-r border-base-300">
	<div class="menu w-full h-full">
		<MenuOrg {data} />
		<ul class="mt-2">
			<li>
				<a {...orgPage('/(org)/logs')}>
					<Newspaper class="h-4" />
					<span>Journal</span>
				</a>
			</li>
			<li>
				<a {...orgPage('/(org)/members')}>
					<BookUserIcon class="h-4" />
					<span>Répertoire</span>
				</a>
			</li>
		</ul>
		<div class="grow"></div>
		<MenuUser user={data.user} />
	</div>
</aside>
