<!--
	@component
	Animated scene layer for a post cover. 
	The scene runs only while at least half of it is in the viewport.

	<LiveCover load={getPostLiveCover(slug)} onready={…} onerror={…} />
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { useIntersectionObserver } from 'runed';
	import { cn } from '$lib/utils';
	import { LoadingOverlay } from '$lib/components/ui';
	import { trackOnce } from '$lib/analytics';
	import type { LiveCoverComponent, LiveCoverLoader } from './types';

	interface Props {
		/** Read once on mount. */
		load: LiveCoverLoader;
		/** Called after the first frame is drawn. */
		onready?: () => void;
		/** Called if the scene can't load or start. */
		onerror?: (err: unknown) => void;
	}

	const { load, onready, onerror }: Props = $props();

	let Scene = $state<LiveCoverComponent>();
	let ready = $state(false);
	let failed = $state(false);

	function markReady() {
		ready = true;
		onready?.();
	}

	function fail(err: unknown) {
		failed = true;
		onerror?.(err);
	}

	onMount(() => {
		let cancelled = false;
		load()
			.then((mod) => {
				if (!cancelled) Scene = mod.default;
			})
			.catch((err) => {
				console.error('Live cover: could not load the scene', err);
				if (!cancelled) fail(err);
			});
		return () => {
			cancelled = true;
		};
	});

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

	$effect(() => {
		if (ready && mostlyVisible) trackOnce('live-cover:shown', 'live_cover_shown', {});
	});

	function interact(action: string) {
		trackOnce(`live-cover:${action}`, 'live_cover_interacted', { action });
	}
</script>

<!-- data-live-cover: read by the perf tests (perf/pages.ts) to time when the scene shows. -->
<div bind:this={root} class="absolute inset-0" data-live-cover={ready ? 'playing' : 'loading'}>
	{#if Scene && !failed}
		<div
			class={cn(
				'absolute inset-0 transition-opacity duration-700',
				ready ? 'opacity-100' : 'opacity-0'
			)}
		>
			<Scene isRunning={mostlyVisible} onready={markReady} onerror={fail} oninteract={interact} />
		</div>
	{/if}
	<LoadingOverlay visible={!ready && !failed} label="Scene is loading" />
</div>
