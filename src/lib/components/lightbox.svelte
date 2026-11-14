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
		class="fixed inset-0 z-1000 flex items-center justify-center bg-black/95 backdrop-blur-xs"
		bind:this={lightboxContainer}
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-label="Image lightbox"
	>
		<div class="relative flex size-full items-center justify-center">
			<button
				class="absolute top-2 right-2 z-10 cursor-pointer rounded-md bg-black/70 p-2 text-white transition-colors duration-200 hover:bg-black/90 md:top-5 md:right-5"
				onclick={onClose}
				aria-label="Close lightbox"
			>
				<X size={24} />
			</button>

			{#if images.length > 1}
				<button
					class="absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-md bg-black/70 p-2 text-white transition-colors duration-200 hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-30 md:p-5 left-5"
					onclick={previousImage}
					disabled={currentIndex === 0}
					aria-label="Previous image"
				>
					<ChevronLeft size={32} />
				</button>

				<button
					class="absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-md bg-black/70 p-2 text-white transition-colors duration-200 hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-30 md:p-5 right-5"
					onclick={nextImage}
					disabled={currentIndex === images.length - 1}
					aria-label="Next image"
				>
					<ChevronRight size={32} />
				</button>
			{/if}

			<div
				class="relative flex max-h-[85vh] max-w-[95vw] items-center justify-center md:max-h-[90vh] md:max-w-[90vw]"
			>
				{#if !imageLoaded}
					<div
						class="absolute flex animate-spin items-center justify-center text-brand"
						aria-label="Loading image"
					>
						<Loader2 size={40} />
					</div>
				{/if}
				<img
					bind:this={imageElement}
					src={images[currentIndex]}
					loading="lazy"
					alt="Gallery image {currentIndex + 1}"
					class={[
						'max-h-full max-w-full object-contain transition-opacity duration-300 ease-[ease]',
						imageLoaded ? 'opacity-100' : 'opacity-0'
					]}
					onload={() => (imageLoaded = true)}
					onclick={(e) => e.stopPropagation()}
					role="none"
				/>
			</div>

			{#if images.length > 1}
				<div
					class="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-5 rounded-2xl bg-black/70 p-2 md:bottom-5 md:px-5"
				>
					<span class="text-xs font-normal whitespace-nowrap text-white">
						{currentIndex + 1} / {images.length}
					</span>
				</div>
			{/if}
		</div>
	</div>
{/if}
