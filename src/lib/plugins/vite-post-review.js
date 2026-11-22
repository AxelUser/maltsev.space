/**
 * Dev-only API for the review overlay on post pages (see `$lib/components/dev/review`).
 *
 * Reads `src/posts/<slug>/review.*.json` (written by the `redditor-audit` skill, gitignored), renders
 * the markdown in each comment to HTML with KaTeX and shiki, and saves status changes back to the file.
 *
 * GET  /__post-review/<slug>  → { reviewers, comments } or 404 when the post has no review files.
 *      A comment is `outdated` when its quote is no longer in `index.md`, i.e. the author edited the text.
 * POST /__post-review/<slug>  { reviewer, id, status } → updates that comment's status
 *
 * `apply: 'serve'`, so nothing of this exists in a build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';
import katex from 'katex';
import { createHighlighter } from 'shiki';

const ROUTE = '/__post-review/';
const FILE = /^review\.([a-z-]+)\.json$/;
const SLUG = /^[\w-]+$/;
const STATUSES = ['open', 'done', 'discarded'];

/** @typedef {{ quote: string, heading?: string }} Anchor */
/** @typedef {{ id: string, anchor: Anchor, severity: string, score?: number, body: string, check?: string, replyTo?: string, status?: string }} ReviewComment */
/** @typedef {{ reviewer: string, handle: string, post: string, created?: string, comments: ReviewComment[] }} ReviewFile */

/**
 * Text with markdown markers, link targets, curly quotes and extra whitespace removed, so a quote still
 * matches after formatting-only edits. Keep in sync with `normalize` in `$lib/components/dev/review/anchors.ts`.
 * @param {string} text
 */
