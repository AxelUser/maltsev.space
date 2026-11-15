import type { EnhancedImageSrc } from './post-hero-image';

const artImages = import.meta.glob<{ default: EnhancedImageSrc }>(
	'/static/images/art/*/*.{jpg,jpeg,png,webp,avif}',
	{ eager: true, query: { enhanced: true } }
);

/**
 * Responsive, pre-processed version of `static/images/art/<collection>/<file>`.
 * Falls back to the plain static URL for files the glob doesn't cover.
 */
export function getArtImage(collectionId: string, file: string): EnhancedImageSrc {
	const path = `/images/art/${collectionId}/${file}`;
	return artImages[`/static${path}`]?.default ?? path;
}
