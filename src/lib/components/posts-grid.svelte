<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { getPostHeroImage } from '$lib/utils';
	import ContentCard from './content-card.svelte';

	const { posts, activeTag, onTagClick } = $props<{
		posts: PostPreview[];
		activeTag?: string;
		onTagClick?: (tag: string) => void;
	}>();
</script>

<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
	{#each posts as post}
		<ContentCard
			date={post.date}
			tags={post.tags}
			href={`/blog/${post.slug}`}
			title={post.title}
			description={post.preview}
			imageDisplayMode="cover"
			image={getPostHeroImage(post.slug)}
			placeholder={post.placeholder}
			{activeTag}
			{onTagClick}
		/>
	{/each}
</div>
