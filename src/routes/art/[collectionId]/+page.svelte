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

<div class="collection-meta">
	<span class="image-count">{data.collection.images.length} images</span>
</div>

<div class="post-navigation top-navigation">
	<Button href="/art">← Back to Gallery</Button>
</div>

<div class="images-grid">
	{#each data.collection.images as image, index}
		<button
			class="image-card"
			onclick={() => openLightbox(index)}
			aria-label="View {image} in lightbox"
		>
			<img
				src="/images/art/{data.collection.id}/{image}"
				alt="Artwork {index + 1} from {data.collection.title}"
				loading="lazy"
			/>
			<div class="image-overlay">
				<span class="view-text">View</span>
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

<style>
	@import 'open-props/media';

	.post-navigation {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--gap);
	}

	.top-navigation {
		margin-bottom: var(--gap-large);
		padding-bottom: var(--gap);
		border-bottom: 1px solid color-mix(in srgb, var(--brand) 20%, transparent);
	}

	.collection-meta {
		margin-top: 0;
		margin-bottom: var(--gap-large);
		text-align: center;
	}

	.image-count {
		color: var(--text-2);
		font-size: var(--font-size-0);
		font-weight: var(--font-weight-4);
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--gap);
	}

	.image-card {
		position: relative;
		aspect-ratio: 1;
		background: var(--surface-2);
		border-radius: var(--radius-2);
		overflow: hidden;
		border: 1px solid var(--surface-3);
		cursor: pointer;
		transition:
			transform var(--transition-fast),
			box-shadow var(--transition-fast);
		padding: 0;
	}

	.image-card:hover {
		box-shadow: var(--shadow-3);
	}

	.image-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--transition-slow);
	}

	.image-card:hover img {
		transform: scale(1.05);
	}

	.image-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity var(--transition-fast);
	}

	.image-card:hover .image-overlay {
		opacity: 1;
	}

	.view-text {
		color: white;
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-5);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	@media (--md-n-below) {
		.images-grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: var(--gap-small);
		}
	}

	@media (--sm-n-below) {
		.images-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	}
</style>
