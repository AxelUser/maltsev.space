<!--
	@component
	"Previous" / "Next" at the end of a note. With both, two compact cards side by side; on the
	newest or first note, the one neighbour gets the full width with its preview text.
-->
<script lang="ts">
	import type { PostPreview } from '$lib/types';
	import PostRow from './post-row.svelte';

	interface Props {
		older?: PostPreview;
		newer?: PostPreview;
	}

	const { older, newer }: Props = $props();
</script>

{#if older && newer}
	<nav
		class="mt-14 grid gap-4 sm:grid-cols-2"
		aria-label="More notes"
		data-ph-capture-attribute-nav="pager"
	>
		<PostRow post={older} eyebrow="Previous" meta={false} boxed compact dir="back" />
		<PostRow post={newer} eyebrow="Next" meta={false} boxed compact />
	</nav>
{:else if older || newer}
	{@const post = (older ?? newer)!}
	<nav class="mt-14" aria-label="More notes" data-ph-capture-attribute-nav="pager">
		<PostRow
			{post}
			eyebrow={older ? 'Previous' : 'Next'}
			description={post.preview}
			meta={false}
			boxed
			dir={older ? 'back' : 'forward'}
		/>
	</nav>
{/if}
