import type { PageServerLoad } from './$types';
import { generatePostHeroThumbhash } from '$lib/server/images';

export const load: PageServerLoad = async ({ params }) => {
	const heroPath = `src/posts/${params.slug}/hero.jpg`;
	return {
		placeholderUrl: await generatePostHeroThumbhash(heroPath, 100)
	};
};
