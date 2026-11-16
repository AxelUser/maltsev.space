<script lang="ts">
	import { collectionKinds, collectionSize, type ArtCollection } from '$lib/content';
	import { getArtImage } from '$lib/utils/art-image';
	import { Button } from '$lib/components/ui';
	import ImageStrip from './image-strip.svelte';
	import SoundCloudPlayer from './soundcloud-player.svelte';

	interface Props {
		collection: ArtCollection;
		/** 1-based position on the page. */
		position: number;
	}

	const { collection, position }: Props = $props();

	const kind = $derived(collectionKinds[collection.kind]);
	const href = $derived(`/misc/${collection.id}`);
</script>

<section
	class="grid items-center gap-5 border-t border-line py-9 last:border-b md:grid-cols-[1.3fr_1fr] md:gap-12"
	aria-labelledby="bay-{collection.id}"
>
	<div>
		{#if collection.kind === 'music'}
			<SoundCloudPlayer track={collection.tracks[0]} />
		{:else}
			<ImageStrip images={collection.images.map((f) => getArtImage(collection.id, f))} {href} />
		{/if}
	</div>

	<div>
		<div class="mb-2 flex flex-wrap items-center gap-4">
			<span
				class="chevron py-1 pr-3 pl-4 font-mono text-[13px] font-semibold text-on-livery [--cut:8px]"
				style:background={kind.color}
			>
				{String(position).padStart(2, '0')}
			</span>
			<span class="eyebrow">{kind.label} · {collectionSize(collection)}</span>
		</div>
		<h2
			id="bay-{collection.id}"
			class="mt-1.5 mb-2.5 text-[28px] font-semibold font-stretch-[110%] sm:text-[32px]"
		>
			{collection.title}
		</h2>
		<p class="m-0 max-w-[30em] text-ink-2">{collection.description}</p>
		<div class="mt-[22px] flex flex-wrap items-center gap-5">
			<Button {href} variant="ghost">Open collection →</Button>
			{#if collection.kind === 'music'}
				<a
					href={collection.profile}
					target="_blank"
					rel="noopener noreferrer"
					class="eyebrow no-underline hover:text-link"
				>
					SoundCloud ↗
				</a>
			{/if}
		</div>
	</div>
</section>
