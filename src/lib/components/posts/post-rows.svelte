<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { cn } from '$lib/utils';
	import PostRow from './post-row.svelte';

	const { posts, class: className }: { posts: PostPreview[]; class?: string } = $props();
</script>

<ul class={cn('m-0 list-none border-t border-line p-0', className)}>
	{#each posts as post (post.slug)}
		<li class="border-b border-line"><PostRow {post} /></li>
	{/each}
</ul>
