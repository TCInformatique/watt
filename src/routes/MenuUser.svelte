<script lang="ts">
	import type { UserBasic } from '$lib/types'
	import { ChevronsUpDown, LogOut, User } from '@lucide/svelte'
	import { DropDown } from 'fuma/ui'
	import ToggleMode from '$lib/material/ToggleMode.svelte'

	let { user }: { user: UserBasic } = $props()

	let minWidth = $state(0)
</script>

<DropDown class="border-input" hideOnBlur tippyProps={{ placement: 'top-start' }}>
	<button slot="activator" class="btn btn-ghost w-full" bind:clientWidth={minWidth}>
		<User class="h-5" />
		<span>{user.contact.firstName} {user.contact.lastName}</span>
		<ChevronsUpDown class="ml-auto w-3.5 translate-x-2 opacity-60" />
	</button>

	<div style="min-width: {minWidth - 8}px;">
		<div class="flex gap-1">
			<form action="/auth?/logout" method="post">
				<button class="btn">
					<LogOut class="h-4" />
					<span>logout</span>
				</button>
			</form>
			<ToggleMode class="ml-auto"></ToggleMode>
		</div>
	</div>
</DropDown>
