<script lang="ts">
	import type { PostPreview } from '#lib/types.ts';
	import { NoteArrow, NoteLink, NoteTitle } from './note-link';

	interface Props {
		name: string;
		posts: PostPreview[];
		current: string;
	}

	const { name, posts, current }: Props = $props();
</script>

{#if posts.length > 1}
	<nav
		class="hud my-10 p-5 sm:p-6"
		aria-label="Series: {name}"
		data-ph-capture-attribute-nav="series"
	>
		<span class="eyebrow">Series · {name}</span>
		<ol class="m-0 mt-3 list-none p-0">
			{#each posts as post, i (post.slug)}
				{@const isCurrent = post.slug === current}
				<li class="grid grid-cols-[36px_1fr] items-baseline gap-2 py-1.5">
					<span class={['font-mono text-[13px]', isCurrent ? 'text-livery-1' : 'text-ink-3']}>
						{String(i + 1).padStart(2, '0')}
					</span>
					{#if isCurrent}
						<span aria-current="page">
							<NoteTitle size="sm" class="font-semibold">{post.title}</NoteTitle>
						</span>
					{:else}
						<NoteLink href="/blog/{post.slug}" class="inline-flex items-baseline gap-2">
							<NoteTitle size="sm" class="text-ink-2">{post.title}</NoteTitle>
							<NoteArrow class="text-[14px]" />
						</NoteLink>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}
