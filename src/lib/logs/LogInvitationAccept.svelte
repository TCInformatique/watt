<script lang="ts">
	import type { LogTyped } from '.'

	let { data }: LogTyped<'invitation_accept'> = $props()
</script>

<p>
	<b>{data.contact.firstName} {data.contact.lastName}</b> a accepté son invitation.
</p>
