<script lang="ts">
	import { Icon } from 'fuma'
	import { mdiThemeLightDark, mdiWeatherNight, mdiWhiteBalanceSunny } from '@mdi/js'
	import { MediaQuery } from 'svelte/reactivity'

	let { class: klass }: { class: string } = $props()

	const light = 'light' as const
	const dark = 'forest' as const

	const themes = {
		[light]: mdiWhiteBalanceSunny,
		[dark]: mdiWeatherNight,
		default: mdiThemeLightDark
	}

	let prefersLight = new MediaQuery('prefers-color-scheme: light')
	let theme = $state<keyof typeof themes>(prefersLight.current ? light : dark)
	$effect(() => {
		if (theme === 'default') {
			document.documentElement.removeAttribute('data-theme')
			return
		}
		document.documentElement.setAttribute('data-theme', theme)
	})

	function toggleTheme() {
		theme = theme === light ? dark : light
	}
</script>

<button class="btn btn-square {klass}" onclick={toggleTheme}>
	<Icon path={themes[theme]} />
</button>
