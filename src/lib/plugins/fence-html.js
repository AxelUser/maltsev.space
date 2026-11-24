import { fence_meta } from 'mdsvex/compile';

/**
 * Creates an mdsvex bundle that replaces every fence of one language with HTML that `render` builds
 * at build time, so the browser downloads no renderer. The bundle wraps each fence in a directive of
 * the same name, and `fence-html.svelte` prints that directive's `html` arg. The bundle also claims
 * the language, so the highlighter skips these fences.
 *
 * @param {string} name Plugin name, used in errors.
 * @param {string} lang Fence language, which is also the directive name.
 * @param {(code: string, meta: Record<string, string>, ctx: { filename?: string, id: (base: string) => string }) => string | Promise<string>} render
 *   Called when the fence closes. If it returns a promise, the bundle's `document` hook awaits it,
 *   so call `ctx.id` before the first await.
 * @returns {import('mdsvex').Bundle}
 */
export function fenceHtml(name, lang, render) {
	return {
		name,
		module: '$lib/components/markdown',
		directives: { [lang]: { text: () => '' } },
		fences: [lang],
		parse: {
			code_fence: {
				parse(node, ctx) {
					if (fence_meta(node.info).lang !== lang) return;
					const wrapper = node.wrap_from('directive_container', { name: lang, args: {} });
					wrapper.close();
					return () => {
						const where = `${ctx.filename ?? 'unknown file'}:${node.position?.start.line ?? '?'}`;
						/** @param {unknown} error */
						const located = (error) =>
							new Error(`[${name}] ${where}: ${/** @type {Error} */ (error).message}`, {
								cause: error
							});
						/** @type {string | Promise<string>} */
						let html;
						try {
							html = render(node.text_content, parseMeta(node.info), ctx);
						} catch (error) {
							throw located(error);
						}
						if (typeof html === 'string') {
							wrapper.attrs.args = { html };
							return;
						}
						// ctx.defer accepts only the fence, not its wrapper, so the document hook below
						// awaits async renders. Each one settles to a result here, because a promise that
						// rejected before the hook awaits it would be an unhandled rejection.
						const result = html.then(
							(value) => ({ html: value }),
							(error) => ({ error: located(error) })
						);
						(ctx.scratch.pending ??= []).push({ wrapper, result });
					};
				}
			},
			async document(_root, ctx) {
				/** @type {{ wrapper: { attrs: Record<string, unknown> }, result: Promise<{ html: string } | { error: Error }> }[]} */
				const pending = ctx.scratch.pending ?? [];
				ctx.scratch.pending = [];
				for (const { wrapper, result } of pending) {
					const settled = await result;
					if ('error' in settled) throw settled.error;
					wrapper.attrs.args = { html: settled.html };
				}
			}
		}
	};
}

/**
 * Parses `key="value"` / `key='value'` pairs from a fence info string.
 * @param {string | null | undefined} info
 * @returns {Record<string, string>}
 */
export function parseMeta(info) {
	/** @type {Record<string, string>} */
	const result = {};
	for (const match of (info ?? '').matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)')/g)) {
		result[match[1]] = match[2] ?? match[3];
	}
	return result;
}

/** @param {string} value */
export function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
