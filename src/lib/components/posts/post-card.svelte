<!--
	@component
	A note in the blog grid.
-->
<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { NoteArrow, NoteLink, NoteThumb, NoteTitle } from './note-link';
	import PostMeta from './post-meta.svelte';

	const { post }: { post: PostPreview } = $props();
</script>

<NoteLink href="/blog/{post.slug}">
	<NoteThumb
		slug={post.slug}
		placeholder={post.placeholder}
		sizes="(min-width: 900px) 360px, (min-width: 640px) 50vw, 85vw"
		framed
		frameSize="sm"
	/>
	<span class="mt-3 block"><PostMeta {post} /></span>
	<NoteTitle as="h3" class="mt-2">{post.title}&nbsp;<NoteArrow class="text-[0.85em]" /></NoteTitle>
</NoteLink>
