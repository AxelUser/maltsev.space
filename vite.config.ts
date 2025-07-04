import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import postcssCustomMedia from 'postcss-custom-media';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit(), qrcode()],
	css: {
		postcss: {
			plugins: [postcssCustomMedia()]
		}
	}
});
