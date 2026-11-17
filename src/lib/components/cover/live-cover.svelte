<!--
	@component
	Shows an animated cover over a still `fallback`. The scene is loaded only on non-mobile devices
	with a hovering pointer and no reduced-motion preference, and runs only while in the viewport.
	Everyone else, and the server render, gets the fallback. `playing` is true while the scene shows.

	<LiveCover load={getPostLiveCover(slug)} fallback={still} bind:playing />
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { IsInViewport } from 'runed';
	import { cn, isMobileDevice } from '$lib/utils';
	import type { LiveCoverComponent, LiveCoverLoader } from './types';

	interface Props {
		load: LiveCoverLoader;
		fallback?: Snippet;
		playing?: boolean;
	}

	let { load, fallback, playing = $bindable(false) }: Props = $props();

	const mobile = isMobileDevice();
	const desktopMotion = new MediaQuery(
		'(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
		false
	);
	const canAnimate = $derived(!mobile && desktopMotion.current);

	let root = $state<HTMLElement>();
	const inViewport = new IsInViewport(() => root);

	let Scene = $state<LiveCoverComponent>();
	let ready = $state(false);

	$effect(() => {
		if (!canAnimate || Scene) return;
		let cancelled = false;
		load()
			.then((mod) => {
				if (!cancelled) Scene = mod.default;
			})
			.catch((err) => console.error('Live cover: could not load the scene', err));
		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		playing = ready && canAnimate;
	});
</script>

<div bind:this={root} class="relative size-full">
	{@render fallback?.()}
	{#if Scene}
		<div
			class={cn(
				'absolute inset-0 transition-opacity duration-700',
				playing ? 'opacity-100' : 'opacity-0'
			)}
		>
			<Scene isRunning={canAnimate && inViewport.current} onready={() => (ready = true)} />
		</div>
	{/if}
</div>
