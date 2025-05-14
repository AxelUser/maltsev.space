<script lang="ts">
	import { Header, Footer, TwinklingStars } from '$lib/components';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { theme, applyTheme } from '$lib/stores/theme';
	import 'open-props/style';
	import 'open-props/normalize';
	import '../app.css';

	const { children } = $props();

	onMount(() => {
		if (browser) {
			applyTheme($theme);
		}
	});
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="Aleksey Maltsev's Blog" href="/rss.xml" />
</svelte:head>

<div class="space-layout">
	<Header />
	<TwinklingStars />
	<main>
		<div class="space-container">
			{@render children()}
		</div>
	</main>

	<Footer />
</div>

<style>
	.space-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--surface-1);
		position: relative;
		overflow-x: hidden;
		z-index: 0;
	}

	main {
		flex: 1;
		padding-block: var(--gap-large);
	}

	@media (--sm-n-below) {
		main {
			padding-block: var(--gap);
		}
	}

	@media (--xs-n-below) {
		main {
			padding-block: var(--gap-small);
		}
	}
</style>
