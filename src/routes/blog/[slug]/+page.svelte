<script lang="ts">
	import '../../../svgbob.css';
	import '../../../zombie-mermaid.css';
	import 'temml/dist/Temml-Local.css';
	import { SEO } from '$lib/components';
	import { Container } from '$lib/components/layout';
	import { Tag } from '$lib/components/ui';
	import { PostCover } from '$lib/components/cover';
	import { PostIndex, PostPager, PostRows, SeriesParts, setPostRefs } from '$lib/components/posts';
	import type { PageProps } from './$types';
	import { getPostHeroImage } from '$lib/utils';
	import { dev } from '$app/environment';
	import { trackReading } from '$lib/analytics';

	const { data }: PageProps = $props();

	// For <PostRef> cards to work efficiently inside the markdown content.
	setPostRefs(() => data.referencedPosts);

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

	<div class="relative mx-auto max-w-article">
		<aside
			data-ph-capture-attribute-nav="index"
			class="absolute inset-y-0 left-full ml-14 hidden w-[260px] 2xl:block print:hidden"
		>
			<div class="sticky top-[calc(var(--spacing-header)+32px)]">
				<PostIndex posts={data.index} current={data.slug} />
			</div>
		</aside>

		{#if dev}
			{#await import('$lib/components/dev/review') then review}
				<review.ReviewOverlay slug={data.slug} />
			{/await}
		{/if}

		{#if data.seriesName}
			<SeriesParts name={data.seriesName} posts={data.series} current={data.slug} />
		{/if}

		<div class="prose" use:trackReading={data.slug}>
			{@render data.content()}
		</div>

		{#if data.referencedPosts.length > 0}
			<section class="mt-14" aria-labelledby="linked-notes" data-ph-capture-attribute-nav="linked">
				<h2 id="linked-notes" class="eyebrow mb-4">Notes linked from this one</h2>
				<PostRows posts={data.referencedPosts} />
			</section>
		{/if}

		<PostPager older={data.neighbours.older} newer={data.neighbours.newer} />
	</div>
</Container>
