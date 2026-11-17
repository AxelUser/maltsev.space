import type { LiveCoverLoader } from '$lib/components/cover/types';

// Lazy: each cover (and whatever it imports, e.g. three.js) becomes its own chunk.
const liveCovers = import.meta.glob('/src/posts/*/live-cover.svelte') as Record<
	string,
	LiveCoverLoader
>;

/** Loader for `src/posts/<slug>/live-cover.svelte`, if the post has one. */
export const getPostLiveCover = (slug: string): LiveCoverLoader | undefined =>
	liveCovers[`/src/posts/${slug}/live-cover.svelte`];
