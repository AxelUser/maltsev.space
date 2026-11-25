<!--
	@component
	Renders a `CanvasScene` at a fixed resolution, stretched to fill its box. Draws one frame once
	`create` resolves, then animates while `isRunning`; scene time stops while paused.

	<SceneCanvas create={createScene} width={384} height={256} {isRunning} {onready} pixelated />
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { AnimationFrames } from 'runed';
	import type { ClassValue } from 'clsx';
	import { cn } from '#lib/utils/index.ts';
	import type { CanvasScene, CanvasSceneFactory } from './types';

	interface Props {
		create: CanvasSceneFactory;
		/** Render resolution, not display size. */
		width: number;
		height: number;
		isRunning: boolean;
		/** `0` = uncapped. */
		fps?: number;
		/** Seconds. */
		startAt?: number;
		/** Nearest-neighbour upscaling. */
		pixelated?: boolean;
		onready?: () => void;
		onerror?: (err: unknown) => void;
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
		onerror,
		class: className
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let scene: CanvasScene | undefined;
	let created = $state(false);
	let t = startAt;

	const frames = new AnimationFrames(
		({ delta }) => {
			// Capped so resuming after a pause doesn't skip ahead.
			t += Math.min(delta, 100) / 1000;
			scene?.render(t);
		},
		// runed drops frames whose measured fps exceeds the cap; without +1, timing jitter turns
		// 30 fps on a 60 Hz display into ~20.
		{ immediate: false, fpsLimit: () => (fps ? fps + 1 : 0) }
	);

	onMount(() => {
		let unmounted = false;
		(async () => {
			try {
				const s = await create(canvas);
				// Unmounted before `create` resolved.
				if (unmounted) return s.dispose();
				scene = s;
				scene.render(t);
			} catch (err) {
				if (unmounted) return;
				console.error('SceneCanvas: could not start the scene', err);
				onerror?.(err);
				return;
			}
			created = true;
			onready?.();
		})();
		return () => {
			unmounted = true;
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
