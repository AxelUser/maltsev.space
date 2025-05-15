import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import postcssCustomMedia from 'postcss-custom-media';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
	plugins: [sveltekit(), qrcode()],
	css: {
		postcss: {
			plugins: [postcssCustomMedia()]
		}
	}
});
