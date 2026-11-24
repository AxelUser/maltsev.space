<!--
	@component
	PS1-style station landing deck: 4 hangar bays of 4 landing pads hold a cuckoo filter, ships known
	only by their hull codes. Hovering shows the codes and the next ship; each click sends it in from
	the corner and plays out the bumping. The scene is in ./scene.ts.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SceneCanvas, type LiveCoverProps } from '$lib/components/cover';
	import { createStationScene, W, H } from './scene';

	const { isRunning, onready, onerror, oninteract }: LiveCoverProps = $props();

	const HOVER_INTERACTION_MS = 1500;

	let hovered = false;
	let hoverInteraction: ReturnType<typeof setTimeout> | undefined;
	let clicks = 0;
	const create = (canvas: HTMLCanvasElement) =>
		createStationScene(canvas, { hovered: () => hovered, clicks: () => clicks });

	onDestroy(() => clearTimeout(hoverInteraction));
</script>

<div
	class="ph-no-capture size-full cursor-pointer select-none"
	role="presentation"
	onpointerenter={() => {
		hovered = true;
		hoverInteraction = setTimeout(() => oninteract?.('hover'), HOVER_INTERACTION_MS);
	}}
	onpointerleave={() => {
		hovered = false;
		clearTimeout(hoverInteraction);
	}}
	onpointerdown={(e) => {
		if (e.button !== 0) return;
		clicks++;
		oninteract?.('click');
	}}
>
	<SceneCanvas
		{create}
		width={W}
		height={H}
		{isRunning}
		{onready}
		{onerror}
		pixelated
		class="bg-[#06060a]"
	/>
</div>
