/**
 * An mdsvex bundle for callouts, written as container directives such as `:::info` or
 * `:::question[So what's next?]`. `callout.svelte` renders them.
 *
 * `@mdsvex/plugin-callouts` supports only note, tip, important, warning and caution. The posts also
 * use info, quote and question, so this bundle declares every kind the posts use.
 */

/** @type {Record<string, string>} The default title of each kind, used when the callout has no `[label]`. */
const CALLOUT_TITLES = {
	note: 'Note',
	info: 'Info',
	tip: 'Tip',
	warning: 'Warning',
	question: 'Question',
	quote: 'Quote'
};

/** @returns {import('mdsvex').Bundle} */
export function callouts() {
	/** @type {NonNullable<import('mdsvex').Bundle['directives']>} */
	const directives = {};
	for (const [kind, title] of Object.entries(CALLOUT_TITLES)) {
		directives[kind] = {
			parse(node, ctx) {
				if (node.type !== 'directive_container') {
					ctx.warn(
						'not_container',
						`write ${kind} as :::${kind} on its own line, closed by :::`,
						node
					);
				}
				node.attrs.args = { ...node.attrs.args, kind, title };
			},
			text: (args, label) => (label === '' ? args.title : label)
		};
	}
	return { name: 'callouts', module: '$lib/components/markdown', directives };
}
