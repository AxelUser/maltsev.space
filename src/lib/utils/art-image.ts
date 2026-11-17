import type { EnhancedImageSrc } from './post-hero-image';

// srcset standard widths + 2048 for the full-screen lightbox. Glob options must be literals.
const artImages = import.meta.glob<{ default: EnhancedImageSrc }>(
	'/static/images/art/*/*.{jpg,jpeg,png,webp,avif}',
	{ eager: true, query: { enhanced: true, w: '256;512;768;960;1152;1536;2048' } }
);

/**
 * Responsive, pre-processed version of `static/images/art/<collection>/<file>`.
 * Falls back to the plain static URL for files the glob doesn't cover.
 */
export function getArtImage(collectionId: string, file: string): EnhancedImageSrc {
	const path = `/images/art/${collectionId}/${file}`;
	return artImages[`/static${path}`]?.default ?? path;
}
