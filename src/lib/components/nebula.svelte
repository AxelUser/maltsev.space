<script lang="ts">
	import { onMount } from 'svelte';
	import { createNebulaRenderer } from './nebula.svelte.js';

	interface Props {
		gasColor1?: [number, number, number];
		gasColor2?: [number, number, number];
		gasColorDark?: [number, number, number];
		flowSpeed?: number;
		noiseScale?: number;
		voidScale?: number;
		voidDensity?: number;
		voidCycleSpeed?: number;
		vignetteStrength?: number;
	}

	const {
		gasColor1 = [0.1, 0.3, 0.7], // Cool Blue
		gasColor2 = [0.3, 0.6, 0.9], // Lighter Blue/Cyan highlight
		gasColorDark = [0.01, 0.02, 0.05], // Very Dark Blue
		flowSpeed = 1.5,
		noiseScale = 2.5,
		voidScale = 4.0,
		voidDensity = 0.4, // 0 to 1, controls how "strong" or "carved out" voids are
		voidCycleSpeed = 0.6,
		vignetteStrength = 0.65 // 0 (strong vignette) to 1 (weak vignette/edges visible)
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	const renderer = createNebulaRenderer();

	$effect(() => {
		renderer.canvas = canvas;
	});

	$effect(() => {
		if (renderer.isInitialized) {
			renderer.updateUniforms({
				gasColor1,
				gasColor2,
				gasColorDark,
				flowSpeed,
				noiseScale,
				voidScale,
				voidDensity,
				voidCycleSpeed,
				vignetteStrength
			});
		}
	});

	onMount(() => {
		renderer.resize();
		renderer.startRendering();
		return renderer.cleanup;
	});
</script>

<svelte:window onresize={renderer.resize} />
<canvas
	bind:this={canvas}
	style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 0;"
></canvas>
