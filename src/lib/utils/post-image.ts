import type { EnhancedImageSrc } from './post-hero-image';

const postImages = import.meta.glob<{ default: EnhancedImageSrc }>(
	['/static/images/posts/*/*.{jpg,jpeg,png,webp,avif}', '!/static/images/posts/*/hero.*'],
	{ eager: true, query: { enhanced: true, w: '512;768;960;1152;1536' } }
);

/** Resolves a public URL such as `/images/posts/<slug>/diagram.png` to its processed image. */
export function getPostImage(url: string): EnhancedImageSrc {
	const image = postImages[`/static${url}`];
	if (!image)
		throw new Error(`Post image not found: ${url} (expected under /static/images/posts/<slug>/)`);
	return image.default;
}
