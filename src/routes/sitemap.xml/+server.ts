import { config } from '$lib/config';
import { getPosts } from '$lib/posts';

export const prerender = true;

export async function GET() {
	const posts = getPosts();
	const baseUrl = config.websiteUrl.replace(/\/$/, '');

	const staticPages = ['', '/about', '/blog', '/art'];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${staticPages
		.map(
			(page) => `
	<url>
		<loc>${baseUrl}${page}</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
	</url>`
		)
		.join('')}
	${posts
		.map(
			(post) => `
	<url>
		<loc>${baseUrl}/blog/${post.slug}</loc>
		<lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
	</url>`
		)
		.join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
