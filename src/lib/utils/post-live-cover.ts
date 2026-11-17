import type { LiveCoverLoader } from '$lib/components/cover/types';

// Not eager, so each cover and its dependencies (e.g. three.js) get their own chunk.
const liveCovers = import.meta.glob('/src/posts/*/live-cover.svelte') as Record<
	string,
	LiveCoverLoader
>;

/** Loader for `src/posts/<slug>/live-cover.svelte`, if the post has one. */
export const getPostLiveCover = (slug: string): LiveCoverLoader | undefined =>
	liveCovers[`/src/posts/${slug}/live-cover.svelte`];
