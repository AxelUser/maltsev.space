/** @returns {import('mdsvex').Bundle} */
export function contents() {
	return {
		name: 'contents',
		module: '$lib/components/markdown',
		directives: {
			contents: {
				parse(node, ctx) {
					if (node.type !== 'directive_leaf') {
						ctx.warn('not_a_leaf', 'write ::contents on a line of its own', node);
					}
				}
			}
		}
	};
}
