<!--
	@component
	A note card as a row.
-->
<script lang="ts">
	import type { PostPreview } from '#lib/types.ts';
	import { cn } from '#lib/utils/index.ts';
	import { NoteArrow, NoteLink, NoteThumb, NoteTitle } from './note-link';
	import PostMeta from './post-meta.svelte';

	interface Props {
		post: PostPreview;
		/** Defaults to the note's page. */
		href?: string;
		/** Replaces the note's title. */
		title?: string;
		/** Context caption above the title, e.g. "Linked note · 009". */
		eyebrow?: string;
		/** Two-line text under the title, hidden on phones. */
		description?: string;
		meta?: boolean;
		/** Adds HUD brackets to the link. */
		boxed?: boolean;
		/** Narrower variant. */
		compact?: boolean;
		/** Direction of the arrow if set. */
		dir?: 'forward' | 'back';
	}

	const {
		post,
		href,
		title,
		eyebrow,
		description,
		meta = true,
		boxed = false,
		compact = false,
		dir = 'forward'
	}: Props = $props();

	const back = $derived(dir === 'back');
</script>

<NoteLink
	href={href ?? `/blog/${post.slug}`}
	{boxed}
	class={cn(
		'grid items-center',
		compact
			? back
				? 'grid-cols-[auto_96px_1fr] gap-4'
				: 'grid-cols-[96px_1fr_auto] gap-4'
			: back
				? 'grid-cols-[auto_88px_1fr] gap-3.5 sm:grid-cols-[auto_120px_1fr] sm:gap-6'
				: 'grid-cols-[88px_1fr] gap-3.5 sm:grid-cols-[120px_1fr_auto] sm:gap-6',
		boxed ? 'p-3.5 sm:p-4' : 'py-4'
	)}
>
	{#if back}<NoteArrow dir="back" />{/if}
	<NoteThumb
		slug={post.slug}
		placeholder={post.placeholder}
		sizes={compact ? '96px' : '(min-width: 640px) 120px, 88px'}
		class={compact ? 'w-24' : 'w-[88px] sm:w-[120px]'}
	/>
	<span class="min-w-0">
		{#if eyebrow}<span class="eyebrow mb-1 block">{eyebrow}</span>{/if}
		<NoteTitle size={compact ? 'sm' : 'md'}>{title ?? post.title}</NoteTitle>
		{#if description}
			<span class="mt-1.5 line-clamp-2 text-[14.5px]/[1.5] text-ink-2 max-sm:hidden">
				{description}
			</span>
		{/if}
		{#if meta}<span class="mt-1.5 block"><PostMeta {post} /></span>{/if}
	</span>
	{#if !back}<NoteArrow class={compact ? undefined : 'max-sm:hidden'} />{/if}
</NoteLink>
