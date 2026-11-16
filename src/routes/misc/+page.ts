import { getAllCollections } from '$lib/content';

export function load() {
	return { collections: getAllCollections() };
}
