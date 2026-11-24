<script lang="ts">
	import { page } from '$app/state';
	import { Container } from '$lib/components/layout';
	import { Button, SectionHeading } from '$lib/components/ui';
	import { PostRows } from '$lib/components/posts';
	import type { PostPreview } from '$lib/types';
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics';

	let recommendedPosts = $state<PostPreview[]>([]);

	onMount(async () => {
		track('page_error', {
			status: page.status,
			path: page.url.pathname,
			referrer: document.referrer
		});
		const res = await fetch('/recent-posts.json');
		if (res.ok) recommendedPosts = await res.json();
	});
</script>

<svelte:head>
	<title>Oops! Lost in Space</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Container>
	<section class="pt-14 pb-16 sm:pt-[72px]">
		<p class="eyebrow mt-0 mb-7">Error {page.status}</p>
		<h1
			class="m-0 text-[clamp(42px,6.4vw,88px)]/[0.98] font-light tracking-[-0.02em] font-stretch-[115%]"
		>
			<span class="block text-ink-3">Signal lost.</span>
			<span class="block font-semibold"
				>Error {page.status}<span class="text-livery-1">.</span></span
			>
		</h1>
		<p class="mt-9 mb-0 max-w-[31em] text-[18px] text-ink-2">
			Oops! We've drifted into unknown space coordinates!
		</p>
		<div class="mt-9 flex flex-wrap gap-3">
			<Button href="/">Go home</Button>
			<Button href="/blog" variant="ghost">Read the notes</Button>
		</div>
	</section>

	{#if recommendedPosts.length > 0}
		<section class="pb-24" data-ph-capture-attribute-nav="error-recs">
			<SectionHeading title="While you're here" aside="All notes →" href="/blog" />
			<PostRows posts={recommendedPosts} />
		</section>
	{/if}
</Container>
