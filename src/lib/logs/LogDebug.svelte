<script lang="ts" generics="T extends LogType">
	import { LogType } from '@prisma/client'
	import type { LogTyped } from '.'

	let { type, data }: LogTyped<T> = $props()
</script>

<p>{type}</p>

<pre class="text-xs">{JSON.stringify(data, null, 2)}</pre>
