import { getContext, setContext } from 'svelte';
import type { PostPreview } from '$lib/types';

// The post page provides the notes it references, so `PostRef` can render them without importing $lib/posts into the client bundle.
const key = Symbol('post-refs');

type Lookup = (slug: string) => PostPreview | undefined;

/**
 * Makes the referenced notes available to `PostRef`. Pass a getter to preserve reactivity.
 */
export function setPostRefs(posts: () => PostPreview[]): void {
	const lookup: Lookup = (slug) => posts().find((post) => post.slug === slug);
	setContext(key, lookup);
}

export function usePostRefs(): Lookup {
	return getContext<Lookup | undefined>(key) ?? (() => undefined);
}
