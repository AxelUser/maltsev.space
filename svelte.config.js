import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { loadEnv } from 'vite';

// Analytics is optional, but $env/static/* only exports variables that exist. Default the
// PostHog keys to '' when neither the shell nor a .env file sets them, so imports still resolve, just not configured.
const OPTIONAL_ENV = [
	'PUBLIC_POSTHOG_API_KEY',
	'PUBLIC_POSTHOG_HOST',
	'POSTHOG_ANALYTICS_API_KEY',
	'POSTHOG_ANALYTICS_PROJECT_ID'
];
const knownEnv = {
	...loadEnv('development', process.cwd(), ''),
	...loadEnv('production', process.cwd(), '')
};
for (const key of OPTIONAL_ENV) {
	if (!(key in knownEnv)) process.env[key] = '';
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// mdsvex runs as a Vite plugin in vite.config.ts. `.svx` in `extensions` makes Kit compile the
	// Svelte code that mdsvex emits.
	preprocess: [vitePreprocess()],
	// Shiki gives each code block tabindex="0" so keyboard users can scroll it. mdsvex 0.x wrapped
	// that markup in {@html}. mdsvex 1.x emits it as markup, and Svelte warns about it.
	onwarn: (warning, handler) => {
		if (warning.code === 'a11y_no_noninteractive_tabindex' && warning.filename?.endsWith('.svx'))
			return;
		handler(warning);
	},
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			crawl: true,
			handleMissingId: 'fail'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
