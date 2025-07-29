<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		density?: number;
		maxStars?: number;
		resizeThreshold?: number;
	}

	const { density = 0.00008, maxStars = 30, resizeThreshold = 20 }: Props = $props();

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
				size: Math.random() * 0.3 + 0.15,
				opacity: Math.random() * 0.5,
				delay: Math.random() * 8
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
			style="left: {star.x}%; top: {star.y}%; --star-size: {star.size}rem; opacity: {star.opacity}; animation-delay: {star.delay}s;"
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
		width: var(--star-size);
		height: var(--star-size);
		animation: twinkle 4s infinite ease-in-out;
		will-change: opacity, filter;
		overflow: visible;
	}

	.star::before,
	.star::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		background: var(--star);
		transform: translate(-50%, -50%);
	}

	/* vertical ray */
	.star::before {
		width: 2px;
		height: calc(var(--star-size) * 3);
		transform: translate(-50%, -50%) scaleY(1) scaleX(1);
		background: linear-gradient(to top, 
			transparent 0%, 
			rgba(255, 255, 255, 0.1) 15%, 
			var(--star) 45%, 
			var(--star) 55%, 
			rgba(255, 255, 255, 0.1) 85%, 
			transparent 100%);
		clip-path: polygon(0% 0%, 100% 0%, 80% 50%, 100% 100%, 0% 100%, 20% 50%);
	}

	/* horizontal ray */
	.star::after {
		width: calc(var(--star-size) * 3);
		height: 2px;
		background: linear-gradient(to right, 
			transparent 0%, 
			rgba(255, 255, 255, 0.1) 15%, 
			var(--star) 45%, 
			var(--star) 55%, 
			rgba(255, 255, 255, 0.1) 85%, 
			transparent 100%);
		clip-path: polygon(0% 0%, 50% 20%, 100% 0%, 100% 100%, 50% 80%, 0% 100%);
	}

	/* bright core */
	.star {
		background: radial-gradient(circle at center, 
			var(--star) 0%, 
			rgba(255, 255, 255, 0.8) 20%, 
			rgba(255, 255, 255, 0.3) 40%, 
			transparent 70%);
		border-radius: 50%;
		filter: drop-shadow(0 0 calc(var(--star-size) * 0.5) var(--star)) 
		        drop-shadow(0 0 calc(var(--star-size) * 1.2) rgba(255, 255, 255, 0.3));
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(0.8);
			filter: drop-shadow(0 0 calc(var(--star-size) * 0.3) var(--star)) 
			        drop-shadow(0 0 calc(var(--star-size) * 0.8) rgba(255, 255, 255, 0.2));
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
			filter: drop-shadow(0 0 calc(var(--star-size) * 0.8) var(--star)) 
			        drop-shadow(0 0 calc(var(--star-size) * 1.8) rgba(255, 255, 255, 0.4));
		}
	}
</style>
