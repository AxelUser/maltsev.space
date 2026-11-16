<!--
	@component
	Satellites are HTML layers spun with CSS transforms over a static SVG, so motion never
	repaints the SVG. They pause on hover/focus and while off-screen.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { stack, type StackKey } from '$lib/components/icons';

	interface Props {
		items: readonly StackKey[];
	}

	const { items }: Props = $props();

	// Geometry in viewBox units (460 × 440, planet at 230,220)
	const VB_W = 460;
	const DISC = 44;
	const ICON = 26;
	const RADII = [146, 178, 178, 208, 208];
	const START = [210, 30, 250, 120, 320];
	const PERIOD = [40, 56, 56, 74, 74];

	const satellites = $derived(
		items.map((key, i) => {
			const r = RADII[i % RADII.length];
			return {
				key,
				...stack[key],
				orbitSize: `${((2 * r) / VB_W) * 100}%`,
				discSize: `${(DISC / (2 * r)) * 100}%`,
				angle: `${START[i % START.length]}deg`,
				period: `${PERIOD[i % PERIOD.length]}s`
			};
		})
	);

	const rings = [
		{ rx: 112, ry: 22, color: 'var(--color-livery-4)' },
		{ rx: 102, ry: 19, color: 'var(--color-livery-3)' },
		{ rx: 92, ry: 16, color: 'var(--color-livery-2)' },
		{ rx: 82, ry: 13, color: 'var(--color-livery-1)' }
	];

	let figure: HTMLElement;
	let hovered = $state<string | null>(null);
	let visible = $state(true);

	const paused = $derived(hovered !== null || !visible);

	onMount(() => {
		const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
		observer.observe(figure);
		return () => observer.disconnect();
	});
</script>

{#snippet ringSet()}
	<g transform="rotate(-14 230 220)" fill="none" stroke-width="5">
		{#each rings as ring (ring.rx)}
			<ellipse cx="230" cy="220" rx={ring.rx} ry={ring.ry} style:stroke={ring.color} />
		{/each}
	</g>
{/snippet}

<figure bind:this={figure} class="hud relative m-0 p-[18px]">
	<div
		class="relative mx-auto aspect-[460/440] w-full max-w-[540px]"
		role="group"
		aria-label="The languages and tools I work with, in orbit"
		onpointerleave={() => (hovered = null)}
	>
		<svg
			viewBox="0 0 460 440"
			class="absolute inset-0 size-full overflow-visible"
			aria-hidden="true"
		>
			<defs>
				<radialGradient id="orbit-planet" cx="35%" cy="30%" r="75%">
					<stop offset="0" style:stop-color="var(--color-planet-a)" />
					<stop offset="1" style:stop-color="var(--color-planet-b)" />
				</radialGradient>
				<clipPath id="orbit-front">
					<rect x="0" y="220" width="460" height="220" transform="rotate(-14 230 220)" />
				</clipPath>
			</defs>
			<g fill="none" class="stroke-line-2" stroke-width="1">
				<circle cx="230" cy="220" r="146" stroke-dasharray="2 6" />
				<circle cx="230" cy="220" r="178" />
				<circle cx="230" cy="220" r="208" stroke-dasharray="1 7" />
			</g>
			<!-- Rings behind the planet, the planet, then the front half of the rings over it -->
			{@render ringSet()}
			<circle cx="230" cy="220" r="58" fill="url(#orbit-planet)" />
			<g clip-path="url(#orbit-front)">{@render ringSet()}</g>
		</svg>

		{#each satellites as sat (sat.key)}
			<div
				class="pointer-events-none absolute top-1/2 left-1/2 aspect-square -translate-1/2 animate-[orbit_var(--t)_linear_infinite] will-change-transform"
				style:width={sat.orbitSize}
				style:--a={sat.angle}
				style:--t={sat.period}
				style:transform="rotate({sat.angle})"
				style:animation-play-state={paused ? 'paused' : 'running'}
			>
				<div
					class="pointer-events-auto absolute top-1/2 left-full aspect-square -translate-1/2"
					style:width={sat.discSize}
				>
					<!-- A button so touch and keyboard users can reveal the name too -->
					<button
						type="button"
						aria-label={sat.name}
						aria-pressed={hovered === sat.name}
						onpointerenter={() => (hovered = sat.name)}
						onclick={() => (hovered = sat.name)}
						onfocus={() => (hovered = sat.name)}
						onblur={() => (hovered = null)}
						class={[
							'grid size-full animate-[orbit-counter_var(--t)_linear_infinite] cursor-default place-items-center rounded-full border bg-sat p-0 will-change-transform',
							hovered === sat.name ? 'border-2 border-livery-2' : 'border-line-2'
						]}
						style:transform="rotate(calc({sat.angle} * -1))"
						style:animation-play-state={paused ? 'paused' : 'running'}
					>
						<sat.icon size="{(ICON / DISC) * 100}%" />
					</button>
				</div>
			</div>
		{/each}
	</div>

	<figcaption class="eyebrow mt-2 flex min-h-[1.3em] flex-wrap justify-between gap-3">
		<span>Fig. 1: what I work with</span>
		<span aria-live="polite">
			{#if hovered}
				In orbit · <b class="font-medium text-ink">{hovered}</b>
			{:else}
				hover a satellite
			{/if}
		</span>
	</figcaption>
</figure>
