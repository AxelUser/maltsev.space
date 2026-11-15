import { visit } from 'unist-util-visit';
/**
 * Remark plugin that extracts all link URLs from markdown content and stores them in file metadata
 */
export function remarkLinksToReferences() {
	/**
	 * @param {Parameters<typeof visit>[0]} tree
	 * @param {{ data: { fm?: Record<string, unknown> } }} file
	 */
	return (tree, file) => {
		/** @type {string[]} */
		const urls = [];

		visit(tree, 'link', (node) => {
			urls.push(/** @type {{ url: string }} */ (/** @type {unknown} */ (node)).url);
		});

		if (!file.data.fm) {
			file.data.fm = {};
		}
		file.data.fm['links'] = urls;
	};
}
