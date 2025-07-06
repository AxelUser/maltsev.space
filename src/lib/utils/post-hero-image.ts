const heroImages = import.meta.glob('/src/posts/*/hero.{jpg,jpeg,png,webp,avif}', {
	eager: true,
	query: {
		enhanced: true
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as Record<string, { default: any }>;

export const getPostHeroImage = (slug: string) => {
	if (!slug) return null;
	const matchingImage = Object.entries(heroImages).find(([path]) => path.includes(slug));
	return matchingImage ? matchingImage[1].default : null;
};
