import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash';
import type { PageServerLoad } from './$types';
import sharp from 'sharp';

async function generateThumbhash(slug: string): Promise<string | undefined> {
	try {
		const { data, info } = await sharp(`src/posts/${slug}/hero.jpg`)
			.resize(100, 100, { fit: 'inside' })
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

export const load: PageServerLoad = async ({ params }) => {
	return {
		placeholderUrl: await generateThumbhash(params.slug)
	};
};
