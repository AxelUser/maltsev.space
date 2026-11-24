import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import { qrcode } from 'vite-plugin-qrcode';
import { postReview } from './src/lib/plugins/vite-post-review.js';
import { autoContents } from './src/lib/plugins/auto-contents.js';
import { mdsvexOptions } from './mdsvex.config';

export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(),
		// Before mdsvex: it inserts `::contents` into the post source that mdsvex compiles.
		autoContents(),
		mdsvex(mdsvexOptions),
		sveltekit(),
		qrcode(),
		postReview()
	]
});
