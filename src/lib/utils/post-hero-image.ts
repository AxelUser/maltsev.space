import type { SvelteHTMLElements } from 'svelte/elements';

/** Anything `<enhanced:img src>` accepts: a URL or an imported, pre-processed picture. */
export type EnhancedImageSrc = SvelteHTMLElements['enhanced:img']['src'];

const heroImages = import.meta.glob<{ default: EnhancedImageSrc }>(
	'/static/images/posts/*/hero.{jpg,jpeg,png,webp,avif}',
	{ eager: true, query: { enhanced: true, w: '256;512;768;960;1152;1536' } }
);

export const getPostHeroImage = (slug: string): EnhancedImageSrc | undefined => {
	if (!slug) return undefined;
	const matchingImage = Object.entries(heroImages).find(([path]) => path.includes(slug));
	return matchingImage ? matchingImage[1].default : undefined;
};
