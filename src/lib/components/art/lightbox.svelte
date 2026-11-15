<!--
	@component
	Opens when `index` is set; resets it to `null` on close.
-->
<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/utils';

	interface Props {
		images: EnhancedImageSrc[];
		index: number | null;
		label?: string;
	}

	let { images, index = $bindable(), label = 'Image viewer' }: Props = $props();

	let dialog: HTMLDialogElement;

	const pad = (n: number) => String(n).padStart(2, '0');

	$effect(() => {
		if (index !== null && !dialog.open) dialog.showModal();
		if (index === null && dialog.open) dialog.close();
	});

	function step(by: number) {
		if (index === null) return;
		index = (index + by + images.length) % images.length;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') step(1);
		if (event.key === 'ArrowLeft') step(-1);
	}

	// A click on the backdrop lands on the dialog element itself
	function onclick(event: MouseEvent) {
		if (event.target === dialog) index = null;
	}

	const controlClass =
		'cursor-pointer border border-[#3a4553] bg-transparent px-3 py-1.5 font-mono text-[12px] tracking-[0.1em] text-[#e9edf2] uppercase hover:border-[#e9edf2]';
</script>

<dialog
	bind:this={dialog}
	aria-label={label}
	class="m-auto max-h-[92vh] max-w-[92vw] border-0 bg-transparent p-0 backdrop:bg-[rgb(4_6_10/0.88)]"
	onclose={() => (index = null)}
	{onkeydown}
	{onclick}
>
	{#if index !== null}
		<enhanced:img
			src={images[index]}
			alt="{label}, {index + 1} of {images.length}"
			sizes="92vw"
			class="block max-h-[80vh] w-auto max-w-[92vw] object-contain"
		/>
		<div class="mt-3 flex items-center justify-between gap-3 font-mono text-[12px] text-[#c9d1da]">
			{#if images.length > 1}
				<button type="button" class={controlClass} onclick={() => step(-1)}>← prev</button>
				<span class="tracking-[0.1em]">{pad(index + 1)} / {pad(images.length)}</span>
				<button type="button" class={controlClass} onclick={() => step(1)}>next →</button>
			{/if}
			<button type="button" class={[controlClass, 'ml-auto']} onclick={() => (index = null)}>
				close
			</button>
		</div>
	{/if}
</dialog>
