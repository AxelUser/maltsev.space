<script lang="ts">
	import { SiteHeader, SiteFooter, Starfield } from '#lib/components/layout/index.ts';
	import { onMount } from 'svelte';
	import '#lib/stores/theme.ts';
	import '../app.css';
	import { page } from '$app/state';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import {
		analyticsEnabled,
		initAnalytics,
		trackPageleave,
		trackPageview
	} from '#lib/analytics/index.ts';

	const { children } = $props();

	onMount(initAnalytics);

	if (analyticsEnabled) {
		// PostHog's unload handler sends $pageleave when the visitor leaves the site
		beforeNavigate(({ type, shallow }) => {
			if (shallow && type === 'goto') return;
			if (type !== 'leave') trackPageleave();
		});

		afterNavigate(({ shallow, type }) => {
			if (shallow && type === 'goto') return;

			return trackPageview(page.data.analytics);
		});
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
