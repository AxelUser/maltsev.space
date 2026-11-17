import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { config } from '$lib/config';
import { getNeighbours, getPosts, getSeries } from '$lib/posts';
import { generatePostHeroThumbhash, getOGImagePath } from '$lib/server/images';
import { getArticleViews } from '$lib/server/analytics';

/** Slugs of other notes this post links to (front-matter `links`, filled by remark-links-to-references). */
function referencedSlugs(links: string[] | undefined, self: string): string[] {
	if (!links) return [];
	const slugs = links
		.filter((link) => link.includes(config.websiteUrl))
		.map((link) => link.substring(link.indexOf('/blog/') + 6).split('#')[0])
		.filter((slug) => slug.length > 0 && slug !== self);
	return [...new Set(slugs)];
}

// Post-list data is built here, not in +page.ts, to keep $lib/posts out of the client bundle.
export const load: PageServerLoad = async ({ params }) => {
	let metadata: Record<string, unknown>;
	try {
		({ metadata } = await import(`../../../posts/${params.slug}/index.md`));
	} catch (err) {
		console.error(err);
		throw error(404, `Could not find article ${params.slug}`);
	}

	const [placeholderUrl, views, ogImagePath] = await Promise.all([
		generatePostHeroThumbhash(params.slug, 100),
		getArticleViews(params.slug),
		Promise.resolve(getOGImagePath(params.slug))
	]);
	const slugs = referencedSlugs(metadata.links as string[] | undefined, params.slug);

	return {
		placeholderUrl,
		views,
		ogImagePath,
		series: getSeries(metadata.series as string),
		neighbours: getNeighbours(params.slug),
		referencedPosts: slugs.length > 0 ? getPosts(null, 'published', slugs) : []
	};
};
