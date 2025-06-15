import type { PageLoad } from './$types';
import { getPosts } from '$lib/posts';

export const load: PageLoad = async () => {
	const posts = getPosts(2);
	return { posts };
};
