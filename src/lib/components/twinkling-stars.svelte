<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		density?: number;
		maxStars?: number;
		resizeThreshold?: number;
	}

	const { density = 0.00008, maxStars = 30, resizeThreshold = 100 }: Props = $props();

	let starsContainer: HTMLDivElement;
	let stars: {
		x: number;
		y: number;
		size: number;
		opacity: number;
		delay: number;
		pixelX?: number;
		pixelY?: number;
	}[] = $state([]);
	let resizeTimer: ReturnType<typeof setTimeout> | undefined = $state(undefined);
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let prevWidth = $state(0);
	let prevHeight = $state(0);
	let isMobile = $state(false);

	function detectMobile() {
		return (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
			(navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
			innerWidth < 768
		);
	}

	function generateStars() {
		if (!starsContainer) return;

		stars = [];

		const mobileMultiplier = isMobile ? 0.3 : 1;
		const viewportArea = innerWidth * innerHeight;
		const baseDensity = density * mobileMultiplier;
		const mobileMaxStars = isMobile ? Math.min(maxStars, 15) : maxStars;
		const starCount = Math.min(Math.round(viewportArea * baseDensity), mobileMaxStars);

		for (let i = 0; i < starCount; i++) {
			const xPercent = Math.random() * 100;
			const yPercent = Math.random() * 100;

			stars.push({
				x: xPercent,
				y: yPercent,
				pixelX: isMobile ? (xPercent / 100) * innerWidth : undefined,
				pixelY: isMobile ? (yPercent / 100) * innerHeight : undefined,
				size: Math.random() * 1.2 + 0.8,
				opacity: Math.random() * 0.4 + 0.2,
				delay: Math.random() * 6
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

		isMobile = detectMobile();

		// Only regenerate stars if dimensions changed significantly. This is to prevent unnecessary re-renders on mobile during scrolling.
		const widthDiff = Math.abs(innerWidth - prevWidth);
		const heightDiff = Math.abs(innerHeight - prevHeight);

		if (widthDiff > resizeThreshold || heightDiff > resizeThreshold) {
			resizeTimer = setTimeout(generateStars, 300);
		}
	}

	onMount(() => {
		isMobile = detectMobile();
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

<div
	class="pointer-events-none fixed inset-0 -z-1 transform-gpu overflow-hidden"
	bind:this={starsContainer}
>
	{#each stars as star, i (i)}
		<div
			class="absolute size-(--star-size) transform-gpu animate-twinkle opacity-(--star-opacity) will-change-[transform,opacity] motion-reduce:animate-none motion-reduce:opacity-[calc(var(--star-opacity)*0.7)]"
			style="
				{isMobile && star.pixelX !== undefined && star.pixelY !== undefined
				? `left: ${star.pixelX}px; top: ${star.pixelY}px;`
				: `left: ${star.x}%; top: ${star.y}%;`}
				--star-size: {star.size}rem; 
				--star-opacity: {star.opacity}; 
				animation-delay: {star.delay}s;
			"
		>
			<svg viewBox="0 0 100 100" class="size-full transform-gpu">
				<defs>
					<radialGradient id="starGradient-{i}" cx="50%" cy="50%" r="60%">
						<stop offset="0%" style="stop-color: var(--star); stop-opacity: 1;" />
						<stop offset="40%" style="stop-color: var(--star); stop-opacity: 0.8;" />
						<stop offset="100%" style="stop-color: var(--star); stop-opacity: 0;" />
					</radialGradient>
					<filter id="starGlow-{i}" x="-50%" y="-50%" width="200%" height="200%">
						{#if !isMobile}
							<feGaussianBlur stdDeviation="3" result="coloredBlur" />
							<feMerge>
								<feMergeNode in="coloredBlur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						{/if}
					</filter>
				</defs>

				<!-- 4-pointed star -->
				<path
					d="M50 5
					   L55 35
					   Q58 45 65 45
					   L95 50
					   L65 55
					   Q58 55 55 65
					   L50 95
					   L45 65
					   Q42 55 35 55
					   L5 50
					   L35 45
					   Q42 45 45 35
					   Z"
					fill="url(#starGradient-{i})"
					filter={isMobile ? 'none' : `url(#starGlow-${i})`}
					class="[vector-effect:non-scaling-stroke]"
				/>
			</svg>
		</div>
	{/each}
</div>
