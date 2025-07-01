import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import autolinkHeadings from 'rehype-autolink-headings';
import slug from 'rehype-slug';
import remarkToc from 'remark-toc';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeKatexSvelte from 'rehype-katex-svelte';
import remarkMath from 'remark-math';
import remarkSVGBob from 'remark-svgbob';
import rehypeCallouts from 'rehype-callouts';

const lightTheme = 'material-theme-palenight';
const darkTheme = 'github-dark';

const highlighter = await createHighlighter({
	themes: [lightTheme, darkTheme],
	langs: ['csharp', 'kotlin', 'javascript', 'typescript', 'json']
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
	remarkPlugins: [[remarkToc, { tight: true, maxDepth: 3 }], remarkMath, remarkSVGBob],
	rehypePlugins: [
		slug,
		[autolinkHeadings, autolinkHeadingsOptions],
		rehypeKatexSvelte,
		rehypeCallouts
	],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			if (lang === 'mermaid') {
				return `{@html \`<pre class="mermaid">${code}</pre>\`}`;
			}

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
