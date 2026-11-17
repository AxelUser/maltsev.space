import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/posts';

// Server load, not +page.ts: $lib/posts imports every post and must stay out of the client bundle.
export const load: PageServerLoad = async () => {
	const posts = getPosts();
	return { latest: posts.slice(0, 4), total: posts.length };
};
