<script lang="ts">
	import { SEO } from '#lib/components/index.ts';
	import { Container } from '#lib/components/layout/index.ts';
	import { Button, Chip, PageHeader } from '#lib/components/ui/index.ts';
	import { PostsByYear, SeriesCard } from '#lib/components/posts/index.ts';
	import { bio, tagStyle } from '#lib/content/index.ts';

	const { data } = $props();

	let activeTag = $state<string | null>(null);

	const tags = [...new Set(data.posts.flatMap((post) => post.tags))];

	const filteredPosts = $derived(
		activeTag ? data.posts.filter((post) => post.tags.includes(activeTag!)) : data.posts
	);

	// Every series, parts in reading order (posts arrive newest first)
	const series = [...new Set(data.posts.map((post) => post.series).filter(Boolean))].map(
		(name) => ({ name, parts: data.posts.filter((post) => post.series === name).reverse() })
	);
</script>

<SEO
	title="Blog"
	description={`${bio.fullName}'s blog about software engineering, distributed systems, C#, Go, and system design. Insights from a Software Developer at JetBrains.`}
	url="/blog"
	keywords={['blog', 'software engineering', 'programming', 'distributed systems', 'C#', 'Go']}
/>

<Container class="pb-24">
	<PageHeader
		kicker="Blog"
		title="Notes"
		lead="Long-form notes on things I use at work or just find interesting. Opinions are my own."
	/>

	{#each series as { name, parts } (name)}
		<div class="mt-2 mb-9" data-ph-capture-attribute-nav="series-card">
			<SeriesCard {name} posts={parts} />
		</div>
	{/each}

	<div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by topic">
		<Chip pressed={activeTag === null} onclick={() => (activeTag = null)}>All</Chip>
		{#each tags as tag (tag)}
			{@const style = tagStyle(tag)}
			<Chip
				pressed={activeTag === tag}
				color={style.color}
				onclick={() => (activeTag = activeTag === tag ? null : tag)}
			>
				{style.label}
			</Chip>
		{/each}
	</div>

	{#if filteredPosts.length > 0}
		<PostsByYear posts={filteredPosts} />
	{:else}
		<div class="hud mt-11 p-10 text-center">
			<p class="mt-0 mb-5 text-ink-2">No notes on this topic yet.</p>
			<Button variant="ghost" onclick={() => (activeTag = null)}>Show all notes</Button>
		</div>
	{/if}
</Container>
