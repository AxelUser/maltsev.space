<script lang="ts">
	import type { MusicCollection } from '#lib/content/index.ts';
	import SoundCloudPlayer from './soundcloud-player.svelte';

	const { collection }: { collection: MusicCollection } = $props();
</script>

<ol class="m-0 grid list-none gap-3.5 p-0">
	{#each collection.tracks as track, i (track.url)}
		<li class="grid items-center gap-3 md:grid-cols-[32px_1fr]">
			<span class="eyebrow">{String(i + 1).padStart(2, '0')}</span>
			<SoundCloudPlayer {track} />
		</li>
	{/each}
</ol>
<p class="eyebrow mt-5">
	<a href={collection.profile} target="_blank" rel="noopener noreferrer" class="hover:text-link">
		All tracks on SoundCloud ↗
	</a>
</p>
