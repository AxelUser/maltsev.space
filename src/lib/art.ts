export interface ArtCollection {
	id: string;
	title: string;
	description: string;
	cover: string;
	images: string[];
}

const collections: Record<string, ArtCollection> = {
	busya: {
		id: 'busya',
		title: 'Busya',
		description:
			'Images capturing the adorable essence of my beloved Japanese Chin pup named Busya, crafted with affection using StableDiffusion technology.',
		cover: 'peter-the-great.png',
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
};

export function getCollection(collectionId: string): ArtCollection | null {
	return collections[collectionId] || null;
}

export function getAllCollections(): ArtCollection[] {
	return Object.values(collections);
}
