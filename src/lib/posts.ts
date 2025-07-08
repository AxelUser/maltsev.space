import type { PostPreview } from './types';
import { raise } from './utils';

function getPosts(
	top: number | null = null,
	status: 'draft' | 'published' | 'all' = 'published',
	slugs: string[] | null = null
): PostPreview[] {
	const paths = import.meta.glob('/src/posts/*/*.md', { eager: true });

	const posts = Object.entries(paths)
		.map(([path, post]) => {
			const slug = path.replace('/index.md', '').split('/').pop()!;
			const metadata = post.metadata;

			return {
				slug,
				date: metadata.date ?? raise(`Date is missing in post ${slug}`),
				title: metadata.title ?? raise(`Title is missing in post ${slug}`),
				preview: metadata.preview ?? raise(`Preview is missing in post ${slug}`),
				tags: metadata.tags ?? raise(`Tags are missing in post ${slug}`),
				draft: metadata.draft ?? false,
				series: metadata.series
			} as PostPreview;
		})
		.filter((post) => {
			if (status === 'all') return true;
			return post.draft === (status === 'draft');
		})
		.filter((post) => {
			if (slugs === null) return true;
			return slugs.includes(post.slug);
		});

	const sortedPosts = posts.sort((a, b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		return dateB.getTime() - dateA.getTime();
	});

	return top ? sortedPosts.slice(0, top) : sortedPosts;
}

function getSeries(series: string): PostPreview[] {
	if (!series) return [];
	const posts = getPosts();
	return posts
		.filter((post) => post.series && post.series === series)
		.sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateA.getTime() - dateB.getTime();
		});
}

export { getPosts, getSeries };
