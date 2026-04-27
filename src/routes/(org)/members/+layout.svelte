<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import SelectorContact from '$lib/selector/SelectorContact.svelte'
	import { XIcon } from '@lucide/svelte'
	import { urlParam } from 'fuma'

	let { data, children } = $props()
</script>

<div class="flex mb-4 gap-2 items-center">
	<SelectorContact
		focusShortcutEnable
		onSelect={async (contact, dropdown) => {
			if (!contact) {
				await goto(`/members`, {
					replaceState: true,
					keepFocus: true
				})
				dropdown?.show()
				return
			}
			await goto(`/members/${contact.id}`, { replaceState: true })
		}}
		value={page.data.member?.contact}
	/>

	{#if page.route.id !== '/(org)/members'}
		<a href={`/members`} class="btn btn-square">
			<XIcon />
		</a>
	{/if}

	<a
		href={$urlParam.with({ form_member: '{}' })}
		class="btn ml-auto btn-soft"
		class:btn-primary={!data.membersCount}
	>
		Importer un CSV
	</a>

	<a
		href={$urlParam.with({ form_member: '{}' })}
		class="btn"
		class:btn-soft={data.membersCount}
		class:btn-primary={!data.membersCount}
	>
		Ajouter un membre
	</a>
</div>

{@render children?.()}
