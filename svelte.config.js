import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import autolinkHeadings from 'rehype-autolink-headings';
import slug from 'rehype-slug';
import remarkToc from 'remark-toc';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeKatexSvelte from 'rehype-katex-svelte';
import remarkMath from 'remark-math';
import { remarkSvgbobTones } from './src/lib/plugins/remark-svgbob-tones.js';
import rehypeCallouts from 'rehype-callouts';
import readingTime from 'mdsvex-reading-time';
import { remarkLinksToReferences } from './src/lib/plugins/remark-links-to-references.js';
import { remarkZombieMermaid } from './src/lib/plugins/remark-zombie-mermaid.js';
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

const lightTheme = 'github-light';
const darkTheme = 'github-dark';

const highlighter = await createHighlighter({
	themes: [lightTheme, darkTheme],
	langs: ['csharp', 'kotlin', 'javascript', 'typescript', 'json', 'diff']
});

/** @type {import('rehype-autolink-headings').Options} */
const autolinkHeadingsOptions = {
	behavior: 'prepend',
	content: {
		type: 'text',
		value: '#'
	},
	properties: {
		className: ['header-anchor'],
		ariaHidden: 'true',
		tabIndex: -1
	}
};

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md', '.svx'],
	remarkPlugins: [
		[remarkToc, { tight: true, maxDepth: 3 }],
		remarkMath,
		// ```svgbob fences → inline SVG with semantic tone classes (see src/svgbob.css).
		remarkSvgbobTones,
		// ```mermaid fences → inline SVG at build time; must run before `highlight`.
		remarkZombieMermaid,
		remarkLinksToReferences,
		readingTime
	],
	rehypePlugins: [
		slug,
		[autolinkHeadings, autolinkHeadingsOptions],
		rehypeKatexSvelte,
		rehypeCallouts
	],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = escapeSvelte(
				highlighter.codeToHtml(code, {
					lang,
					themes: {
						light: lightTheme,
						dark: darkTheme
					}
				})
			);
			return `{@html \`${html}\` }`;
		}
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			crawl: true,
			handleMissingId: 'fail'
		}
	},
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