const normalize = (text) =>
	text
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_`~]/g, '')
		.replace(/[‘’]/g, "'")
		.replace(/[“”]/g, '"')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase();

/** `$…$` and `$$…$$` as KaTeX. Escaped `\$` stays a dollar sign. */
const math = {
	extensions: [
		{
			name: 'mathBlock',
			level: /** @type {const} */ ('block'),
			start: (/** @type {string} */ src) => src.indexOf('$$'),
			tokenizer(/** @type {string} */ src) {
				const m = /^\$\$([\s\S]+?)\$\$(?:\n|$)/.exec(src);
				if (m) return { type: 'mathBlock', raw: m[0], text: m[1].trim() };
			},
			renderer: (/** @type {{ text: string }} */ t) =>
				katex.renderToString(t.text, { displayMode: true, throwOnError: false })
		},
		{
			name: 'mathInline',
			level: /** @type {const} */ ('inline'),
			start: (/** @type {string} */ src) => src.search(/(?<!\\)\$/),
			tokenizer(/** @type {string} */ src) {
				const m = /^\$\$([\s\S]+?)\$\$|^\$((?:\\\$|[^$\n])+?)\$/.exec(src);
				if (m)
					return { type: 'mathInline', raw: m[0], text: (m[1] ?? m[2]).trim(), display: !!m[1] };
			},
			renderer: (/** @type {{ text: string, display: boolean }} */ t) =>
				katex.renderToString(t.text, { displayMode: t.display, throwOnError: false })
		}
	]
};

/** @param {string} postsDir */
export function postReview(postsDir = 'src/posts') {
	const root = path.resolve(postsDir);
	/** @type {Marked | undefined} */
	let marked;

	async function renderer() {
		if (marked) return marked;
		const highlighter = await createHighlighter({
			themes: ['github-light', 'github-dark'],
			langs: ['csharp', 'kotlin', 'javascript', 'typescript', 'json', 'diff', 'python', 'c', 'cpp']
		});
		const langs = highlighter.getLoadedLanguages();
		marked = new Marked(math, {
			renderer: {
				code({ text, lang }) {
					const known = lang && langs.includes(lang) ? lang : 'text';
					return highlighter.codeToHtml(text, {
						lang: known,
						themes: { light: 'github-light', dark: 'github-dark' }
					});
				}
			}
		});
		return marked;
	}

	/** @param {string} slug */
	function reviewFiles(slug) {
		if (!SLUG.test(slug)) return undefined;
		const dir = path.join(root, slug);
		if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return undefined;
		return fs
			.readdirSync(dir)
			.filter((f) => FILE.test(f))
			.map((f) => path.join(dir, f));
	}

	/** @param {string} file @returns {ReviewFile} */
	const readReview = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

	/** @param {string} slug */
	async function load(slug) {
		const files = reviewFiles(slug);
		if (!files?.length) return undefined;
		const md = await renderer();
		const postFile = path.join(root, slug, 'index.md');
		const source = fs.existsSync(postFile) ? normalize(fs.readFileSync(postFile, 'utf8')) : '';
		const reviewers = [];
		const comments = [];
		for (const file of files) {
			const review = readReview(file);
			reviewers.push({ reviewer: review.reviewer, handle: review.handle, created: review.created });
			for (const c of review.comments) {
				comments.push({
					...c,
					reviewer: review.reviewer,
					handle: review.handle,
					status: c.status ?? 'open',
					outdated: !source.includes(normalize(c.anchor.quote)),
					quoteHtml: md.parseInline(c.anchor.quote),
					bodyHtml: md.parse(c.body)
				});
			}
		}
		return { reviewers, comments };
	}

	/** @param {string} slug @param {{ reviewer: string, id: string, status: string }} change */
	function setStatus(slug, { reviewer, id, status }) {
		if (!STATUSES.includes(status)) return false;
		const file = reviewFiles(slug)?.find((f) => path.basename(f) === `review.${reviewer}.json`);
		if (!file) return false;
		const review = readReview(file);
		const comment = review.comments.find((c) => c.id === id);
		if (!comment) return false;
		comment.status = status;
		fs.writeFileSync(file, JSON.stringify(review, null, '\t') + '\n');
		return true;
	}

	/** @param {import('node:http').IncomingMessage} req */
	const readBody = (req) =>
		new Promise((resolve, reject) => {
			let data = '';
			req.on('data', (chunk) => (data += chunk));
			req.on('end', () => resolve(data));
			req.on('error', reject);
		});

	/** @type {import('vite').Plugin} */
	const plugin = {
		name: 'post-review',
		apply: 'serve',
		configureServer(server) {
			// Vite's own watcher misses these files on Windows, so watch the posts folder directly.
			// Edits to `index.md` reload too, so `outdated` follows the text. The delay lets the post's
			// own HMR update land first, so anchors are looked up in the new page.
			/** @type {Map<string, ReturnType<typeof setTimeout>>} */
			const pending = new Map();
			const watcher = fs.watch(root, { recursive: true }, (_event, name) => {
				if (!name) return;
				const base = path.basename(name);
				if (!FILE.test(base) && base !== 'index.md') return;
				const slug = path.basename(path.dirname(path.join(root, name)));
				if (!reviewFiles(slug)?.length) return;
				clearTimeout(pending.get(slug));
				pending.set(
					slug,
					setTimeout(() => {
						pending.delete(slug);
						server.ws.send({ type: 'custom', event: 'post-review:update', data: { slug } });
					}, 300)
				);
			});
			server.httpServer?.on('close', () => watcher.close());

			server.middlewares.use(async (req, res, next) => {
				if (!req.url?.startsWith(ROUTE)) return next();
				const slug = decodeURIComponent(req.url.slice(ROUTE.length).split('?')[0]);
				const send = (/** @type {number} */ code, /** @type {unknown} */ body) => {
					res.statusCode = code;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(body));
				};
				try {
					if (req.method === 'GET') {
						const data = await load(slug);
						return data ? send(200, data) : send(404, { error: 'no review files' });
					}
					if (req.method === 'POST') {
						const ok = setStatus(slug, JSON.parse(String(await readBody(req))));
						return ok ? send(200, { ok }) : send(400, { error: 'unknown comment or status' });
					}
					send(405, { error: 'method not allowed' });
				} catch (err) {
					server.config.logger.error(`post-review: ${err}`);
					send(500, { error: String(err) });
				}
			});
		}
	};
	return plugin;
}
