<script lang="ts">
	import { page } from '$app/state'
</script>

<div class="flex flex-col items-center justify-center h-full">
	<div class="card border border-error text-center p-6 flex flex-col gap-4 max-w-md w-full">
		<h2 class="text-xl">{page.status}</h2>
		<p>{page.error?.message}</p>
	</div>
</div>
