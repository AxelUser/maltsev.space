<!--
	@component
	The featured note on the home page: large framed image beside the title, preview and all tags.
-->
<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import { NoteArrow, NoteLink, NoteThumb, NoteTitle } from './note-link';
	import PostMeta from './post-meta.svelte';

	const { post }: { post: PostPreview } = $props();
</script>

<NoteLink
	href="/blog/{post.slug}"
	class="grid items-center gap-5 lg:grid-cols-[1.15fr_1fr] lg:gap-12"
>
	<NoteThumb
		slug={post.slug}
		placeholder={post.placeholder}
		sizes="(min-width: 900px) 560px, 85vw"
		framed
	/>
	<div>
		<PostMeta {post} allTags />
		<NoteTitle as="h3" size="lg" class="mt-3.5">{post.title}</NoteTitle>
		<p class="mt-4 mb-0 text-ink-2">{post.preview}</p>
		<NoteArrow label="Read the note" class="mt-6" />
	</div>
</NoteLink>
