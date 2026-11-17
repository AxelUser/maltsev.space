<!--
	@component
	Shows an animated cover over a still `fallback`. The scene is loaded only on non-mobile devices
	with a hovering pointer and no reduced-motion preference, and runs only while at least half of it
	is in the viewport, so it doesn't move beside the text the reader has scrolled on to.
	Everyone else, and the server render, gets the fallback. While the scene loads, the fallback is
	dimmed under a loading indicator. `playing` is true while the scene shows.

	<LiveCover load={getPostLiveCover(slug)} fallback={still} bind:playing />
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { useIntersectionObserver } from 'runed';
	import { cn, isMobileDevice } from '$lib/utils';
	import { LoadingOverlay } from '$lib/components/ui';
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

	// Ratio, not `isIntersecting` (runed's IsInViewport): that stays true while any sliver shows.
	const VISIBLE = 0.5;
	let root = $state<HTMLElement>();
	let mostlyVisible = $state(false);
	useIntersectionObserver(
		() => root,
		(entries) => {
			const last = entries.at(-1);
			if (last) mostlyVisible = last.intersectionRatio >= VISIBLE;
		},
		{ threshold: VISIBLE }
	);

	let Scene = $state<LiveCoverComponent>();
	let ready = $state(false);
	let failed = $state(false);

	$effect(() => {
		if (!canAnimate || Scene) return;
		let cancelled = false;
		load()
			.then((mod) => {
				if (!cancelled) Scene = mod.default;
			})
			.catch((err) => {
				console.error('Live cover: could not load the scene', err);
				failed = true;
			});
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
			<Scene
				isRunning={canAnimate && mostlyVisible}
				onready={() => (ready = true)}
				onerror={() => (failed = true)}
			/>
		</div>
	{/if}
	<LoadingOverlay visible={canAnimate && !ready && !failed} label="Scene is loading" />
</div>
