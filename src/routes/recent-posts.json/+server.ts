import { json } from '@sveltejs/kit';
import { getPosts } from '$lib/posts';

export const prerender = true;

/** Latest three posts, for the error page. */
export function GET() {
	return json(getPosts(3));
}
