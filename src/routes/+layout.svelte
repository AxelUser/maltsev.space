<script lang="ts">
	import { Header, Footer, TwinklingStars } from '$lib/components';
	import { browser, dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { theme, applyTheme } from '$lib/stores/theme';
	import '../app.css';
	import posthog from 'posthog-js';
	import { PUBLIC_POSTHOG_API_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	const { children } = $props();

	const isLocalhost = $state(browser && window.location.hostname === 'localhost');

	onMount(() => {
		if (browser && !dev && !isLocalhost) {
			applyTheme($theme);
			posthog.init(PUBLIC_POSTHOG_API_KEY, {
				api_host: PUBLIC_POSTHOG_HOST,
				person_profiles: 'always',
				capture_pageview: false,
				capture_pageleave: false
			});
		}
	});

	if (browser && !dev && !isLocalhost) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="Aleksey Maltsev's Blog" href="/rss.xml" />
	<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
</svelte:head>

<div class="relative z-0 flex min-h-screen flex-col bg-surface-1">
	<Header />
	<TwinklingStars />
	<main class="flex-1 py-12">
		{@render children()}
	</main>

	<Footer />
</div>
