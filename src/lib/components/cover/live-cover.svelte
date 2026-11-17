<!--
	@component
	Shows an animated cover over a still `fallback`. The scene is loaded only on non-mobile devices
	with a hovering pointer and no reduced-motion preference, and runs only while at least half of it
	is in the viewport, so it doesn't move beside the text the reader has scrolled on to.
	Everyone else, and the server render, gets the fallback. While the scene loads, the fallback is
	dimmed under a loading indicator. `playing` is true while the scene shows.
	A toggle in the top-right corner lets the reader turn the scene off until the page is reloaded.

	<LiveCover load={getPostLiveCover(slug)} fallback={still} bind:playing />
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { MediaQuery } from 'svelte/reactivity';
	import { useIntersectionObserver } from 'runed';
	import { cn, isMobileDevice } from '$lib/utils';
	import { LoadingOverlay } from '$lib/components/ui';
	import { liveCoverEnabled } from '$lib/stores/live-cover';
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

	const active = $derived(canAnimate && $liveCoverEnabled);

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
		if (!active || Scene) return;
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
		playing = ready && active;
	});

	function toggle() {
		// The scene is unmounted when off and must report ready again when it comes back.
		if ($liveCoverEnabled) ready = false;
		liveCoverEnabled.update((on) => !on);
	}
</script>

<!-- data-live-cover: read by the perf tests (perf/pages.ts) to time when the scene shows. -->
<div
	bind:this={root}
	class="relative size-full"
	data-live-cover={playing ? 'playing' : active && !failed ? 'loading' : 'still'}
>
	{@render fallback?.()}
	{#if Scene && active}
		<div
			class={cn(
				'absolute inset-0 transition-opacity duration-700',
				playing ? 'opacity-100' : 'opacity-0'
			)}
			out:fade={{ duration: 300 }}
		>
			<Scene
				isRunning={active && mostlyVisible}
				onready={() => (ready = true)}
				onerror={() => (failed = true)}
			/>
		</div>
	{/if}
	<LoadingOverlay visible={active && !ready && !failed} label="Scene is loading" />
	{#if canAnimate && !failed}
		<button
			type="button"
			aria-pressed={$liveCoverEnabled}
			title={$liveCoverEnabled ? 'Turn the animation off' : 'Turn the animation on'}
			onclick={toggle}
			class="absolute top-3 right-3 z-2 inline-flex cursor-pointer items-center gap-1.5 border border-white/15 bg-[rgb(7_10_15/0.55)] px-2 py-0.5 font-mono text-[11px]/[1.4] font-medium text-white/80 backdrop-blur-sm transition-colors hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
		>
			<span
				class={cn(
					'size-1.5 rounded-full transition-colors',
					$liveCoverEnabled ? 'bg-livery-3/80' : 'bg-white/35'
				)}
				aria-hidden="true"
			></span>
			Live cover: {$liveCoverEnabled ? 'on' : 'off'}
		</button>
	{/if}
</div>
