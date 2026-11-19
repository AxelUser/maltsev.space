import remarkSvgbob from 'remark-svgbob';
import { visit } from 'unist-util-visit';

/**
 * Build-time svgbob → inline SVG, plus semantic colour ("tones") for cells and text.
 *
 * Wraps `remark-svgbob` (it renders, this post-processes) and replaces it in the
 * mdsvex pipeline. svgbob's own `{tag}` + `# Legend:` colouring only reaches
 * isolated closed shapes, never a cell of a `+---+---+` grid, and its legend
 * bakes hex colours into an inline <style>. Here colours are classes that
 * src/svgbob.css maps onto the site's light-dark() tokens, using the same
 * palette as ArrayView / ByteLanes.
 *
 * svgbob draws on an 8 × 16 px character grid, so an ASCII position maps
 * exactly onto SVG coordinates: char (row, col) is the box
 * x = col·8 … col·8+8, y = row·16 … row·16+16.
 *
 * Fence syntax (everything optional):
 *
 *   ```svgbob alt="Accessible description"
 *                       +---+---+---+
 *   bit array           | 0 | 1 | 0 |
 *                       +---+---+---+
 *
 *   # Tones:
 *   changed  bit array: 1        ← row label: 0-based cell indices
 *   accent   "milk"              ← every cell / text run containing the literal
 *   ```
 *
 * A label rule finds the first line whose text starts with the label and takes
 * the n-th `|…|` cell on it. A literal rule tones the enclosing cell if the
 * match sits inside one, otherwise just the matching text. Tones:
 *   set, changed, ok, bad, muted, accent, strike
 *
 * Always on: a lone `✓` / `✗` is coloured like ArrayView marks, the renderer's
 * inline <style> is dropped (src/svgbob.css styles everything), and so are the
 * marker <defs> when nothing uses them (they repeat the same ids per figure).
 */

const CHAR_W = 8;
const CHAR_H = 16;

/**
 * fill: paints the whole cell behind its borders and text.
 * edge: an inset outline inside the cell's ink border.
 * @type {Record<string, { fill?: boolean, edge?: boolean }>}
 */
const TONES = {
	set: { fill: true },
	changed: { fill: true },
	accent: { fill: true },
	ok: { fill: true, edge: true },
	bad: { edge: true },
	muted: {},
	strike: {}
};

const GLYPH_TONES = { '✓': 'ok', '✗': 'bad' };

/**
 * @typedef {{ top: number, bottom: number, left: number, right: number }} Cell
 *   Border coordinates in characters: rows of the `-` borders, columns of the `|` walls.
 * @typedef {{ row: number, from: number, to: number }} Span  Text columns [from, to) on one row.
 * @typedef {{ tone: string, cells: Cell[], spans: Span[] }} Resolved
 * @typedef {{ x: number, y: number, row: number, from: number, to: number, content: string, classes: Set<string> }} TextEl
 */

export function remarkSvgbobTones() {
	const render = createRenderer();

	/**
	 * @param {any} tree
	 * @param {any} file
	 */
	return async (tree, file) => {
		/** @type {{ node: any, index: number, parent: any }[]} */
		const jobs = [];
		visit(tree, 'code', (/** @type {any} */ node, index, /** @type {any} */ parent) => {
			if (node.lang === 'svgbob' && parent && index !== undefined)
				jobs.push({ node, index, parent });
		});

		for (const { node, index, parent } of jobs) {
			const where = `${file?.filename ?? 'unknown file'}:${node.position?.start.line ?? '?'}`;
			try {
				const { ascii, rules } = splitTones(node.value);
				const svg = await render(ascii);
				const html = decorate(svg, ascii, rules, parseMeta(node.meta));
				// One {@html} expression so Svelte never parses anything inside the SVG.
				parent.children[index] = { type: 'html', value: `{@html ${JSON.stringify(html)}}` };
			} catch (error) {
				throw new Error(`[remark-svgbob-tones] ${where}: ${/** @type {Error} */ (error).message}`, {
					cause: error
				});
			}
		}
	};
}

/** Reuses remark-svgbob's wasm renderer through its own transformer (the renderer isn't exported). */
function createRenderer() {
	const transform = /** @type {(tree: any) => Promise<any>} */ (remarkSvgbob());
	/** @param {string} ascii */
	return async (ascii) => {
		const tree = { type: 'root', children: [{ type: 'code', lang: 'svgbob', value: ascii }] };
		await transform(tree);
		return /** @type {string} */ (tree.children[0].value);
	};
}

/**
 * Splits the fence into the drawing and its `# Tones:` rules.
 * @param {string} value
 */
