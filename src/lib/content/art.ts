interface CollectionBase {
	id: string;
	title: string;
	description: string;
}

export interface Track {
	title: string;
	url: string;
}

export interface MusicCollection extends CollectionBase {
	kind: 'music';
	profile: string;
	tracks: Track[];
}

export interface VisualCollection extends CollectionBase {
	kind: 'visual';
	/** File names inside `static/images/art/<id>/`; the first one is the cover. */
	images: string[];
}

export type ArtCollection = MusicCollection | VisualCollection;

/** Each entry gets a section on /art and its own page at /art/<id>. */
const collections: ArtCollection[] = [
	{
		id: 'music',
		kind: 'music',
		title: 'Music',
		description: 'Tracks I write and produce in my spare time.',
		profile: 'https://soundcloud.com/mlcv',
		tracks: [
			{ title: 'Bravery Found Within', url: 'https://soundcloud.com/mlcv/bravery-found-within' }
		]
	},
	{
		id: 'busya',
		kind: 'visual',
		title: 'Busya',
		description:
			'Images capturing the adorable essence of my beloved Japanese Chin pup named Busya, crafted with affection using StableDiffusion technology.',
		images: [
			'peter-the-great.png',
			'mantle-01.png',
			'spagetti-01.png',
			'jar-of-pickles-04.png',
			'jar-of-pickles-02.png',
			'jar-of-pickles-01.png',
			'anthropomorphic-vintage-dark-05.jpg',
			'anthropomorphic-vintage-dark-03.jpg',
			'anthropomorphic-vintage-dark-04.jpg',
			'anthropomorphic-vintage-dark-02.jpg',
			'anthropomorphic-vintage-03.jpg',
			'anthropomorphic-vintage-dark-01.jpg',
			'anthropomorphic-vintage-02.jpg',
			'anthropomorphic-cute-02.jpg',
			'anthropomorphic-vintage-01.jpg',
			'anthropomorphic-anime-01.jpg'
		]
	}
];

export const collectionKinds = {
	music: { label: 'Music', color: 'var(--color-livery-4)' },
	visual: { label: 'Visual', color: 'var(--color-livery-1)' }
} satisfies Record<ArtCollection['kind'], { label: string; color: string }>;

export function getCollection(collectionId: string): ArtCollection | null {
	return collections.find((c) => c.id === collectionId) ?? null;
}

export function getAllCollections(): ArtCollection[] {
	return collections;
}

export function collectionSize(collection: ArtCollection): string {
	const [n, noun] =
		collection.kind === 'music'
			? [collection.tracks.length, 'track']
			: [collection.images.length, 'image'];
	return `${n} ${noun}${n === 1 ? '' : 's'}`;
}
