<script lang="ts">
	import { Logs } from '$lib/logs'

	let { data } = $props()
</script>

<Logs title="le journal de {data.org.name}" logs={data.logs} class="max-w-2xl mx-auto" />
