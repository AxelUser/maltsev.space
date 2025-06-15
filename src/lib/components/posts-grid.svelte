<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import ContentCard from './content-card.svelte';

	const { posts, activeTag, onTagClick } = $props<{
		posts: PostPreview[];
		activeTag?: string;
		onTagClick?: (tag: string) => void;
	}>();
</script>

<div class="posts-grid">
	{#each posts as post}
		<ContentCard
			date={post.date}
			tags={post.tags}
			href={`/blog/${post.slug}`}
			title={post.title}
			description={post.preview}
			{activeTag}
			{onTagClick}
		/>
	{/each}
</div>

<style>
	@import 'open-props/media';

	.posts-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--gap-large);
	}

	@media (--lg-n-above) {
		.posts-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--gap-large);
		}
	}
</style>
