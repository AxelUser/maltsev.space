import { getCollection } from '$lib/art.js';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const collection = getCollection(params.collectionId);

	if (!collection) {
		throw error(404, 'Collection not found');
	}

	return {
		collection
	};
};
