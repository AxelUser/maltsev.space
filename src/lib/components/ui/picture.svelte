<!--
	@component
	Responsive image that fills its box and shows a tiny blurred placeholder until it loads.
	`class` lands on the `<img>` itself, so it composes with `HoverZoom.Target`:

	<HoverZoom.Target>
		{#snippet child({ props })}<Picture {...props} src={hero} placeholder={blur} />{/snippet}
	</HoverZoom.Target>
-->
<script lang="ts">
	import type { ClassValue } from 'clsx';
	import { cn, type EnhancedImageSrc } from '$lib/utils';

	interface Props {
		src?: EnhancedImageSrc;
		alt?: string;
		/** `sizes` hint for the responsive image, e.g. `(min-width: 900px) 560px, 100vw`. */
		sizes?: string;
		/** Tiny blurred preview (data URL) shown until the image arrives. */
		placeholder?: string;
		/** Above-the-fold images load eagerly with high priority. */
		priority?: boolean;
		class?: ClassValue;
	}

	const {
		src,
		alt = '',
		sizes = '100vw',
		placeholder,
		priority = false,
		class: className
	}: Props = $props();

	// The placeholder is the <img>'s own background, so transforms move both together.
	const style = $derived(placeholder ? `background-image:url(${placeholder})` : undefined);
	const classes = $derived(cn('block size-full bg-cover bg-center object-cover', className));
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
{:else if placeholder}
	<div class={classes} {style}></div>
{/if}
