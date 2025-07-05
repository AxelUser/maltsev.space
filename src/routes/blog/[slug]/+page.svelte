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

	const { data }: PageProps = $props();

	const heroImages = import.meta.glob('/src/posts/*/hero.{jpg,jpeg,png,webp,avif}', {
		eager: true,
		query: {
			enhanced: true
		}
	}) as Record<string, { default: any }>;

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

	const heroImage = $derived.by(() => {
		if (!data?.slug) return null;
		const matchingImage = Object.entries(heroImages).find(([path]) => path.includes(data.slug));
		return matchingImage ? matchingImage[1].default : null;
	});

	const publishedTime = $derived(data.date ? new Date(data.date).toISOString() : undefined);

	const allKeywords = $derived([...(data.keywords || []), ...(data.tags || [])]);
</script>

<SEO
	title={data.title}
	description={data.preview || `Read about ${data.title} on ${config.websiteTitle}`}
	image={heroImage?.src}
	imageAlt={`${data.title} - Blog post hero image`}
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
/>

<article>
	<div class="post-navigation top-navigation">
		<Button href="/blog">← Back to all posts</Button>
	</div>

	{#if data.series && data.series.length > 0}
		<SeriesBanner posts={data.series} />
	{/if}

	<div class="prose">
		{@render data.content()}
	</div>

	<footer class="post-footer">
		<div class="post-navigation">
			<Button href="/blog">← Back to all posts</Button>
		</div>

		{#if data.series && data.series.length > 0}
			<SeriesBanner posts={data.series} />
		{/if}

		<Card>
			<div class="share-message">Enjoyed this post? Share it with the universe!</div>
			<div class="share-buttons">
				<Link
					href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(pageUrl)}`}
					external={true}
					class="share-link twitter"
					aria-label="Share on Twitter"
				>
					Twitter
				</Link>
				<Link
					href={`https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(data.title)}&url=${encodeURIComponent(pageUrl)}`}
					external={true}
					class="share-link linkedin"
					aria-label="Share on LinkedIn"
				>
					LinkedIn
				</Link>
				<Link
					href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
					external={true}
					class="share-link facebook"
					aria-label="Share on Facebook"
				>
					Facebook
				</Link>
			</div>
		</Card>
	</footer>
</article>

<style>
	article {
		margin: 0 auto;
		padding-bottom: var(--gap-large);
		max-width: var(--max-width-prose, 70ch);
	}

	.post-footer {
		margin-top: var(--gap-large);
		padding-top: var(--gap);
		border-top: 1px solid color-mix(in srgb, var(--brand) 20%, transparent);
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	.post-navigation {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--gap);
	}

	.top-navigation {
		margin-bottom: var(--gap-large);
		padding-bottom: var(--gap);
		border-bottom: 1px solid color-mix(in srgb, var(--brand) 20%, transparent);
	}

	.share-message {
		color: var(--text-1);
		font-size: var(--font-size-2);
		margin-bottom: var(--gap);
		font-weight: 500;
		text-align: center;
	}

	.share-buttons {
		display: flex;
		gap: var(--gap);
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
