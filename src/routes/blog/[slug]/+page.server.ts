import type { PageServerLoad } from './$types';
import { generatePostHeroThumbhash, getOGImagePath } from '$lib/server/images';
import { getArticleViews } from '$lib/server/analytics';

export const load: PageServerLoad = async ({ params }) => {
	const [placeholderUrl, views, ogImagePath] = await Promise.all([
		generatePostHeroThumbhash(params.slug, 100),
		getArticleViews(params.slug),
		Promise.resolve(getOGImagePath(params.slug))
	]);

	return {
		placeholderUrl,
		views,
		ogImagePath
	};
};
