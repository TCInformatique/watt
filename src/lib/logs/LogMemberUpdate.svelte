<script lang="ts">
	import { Icon } from 'fuma'
	import { ContactGender } from '@prisma/client'
	import { contactLabels } from '$lib/labels'
	import { optionsContactGender } from '$lib/selectOptions'
	import type { LogTyped } from '.'
	import LogDiff from './LogDiff.svelte'
	import LogDiffs from './LogDiffs.svelte'
	import { snippetDate } from './Snippets.svelte'

	let { data }: LogTyped<'member_update'> = $props()

	let contactUpdate = $derived({ before: data.before.contact, after: data.after.contact })
</script>

<p>Membre modifié: <b>{data.before.contact.firstName} {data.before.contact.lastName}</b></p>

{#if data.before.role !== data.after.role}
	<LogDiff {data} key="role" label="Role" />
{/if}

<LogDiffs
	data={contactUpdate}
	labels={contactLabels}
	snippets={{ birthday: snippetDate, gender: snippetGender }}
/>

{#snippet snippetGender(gender: ContactGender | null)}
	{#if !gender}
		<span>-</span>
	{:else}
		<span class="flex items-center gap-1">
			<Icon path={optionsContactGender[gender].icon} size={16} class="opacity-70" />
			{optionsContactGender[gender].label}
		</span>
	{/if}
{/snippet}
