<script lang="ts">
	import { Button, Card, Badge, Link } from '$lib/components/ui';
	import { PostPreviewCard } from '$lib/components';

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

<div class="blog-page">
	<header class="blog-header">
		<h1 class="space-title">Blog</h1>
		<p class="space-subtitle">Thoughts, ideas, and explorations</p>
	</header>

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
			<div class="posts-grid">
				{#each filteredPosts as post}
					<PostPreviewCard {...post} {activeTag} onTagClick={toggleTag} />
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.blog-page {
		padding-bottom: var(--gap-large);
		display: flex;
		flex-direction: column;
	}

	.blog-header {
		margin: 0 auto;
		text-align: center;
		margin-bottom: var(--gap-large);
	}

	.blog-header .space-title {
		margin-bottom: var(--gap-small);
	}

	.blog-header .space-subtitle {
		margin: 0;
	}

	/* Filters */
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

	/* Posts Grid */
	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--gap);
	}

	@media (--lg-n-above) {
		.posts-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--gap-large);
		}
	}

	@media (--sm-n-below) {
		.blog-filters {
			flex-direction: column;
			align-items: flex-start;
		}

		.posts-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
