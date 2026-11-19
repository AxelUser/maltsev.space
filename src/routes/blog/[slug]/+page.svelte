<script lang="ts">
	import '../../../svgbob.css';
	import '../../../zombie-mermaid.css';
	import { SEO } from '$lib/components';
	import { Container } from '$lib/components/layout';
	import { Tag } from '$lib/components/ui';
	import { PostCover } from '$lib/components/cover';
	import { PostPager, PostRows, SeriesParts } from '$lib/components/posts';
	import type { PageProps } from './$types';
	import { getPostHeroImage } from '$lib/utils';

	const { data }: PageProps = $props();

	const heroImage = $derived(getPostHeroImage(data.slug));
	const publishedTime = $derived(data.date ? new Date(data.date).toISOString() : undefined);
	const allKeywords = $derived([...(data.keywords || []), ...data.tags]);
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

<Container as="article" class="pb-24">
	<header class="mx-auto max-w-[760px] pt-14 pb-8 sm:pt-[72px]">
		<p class="eyebrow m-0">
			<a href="/blog" class="no-underline hover:text-ink">Notes</a> / {data.number}
		</p>
		<h1
			class="mt-4 mb-0 text-[clamp(32px,4.8vw,52px)]/[1.08] font-semibold tracking-[-0.015em] font-stretch-[108%]"
		>
			{data.title}
		</h1>
		{#if data.preview}
			<p class="mt-5 mb-0 max-w-[40em] text-[18px] text-ink-2">{data.preview}</p>
		{/if}
		<div class="eyebrow mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
			<time datetime={publishedTime}>{data.date}</time>
			{#if data.readingTimeMinutes}
				<span>{data.readingTimeMinutes} min read</span>
			{/if}
			{#if data.views}
				<span>{data.views.toLocaleString('en-US')} views</span>
			{/if}
			{#each data.tags as tag (tag)}
				<Tag {tag} />
			{/each}
		</div>
	</header>

	<PostCover
		image={heroImage}
		placeholder={data.placeholderUrl}
		live={data.liveCover}
		caption={data.coverCaption}
		ai={data.aiCover}
	/>

	<div class="mx-auto max-w-article">
		{#if data.seriesName}
			<SeriesParts name={data.seriesName} posts={data.series} current={data.slug} />
		{/if}

		<div class="prose">
			{@render data.content()}
		</div>

		{#if data.referencedPosts.length > 0}
			<section class="mt-14" aria-labelledby="linked-notes">
				<h2 id="linked-notes" class="eyebrow mb-4">Notes linked from this one</h2>
				<PostRows posts={data.referencedPosts} />
			</section>
		{/if}

		<PostPager older={data.neighbours.older} newer={data.neighbours.newer} />
	</div>
</Container>
