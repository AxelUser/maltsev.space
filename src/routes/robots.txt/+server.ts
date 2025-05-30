import { config } from '$lib/config';

export const prerender = true;

export async function GET() {
	const baseUrl = config.websiteUrl.replace(/\/$/, '');

	const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

Disallow: /api/
`;

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=86400'
		}
	});
}
