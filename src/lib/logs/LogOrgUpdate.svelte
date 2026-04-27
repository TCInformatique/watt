<script lang="ts">
	import type { LogTyped } from '.'
	import LogDiff from './LogDiff.svelte'

	let { data }: LogTyped<'org_update'> = $props()
</script>

<p>Modification du nom de l'organisation</p>
<LogDiff {data} key="name" />
