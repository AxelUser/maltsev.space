<!--
	@component
	Responsive image that fills its box, with a blurred placeholder until it loads.
-->
<script lang="ts">
	import type { ClassValue } from 'clsx';
	import { cn, type EnhancedImageSrc } from '$lib/utils';

	interface Props {
		src?: EnhancedImageSrc;
		alt?: string;
		sizes: string;
		/** Data URL. */
		placeholder?: string;
		/** Load eagerly with high priority (above the fold). */
		priority?: boolean;
		class?: ClassValue;
	}

	const { src, alt = '', sizes, placeholder, priority = false, class: className }: Props = $props();

	// Set on the <img> itself so transforms also apply to the placeholder.
	const style = $derived(placeholder ? `background-image:url(${placeholder})` : undefined);
	const classes = $derived(cn('block h-full w-full bg-cover bg-center object-cover', className));
</script>

{#if src}
	<enhanced:img
		{src}
		{alt}
		{sizes}
		{style}
		loading={priority ? 'eager' : 'lazy'}
		fetchpriority={priority ? 'high' : 'auto'}
		decoding="async"
		class={classes}
	/>
{:else}
	<div class={classes} {style}></div>
{/if}
