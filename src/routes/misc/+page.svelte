<script lang="ts">
	import { SEO } from '#lib/components/index.ts';
	import { Container } from '#lib/components/layout/index.ts';
	import { PageHeader } from '#lib/components/ui/index.ts';
	import { CollectionBay } from '#lib/components/art/index.ts';

	const { data } = $props();
</script>

<SEO
	title="Misc"
	description="Outside of code. Just things I enjoy making."
	url="/misc"
	keywords={['misc', 'art', 'music', 'stable diffusion', 'ai art']}
/>

<Container class="pb-[72px]">
	<PageHeader
		kicker="Misc"
		title="Things I make"
		lead="Outside of code. Just things I enjoy making."
	/>

	{#each data.collections as collection, i (collection.id)}
		<CollectionBay {collection} position={i + 1} />
	{/each}
</Container>
