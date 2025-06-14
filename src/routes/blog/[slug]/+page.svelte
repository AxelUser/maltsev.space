<script lang="ts">
	import Link from '$lib/components/ui/link/link.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { SEO } from '$lib/components';
	import { config } from '$lib/config';

	const { data } = $props();

	const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
	const heroImage = data?.heroUrl;

	const publishedTime = data.date ? new Date(data.date).toISOString() : undefined;

	const allKeywords = [...(data.keywords || []), ...(data.tags || [])];
</script>

<SEO
	title={data.title}
	description={(data as any).preview || `Read about ${data.title} on ${config.websiteTitle}`}
	image={heroImage}
	imageAlt={`${data.title} - Blog post hero image`}
	url={`/blog/${(data as any).slug}`}
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

{#if heroImage}
	<div class="hero-background-container">
		<img
			src={heroImage}
			alt="{data.title} hero image"
			loading="lazy"
			class="hero-background-image"
		/>
		<div class="hero-content">
			<hgroup>
				<h1 class="space-title">{data.title}</h1>
				<p>
					<span>Published at <time datetime="2024-06-15">{data.date}</time></span>
				</p>
			</hgroup>
		</div>
	</div>
{/if}

<article>
	{#if !heroImage}
		<hgroup>
			<h1 class="space-title">{data.title}</h1>
			<p>
				<span>Published at <time datetime="2024-06-15">{data.date}</time></span>
			</p>
		</hgroup>
	{/if}

	<div class="post-navigation top-navigation">
		<Button href="/blog">← Back to all posts</Button>
	</div>

	<div class="prose">
		{@render data.content()}
	</div>

	<footer class="post-footer">
		<div class="post-navigation">
			<Button href="/blog">← Back to all posts</Button>
		</div>

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
	@import 'open-props/media';

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

	.hero-background-container {
		position: relative;
		width: 100%;
		padding: var(--gap-large) 0;
		margin-bottom: var(--gap);
		color: var(--text-on-dark-bg, white);
	}

	.hero-background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.3;
		z-index: -1;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: var(--max-width-prose, 70ch);
		margin: 0 auto;
		padding: 0;
	}

	.hero-content hgroup {
		margin-bottom: 0;
	}

	.hero-content h1 {
		color: inherit;
	}

	.hero-content p {
		color: inherit;
		font-size: var(--font-size-1);
		margin-bottom: 0;
	}

	article > hgroup {
		margin-bottom: var(--gap);
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	article > hgroup p {
		display: flex;
		gap: var(--gap);
		font-size: var(--font-size-1);
		color: var(--space-text-muted);
		margin-bottom: var(--gap-small);
	}

	@media (--md-n-below) {
		.hero-content hgroup,
		article > hgroup {
			text-align: center;
		}
	}
</style>
