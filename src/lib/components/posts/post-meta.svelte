<script lang="ts">
	import type { PostPreview } from '#lib/types.ts';
	import { Tag } from '#lib/components/ui/index.ts';

	interface Props {
		post: Pick<PostPreview, 'tags' | 'date'>;
		/** Show every tag instead of just the primary one. */
		allTags?: boolean;
	}

	const { post, allTags = false }: Props = $props();

	const shown = $derived(allTags ? post.tags : post.tags.slice(0, 1));
</script>

<span class="flex flex-wrap items-center gap-3">
	{#each shown as tag (tag)}
		<Tag {tag} />
	{/each}
	<time datetime={post.date} class="font-mono text-[13px] text-ink-3">{post.date}</time>
</span>
