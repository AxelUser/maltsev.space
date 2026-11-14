<script lang="ts">
	import type { PageData } from './$types';
	import { ContentCard, PageHeader } from '$lib/components';

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Art</title>
	<meta
		name="description"
		content="A personal collection of my humble experiments and explorations with AI-generated art."
	/>
</svelte:head>

<div class="flex flex-col pb-12">
	<PageHeader
		title="My AI Art Experiments"
		subtitle="Just my experiments with AI art and creativity"
	/>

	<section class="mb-12">
		<div class="grid grid-cols-1 gap-5 lg:gap-12">
			{#each data.collections as collection}
				<ContentCard
					href="/art/{collection.id}"
					title={collection.title}
					description={collection.description}
					metadata="{collection.images.length} images"
				/>
			{/each}
		</div>
	</section>
</div>
