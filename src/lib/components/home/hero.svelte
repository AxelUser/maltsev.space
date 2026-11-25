<script lang="ts">
	import { bio } from '#lib/content/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import { Container } from '#lib/components/layout/index.ts';
	import OrbitFigure from './orbit-figure.svelte';
</script>

<Container
	as="section"
	class="grid items-center gap-10 pt-14 pb-14 lg:min-h-[calc(100svh-72px)] lg:grid-cols-2 lg:pt-10"
>
	<div>
		<p class="eyebrow mt-0 mb-7">{bio.fullName} / {bio.role.toLowerCase()}</p>
		<h1
			class="m-0 text-[clamp(42px,6.4vw,88px)]/[0.98] font-light tracking-[-0.02em] font-stretch-[115%]"
		>
			<span class="block text-ink-3">Space is dangerous.</span>
			<span class="block font-semibold">Use tabs<span class="text-livery-1">.</span></span>
		</h1>
		<p class="mt-9 mb-0 max-w-[31em] text-[18px] text-ink-2">
			For me, programming is both work and play. I experiment with
			<b class="font-semibold text-ink">performance</b>,
			<b class="font-semibold text-ink">data structures</b> and
			<b class="font-semibold text-ink">distributed systems</b>, and write down what I learn along
			the way.
		</p>
		<p class="mt-4 mb-0 max-w-[31em] text-[18px] text-ink-2">
			Currently working as a {bio.role} at {bio.company}.
		</p>
		<div class="mt-9 flex flex-wrap gap-3">
			<Button href="/blog">Read the notes →</Button>
			<Button href="/about" variant="ghost">About me</Button>
		</div>
	</div>

	<OrbitFigure items={bio.stack} />
</Container>
