import { getNeighbours, getPosts, getSeries } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { config } from '$lib/config';

/** Slugs of other notes this post links to (front-matter `links`, filled by remark-links-to-references). */
function referencedSlugs(links: string[] | undefined, self: string): string[] {
	if (!links) return [];
	const slugs = links
		.filter((link) => link.includes(config.websiteUrl))
		.map((link) => link.substring(link.indexOf('/blog/') + 6).split('#')[0])
		.filter((slug) => slug.length > 0 && slug !== self);
	return [...new Set(slugs)];
}

export const load: PageLoad = async ({ params, data }) => {
	try {
		const post = await import(`../../../posts/${params.slug}/index.md`);
		const series = getSeries(post.metadata.series);
		const slugs = referencedSlugs(post.metadata.links as string[] | undefined, params.slug);

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
			aiCover: post.metadata.aiCover as boolean | string | undefined,
			coverCaption: post.metadata.coverCaption as string | undefined,
			seriesName: post.metadata.series as string | undefined,
			series,
			neighbours: getNeighbours(params.slug),
			referencedPosts: slugs.length > 0 ? getPosts(null, 'published', slugs) : [],
			placeholderUrl: data.placeholderUrl,
			views: data.views,
			ogImagePath: data.ogImagePath
		};
	} catch (err) {
		console.error(err);
		throw error(404, `Could not find article ${params.slug}`);
	}
};
