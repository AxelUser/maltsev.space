<script lang="ts">
	import { Button, Badge } from '$lib/components/ui';
	import { PageHeader, PostsGrid, SEO } from '$lib/components';
	import { bio } from '$lib/bio';
	import { OneColumnLayout } from '$lib/components/layouts';

	const { data } = $props();

	let activeTag = $state<string | undefined>(undefined);

	function toggleTag(tag: string) {
		activeTag = activeTag === tag ? undefined : tag;
	}

	function getAllTags() {
		const tagsSet = new Set<string>();
		data.posts.forEach((post) => {
			post.tags.forEach((tag) => tagsSet.add(tag));
		});
		return Array.from(tagsSet);
	}

	const filteredPosts = $derived(
		activeTag ? data.posts.filter((post) => post.tags.includes(activeTag!)) : data.posts
	);

	const allTags = getAllTags();
</script>

<SEO
	title="Blog"
	description={`${bio.fullName}'s blog about software engineering, distributed systems, C#, Go, and system design. Insights from a Senior Software Engineer at Infobip.`}
	url="/blog"
	keywords={['blog', 'software engineering', 'programming', 'distributed systems', 'C#', 'Go']}
/>

<OneColumnLayout>
	<div class="blog-page">
		<PageHeader title="Blog" subtitle="Thoughts, ideas, and explorations" />

		<section class="blog-filters">
			<div class="filter-label">Filter by topic:</div>
			<div class="tags-container">
				{#each allTags as tag}
					<Badge
						variant={activeTag === tag ? 'active' : 'default'}
						interactive={true}
						onclick={() => toggleTag(tag)}
					>
						{tag}
					</Badge>
				{/each}
				{#if activeTag}
					<Button size="small" intent="secondary" onclick={() => (activeTag = undefined)}>
						Clear filter
					</Button>
				{/if}
			</div>
		</section>

		<section class="blog-posts">
			{#if filteredPosts.length === 0}
				<div class="no-results">
					<p>No posts found matching the selected filter.</p>
					<Button size="small" intent="secondary" onclick={() => (activeTag = undefined)}>
						Clear filter
					</Button>
				</div>
			{:else}
				<PostsGrid posts={filteredPosts} {activeTag} onTagClick={toggleTag} />
			{/if}
		</section>
	</div>
</OneColumnLayout>

<style>
	@import 'open-props/media';
	.blog-page {
		padding-bottom: var(--gap-large);
		display: flex;
		flex-direction: column;
	}

	.blog-filters {
		margin-bottom: var(--gap-large);
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
		align-items: center;
	}

	.filter-label {
		font-size: var(--font-size-2);
		color: var(--text-2);
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-small);
	}

	.no-results {
		text-align: center;
		padding: var(--gap-large);
		background-color: var(--surface-2);
		border-radius: var(--radius-base);
		margin-top: var(--gap);
	}

	.no-results p {
		margin-bottom: var(--gap);
	}

	@media (--sm-n-below) {
		.blog-filters {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
