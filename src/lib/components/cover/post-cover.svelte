<!--
	@component
	A post cover, either a plain image or live cover.
-->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { MediaQuery } from 'svelte/reactivity';
	import { isMobileDevice, type EnhancedImageSrc } from '#lib/utils/index.ts';
	import { AiFlag, Figure, Picture } from '#lib/components/ui/index.ts';
	import { liveCoverPrefs } from '#lib/stores/live-cover.svelte.ts';
	import LiveCover from './live-cover.svelte';
	import LiveCoverToggle from './live-cover-toggle.svelte';
	import type { AiCoverKind, LiveCoverLoader } from './types';

	interface Props {
		image?: EnhancedImageSrc;
		/** Data URL. */
		placeholder?: string;
		live?: LiveCoverLoader;
		caption?: string;
		ai?: AiCoverKind[];
	}

	const { image, placeholder, live, caption, ai = [] }: Props = $props();

	const mobile = isMobileDevice();
	const desktopMotion = new MediaQuery(
		'(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
		false
	);
	const canAnimate = $derived(!!live && !mobile && desktopMotion.current);
	const showLive = $derived(canAnimate && liveCoverPrefs.enabled);

	let ready = $derived.by(() => {
		void live;
		void showLive;
		return false;
	});
	let failed = $derived.by(() => {
		void live;
		return false;
	});

	const playing = $derived(showLive && ready);
	const aiMedia = $derived(
		playing ? ai.includes('Live') && 'Animation' : ai.includes('Image') && 'Image'
	);
</script>

{#if image || live}
	<Figure.Root class="mx-auto mt-2 mb-14 max-w-[1040px]">
		<Figure.Media>
			<Picture src={image} {placeholder} sizes="min(1040px, 100vw)" priority />
			{#key live}
				{#if live && showLive && !failed}
					<div class="absolute inset-0" out:fade={{ duration: 300 }}>
						<LiveCover load={live} onready={() => (ready = true)} onerror={() => (failed = true)} />
					</div>
				{/if}
			{/key}
			{#if aiMedia}
				<Figure.Corner at="top-left"><AiFlag media={aiMedia} /></Figure.Corner>
			{/if}
			{#if canAnimate && !failed}
				<Figure.Corner at="top-right">
					<LiveCoverToggle bind:enabled={liveCoverPrefs.enabled} />
				</Figure.Corner>
			{/if}
		</Figure.Media>
		{#if caption}
			<Figure.Caption>{caption}</Figure.Caption>
		{/if}
	</Figure.Root>
{/if}
