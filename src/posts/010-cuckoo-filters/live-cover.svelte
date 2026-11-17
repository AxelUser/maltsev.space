<!--
	@component
	PS1-style station landing deck: 4 hangar bays of 4 landing pads hold a cuckoo filter, ships known
	only by their hull codes. Hovering shows the codes and the next ship; each click sends it in from
	the corner and plays out the bumping. The scene is in ./scene.ts.
-->
<script lang="ts">
	import { SceneCanvas, type LiveCoverProps } from '$lib/components/cover';
	import { createStationScene, W, H } from './scene';

	const { isRunning, onready, onerror }: LiveCoverProps = $props();

	let hovered = false;
	let clicks = 0;
	const create = (canvas: HTMLCanvasElement) =>
		createStationScene(canvas, { hovered: () => hovered, clicks: () => clicks });
</script>

<div
	class="size-full cursor-pointer select-none"
	role="presentation"
	onpointerenter={() => (hovered = true)}
	onpointerleave={() => (hovered = false)}
	onpointerdown={(e) => e.button === 0 && clicks++}
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
