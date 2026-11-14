<script lang="ts">
	import type { PageData } from './$types';
	import { Lightbox, PageHeader } from '$lib/components';
	import Button from '$lib/components/ui/button/button.svelte';
	import { config } from '$lib/config';

	const { data }: { data: PageData } = $props();

	let lightboxOpen = $state(false);
	let currentImageIndex = $state(0);

	const imageUrls = $derived(
		data.collection.images.map((img) => `/images/art/${data.collection.id}/${img}`)
	);

	function openLightbox(index: number) {
		currentImageIndex = index;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function navigateToImage(index: number) {
		currentImageIndex = index;
	}
</script>

<svelte:head>
	<title>{data.collection.title}</title>
	<meta name="description" content={data.collection.description} />
</svelte:head>

<PageHeader title={data.collection.title} subtitle={data.collection.description} />

<div class="mt-0 mb-12 text-center">
	<span class="text-xs font-normal text-fg-2">{data.collection.images.length} images</span>
</div>

<div class="mb-12 flex justify-between border-b border-brand/20 pb-5">
	<Button href="/art">← Back to Gallery</Button>
</div>

<div
	class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:gap-5"
>
	{#each data.collection.images as image, index}
		<button
			class="group relative aspect-square cursor-pointer overflow-hidden rounded-md border border-surface-3 bg-surface-2 p-0 transition-[transform,box-shadow] hover:shadow-lg"
			onclick={() => openLightbox(index)}
			aria-label="View {image} in lightbox"
		>
			<img
				src="/images/art/{data.collection.id}/{image}"
				alt="Artwork {index + 1} from {data.collection.title}"
				loading="lazy"
				class="size-full object-cover transition-transform duration-500 ease-[ease] group-hover:scale-105"
			/>
			<div
				class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<span class="text-base font-medium text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]"
					>View</span
				>
			</div>
		</button>
	{/each}
</div>

<Lightbox
	images={imageUrls}
	currentIndex={currentImageIndex}
	isOpen={lightboxOpen}
	onClose={closeLightbox}
	onNavigate={navigateToImage}
/>
