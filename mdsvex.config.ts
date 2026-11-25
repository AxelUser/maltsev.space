import type { MdsvexOptions } from 'mdsvex';
import { load_math } from 'mdsvex/math';
import { anchors } from '@mdsvex/plugin-anchors';
import { page_data } from '@mdsvex/plugin-page-data';
import { toc } from '@mdsvex/plugin-toc';
import { createHighlighter } from 'shiki';
import { callouts } from './src/lib/plugins/callouts.js';
import { contents } from './src/lib/plugins/contents.js';
import { postReferences, rewriteNoteLinks } from './src/lib/plugins/post-references.js';
import { svgbobTones } from './src/lib/plugins/svgbob-tones.js';
import { zombieMermaid } from './src/lib/plugins/zombie-mermaid.js';
import { config as siteConfig } from './src/lib/config.ts';

const themes = { light: 'github-light', dark: 'github-dark' };

const highlighter = await createHighlighter({
	themes: Object.values(themes),
	langs: ['csharp', 'kotlin', 'javascript', 'typescript', 'json', 'diff']
});
const languages = new Set(highlighter.getLoadedLanguages());

export const mdsvexOptions: MdsvexOptions = {
	extensions: ['.svx'],
	smart_punctuation: true,
	heading_ids: true,
	// Temml renders math to MathML at build time. The post page imports temml/dist/Temml-Local.css.
	// load_math() loads temml before any post compiles. With the lazy default, `math: {}`, post 008
	// compiled before temml had loaded, and every formula in it rendered empty.
	math: await load_math(),
	highlight: (code, { lang, inline }) =>
		inline || !lang || !languages.has(lang) ? null : highlighter.codeToHtml(code, { lang, themes }),
	rewrite: rewriteNoteLinks({ site: siteConfig.websiteUrl }),
	parse_plugins: [postReferences({ site: siteConfig.websiteUrl })],
	plugins: [
		// Renders ```svgbob fences as inline SVG with tone classes, styled by src/svgbob.css.
		svgbobTones(),
		// Renders ```mermaid fences as inline SVG, styled by src/zombie-mermaid.css.
		zombieMermaid(),
		callouts(),
		// Collects the h2 and h3 headings into `plugin_data.toc.headings` for the TOC sidebar and `::contents`.
		toc({ min_depth: 2, max_depth: 3 }),
		// `::contents`, the inline TOC that `autoContents()` in vite.config.ts places before the first h2.
		contents(),
		anchors({ position: 'prepend', attrs: { class: 'header-anchor' } }),
		page_data({ excerpt: false, title: false })
	]
};
