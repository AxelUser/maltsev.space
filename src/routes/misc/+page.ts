import { getAllCollections } from '#lib/content/index.ts';

export function load() {
	return { collections: getAllCollections() };
}
