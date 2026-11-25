import adapter from '@sveltejs/adapter-static';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';
import { mdsvexOptions } from './mdsvex.config.ts';
import { autoContents } from './src/lib/plugins/auto-contents.js';
import { postReview } from './src/lib/plugins/vite-post-review.js';

export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(),
		autoContents(),
		mdsvex(mdsvexOptions),
		sveltekit({
			preprocess: [vitePreprocess()],
			extensions: ['.svelte', '.svx'],
			// Shiki gives each code block tabindex="0" so keyboard users can scroll it. mdsvex 1.x emits
			// that markup as-is, and Svelte warns about it.
			onwarn: (warning, handler) => {
				if (
					warning.code === 'a11y_no_noninteractive_tabindex' &&
					warning.filename?.endsWith('.svx')
				)
					return;
				handler(warning);
			},
			adapter: adapter({ fallback: '404.html' }),
			prerender: { crawl: true, handleMissingId: 'fail' }
		}),
		qrcode(),
		postReview()
	]
});
