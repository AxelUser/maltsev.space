<!--
	@component
	Live cover: PS1-style harbor at dusk, a drone scanning four container "lanes" (see ./scene.ts).
-->
<script lang="ts">
	import { SceneCanvas, type LiveCoverProps } from '$lib/components/cover';
	import { createHarborScene, W, H } from './scene';

	const { isRunning, onready }: LiveCoverProps = $props();
</script>

<SceneCanvas
	create={createHarborScene}
	width={W}
	height={H}
	{isRunning}
	{onready}
	startAt={3}
	pixelated
	class="bg-[#05060c]"
/>
