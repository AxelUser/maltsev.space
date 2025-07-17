import sharp from 'sharp';
import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash';
import fs from 'fs';
import path from 'path';

export async function generatePostHeroThumbhash(
	slug: string,
	size: number
): Promise<string | undefined> {
	try {
		const { data, info } = await sharp(`static/images/posts/${slug}/hero.jpg`)
			.resize(size, size, { fit: 'inside' })
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true });

		const thumbhash = rgbaToThumbHash(info.width, info.height, data);

		const thumbhashDataURL = thumbHashToDataURL(thumbhash);

		return thumbhashDataURL;
	} catch (err) {
		console.warn(`Could not generate thumbhash for ${slug}:`, err);
		return undefined;
	}
}

export function getOGImagePath(slug: string): string | undefined {
	const ogImagePath = `/images/og/${slug}.jpg`;
	const staticOgPath = path.join('static', ogImagePath);

	// Check if OG image exists in static folder
	if (fs.existsSync(staticOgPath)) {
		return ogImagePath;
	}

	// Fallback to post hero image
	const postHeroPath = `/images/posts/${slug}/hero.jpg`;
	const staticPostHeroPath = path.join('static', postHeroPath);

	if (fs.existsSync(staticPostHeroPath)) {
		return postHeroPath;
	}

	return undefined;
}

export function getOGImageUrl(slug: string, baseUrl: string): string | undefined {
	const cleanBaseUrl = baseUrl.replace(/\/$/, '');
	const ogImagePath = getOGImagePath(slug);
	return ogImagePath ? `${cleanBaseUrl}${ogImagePath}` : undefined;
}
