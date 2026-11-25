import { getPosts } from '#lib/posts.ts';
import { generatePostHeroThumbhash } from '#lib/server/images.ts';
import type { PageServerLoad } from './$types';
import { dev } from '$app/env';

export const load: PageServerLoad = async () => {
	const posts = getPosts(null, dev ? 'all' : 'published');
	const postsWithPlaceholders = await Promise.all(
		posts.map(async (post) => {
			post.placeholder = await generatePostHeroThumbhash(post.slug, 100);
			return post;
		})
	);
	return {
		posts: postsWithPlaceholders
	};
};
