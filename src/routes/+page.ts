import type { PageLoad } from './$types';
import { getPosts } from '$lib/posts';

export const load: PageLoad = async () => {
	const posts = getPosts();
	return { latest: posts.slice(0, 4), total: posts.length };
};
