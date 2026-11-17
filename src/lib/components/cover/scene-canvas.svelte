<!--
	@component
	Runs an imperative `CanvasScene` (three.js, 2D canvas, …) at a fixed internal resolution,
	upscaled to fill its box. Draws a first frame on mount, then animates only while `isRunning`.
	Scene time pauses with it, so the animation resumes where it stopped.

	<SceneCanvas create={createScene} width={384} height={256} {isRunning} {onready} pixelated />
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { AnimationFrames } from 'runed';
	import type { ClassValue } from 'clsx';
	import { cn } from '$lib/utils';
	import type { CanvasScene } from './types';

	interface Props {
		create: (canvas: HTMLCanvasElement) => CanvasScene;
		/** Internal render resolution. */
		width: number;
		height: number;
		isRunning: boolean;
		/** Frame-rate cap; `0` renders every animation frame. */
		fps?: number;
		/** Scene time (seconds) of the first frame. */
		startAt?: number;
		/** Upscale with nearest-neighbour sampling (for low-res, retro scenes). */
		pixelated?: boolean;
		onready?: () => void;
		class?: ClassValue;
	}

	const {
		create,
		width,
		height,
		isRunning,
		fps = 30,
		startAt = 0,
		pixelated = false,
		onready,
		class: className
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let scene: CanvasScene | undefined;
	let created = $state(false);
	let t = startAt;

	const frames = new AnimationFrames(
		({ delta }) => {
			// Clamp so a resume (or a long hitch) doesn't jump the scene ahead.
			t += Math.min(delta, 100) / 1000;
			scene?.render(t);
		},
		// runed skips a frame when its instantaneous fps exceeds the cap; +1 absorbs vsync jitter
		// so a 30 fps cap really yields 30 on a 60 Hz display.
		{ immediate: false, fpsLimit: () => (fps ? fps + 1 : 0) }
	);

	onMount(() => {
		try {
			scene = create(canvas);
			scene.render(t);
		} catch (err) {
			console.error('Live cover: could not start the scene', err);
			return;
		}
		created = true;
		onready?.();
		return () => {
			frames.stop();
			scene?.dispose();
			scene = undefined;
		};
	});

	$effect(() => {
		if (created && isRunning) frames.start();
		else frames.stop();
	});
</script>

<canvas
	bind:this={canvas}
	{width}
	{height}
	aria-hidden="true"
	class={cn('block size-full object-cover', pixelated && '[image-rendering:pixelated]', className)}
></canvas>
