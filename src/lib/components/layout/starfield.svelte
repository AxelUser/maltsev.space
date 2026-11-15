<!--
	@component
	Static server-rendered SVG: no JS, no per-frame work. `slice` keeps the density
	constant at any viewport size.
-->
<script module lang="ts">
	const W = 1600;
	const H = 1000;
	const COUNT = 110;

	// Deterministic Park–Miller PRNG so server and client agree
	let seed = 7;
	const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

	const stars = Array.from({ length: COUNT }, () => ({
		x: (rnd() * W).toFixed(1),
		y: (rnd() * H).toFixed(1),
		r: rnd() > 0.94 ? 1.2 : 0.6,
		o: (0.2 + rnd() * 0.6).toFixed(2)
	}));
</script>

<svg
	class="pointer-events-none fixed inset-0 -z-10 size-full opacity-0 transition-opacity duration-700 dark:opacity-100"
	viewBox="0 0 {W} {H}"
	preserveAspectRatio="xMidYMid slice"
	aria-hidden="true"
>
	<g fill="#dfe6ee">
		{#each stars as star, i (i)}
			<circle cx={star.x} cy={star.y} r={star.r} opacity={star.o} />
		{/each}
	</g>
</svg>
