import { getPosts } from '$lib/posts';

export const prerender = true;

export async function GET() {
	const posts = getPosts();
	const siteURL = 'https://maltsev.space';
	const title = 'Aleksey Maltsev';
	const description = 'Personal blog by Aleksey Maltsev';

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${title}</title>
<description>${description}</description>
<link>${siteURL}</link>
<atom:link href="${siteURL}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
	.map(
		(post) => `<item>
<title>${post.title}</title>
<link>${siteURL}/blog/${post.slug}</link>
<description>${post.preview}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
<guid isPermaLink="true">${siteURL}/blog/${post.slug}</guid>
</item>`
	)
	.join('')}
</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
