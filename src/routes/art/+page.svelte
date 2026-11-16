<script lang="ts">
	import { SEO } from '$lib/components';
	import { Container } from '$lib/components/layout';
	import { PageHeader } from '$lib/components/ui';
	import { CollectionBay } from '$lib/components/art';

	const { data } = $props();
</script>

<SEO
	title="Art"
	description="Things I make outside of code: music and AI-generated pictures. Each collection is a separate experiment."
	url="/art"
	keywords={['art', 'music', 'stable diffusion', 'ai art']}
/>

<Container class="pb-[72px]">
	<PageHeader
		kicker="Art"
		title="Things I make"
		lead="Outside of code. Each collection is a separate experiment with its own page."
	/>

	{#each data.collections as collection, i (collection.id)}
		<CollectionBay {collection} position={i + 1} />
	{/each}
</Container>
