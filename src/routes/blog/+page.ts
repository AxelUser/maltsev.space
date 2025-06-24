import { getPosts } from '$lib/posts';
import type { PageLoad } from './$types';
import { dev } from '$app/environment';

export const load: PageLoad = async () => {
	const posts = getPosts(null, dev ? 'all' : 'published');
	return { posts };
};
