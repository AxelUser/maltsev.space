import type { PostPreview } from './types';
import { raise } from './utils';

function getPosts(
	top: number | null = null,
	status: 'draft' | 'published' | 'all' = 'published',
	slugs: string[] | null = null
): PostPreview[] {
	// `?metadata` imports only the front matter, not each post's component.
	const paths = import.meta.glob<Partial<PostPreview>>('/src/posts/*/index.svx', {
		query: '?metadata',
		import: 'metadata',
		eager: true
	});

	const posts = Object.entries(paths)
		.map(([path, metadata]) => {
			const slug = path.replace('/index.svx', '').split('/').pop()!;

			return {
				slug,
				number: slug.split('-')[0],
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

/** The posts published right before and after `slug`, by date. */
function getNeighbours(slug: string): { older?: PostPreview; newer?: PostPreview } {
	const posts = getPosts();
	const i = posts.findIndex((post) => post.slug === slug);
	if (i < 0) return {};
	return { newer: posts[i - 1], older: posts[i + 1] };
}

export { getPosts, getSeries, getNeighbours };
