<script lang="ts">
	import type { LogTyped } from '.'

	let { data }: LogTyped<'org_create'> = $props()
</script>

<p>
	Création de l'organisation <b>{data.name}</b> et de son premier administrateur.
</p>
