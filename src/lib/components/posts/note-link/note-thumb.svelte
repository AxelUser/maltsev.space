<!--
	@component
	A note's hero image inside `NoteLink`; zooms on hover. If not `framed` it is a bare 3:2 image with a drop shadow.
-->
<script lang="ts">
	import type { ClassValue } from 'clsx';
	import { cn, getPostHeroImage } from '#lib/utils/index.ts';
	import { Frame, HoverZoom, Picture } from '#lib/components/ui/index.ts';

	interface Props {
		slug: string;
		sizes: string;
		placeholder?: string;
		framed?: boolean;
		frameSize?: 'sm' | 'md';
		class?: ClassValue;
	}

	const {
		slug,
		sizes,
		placeholder,
		framed = false,
		frameSize = 'md',
		class: className
	}: Props = $props();

	const src = $derived(getPostHeroImage(slug));
</script>

{#snippet image()}
	<HoverZoom.Target>
		{#snippet child({ props })}
			<!-- m-0: inside .prose, images get vertical margins. -->
			<Picture {src} {sizes} {placeholder} class={cn(props.class, 'm-0 shadow-none')} />
		{/snippet}
	</HoverZoom.Target>
{/snippet}

{#if framed}
	<Frame size={frameSize} class={className}>{@render image()}</Frame>
{:else}
	<span
		class={cn('block aspect-[3/2] shrink-0 overflow-hidden bg-surface shadow-frame', className)}
	>
		{@render image()}
	</span>
{/if}
