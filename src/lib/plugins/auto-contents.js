const POST = /[\\/]src[\\/]posts[\\/][^\\/]+[\\/]index\.svx$/;
const DIRECTIVE = '::contents';

/** @param {string} source */
export function insertContents(source) {
	if (/^::contents\b/m.test(source)) return undefined;

	const lines = source.split('\n');
	let i = 0;

	if (lines[0]?.trim() === '---') {
		const end = lines.findIndex((line, n) => n > 0 && line.trim() === '---');
		if (end === -1) return undefined;
		if (lines.slice(1, end).some((line) => /^toc:\s*false\s*$/.test(line.trim()))) return undefined;
		i = end + 1;
	}

	/** @type {string | undefined} */
	let fence;
	let script = false;
	for (; i < lines.length; i++) {
		const line = lines[i];
		if (script) {
			if (/<\/script>/.test(line)) script = false;
			continue;
		}
		if (fence) {
			if (line.trimStart().startsWith(fence)) fence = undefined;
			continue;
		}
		const open = line.match(/^\s*(`{3,}|~{3,})/);
		if (open) {
			fence = open[1];
			continue;
		}
		if (/^<script[\s>]/.test(line)) {
			script = !/<\/script>/.test(line);
			continue;
		}
		if (/^##\s/.test(line)) {
			lines.splice(i, 0, DIRECTIVE, '');
			return lines.join('\n');
		}
	}
	return undefined;
}

/** @returns {import('vite').Plugin} */
export function autoContents() {
	return {
		name: 'auto-contents',
		// mdsvex compiles `.svx` in its own `pre` transform, so this plugin must also be `pre` and listed before it.
		enforce: 'pre',
		transform(code, id) {
			if (!POST.test(id)) return;
			const out = insertContents(code);
			return out === undefined ? undefined : { code: out, map: null };
		}
	};
}
