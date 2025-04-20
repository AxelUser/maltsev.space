import type { PostPreview } from './types';

function getPosts(top: number | null = null): PostPreview[] {
	const paths = import.meta.glob('/src/posts/*/*.md', { eager: true });

	const posts = Object.entries(paths).map(([path, post]) => {
		const slug = path.replace('/index.md', '').split('/').pop();
		const metadata = post.metadata;
		return { ...metadata, slug };
	});

	const sortedPosts = posts.sort((a, b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		return dateB.getTime() - dateA.getTime();
	});

	return top ? sortedPosts.slice(0, top) : sortedPosts;
}

export { getPosts };
