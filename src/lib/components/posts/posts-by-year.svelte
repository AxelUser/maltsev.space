<!--
	@component
	Expects posts sorted newest first.
-->
<script lang="ts">
	import type { PostPreview } from '#lib/types.ts';
	import PostCard from './post-card.svelte';

	const { posts }: { posts: PostPreview[] } = $props();

	const years = $derived(
		Object.entries(
			posts.reduce<Record<string, PostPreview[]>>((acc, post) => {
				(acc[post.date.slice(0, 4)] ??= []).push(post);
				return acc;
			}, {})
		).sort(([a], [b]) => Number(b) - Number(a))
	);
</script>

{#each years as [year, list] (year)}
	<section aria-labelledby="year-{year}">
		<h2
			id="year-{year}"
			class="mt-11 mb-5 flex items-center gap-4 font-mono text-[14px] font-medium text-ink-3 after:h-px after:flex-1 after:bg-line"
		>
			{year}
		</h2>
		<div class="grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
			{#each list as post (post.slug)}
				<PostCard {post} />
			{/each}
		</div>
	</section>
{/each}
