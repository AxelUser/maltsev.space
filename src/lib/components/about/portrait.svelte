<script lang="ts">
	import type { EnhancedImageSrc } from '$lib/utils';

	interface Props {
		src: EnhancedImageSrc;
		alt: string;
	}

	const { src, alt }: Props = $props();

	// `x` and `size` are % of the box
	const moons = [
		{ x: 96.7, size: 3.4, angle: '0deg', period: '40s', color: 'var(--color-livery-1)' },
		{ x: 89.3, size: 2.4, angle: '200deg', period: '60s', color: 'var(--color-livery-4)' }
	];
</script>

<div class="relative grid aspect-square w-[220px] place-items-center lg:w-full">
	<svg viewBox="0 0 300 300" class="absolute inset-0 size-full" fill="none" aria-hidden="true">
		<circle cx="150" cy="150" r="118" class="stroke-line-2" stroke-dasharray="2 6" />
		<circle cx="150" cy="150" r="140" class="stroke-line" />
	</svg>
	{#each moons as moon (moon.period)}
		<div
			class="absolute inset-0 animate-[orbit_var(--t)_linear_infinite] will-change-transform"
			style:--a={moon.angle}
			style:--t={moon.period}
			style:transform="rotate({moon.angle})"
			aria-hidden="true"
		>
			<span
				class="absolute top-1/2 aspect-square -translate-1/2 rounded-full"
				style:left="{moon.x}%"
				style:width="{moon.size}%"
				style:background={moon.color}
			></span>
		</div>
	{/each}
	<enhanced:img
		{src}
		{alt}
		sizes="210px"
		fetchpriority="high"
		class="relative aspect-square w-[68%] rounded-full object-cover"
	/>
</div>
