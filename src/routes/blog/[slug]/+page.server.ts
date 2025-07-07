import type { PageServerLoad } from './$types';
import { generatePostHeroThumbhash } from '$lib/server/images';

export const load: PageServerLoad = async ({ params }) => {
	return {
		placeholderUrl: await generatePostHeroThumbhash(params.slug, 100)
	};
};
