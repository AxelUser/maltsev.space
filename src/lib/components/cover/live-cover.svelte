<!--
	@component
	Shell for an animated cover. Always renders `fallback` (the still image), which is all that
	server rendering, phones, tablets and reduced-motion readers ever see. On other devices it
	lazy-loads the scene, fades it in over the fallback once its first frame is drawn, and runs it
	only while it is in the viewport (hidden tabs pause on their own, as animation frames stop firing).
	`playing` is bindable and tells whether the scene (rather than the fallback) is on screen.

	<LiveCover load={() => import('./live-cover.svelte')} fallback={still} bind:playing />
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

	// Not a phone or tablet (saves their battery), drives a precise hovering pointer, and the reader
	// hasn't asked for reduced motion.
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
