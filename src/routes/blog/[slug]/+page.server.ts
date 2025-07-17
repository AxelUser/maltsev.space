import type { PageServerLoad } from './$types';
import { generatePostHeroThumbhash } from '$lib/server/images';
import { getArticleViews } from '$lib/server/analytics';

export const load: PageServerLoad = async ({ params }) => {
	const [placeholderUrl, views] = await Promise.all([
		generatePostHeroThumbhash(params.slug, 100),
		getArticleViews(params.slug)
	]);

	return {
		placeholderUrl,
		views
	};
};
