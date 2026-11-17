<!--
	@component
	PS1-style harbor at dusk: a drone scans four containers, the slots of a bucket.
	Hovering makes it look up a fingerprint in all four at once. The scene is in ./scene.ts.
-->
<script lang="ts">
	import { SceneCanvas, type LiveCoverProps } from '$lib/components/cover';
	import { createHarborScene, W, H } from './scene';

	const { isRunning, onready, onerror }: LiveCoverProps = $props();

	let hovered = false;
	const create = (canvas: HTMLCanvasElement) =>
		createHarborScene(canvas, { detecting: () => hovered });
</script>

<div
	class="size-full cursor-crosshair"
	role="presentation"
	onpointerenter={() => (hovered = true)}
	onpointerleave={() => (hovered = false)}
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
