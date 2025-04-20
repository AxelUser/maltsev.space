import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import postcssCustomMedia from 'postcss-custom-media';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: {
			plugins: [postcssCustomMedia()]
		}
	}
});
