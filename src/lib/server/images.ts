import sharp from 'sharp';
import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash';

export async function generatePostHeroThumbhash(
	path: string,
	size: number
): Promise<string | undefined> {
	try {
		const { data, info } = await sharp(path)
			.resize(size, size, { fit: 'inside' })
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true });

		const thumbhash = rgbaToThumbHash(info.width, info.height, data);

		const thumbhashDataURL = thumbHashToDataURL(thumbhash);

		return thumbhashDataURL;
	} catch (err) {
		console.warn(`Could not generate thumbhash for ${path}:`, err);
		return undefined;
	}
}
