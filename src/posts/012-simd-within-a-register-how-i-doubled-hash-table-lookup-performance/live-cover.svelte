<!--
	@component
	PS1-style harbor at dusk: a drone scans four containers, the slots of a bucket.
	Hovering makes it look up a fingerprint in all four at once. The scene is in ./scene.ts.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SceneCanvas, type LiveCoverProps } from '$lib/components/cover';
	import { createHarborScene, W, H } from './scene';

	const { isRunning, onready, onerror, oninteract }: LiveCoverProps = $props();

	const HOVER_INTERACTION_MS = 1500;

	let hovered = false;
	let hoverInteraction: ReturnType<typeof setTimeout> | undefined;
	const create = (canvas: HTMLCanvasElement) =>
		createHarborScene(canvas, { detecting: () => hovered });

	onDestroy(() => clearTimeout(hoverInteraction));
</script>

<div
	class="size-full"
	role="presentation"
	onpointerenter={() => {
		hovered = true;
		hoverInteraction = setTimeout(() => oninteract?.('hover'), HOVER_INTERACTION_MS);
	}}
	onpointerleave={() => {
		hovered = false;
		clearTimeout(hoverInteraction);
	}}
>
	<SceneCanvas
		{create}
		width={W}
		height={H}
		{isRunning}
		{onready}
		{onerror}
		startAt={3}
		pixelated
		class="bg-[#05060c]"
	/>
</div>
