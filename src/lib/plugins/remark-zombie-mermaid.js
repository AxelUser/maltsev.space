import { createHash } from 'node:crypto';
import { visit } from 'unist-util-visit';
import { renderMermaidSVG } from 'zombie-mermaid';

/**
 * Build-time Mermaid → inline SVG for mdsvex, via zombie-mermaid.
 *
 * Replaces each ```mermaid fence with a <figure class="zm-diagram"> holding a
 * pre-rendered SVG, so no diagram library ships to the browser.
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
 * @property {(file: { filename?: string, data: { fm?: Record<string, unknown> } }) => boolean} [enabled]
 *   Per-file gate; fences in files where it returns false are left untouched.
 * @property {import('zombie-mermaid').RenderOptions} [render] Merged over the defaults.
 */

/**
 * The bits of an mdast `code` node this plugin reads.
 * @typedef {{ lang?: string | null, meta?: string | null, value: string, position?: { start: { line: number } } }} CodeNode
 */

/** @param {Options} [options] */
export function remarkZombieMermaid(options = {}) {
	const { className = 'zm-diagram', enabled = () => true, render = {} } = options;
	const renderOptions = { ...DEFAULT_RENDER_OPTIONS, ...render };

	/**
	 * @param {Parameters<typeof visit>[0]} tree
	 * @param {any} file
	 */
	return (tree, file) => {
		if (!enabled(file)) return;

		let index = 0;
		visit(tree, 'code', (/** @type {any} */ anyNode, position, /** @type {any} */ parent) => {
			/** @type {CodeNode} */
			const node = anyNode;
			if (node.lang !== 'mermaid' || !parent || position === undefined) return;

			const meta = parseMeta(node.meta);
			const id = `zm-${hash(`${file.filename ?? ''}\0${index++}\0${node.value}`)}`;

			let svg;
			try {
				svg = renderMermaidSVG(node.value, { ...renderOptions, title: meta.title });
			} catch (error) {
				const where = `${file.filename ?? 'unknown file'}:${node.position?.start.line ?? '?'}`;
				throw new Error(`[remark-zombie-mermaid] failed to render diagram at ${where}`, {
					cause: error
				});
			}

			const caption = meta.caption ? `<figcaption>${escapeHtml(meta.caption)}</figcaption>` : '';
			const html = `<figure id="${id}" class="${className}">${scopeStyles(prefixIds(svg, id), id)}${caption}</figure>`;

			// One {@html} expression so Svelte never parses the braces in the SVG's <style>.
			parent.children[position] = { type: 'html', value: `{@html ${JSON.stringify(html)}}` };
		});
	};
}

/** @param {string} value */
function hash(value) {
	return createHash('sha1').update(value).digest('hex').slice(0, 8);
}

/**
 * Parses `key="value"` / `key='value'` pairs from the fence meta string.
 * @param {string | null | undefined} meta
 * @returns {Record<string, string>}
 */
function parseMeta(meta) {
	/** @type {Record<string, string>} */
	const result = {};
	for (const match of (meta ?? '').matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)')/g)) {
		result[match[1]] = match[2] ?? match[3];
	}
	return result;
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

/** @param {string} value */
function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
