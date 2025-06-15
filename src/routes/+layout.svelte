<script lang="ts">
	import { Header, Footer, TwinklingStars } from '$lib/components';
	import { browser, dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { theme, applyTheme } from '$lib/stores/theme';
	import 'open-props/style';
	import 'open-props/normalize';
	import '../app.css';
	import posthog from 'posthog-js';
	import { PUBLIC_POSTHOG_API_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	const { children } = $props();

	onMount(() => {
		if (browser && !dev) {
			applyTheme($theme);
			posthog.init(PUBLIC_POSTHOG_API_KEY, {
				api_host: PUBLIC_POSTHOG_HOST,
				person_profiles: 'always',
				capture_pageview: false,
				capture_pageleave: false
			});
		}
	});

	if (browser && !dev) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="Aleksey Maltsev's Blog" href="/rss.xml" />
	<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
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
