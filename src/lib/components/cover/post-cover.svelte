<!--
	@component
	A post's hero: framed image with an optional caption. With `live`, the image becomes the fallback
	of a `LiveCover` that plays on desktop. `ai` lists which of the two is AI-generated; the flag
	shows only while that one is on screen.
-->
<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/utils';
	import { AiFlag, Frame, Picture } from '$lib/components/ui';
	import LiveCover from './live-cover.svelte';
	import type { AiCoverKind, LiveCoverLoader } from './types';

	interface Props {
		image?: EnhancedImageSrc;
		/** Tiny blurred preview (data URL) shown until the image arrives. */
		placeholder?: string;
		live?: LiveCoverLoader;
		caption?: string;
		/** Which cover variants are AI-generated (front matter `aiCover`). */
		ai?: AiCoverKind[];
		sizes?: string;
	}

	const {
		image,
		placeholder,
		live,
		caption,
		ai = [],
		sizes = '(min-width: 1104px) 1040px, 100vw'
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
