import { basename, dirname } from 'node:path';
import { visit } from 'unist-util-visit';

/** `<PostRef slug="…">` cards in markdown, which mdsvex leaves as raw `html` nodes. */
const POST_REF = /<PostRef\b[^>]*?\bslug=["']([^"']+)["']/g;

/**
 * Remark plugin that collects the other notes a post references, into front matter `refs`:
 * slugs in order of first appearance, without duplicates. Both forms count the same:
 * - links to `/blog/<slug>` (absolute links to `site` are rewritten to relative ones, so they
 *   stay in the app and the prerender crawler checks them, `#hash` included);
 * - `<PostRef slug="<slug>">` cards.
 *
 * The post's own slug (its folder, `src/posts/<slug>/index.md`) is left out, so links to its own
 * headings by full path don't list it.
 *
 * @param {{ site: string }} options e.g. `{ site: 'https://maltsev.space' }`
 */
export function remarkLinksToReferences({ site }) {
	const escaped = site.replace(/\/$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const noteLink = new RegExp(`^(?:${escaped})?(/blog/([^/?#]+).*)$`);

	/**
	 * @param {Parameters<typeof visit>[0]} tree
	 * @param {{ filename?: string, data: { fm?: Record<string, unknown> } }} file
	 */
	return (tree, file) => {
		/** @type {Set<string>} */
		const refs = new Set();

		const self = file.filename ? basename(dirname(file.filename)) : undefined;

		visit(tree, ['link', 'html'], (node) => {
			if (node.type === 'link') {
				const link = /** @type {{ url: string }} */ (/** @type {unknown} */ (node));
				const match = link.url.match(noteLink);
				if (!match) return;
				link.url = match[1];
				refs.add(match[2]);
			} else {
				const html = /** @type {{ value: string }} */ (/** @type {unknown} */ (node)).value;
				for (const match of html.matchAll(POST_REF)) refs.add(match[1]);
			}
		});

		if (!file.data.fm) {
			file.data.fm = {};
		}
		if (self) refs.delete(self);
		file.data.fm['refs'] = [...refs];
	};
}
