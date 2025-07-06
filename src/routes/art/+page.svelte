<script lang="ts">
	import type { PageData } from './$types';
	import { ContentCard, PageHeader } from '$lib/components';
	import { config } from '$lib/config';

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Art | {config.websiteTitle}</title>
	<meta
		name="description"
		content="A personal collection of my humble experiments and explorations with AI-generated art."
	/>
</svelte:head>

<div class="art-page">
	<PageHeader
		title="My AI Art Experiments"
		subtitle="Just my experiments with AI art and creativity"
	/>

	<section class="art-collections">
		<div class="collections-grid">
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

<style>
	@import 'open-props/media';

	.art-page {
		padding-bottom: var(--gap-large);
		display: flex;
		flex-direction: column;
	}

	.art-collections {
		margin-bottom: var(--gap-large);
	}

	.collections-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--gap);
	}

	@media (--lg-n-above) {
		.collections-grid {
			grid-template-columns: 1fr;
			gap: var(--gap-large);
		}
	}

	@media (--sm-n-below) {
		.collections-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
