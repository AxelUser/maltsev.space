<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		density?: number;
		maxStars?: number;
		resizeThreshold?: number;
	}

	const { density = 0.00008, maxStars = 150, resizeThreshold = 20 }: Props = $props();

	let starsContainer: HTMLDivElement;
	let stars: { x: number; y: number; size: number; opacity: number; delay: number }[] = $state([]);
	let resizeTimer: number | undefined = $state(undefined);
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let prevWidth = $state(0);
	let prevHeight = $state(0);

	function generateStars() {
		if (!starsContainer) return;

		stars = [];

		const viewportArea = innerWidth * innerHeight;
		const starCount = Math.min(Math.round(viewportArea * density), maxStars);

		for (let i = 0; i < starCount; i++) {
			stars.push({
				x: Math.random() * 100,
				y: Math.random() * 100,
				size: Math.random() * 0.15 + 0.05,
				opacity: Math.random() * 0.5 + 0.2,
				delay: Math.random() * 4
			});
		}

		prevWidth = innerWidth;
		prevHeight = innerHeight;
	}

	function handleResize() {
		if (resizeTimer) {
			clearTimeout(resizeTimer);
			resizeTimer = undefined;
		}

		// Only regenerate stars if dimensions changed significantly. This is to prevent unnecessary re-renders on mobile during scrolling.
		const widthDiff = Math.abs(innerWidth - prevWidth);
		const heightDiff = Math.abs(innerHeight - prevHeight);

		if (widthDiff > resizeThreshold || heightDiff > resizeThreshold) {
			resizeTimer = setTimeout(generateStars, 300);
		}
	}

	onMount(() => {
		generateStars();
		return () => {
			if (resizeTimer) {
				clearTimeout(resizeTimer);
				resizeTimer = undefined;
			}
		};
	});
</script>

<svelte:window onresize={handleResize} bind:innerWidth bind:innerHeight />

<div class="stars-background" bind:this={starsContainer}>
	{#each stars as star, i}
		<div
			class="star"
			style="left: {star.x}%; top: {star.y}%; width: {star.size}rem; height: {star.size}rem; opacity: {star.opacity}; animation-delay: {star.delay}s;"
		></div>
	{/each}
</div>

<style>
	.stars-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		pointer-events: none;
		will-change: transform;
		overflow: hidden;
	}

	.star {
		position: absolute;
		background-color: var(--star);
		border-radius: 50%;
		animation: twinkle 4s infinite ease-in-out;
		will-change: opacity;
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.1;
		}
		50% {
			opacity: 0.6;
		}
	}
</style>
