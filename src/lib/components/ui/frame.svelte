<!--
	@component
	Zooms on hover of an ancestor with the `group` class.
-->
<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/utils';
	import { aiLabel, cn } from '$lib/utils';
	import AiFlag from './ai-flag.svelte';

	interface Props {
		src?: EnhancedImageSrc;
		alt?: string;
		/** `sizes` hint for the responsive image, e.g. `(min-width: 900px) 560px, 100vw`. */
		sizes?: string;
		/** Tiny blurred preview (data URL) shown until the image arrives. */
		placeholder?: string;
		/** Above-the-fold images load eagerly with high priority. */
		priority?: boolean;
		/** Flags the image as AI-generated; a string names the tool. */
		ai?: boolean | string;
		size?: 'sm' | 'md';
		class?: string;
	}

	const {
		src,
		alt = '',
		sizes = '100vw',
		placeholder,
		priority = false,
		ai = false,
		size = 'md',
		class: className
	}: Props = $props();

	const label = $derived(aiLabel(ai));
</script>

<div class={cn('hud relative', size === 'sm' ? 'p-2' : 'p-2.5', className)}>
	<div
		class="aspect-[3/2] overflow-hidden bg-surface bg-cover bg-center shadow-frame"
		style:background-image={placeholder ? `url(${placeholder})` : undefined}
	>
		{#if src}
			<enhanced:img
				{src}
				{alt}
				{sizes}
				loading={priority ? 'eager' : 'lazy'}
				fetchpriority={priority ? 'high' : 'auto'}
				decoding="async"
				class="block size-full object-cover transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.02]"
			/>
		{/if}
	</div>
	{#if label}<AiFlag {label} />{/if}
</div>
