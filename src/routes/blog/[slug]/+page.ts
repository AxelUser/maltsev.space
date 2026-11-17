import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getPostLiveCover } from '$lib/utils';
import { AI_COVER_KINDS, type AiCoverKind, type LiveCoverLoader } from '$lib/components/cover';

// Don't import $lib/posts: this load also runs in the client and would bundle every post.
// Series, neighbours and referenced posts come from +page.server.ts.

/** Validates front matter `aiCover`, e.g. `[Image, Live]`. */
function aiCover(slug: string, value: unknown): AiCoverKind[] {
	if (value == null) return [];
	const kinds = Array.isArray(value) ? value : [value];
	const unknown = kinds.filter((k) => !AI_COVER_KINDS.includes(k));
	if (unknown.length > 0)
		throw new Error(
			`Post ${slug}: aiCover must list ${AI_COVER_KINDS.join(' / ')}, got ${JSON.stringify(value)}`
		);
	return kinds;
}

/** Loader for the post's `live-cover.svelte`, if front matter sets `liveCover: true`. */
function liveCover(slug: string, enabled: boolean): LiveCoverLoader | undefined {
	if (!enabled) return undefined;
	const loader = getPostLiveCover(slug);
	if (!loader) console.warn(`Post ${slug} sets liveCover, but has no live-cover.svelte`);
	return loader;
}

export const load: PageLoad = async ({ params, data }) => {
	try {
		const post = await import(`../../../posts/${params.slug}/index.md`);
		return {
			content: post.default,
			title: post.metadata.title as string,
			date: post.metadata.date as string,
			preview: post.metadata?.preview as string,
			keywords: post.metadata?.keywords as string[] | undefined,
			tags: (post.metadata?.tags as string[] | undefined) ?? [],
			draft: !!post.metadata?.draft,
			readingTimeMinutes: Math.round(post.metadata?.readingTime?.minutes as number),
			slug: params.slug,
			number: params.slug.split('-')[0],
			aiCover: aiCover(params.slug, post.metadata.aiCover),
			coverCaption: post.metadata.coverCaption as string | undefined,
			liveCover: liveCover(params.slug, !!post.metadata.liveCover),
			seriesName: post.metadata.series as string | undefined,
			...data
		};
	} catch (err) {
		console.error(err);
		throw error(404, `Could not find article ${params.slug}`);
	}
};
