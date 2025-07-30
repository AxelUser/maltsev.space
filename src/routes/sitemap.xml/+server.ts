import { config } from '$lib/config';
import { getPosts } from '$lib/posts';
import { getAllCollections } from '$lib/art';
import { getLastModified } from '$lib/server/git';

export const prerender = true;

export async function GET() {
	const posts = getPosts();
	const collections = getAllCollections();
	const baseUrl = config.websiteUrl.replace(/\/$/, '');

	const staticPages = [
		{ path: '', lastmod: getLastModified('src/routes/+page.svelte') },
		{ path: '/about', lastmod: getLastModified('src/routes/about/+page.svelte') },
		{ path: '/blog', lastmod: getLastModified('src/routes/blog/+page.svelte') },
		{ path: '/art', lastmod: getLastModified('src/routes/art/+page.svelte') }
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${staticPages
		.map(
			(page) => `
	<url>
		<loc>${baseUrl}${page.path}</loc>
		<lastmod>${page.lastmod}</lastmod>
	</url>`
		)
		.join('')}
	${posts
		.map(
			(post) => `
	<url>
		<loc>${baseUrl}/blog/${post.slug}</loc>
		<lastmod>${getLastModified(`src/posts/${post.slug}/index.md`)}</lastmod>
	</url>`
		)
		.join('')}
	${collections
		.map(
			(collection) => `
	<url>
		<loc>${baseUrl}/art/${collection.id}</loc>
		<lastmod>${getLastModified('src/lib/art.ts')}</lastmod>
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
