<script lang="ts">
	import { browser } from '$app/env';
	import PostRow from './post-row.svelte';
	import { usePostRefs } from './post-refs-context';

	interface Props {
		/** The note's slug. Should be a published note, otherwise it fails the prerender. */
		slug: string;
		/** Heading id to link to, without `#`. */
		hash?: string;
		/** Replaces the note's preview text. */
		description?: string;
	}

	const { slug, hash, description }: Props = $props();

	const lookup = usePostRefs();
	const post = $derived(lookup(slug));

	// Every post is prerendered, so a bad slug fails the build. In the browser, just skip the card, because theoretically it can point to old reference during navigation.
	if (!browser && !lookup(slug))
		throw new Error(
			`PostRef: no published note "${slug}" (check the slug, or that it isn't a draft)`
		);
</script>

<!--
	@component
	Inline card for another note, placed in a markdown post.

	<script>
		import { PostRef } from '#lib/components/index.ts';
	</script>

	<PostRef slug="009-counting-bloom-filters" hash="d-left-counting-bloom-filter" />
-->

{#if post}
	<div class="my-8" data-ph-capture-attribute-nav="post-ref">
		<PostRow
			{post}
			href="/blog/{slug}{hash ? `#${hash}` : ''}"
			eyebrow="Linked note · {post.number}"
			description={description ?? post.preview}
			boxed
		/>
	</div>
{/if}
