import { getSeries } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
	try {
		const post = await import(`../../../posts/${params.slug}/index.md`);
		const series = getSeries(post.metadata.series);
		return {
			content: post.default,
			title: post.metadata.title as string,
			date: post.metadata.date as string,
			heroUrl: post.metadata?.hero as string | undefined,
			preview: post.metadata?.preview as string,
			keywords: post.metadata?.keywords as string[] | undefined,
			tags: post.metadata?.tags as string[] | undefined,
			draft: !!post.metadata?.draft,
			slug: params.slug,
			series,
			placeholderUrl: data.placeholderUrl
		};
	} catch (err) {
		console.error(err);
		throw error(404, `Could not find ${params.slug}`);
	}
};
