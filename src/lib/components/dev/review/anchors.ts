import type { ReviewAnchor } from './types';

const BLOCKS =
	'p, li, blockquote, pre, tr, table, h2, h3, h4, .katex-display, figcaption, figure, details';
/** Long quotes often span inline markup that renders differently; matching their start is enough. */
const PREFIX = 60;

/** Lowercase text with markdown markers, link targets and extra whitespace removed. Same as in `vite-post-review.js`. */
export function normalize(text: string): string {
	return text
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_`~]/g, '')
		.replace(/[‘’]/g, "'")
		.replace(/[“”]/g, '"')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase();
}

/**
 * The block in `root` that the comment points at: the smallest block containing the quote (or its
 * first characters), else the heading with id `anchor.heading`, else null.
 */
export function findAnchor(root: HTMLElement, anchor: ReviewAnchor): HTMLElement | null {
	const quote = normalize(anchor.quote);
	if (quote) {
		const needles = quote.length > PREFIX ? [quote, quote.slice(0, PREFIX)] : [quote];
		const blocks = [...root.querySelectorAll<HTMLElement>(BLOCKS)].filter(
			(b) => !b.closest('[data-review-overlay]')
		);
		for (const needle of needles) {
			let best: HTMLElement | null = null;
			for (const block of blocks) {
				const text = normalize(block.textContent ?? '');
				if (!text.includes(needle)) continue;
				if (!best || best.contains(block)) best = block;
			}
			if (best) return best;
		}
	}
	if (anchor.heading) {
		const heading = root.querySelector<HTMLElement>(`[id="${CSS.escape(anchor.heading)}"]`);
		if (heading) return heading;
	}
	return null;
}
