<script lang="ts">
	import dayjs from 'dayjs'
	import { heightScreen, maxHeightScreen } from 'fuma'
	import type { LogWithAll } from '.'
	import LogComponent from './Log.svelte'
	import LogInput from './LogInput.svelte'

	let {
		logs,
		title,
		class: klass = ''
	}: { logs: LogWithAll[]; title: string; class?: string } = $props()
	let days = $derived(Object.groupBy(logs, (log) => dayjs(log.createdAt).format('YYYY-MM-DD')))

	const intlDay = new Intl.DateTimeFormat('fr-ch', {
		dateStyle: 'full'
	})

	let scrollContainer = $state<HTMLDivElement>()
	$effect(() => {
		logs.length
		if (scrollContainer) {
			scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' })
		}
	})

	function scrollDown(element: HTMLDivElement) {
		element.scrollTop = element.scrollHeight
	}
</script>

<div
	bind:this={scrollContainer}
	class="{klass}
		flex flex-col gap-4 h-full bg-base-100
		border border-input overflow-y-scroll rounded-lg
	"
	use:heightScreen
	use:scrollDown
>
	<h2 class="text-center text-3xl mt-[30%]">
		Bienvenue sur {title}
	</h2>
	<p class="text-center">Vous êtes au début du journal</p>
	{#each Object.entries(days) as [day, logs] (day)}
		<div class="divider px-3 text-xs opacity-70 my-0">{intlDay.format(new Date(day))}</div>
		{#each logs || [] as log (log.id)}
			<div class="hover:bg-base-200 py-1 px-3 rounded text-sm">
				<LogComponent {log} />
			</div>
		{/each}
	{/each}

	<LogInput {title} />
</div>
