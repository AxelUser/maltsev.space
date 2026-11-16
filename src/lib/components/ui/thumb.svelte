<!--
	@component
	Set the width via `class` and pass a matching `sizes`.
-->
<script lang="ts">
	import type { ClassValue } from 'clsx';
	import { cn, type EnhancedImageSrc } from '$lib/utils';

	interface Props {
		src?: EnhancedImageSrc;
		sizes?: string;
		class?: ClassValue;
	}

	const { src, sizes = '120px', class: className }: Props = $props();
</script>

<span class={cn('block aspect-[3/2] shrink-0 overflow-hidden bg-surface', className)}>
	{#if src}
		<enhanced:img
			{src}
			alt=""
			{sizes}
			loading="lazy"
			decoding="async"
			class="block size-full object-cover"
		/>
	{/if}
</span>
