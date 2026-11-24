/** Shape of `/__post-review/<slug>` (see `src/lib/plugins/vite-post-review.js`). */
export type ReviewStatus = 'open' | 'done' | 'discarded';
export type ReviewSeverity = 'must' | 'should' | 'consider' | 'keep';

export interface ReviewAnchor {
	/** Exact markdown source text from the post. */
	quote: string;
	/** Id of the section heading; used when the quote can't be found in the rendered page. */
	heading?: string;
}

export interface ReviewComment {
	id: string;
	reviewer: string;
	handle: string;
	anchor: ReviewAnchor;
	severity: ReviewSeverity;
	score?: number;
	check?: string;
	replyTo?: string;
	status: ReviewStatus;
	/** The quote is no longer in `index.svx`: the author edited the text after the review. */
	outdated: boolean;
	quoteHtml: string;
	bodyHtml: string;
}

export interface ReviewData {
	reviewers: { reviewer: string; handle: string; created?: string }[];
	comments: ReviewComment[];
}

export interface ReviewThread {
	key: string;
	top: ReviewComment;
	replies: ReviewComment[];
}

export const SEVERITY: Record<ReviewSeverity, { label: string; color: string }> = {
	must: { label: 'Must fix', color: 'var(--color-livery-1)' },
	should: { label: 'Should fix', color: 'var(--color-livery-2)' },
	consider: { label: 'Consider', color: 'var(--color-livery-4)' },
	keep: { label: 'Keep', color: 'var(--color-line-2)' }
};

export const isResolved = (c: ReviewComment) => c.status !== 'open';
export const threadResolved = (t: ReviewThread) => [t.top, ...t.replies].every(isResolved);
