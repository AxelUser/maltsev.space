/**
 * Finds the other notes a post references, for its "Notes linked from this one" cards. Both forms
 * count:
 * - a markdown link to `/blog/<slug>`, absolute (`https://maltsev.space/blog/…`) or relative;
 * - a `<PostRef slug="<slug>">` card.
 */
import { basename, dirname } from 'node:path';

/** @param {string} site */
function noteLinkPattern(site) {
	const escaped = site.replace(/\/$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return new RegExp(`^(?:${escaped})?(/blog/([^/?#]+).*)$`);
}

/**
 * Makes absolute note links relative. The links then stay in the app, and the prerender crawler
 * checks them, `#hash` included. Pass it as mdsvex's `rewrite` option.
 * @param {{ site: string }} options
 * @returns {import('mdsvex').MdsvexOptions['rewrite']}
 */
export function rewriteNoteLinks({ site }) {
	const noteLink = noteLinkPattern(site);
	return (url, { type }) => (type === 'link' ? url.match(noteLink)?.[1] : undefined);
}

/**
 * Adds each referenced slug to `plugin_data.references.refs`, in document order. A slug can repeat.
 * The post's own slug, its folder in `src/posts/<slug>/index.svx`, is skipped, so a link to one of
 * its own headings by full path doesn't count.
 * @param {{ site: string }} options
 * @returns {NonNullable<import('mdsvex').MdsvexOptions['parse_plugins']>[number]}
 */
export function postReferences({ site }) {
	const noteLink = noteLinkPattern(site);

	/**
	 * @param {string | undefined} slug
	 * @param {{ filename?: string, add: (key: string, value: unknown) => void }} ctx
	 */
	const collect = (slug, ctx) => {
		const self = ctx.filename ? basename(dirname(ctx.filename)) : undefined;
		if (slug && slug !== self) ctx.add('refs', slug);
	};

	return {
		name: 'references',
		link: {
			parse(node, ctx) {
				return () => collect(node.href?.match(noteLink)?.[2], ctx);
			}
		},
		html: {
			parse(node, ctx) {
				return () => {
					if (node.attrs.tag === 'PostRef') collect(node.attrs.attributes?.slug, ctx);
				};
			}
		}
	};
}
