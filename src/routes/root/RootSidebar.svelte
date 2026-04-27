<script lang="ts">
	import { BananaIcon, HouseIcon, SchoolIcon, UsersIcon } from '@lucide/svelte'
	import { page } from '$app/state'
	import type { UserBasic } from '$lib/types'
	import MenuUser from '../MenuUser.svelte'

	let { user }: { user: UserBasic } = $props()
</script>

<aside class="min-w-40 border-r border-base-300">
	<div class="menu w-full h-full">
		<h1 class="menu-title">Root admin</h1>

		<ul class="mt-2">
			<li>
				<a href="/root" class:menu-active={page.route.id === '/root'}>
					<BananaIcon class="h-4" />
					<span>Overview</span>
				</a>
			</li>
			<li>
				<a href="/root/users" class:menu-active={page.route.id === '/root/users'}>
					<UsersIcon class="h-4" />
					<span>Users</span>
				</a>
			</li>
			<li>
				<a href="/root/orgs" class:menu-active={page.route.id === '/root/orgs'}>
					<SchoolIcon class="h-4" />
					<span>Organizations</span>
				</a>
			</li>

			<h1 class="menu-title">Other pages</h1>
			<li>
				<a href="/">
					<SchoolIcon class="h-4" />
					<span>Organisation</span>
				</a>
			</li>
			<li>
				<a href="/home">
					<HouseIcon class="h-4" />
					<span>Home</span>
				</a>
			</li>
		</ul>
		<div class="grow"></div>
		<MenuUser {user} />
	</div>
</aside>
