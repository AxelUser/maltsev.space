import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { qrcode } from 'vite-plugin-qrcode';
import { postReview } from './src/lib/plugins/vite-post-review.js';

export default defineConfig({
	plugins: [tailwindcss(), enhancedImages(), sveltekit(), qrcode(), postReview()]
});
