<script lang="ts">
	import { SiteHeader, SiteFooter, Starfield } from '$lib/components/layout';
	import { browser, dev } from '$app/environment';
	import { onMount } from 'svelte';
	import '$lib/stores/theme';
	import '../app.css';
	import posthog from 'posthog-js';
	import { PUBLIC_POSTHOG_API_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	const { children } = $props();

	const analyticsEnabled = browser && !dev && window.location.hostname !== 'localhost';

	onMount(() => {
		if (analyticsEnabled) {
			posthog.init(PUBLIC_POSTHOG_API_KEY, {
				api_host: PUBLIC_POSTHOG_HOST,
				person_profiles: 'always',
				capture_pageview: false,
				capture_pageleave: false
			});
		}
	});

	if (analyticsEnabled) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="Aleksey Maltsev's Blog" href="/rss.xml" />
	<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
</svelte:head>

<Starfield />
<div class="relative flex min-h-svh flex-col">
	<SiteHeader />
	<main class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>
