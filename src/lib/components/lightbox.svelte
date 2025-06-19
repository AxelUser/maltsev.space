<script lang="ts">
	import { onMount } from 'svelte';
	import { X, ChevronLeft, ChevronRight, Loader2 } from '@lucide/svelte';

	interface Props {
		images: string[];
		currentIndex: number;
		isOpen: boolean;
		onClose: () => void;
		onNavigate: (index: number) => void;
	}

	const { images, currentIndex, isOpen, onClose, onNavigate }: Props = $props();

	let lightboxContainer = $state<HTMLDivElement>();
	let imageElement = $state<HTMLImageElement>();
	let imageLoaded = $state(false);

	function handleKeyDown(event: KeyboardEvent) {
		if (!isOpen) return;

		switch (event.key) {
			case 'Escape':
				onClose();
				break;
			case 'ArrowLeft':
				if (currentIndex > 0) {
					onNavigate(currentIndex - 1);
				}
				break;
			case 'ArrowRight':
				if (currentIndex < images.length - 1) {
					onNavigate(currentIndex + 1);
				}
				break;
		}
	}

	function previousImage() {
		if (currentIndex > 0) {
			onNavigate(currentIndex - 1);
		}
	}

	function nextImage() {
		if (currentIndex < images.length - 1) {
			onNavigate(currentIndex + 1);
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			imageLoaded = false;
		} else {
			document.body.style.overflow = '';
		}
	});

	$effect(() => {
		imageLoaded = false;
	});
</script>

{#if isOpen}
	<div
		class="lightbox-overlay"
		bind:this={lightboxContainer}
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-label="Image lightbox"
	>
		<div class="lightbox-container">
			<button class="close-btn" onclick={onClose} aria-label="Close lightbox">
				<X size={24} />
			</button>

			{#if images.length > 1}
				<button
					class="nav-btn prev-btn"
					onclick={previousImage}
					disabled={currentIndex === 0}
					aria-label="Previous image"
				>
					<ChevronLeft size={32} />
				</button>

				<button
					class="nav-btn next-btn"
					onclick={nextImage}
					disabled={currentIndex === images.length - 1}
					aria-label="Next image"
				>
					<ChevronRight size={32} />
				</button>
			{/if}

			<div class="image-container">
				{#if !imageLoaded}
					<div class="loading-spinner" aria-label="Loading image">
						<Loader2 size={40} />
					</div>
				{/if}
				<img
					bind:this={imageElement}
					src={images[currentIndex]}
					loading="lazy"
					alt="Gallery image {currentIndex + 1}"
					class:loaded={imageLoaded}
					onload={() => (imageLoaded = true)}
					onclick={(e) => e.stopPropagation()}
					role="none"
				/>
			</div>

			{#if images.length > 1}
				<div class="controls">
					<span class="image-counter">
						{currentIndex + 1} / {images.length}
					</span>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.lightbox-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.95);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.lightbox-container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-container {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-container img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.image-container img.loaded {
		opacity: 1;
	}

	.loading-spinner {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--brand);
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.close-btn {
		position: absolute;
		background: rgba(0, 0, 0, 0.7);
		border: none;
		color: white;
		cursor: pointer;
		padding: var(--gap-small);
		border-radius: var(--radius-2);
		transition: background-color 0.2s ease;
		z-index: 10;
		top: var(--gap);
		right: var(--gap);
	}

	.close-btn:hover {
		background: rgba(0, 0, 0, 0.9);
	}

	.nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(0, 0, 0, 0.7);
		border: none;
		color: white;
		cursor: pointer;
		padding: var(--gap);
		border-radius: var(--radius-2);
		transition: background-color 0.2s ease;
		z-index: 10;
	}

	.nav-btn:hover {
		background: rgba(0, 0, 0, 0.9);
	}

	.nav-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.prev-btn {
		left: var(--gap);
	}

	.next-btn {
		right: var(--gap);
	}

	.controls {
		position: absolute;
		bottom: var(--gap);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: var(--gap);
		background: rgba(0, 0, 0, 0.7);
		padding: var(--gap-small) var(--gap);
		border-radius: var(--radius-3);
	}

	.image-counter {
		color: white;
		font-size: var(--font-size-0);
		font-weight: var(--font-weight-4);
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		.image-container {
			max-width: 95vw;
			max-height: 85vh;
		}

		.nav-btn {
			padding: var(--gap-small);
		}

		.controls {
			bottom: var(--gap-small);
			padding: var(--gap-small);
		}

		.close-btn {
			top: var(--gap-small);
			right: var(--gap-small);
		}
	}
</style>
