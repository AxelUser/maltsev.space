import { renderMermaidSVG } from 'zombie-mermaid';
import { escapeHtml, fenceHtml } from './fence-html.js';

/**
 * An mdsvex bundle that renders ```mermaid fences to inline SVG at build time with
 * zombie-mermaid.
 *
 * Each fence becomes a <figure class="zm-diagram"> that holds the SVG, so the
 * browser downloads no diagram library.
 *
 * Colours are NOT baked in: the SVG is rendered with `styleAttribute: false`,
 * so it reads its theme from CSS custom properties (--bg, --fg, --line, ...)
 * that src/zombie-mermaid.css maps onto the site's light-dark() tokens. That
 * is what makes diagrams follow the day/night switch without re-rendering.
 *
 * Node highlighting is semantic: tag nodes in Mermaid (`class A input` or
 * `A:::danger`) and style the class in CSS, instead of `style A fill:#hex`.
 *
 * Fence meta (all optional):
 *   ```mermaid title="Accessible name" caption="Visible caption"
 */

/** @type {import('zombie-mermaid').RenderOptions} */
const DEFAULT_RENDER_OPTIONS = {
	transparent: true,
	// Theme vars come from the site stylesheet, not an inline style attribute.
	styleAttribute: false,
	font: 'IBM Plex Sans',
	fontSizes: { nodeLabel: 14, edgeLabel: 12, groupHeader: 13 },
	// Inline `style X fill:#...` must not fight the site palette.
	honorThemeVariables: false,
	interactivity: 'static'
};

/**
 * @typedef {object} Options
 * @property {string} [className] Class on the wrapping <figure>.
 * @property {import('zombie-mermaid').RenderOptions} [render] Merged over the defaults.
 */

/**
 * @param {Options} [options]
 * @returns {import('mdsvex').Bundle}
 */
export function zombieMermaid(options = {}) {
	const { className = 'zm-diagram', render = {} } = options;
	const renderOptions = { ...DEFAULT_RENDER_OPTIONS, ...render };

	return fenceHtml('zombie-mermaid', 'mermaid', (code, meta, ctx) => {
		// ctx.id returns an id that no other element in the document has, heading ids included.
		const id = ctx.id('zm');
		const svg = renderMermaidSVG(code, { ...renderOptions, title: meta.title });
		const caption = meta.caption ? `<figcaption>${escapeHtml(meta.caption)}</figcaption>` : '';
		return `<figure id="${id}" class="${className}">${scopeStyles(prefixIds(svg, id), id)}${caption}</figure>`;
	});
}

/**
 * Node ids (`id="A"`) and the title id are only unique within one render, so
 * two diagrams on a page would collide. Namespace every id and its references.
 * @param {string} svg
 * @param {string} prefix
 */
function prefixIds(svg, prefix) {
	return svg
		.replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`)
		.replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
		.replace(/\bhref="#([^"]+)"/g, `href="#${prefix}-$1"`)
		.replace(
			/\baria-(labelledby|describedby)="([^"]+)"/g,
			(_, attr, ids) =>
				`aria-${attr}="${ids
					.split(/\s+/)
					.map((/** @type {string} */ ref) => `${prefix}-${ref}`)
					.join(' ')}"`
		);
}

/**
 * The renderer's <style> uses bare `svg { }` / `text { }` selectors, which leak
 * to every SVG once inlined into HTML, and imports the font from Google Fonts
 * (the site self-hosts it). Drop that import and nest the rules under the
 * figure's id; @keyframes cannot be nested, so they stay top-level.
 * @param {string} svg
 * @param {string} id
 */
function scopeStyles(svg, id) {
	return svg.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (_, attrs, css) => {
		const withoutImports = css.replace(/@import\s+url\([^)]*\)\s*;?/g, '');
		const { keyframes, rest } = extractKeyframes(withoutImports);
		return `<style${attrs}>#${id}{${rest}}${keyframes}</style>`;
	});
}

/** @param {string} css */
function extractKeyframes(css) {
	let keyframes = '';
	let rest = '';
	let cursor = 0;
	const pattern = /@(?:-webkit-)?keyframes\b[^{]*\{/g;
	for (let match; (match = pattern.exec(css)); ) {
		let depth = 1;
		let end = pattern.lastIndex;
		while (end < css.length && depth > 0) {
			if (css[end] === '{') depth++;
			else if (css[end] === '}') depth--;
			end++;
		}
		rest += css.slice(cursor, match.index);
		keyframes += css.slice(match.index, end);
		cursor = pattern.lastIndex = end;
	}
	return { keyframes, rest: rest + css.slice(cursor) };
}
