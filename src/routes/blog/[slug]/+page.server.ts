import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getNeighbours, getPosts, getSeries } from '#lib/posts.ts';
import { generatePostHeroThumbhash, getOGImagePath } from '#lib/server/images.ts';
import { getArticleViews } from '#lib/server/analytics.ts';
import type { PostIndexEntry, PostPreview } from '#lib/types.ts';

/** Published posts by slug, each with its hero placeholder. */
async function referencedPosts(slugs: string[]): Promise<PostPreview[]> {
	if (slugs.length === 0) return [];
	const posts = getPosts(null, 'published', slugs);
	await Promise.all(
		posts.map(async (post) => {
			post.placeholder = await generatePostHeroThumbhash(post.slug, 100);
		})
	);
	return posts;
}

// Post-list data is built here, not in +page.ts, to keep $lib/posts out of the client bundle.
export const load: PageServerLoad = async ({ params }) => {
	let metadata: Record<string, unknown>;
	let slugs: string[];
	try {
		const post = await import(`../../../posts/${params.slug}/index.svx`);
		metadata = post.metadata;
		// Linked notes, collected by src/lib/plugins/post-references.js.
		slugs = post.plugin_data?.references?.refs ?? [];
	} catch (err) {
		console.error(err);
		throw error(404, `Could not find article ${params.slug}`);
	}

	const [placeholderUrl, views, ogImagePath, refs] = await Promise.all([
		generatePostHeroThumbhash(params.slug, 100),
		getArticleViews(params.slug),
		Promise.resolve(getOGImagePath(params.slug)),
		referencedPosts(slugs)
	]);

	return {
		placeholderUrl,
		views,
		ogImagePath,
		series: getSeries(metadata.series as string),
		neighbours: getNeighbours(params.slug),
		referencedPosts: refs,
		index: getPosts().map(
			({ slug, number, title, date }): PostIndexEntry => ({
				slug,
				number,
				title,
				year: date.slice(0, 4)
			})
		)
	};
};
