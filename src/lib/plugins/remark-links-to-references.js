import { visit } from 'unist-util-visit';
/**
 * Remark plugin that extracts all link URLs from markdown content and stores them in file metadata
 */
export function remarkLinksToReferences() {
	return (tree, file) => {
		const urls = [];

		visit(tree, 'link', (node) => {
			urls.push(node.url);
		});

		if (!file.data.fm) {
			file.data.fm = {};
		}
		file.data.fm['links'] = urls;
	};
}
