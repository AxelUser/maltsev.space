import { getPosts } from '#lib/posts.ts';

export const prerender = true;

export function GET() {
	return Response.json(getPosts(3));
}
