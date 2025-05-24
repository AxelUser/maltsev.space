import { getAllCollections } from '$lib/art.js';

export async function load() {
	const collections = getAllCollections();

	return {
		collections
	};
}
