<script lang="ts">
	import type { LogTyped } from '.'

	let { data }: LogTyped<'member_create'> = $props()
</script>

<p>
	Membre créer: <b>{data.contact.firstName} {data.contact.lastName}</b>
</p>
