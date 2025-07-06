import { getPosts } from '$lib/posts';
import { generatePostHeroThumbhash } from '$lib/server/images';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';

export const load: PageServerLoad = async () => {
	const posts = getPosts(null, dev ? 'all' : 'published');
	const postsWithPlaceholders = await Promise.all(
		posts.map(async (post) => {
			post.placeholder = await generatePostHeroThumbhash(`src/posts/${post.slug}/hero.jpg`, 100);
			return post;
		})
	);
	return {
		posts: postsWithPlaceholders
	};
};
