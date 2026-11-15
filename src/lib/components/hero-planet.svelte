<script lang="ts">
	import { SvelteIcon, ReactIcon, KotlinIcon, CSharpIcon } from './icons';

	// Static class strings so Tailwind can see every utility at build time.
	const orbits = [
		{
			icon: CSharpIcon,
			orbit: 'size-[120px] animate-[orbit_25s_linear_infinite] md:size-[160px]',
			moon: 'animate-[orbit-reverse_25s_linear_infinite] -top-[15px] left-1/2 -translate-x-1/2 md:-top-5'
		},
		{
			icon: KotlinIcon,
			orbit: 'size-[190px] animate-[orbit_30s_linear_infinite] md:size-[260px]',
			moon: 'animate-[orbit-reverse_30s_linear_infinite] top-1/2 -right-[15px] -translate-y-1/2 md:-right-5'
		},
		{
			icon: ReactIcon,
			orbit: 'size-[260px] animate-[orbit_35s_linear_infinite] md:size-[360px]',
			moon: 'animate-[orbit-reverse_35s_linear_infinite] -bottom-[15px] left-1/2 -translate-x-1/2 md:-bottom-5'
		},
		{
			icon: SvelteIcon,
			orbit: 'size-[330px] animate-[orbit_40s_linear_infinite] md:size-[460px]',
			moon: 'animate-[orbit-reverse_40s_linear_infinite] top-1/2 -left-[15px] -translate-y-1/2 md:-left-5'
		}
	];
</script>

<div class="relative my-5 size-[380px] overflow-hidden md:size-[540px]">
	<div
		class="absolute top-1/2 left-1/2 size-20 -translate-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--planet),var(--brand))] shadow-[0_0_20px_color-mix(in_srgb,var(--brand)_40%,transparent)] md:size-[100px]"
	>
		<div
			class="absolute inset-0 rounded-full bg-[linear-gradient(45deg,rgba(0,0,0,0.5),transparent_70%)]"
		></div>
	</div>
	{#each orbits as { icon: Icon, orbit, moon }, i (i)}
		<div
			class="absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-fg-2/30 {orbit}"
		>
			<div
				class="absolute flex size-[30px] items-center justify-center rounded-full bg-fg-2 shadow-[0_0_15px_rgba(255,255,255,0.3)] md:size-10 {moon}"
			>
				<div
					class="flex size-full items-center justify-center drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
				>
					<Icon size="24px" />
				</div>
			</div>
		</div>
	{/each}
</div>
