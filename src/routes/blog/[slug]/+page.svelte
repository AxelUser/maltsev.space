<script lang="ts">
	import '../../../svgbob.css';
	import Link from '$lib/components/ui/link/link.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArticleHero, SEO, SeriesBanner } from '$lib/components';
	import { config } from '$lib/config';
	import { bio } from '$lib/bio';
	import mermaid from 'mermaid';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { getPostHeroImage } from '$lib/utils';
	import PostsGrid from '$lib/components/posts-grid.svelte';
	import { OneColumnLayout } from '$lib/components/layouts';
	const { data }: PageProps = $props();

	onMount(() => {
		mermaid.initialize({
			theme: 'dark'
		});
	});

	$effect(() => {
		if (data.content) {
			mermaid.run({
				querySelector: '.mermaid'
			});
		}
	});

	const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

	const heroImage = $derived(getPostHeroImage(data.slug));

	const publishedTime = $derived(data.date ? new Date(data.date).toISOString() : undefined);

	const allKeywords = $derived([...(data.keywords || []), ...(data.tags || [])]);
</script>

<SEO
	title={data.title}
	description={data.preview}
	image={data.ogImagePath}
	imageAlt={data.title}
	url={`/blog/${data.slug}`}
	type="article"
	{publishedTime}
	keywords={allKeywords}
/>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"
		integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP"
		crossorigin="anonymous"
	/>
</svelte:head>

<ArticleHero
	title={data.title}
	date={data.date}
	preview={data.preview}
	author={bio.fullName}
	{heroImage}
	placeholder={data.placeholderUrl}
	views={data.views}
	readingTimeMinutes={data.readingTimeMinutes}
/>

<OneColumnLayout>
	<article class="mx-auto max-w-[70ch] rounded-2xl bg-surface-1/95 pb-12">
		<div class="mb-12 flex justify-between border-b border-brand/20 pb-5">
			<Button href="/blog">← Back to all posts</Button>
		</div>

		{#if data.series && data.series.length > 0}
			<SeriesBanner posts={data.series} />
		{/if}

		<div class="prose">
			{@render data.content()}
		</div>

		<footer class="mt-12 flex flex-col gap-5 border-t border-brand/20 pt-5">
			<div class="mb-5 flex justify-between">
				<Button href="/blog">← Back to all posts</Button>
			</div>

			{#if data.series && data.series.length > 0}
				<SeriesBanner posts={data.series} />
			{/if}

			<Card>
				<div class="mb-5 text-center text-lg font-medium text-fg-1">
					Enjoyed this post? Share it with the universe!
				</div>
				<div class="flex flex-wrap justify-center gap-5">
					<Link
						href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(pageUrl)}`}
						external={true}
						aria-label="Share on Twitter"
					>
						Twitter
					</Link>
					<Link
						href={`https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(data.title)}&url=${encodeURIComponent(pageUrl)}`}
						external={true}
						aria-label="Share on LinkedIn"
					>
						LinkedIn
					</Link>
					<Link
						href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
						external={true}
						aria-label="Share on Facebook"
					>
						Facebook
					</Link>
				</div>
			</Card>
		</footer>
	</article>

	{#if data.referencedPost && data.referencedPost.length > 0}
		<div class="mt-5 flex flex-col items-center gap-12">
			<h2 class="max-md:text-2xl">Want to read more?</h2>
			<PostsGrid posts={data.referencedPost} />
		</div>
	{/if}
</OneColumnLayout>