function splitTones(value) {
	const lines = value.split('\n');
	const header = lines.findIndex((line) => /^#\s*Tones:\s*$/i.test(line.trim()));
	if (header === -1) return { ascii: value, rules: [] };

	const drawing = lines.slice(0, header);
	while (drawing.length && !drawing[drawing.length - 1].trim()) drawing.pop();

	const rules = lines
		.slice(header + 1)
		.map((line) => line.replace(/\s+#.*$/, '').trim())
		.filter(Boolean)
		.map(parseRule);
	return { ascii: drawing.join('\n'), rules };
}

/** @param {string} line */
function parseRule(line) {
	const match = line.match(/^(\w+)\s+(.+)$/);
	if (!match || !(match[1] in TONES)) {
		throw new Error(`bad tone rule "${line}" (tones: ${Object.keys(TONES).join(', ')})`);
	}
	const [, tone, target] = match;

	const literal = target.match(/^"(.+)"$/);
	if (literal) return { tone, literal: literal[1] };

	const labelled = target.match(/^(.+?):((?:\s*\d+)+)$/);
	if (!labelled)
		throw new Error(`tone rule "${line}" needs a "literal" or "row label: cell indices"`);
	return { tone, label: labelled[1].trim(), indices: labelled[2].trim().split(/\s+/).map(Number) };
}

/**
 * @param {ReturnType<typeof parseRule>[]} rules
 * @param {string[][]} grid
 * @returns {Resolved[]}
 */
function resolveRules(rules, grid) {
	const lines = grid.map((row) => row.join(''));

	return rules.map((rule) => {
		/** @type {Resolved} */
		const resolved = { tone: rule.tone, cells: [], spans: [] };

		if ('literal' in rule && rule.literal) {
			const needle = Array.from(rule.literal);
			grid.forEach((row, r) => {
				for (let c = 0; c + needle.length <= row.length; c++) {
					if (!needle.every((ch, i) => row[c + i] === ch)) continue;
					const cell = enclosingCell(grid, r, c);
					if (cell) resolved.cells.push(cell);
					else resolved.spans.push({ row: r, from: c, to: c + needle.length });
				}
			});
			if (!resolved.cells.length && !resolved.spans.length) {
				throw new Error(`tone literal "${rule.literal}" not found in the drawing`);
			}
			// A multi-line cell can match on several of its lines; paint it once.
			const seen = new Set();
			resolved.cells = resolved.cells.filter((cell) => {
				const key = `${cell.top},${cell.left}`;
				return !seen.has(key) && seen.add(key);
			});
			return resolved;
		}

		const { label = '', indices = [] } = /** @type {{ label?: string, indices?: number[] }} */ (
			rule
		);
		const r = lines.findIndex((line) => line.trimStart().startsWith(label));
		if (r === -1) throw new Error(`no line starts with the row label "${label}"`);
		const cells = cellsOnRow(grid, r);
		for (const i of indices) {
			if (!cells[i]) throw new Error(`row "${label}" has ${cells.length} cells, no cell ${i}`);
			resolved.cells.push(cells[i]);
		}
		return resolved;
	});
}

/**
 * The `|…|` cells crossing row `r`, left to right. Gaps between two boxes (`| |`
 * with no `-` border above) are not cells.
 * @param {string[][]} grid
 * @param {number} r
 */
function cellsOnRow(grid, r) {
	/** @type {Cell[]} */
	const cells = [];
	const row = grid[r];
	for (let c = 0; c < row.length; c++) {
		if (row[c] !== '|') continue;
		let end = c + 1;
		while (end < row.length && row[end] !== '|') end++;
		if (end >= row.length) break;
		const cell = end > c + 1 ? enclosingCell(grid, r, c + 1) : null;
		if (cell) cells.push(cell);
		c = end - 1;
	}
	return cells;
}

/**
 * The box around character (r, c): `|` walls on the row, `+` corners and `-`
 * borders above and below. Multi-line cells are fine. Returns null outside a box.
 * @param {string[][]} grid
 * @param {number} r
 * @param {number} c
 * @returns {Cell | null}
 */
function enclosingCell(grid, r, c) {
	const at = (/** @type {number} */ row, /** @type {number} */ col) => grid[row]?.[col] ?? ' ';
	if (at(r, c) === '|') return null;

	let left = c;
	while (left >= 0 && at(r, left) !== '|') left--;
	let right = c;
	while (right < grid[r].length && at(r, right) !== '|') right++;
	if (left < 0 || right >= grid[r].length) return null;

	let top = r;
	while (top > 0 && at(top, left) === '|') top--;
	let bottom = r;
	while (bottom < grid.length - 1 && at(bottom, left) === '|') bottom++;

	const isCorner = (/** @type {number} */ row, /** @type {number} */ col) => at(row, col) === '+';
	if (
		![
			isCorner(top, left),
			isCorner(bottom, left),
			isCorner(top, right),
			isCorner(bottom, right)
		].every(Boolean)
	) {
		return null;
	}
	if (at(top, left + 1) !== '-' || at(bottom, left + 1) !== '-') return null;
	return { top, bottom, left, right };
}

/**
 * @param {string} svg
 * @param {string} ascii
 * @param {ReturnType<typeof parseRule>[]} rules
 * @param {Record<string, string>} meta
 */
function decorate(svg, ascii, rules, meta) {
	const grid = ascii.split('\n').map((line) => Array.from(line));
	const resolved = resolveRules(rules, grid);

	/** @type {TextEl[]} */
	const texts = [];
	const textPattern = /<text x="([\d.]+)" y="([\d.]+)"\s*>([^<]*)<\/text>/g;
	for (const match of svg.matchAll(textPattern)) {
		const x = Number(match[1]);
		const y = Number(match[2]);
		const from = Math.round((x - 2) / CHAR_W);
		const content = match[3];
		texts.push({
			x,
			y,
			row: Math.round((y - 12) / CHAR_H),
			from,
			to: from + Array.from(unescapeHtml(content)).length,
			content,
			classes: new Set()
		});
	}

	for (const text of texts) {
		const glyph =
			GLYPH_TONES[/** @type {keyof typeof GLYPH_TONES} */ (unescapeHtml(text.content).trim())];
		if (glyph) text.classes.add(`t-${glyph}`);
	}

	const under = [];
	const over = [];
	for (const { tone, cells, spans } of resolved) {
		for (const cell of cells) {
			const inside = texts.filter(
				(t) => t.row > cell.top && t.row < cell.bottom && t.from > cell.left && t.to <= cell.right
			);
			inside.forEach((t) => t.classes.add(`on-${tone}`));
			under.push(...cellRects(cell, tone));
			if (tone === 'strike') over.push(...inside.map(strikeLine));
		}
		for (const span of spans) {
			const hit = texts.filter((t) => t.row === span.row && t.from < span.to && t.to > span.from);
			hit.forEach((t) => t.classes.add(`t-${tone}`));
			if (tone === 'strike') over.push(...hit.map(strikeLine));
		}
	}

	let out = svg.replace(textPattern, (whole, x, y, content) => {
		const text = texts.find((t) => t.x === Number(x) && t.y === Number(y) && t.content === content);
		if (!text || !text.classes.size) return whole;
		return `<text x="${x}" y="${y}" class="${[...text.classes].join(' ')}">${content}</text>`;
	});

	out = out.replace(/<style>[\s\S]*?<\/style>\s*/, '');
	if (!/_marked_/.test(out)) out = out.replace(/<defs>[\s\S]*?<\/defs>\s*/, '');
	if (under.length)
		out = out.replace(/(<rect class="backdrop"[^>]*><\/rect>)/, `$1${under.join('')}`);
	if (over.length) out = out.replace(/<\/svg>\s*$/, `${over.join('')}</svg>`);
	if (meta.alt)
		out = out.replace(/^<svg /, `<svg role="img" aria-label="${escapeHtml(meta.alt)}" `);
	return out;
}

/**
 * @param {Cell} cell
 * @param {string} tone
 */
function cellRects(cell, tone) {
	const { fill, edge } = TONES[tone];
	const x = cell.left * CHAR_W + CHAR_W / 2;
	const y = cell.top * CHAR_H + CHAR_H / 2;
	const w = (cell.right - cell.left) * CHAR_W;
	const h = (cell.bottom - cell.top) * CHAR_H;
	const rects = [];
	if (fill)
		rects.push(
			`<rect class="tone tone-${tone}" x="${x}" y="${y}" width="${w}" height="${h}"></rect>`
		);
	if (edge) {
		const inset = 3;
		rects.push(
			`<rect class="tone-edge tone-edge-${tone}" x="${x + inset}" y="${y + inset}" width="${w - 2 * inset}" height="${h - 2 * inset}"></rect>`
		);
	}
	return rects;
}

/** @param {TextEl} text */
function strikeLine(text) {
	const y = text.row * CHAR_H + CHAR_H / 2;
	return `<line class="strike" x1="${text.from * CHAR_W}" y1="${y}" x2="${text.to * CHAR_W}" y2="${y}"></line>`;
}

/**
 * Parses `key="value"` / `key='value'` pairs from the fence meta string.
 * @param {string | null | undefined} meta
 * @returns {Record<string, string>}
 */
function parseMeta(meta) {
	/** @type {Record<string, string>} */
	const result = {};
	for (const match of (meta ?? '').matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)')/g)) {
		result[match[1]] = match[2] ?? match[3];
	}
	return result;
}

/** @param {string} value */
function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** @param {string} value */
function unescapeHtml(value) {
	return value
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&');
}
