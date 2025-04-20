import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../posts/${params.slug}/index.md`);
		return {
			content: post.default,
			title: post.metadata.title as string,
			date: post.metadata.date as string
		};
	} catch (err) {
		console.error(err);
		throw error(404, `Could not find ${params.slug}`);
	}
};
