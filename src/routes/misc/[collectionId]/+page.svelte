<script lang="ts">
	import { SEO } from '#lib/components/index.ts';
	import { Container } from '#lib/components/layout/index.ts';
	import { PageHeader } from '#lib/components/ui/index.ts';
	import { Gallery, TrackList } from '#lib/components/art/index.ts';
	import { getArtImage } from '#lib/utils/art-image.ts';

	const { data } = $props();

	const collection = $derived(data.collection);
</script>

<SEO
	title={collection.title}
	description={collection.description}
	url="/misc/{collection.id}"
	image={collection.kind === 'visual'
		? `/images/art/${collection.id}/${collection.images[0]}`
		: undefined}
/>

<Container class="pb-24">
	<PageHeader
		title={collection.title}
		lead={collection.description}
		back={{ href: '/misc', label: 'Misc' }}
	/>

	{#if collection.kind === 'music'}
		<TrackList {collection} />
	{:else}
		<Gallery
			title={collection.title}
			images={collection.images.map((file) => getArtImage(collection.id, file))}
		/>
	{/if}
</Container>
