<script lang="ts">
	import type { Track } from '#lib/content/index.ts';

	const { track }: { track: Track } = $props();

	const src = $derived(
		'https://w.soundcloud.com/player/?' +
			new URLSearchParams({
				url: track.url,
				color: '#e4572e',
				auto_play: 'false',
				hide_related: 'true',
				show_comments: 'false',
				show_user: 'true',
				show_reposts: 'false',
				show_teaser: 'false',
				visual: 'false'
			})
	);
</script>

<iframe
	title="{track.title} on SoundCloud"
	{src}
	loading="lazy"
	allow="autoplay"
	class="block h-[166px] w-full border-0 bg-surface"
></iframe>
