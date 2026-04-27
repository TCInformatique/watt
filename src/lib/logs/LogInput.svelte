<script lang="ts">
	import { page } from '$app/state'
	import MarkdownEdit from '$lib/markdown/MarkdownEdit.svelte'
	import { SendHorizontalIcon } from '@lucide/svelte'
	import { tip, useForm } from 'fuma'
	import { toast } from 'svelte-sonner'

	let { title }: { title: string } = $props()

	let message = $state('')

	const { enhance } = useForm({
		onSuccess(action, data) {
			toast.success('Message posté')
			message = ''
		}
	})
</script>

<div
	class="sticky bottom-0 w-full pl-3 pb-3 bg-linear-to-b from-base-100/0 to-base-100 to-50% mt-auto"
>
	<div class="border border-input rounded bg-base-100 relative">
		<MarkdownEdit bind:value={message} placeholder="Rediger un message dans {title}" />

		<form action="/{page.data.org?.id}/logs?/message_create" method="post" use:enhance>
			<input type="hidden" name="message" value={message} />
			{#if page.data.member}
				<input type="hidden" name="memberId" value={page.data.member.id} />
				<input type="hidden" name="contactId" value={page.data.member.contactId} />
			{/if}
			<button
				disabled={!message}
				class="btn btn-square bottom-1 right-1 absolute btn-sm btn-primary btn-soft"
				use:tip={{ content: `Poster dans ${title}` }}
			>
				<SendHorizontalIcon size={18} />
			</button>
		</form>
	</div>
</div>
