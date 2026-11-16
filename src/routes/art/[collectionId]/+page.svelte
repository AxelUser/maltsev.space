<script lang="ts">
	import { SEO } from '$lib/components';
	import { Container } from '$lib/components/layout';
	import { PageHeader } from '$lib/components/ui';
	import { Gallery, TrackList } from '$lib/components/art';
	import { getArtImage } from '$lib/utils/art-image';

	const { data } = $props();

	const collection = $derived(data.collection);
</script>

<SEO
	title={collection.title}
	description={collection.description}
	url="/art/{collection.id}"
	image={collection.kind === 'visual'
		? `/images/art/${collection.id}/${collection.images[0]}`
		: undefined}
/>

<Container class="pb-24">
	<PageHeader
		title={collection.title}
		lead={collection.description}
		back={{ href: '/art', label: 'Art' }}
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
