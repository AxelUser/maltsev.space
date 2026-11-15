<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/utils';
	import Lightbox from './lightbox.svelte';

	interface Props {
		images: EnhancedImageSrc[];
		title: string;
	}

	const { images, title }: Props = $props();

	let open = $state<number | null>(null);
</script>

<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
	{#each images as image, i (i)}
		<button
			type="button"
			class={[
				'group aspect-square cursor-zoom-in overflow-hidden border-0 bg-surface p-0',
				i === 0 && 'col-span-2 row-span-2'
			]}
			aria-label="Open image {i + 1} of {images.length}"
			onclick={() => (open = i)}
		>
			<enhanced:img
				src={image}
				alt=""
				sizes={i === 0 ? '(min-width: 768px) 560px, 100vw' : '(min-width: 768px) 280px, 50vw'}
				loading={i < 3 ? 'eager' : 'lazy'}
				decoding="async"
				class="block size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
			/>
		</button>
	{/each}
</div>

<Lightbox {images} bind:index={open} label={title} />
