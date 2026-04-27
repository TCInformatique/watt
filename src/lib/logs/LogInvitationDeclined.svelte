<script lang="ts">
	import type { LogTyped } from '.'

	let { data }: LogTyped<'invitation_declined'> = $props()
</script>

<p>
	<b>{data.contact.firstName} {data.contact.lastName}</b> a décliné son invitation.
</p>
