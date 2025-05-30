import { getPosts } from '$lib/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const posts = getPosts();
	return { posts };
};
