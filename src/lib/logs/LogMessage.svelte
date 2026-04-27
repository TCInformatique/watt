<script lang="ts">
	import type { LogTyped } from '.'
	import Markdown from '$lib/markdown/Markdown.svelte'
	import { page } from '$app/state'

	let { data, member }: LogTyped<'message_create'> = $props()
</script>

{#if member && !page.data.member}
	<span class="italic opacity-70 text-xs">
		Message posté dans le journal de
		<a href="/{member.orgId}/members/{member.contactId}" class="link link-hover">
			{member.contact.firstName}
			{member.contact.lastName}
		</a>
	</span>
{/if}

<Markdown value={data.message} />
