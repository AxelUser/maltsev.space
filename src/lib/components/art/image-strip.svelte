<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/utils';

	interface Props {
		images: EnhancedImageSrc[];
		href: string;
		limit?: number;
	}

	const { images, href, limit = 4 }: Props = $props();

	const shown = $derived(images.slice(0, limit));
	const rest = $derived(images.length - shown.length);
</script>

<div class="grid grid-cols-4 gap-2">
	{#each shown as image, i (i)}
		{@const isLast = i === shown.length - 1 && rest > 0}
		<a
			{href}
			class="group relative block aspect-square overflow-hidden bg-surface"
			aria-label={isLast ? `${rest} more images` : `Image ${i + 1}`}
		>
			<enhanced:img
				src={image}
				alt=""
				sizes="(min-width: 768px) 160px, 25vw"
				loading="lazy"
				decoding="async"
				class="block size-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
			/>
			{#if isLast}
				<span
					class="absolute inset-0 grid place-items-center bg-[rgb(7_10_15/0.62)] font-display text-[22px] font-semibold text-white"
					aria-hidden="true"
				>
					+{rest}
				</span>
			{/if}
		</a>
	{/each}
</div>
