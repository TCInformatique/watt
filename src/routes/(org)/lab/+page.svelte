<script lang="ts">
	import { MarkdownEdit } from '$lib/markdown'
	let value = $state('')
</script>

<div class="max-w-xl border">
	<MarkdownEdit bind:value />
</div>
