<script lang="ts">
	import type { LogTyped } from '.'

	let { data }: LogTyped<'member_delete'> = $props()
</script>

<p>
	Membre supprimé: <b>{data.contact.firstName} {data.contact.lastName}</b>
</p>
