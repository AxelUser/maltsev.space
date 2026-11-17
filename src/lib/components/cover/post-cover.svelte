<!--
	@component
	Post hero: framed image and caption, with a `LiveCover` on top when `live` is set.
	The AI flag shows only while a variant listed in `ai` is visible.
-->
<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/utils';
	import { AiFlag, Frame, Picture } from '$lib/components/ui';
	import LiveCover from './live-cover.svelte';
	import type { AiCoverKind, LiveCoverLoader } from './types';

	interface Props {
		image?: EnhancedImageSrc;
		/** Data URL. */
		placeholder?: string;
		live?: LiveCoverLoader;
		caption?: string;
		ai?: AiCoverKind[];
		sizes?: string;
	}

	const {
		image,
		placeholder,
		live,
		caption,
		ai = [],
		sizes = '(min-width: 1104px) 1040px, 85vw'
	}: Props = $props();

	let playing = $state(false);

	const label = $derived(
		playing
			? ai.includes('Live') && 'AI Generated Animation'
			: ai.includes('Image') && 'AI Generated Image'
	);
</script>

{#snippet still()}
	<Picture src={image} {placeholder} {sizes} priority />
{/snippet}

{#if image || live}
	<figure class="mx-auto mt-2 mb-14 max-w-[1040px]">
		<Frame>
			{#if live}
				<LiveCover load={live} fallback={still} bind:playing />
			{:else}
				{@render still()}
			{/if}
			{#if label}<AiFlag {label} />{/if}
		</Frame>
		{#if caption}
			<figcaption class="eyebrow mt-1.5 text-right">{caption}</figcaption>
		{/if}
	</figure>
{/if}
