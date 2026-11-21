<!--
	@component
	A series card, showing the series name, description and a link to the first note.
-->
<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { seriesDescription } from '$lib/content';
	import { NoteArrow, NoteLink, NoteThumb, NoteTitle } from './note-link';

	interface Props {
		name: string;
		/** The series posts in reading order (oldest first). */
		posts: PostPreview[];
	}

	const { name, posts }: Props = $props();
	const description = $derived(seriesDescription(name));
</script>

{#if posts.length > 0}
	<NoteLink
		href="/blog/{posts[0].slug}"
		boxed
		class="grid items-center gap-3.5 p-[22px] md:grid-cols-[auto_1fr_auto] md:gap-7"
	>
		<span class="flex" aria-hidden="true">
			{#each posts as post, i (post.slug)}
				<NoteThumb
					slug={post.slug}
					placeholder={post.placeholder}
					sizes="96px"
					class={['w-24 outline-[3px] outline-canvas', i > 0 && '-ml-9']}
				/>
			{/each}
		</span>
		<span>
			<span class="eyebrow block">Series · {posts.length} parts</span>
			<NoteTitle as="h3" class="mt-1 mb-0.5 font-semibold font-stretch-[108%] sm:text-[22px]">
				{name}
			</NoteTitle>
			{#if description}
				<span class="block text-[15px] text-ink-2">{description}</span>
			{/if}
		</span>
		<NoteArrow label="Start reading" />
	</NoteLink>
{/if}
