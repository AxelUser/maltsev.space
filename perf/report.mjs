// Markdown comparison of two perf runs, for the PR comment and the job summary.
// Usage:
//   node perf/report.mjs --head <resultsDir> (--base <resultsDir> | --base-history <history.jsonl>)
//     [--head-label <text>] [--base-label <text>] [--history-url <url>] [--runs <n>] --out <file>
import fs from 'node:fs';
import { args, deltaKb, deltaMs, kb, key, ms, readHistory, readResults } from './results.mjs';

const MARKER = '<!-- perf-report -->';
const CATEGORY_NAMES = {
	framework: 'Framework & shared',
	layout: 'Root layout',
	page: 'Page code',
	posts: 'All posts',
	mermaid: 'Mermaid',
	three: 'three.js'
};

const a = args();
const config = JSON.parse(fs.readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
const { minBytes, minPercent } = config.regression;

const head = readResults(a.head);
let base = [];
let baseLabel = a['base-label'] ?? 'base';
if (a.base && fs.existsSync(a.base)) base = readResults(a.base);
else if (a['base-history']) {
	const last = readHistory(a['base-history']).at(-1);
	if (last) {
		base = last.results;
		baseLabel = a['base-label'] ?? `last main run (${last.sha.slice(0, 7)})`;
	}
}
const baseByKey = new Map(base.map((r) => [key(r), r]));

const isRegression = (from, to) =>
	to - from > minBytes && (from === 0 || ((to - from) / from) * 100 > minPercent);
const isImprovement = (from, to) => from - to > minBytes && ((from - to) / from) * 100 > minPercent;

/** Value with its delta from base, and a flag when the change crosses the thresholds. */
const sizeCell = (from, to, flag) => {
	if (from === undefined) return kb(to);
	const icon =
		flag && isRegression(from, to) ? ' ⚠️' : flag && isImprovement(from, to) ? ' ✅' : '';
	return `${kb(to)} <sub>${deltaKb(to - from)}${icon}</sub>`;
};
const timeCell = (from, to) =>
	from === undefined || from === null || to === null
		? ms(to)
		: `${ms(to)} <sub>${deltaMs(to - from)}</sub>`;

const rows = [];
const changed = [];
let regressions = 0;
let improvements = 0;
for (const h of head) {
	const b = baseByKey.get(key(h));
	if (b && isRegression(b.totalJs, h.totalJs)) regressions++;
	if (b && isImprovement(b.totalJs, h.totalJs)) improvements++;
	if (b && (Math.abs(h.totalJs - b.totalJs) >= 1024 || Math.abs(h.upfrontJs - b.upfrontJs) >= 1024))
		changed.push([b, h]);
	rows.push(
		`| ${h.name} | ${h.device} | ${sizeCell(b?.upfrontJs, h.upfrontJs, true)} | ${sizeCell(b?.totalJs, h.totalJs, true)} | ${sizeCell(b?.css, h.css, false)} | ${sizeCell(b?.image, h.image, false)} | ${timeCell(b?.timing.lcp, h.timing.lcp)} | ${timeCell(b?.timing.tbt, h.timing.tbt)} |`
	);
}

const out = [MARKER, `### Page performance: ${a['head-label'] ?? 'head'} vs ${baseLabel}`, ''];
if (!base.length)
	out.push('_No baseline to compare with, so this run only shows absolute numbers._', '');
else if (regressions)
	out.push(
		`⚠️ **${regressions} page${regressions > 1 ? 's' : ''} grew by more than ${kb(minBytes)} and ${minPercent}% of JS.**`,
		''
	);
else
	out.push(
		`No JS size regressions.${improvements ? ` ✅ ${improvements} page${improvements > 1 ? 's' : ''} got lighter.` : ''}`,
		''
	);

out.push(
	'| Page | Device | Upfront JS | Total JS | CSS | Images | LCP | Blocking time |',
	'|---|---|--:|--:|--:|--:|--:|--:|',
	...rows,
	''
);

if (changed.length) {
	// Desktop and mobile usually pull in the same chunks; show such pairs once.
	const groups = new Map();
	for (const [b, h] of changed) {
		const id = `${h.page}|${JSON.stringify([b.upfrontByCategory, b.afterLoadByCategory, h.upfrontByCategory, h.afterLoadByCategory])}`;
		if (groups.has(id)) groups.get(id).devices.push(h.device);
		else groups.set(id, { b, h, devices: [h.device] });
	}
	out.push('<details><summary>JS by chunk type, for pages whose JS changed</summary>', '');
	for (const { b, h, devices } of groups.values()) {
		out.push(
			`**${h.name}, ${devices.join(' & ')}**`,
			'',
			'| Chunk type | Upfront | After load |',
			'|---|--:|--:|'
		);
		const cats = new Set([
			...Object.keys(b.upfrontByCategory),
			...Object.keys(h.upfrontByCategory),
			...Object.keys(b.afterLoadByCategory),
			...Object.keys(h.afterLoadByCategory)
		]);
		for (const c of Object.keys(CATEGORY_NAMES).filter((x) => cats.has(x))) {
			const cell = (from = 0, to = 0) => (from === to ? kb(to) : `${kb(from)} → ${kb(to)}`);
			out.push(
				`| ${CATEGORY_NAMES[c]} | ${cell(b.upfrontByCategory[c], h.upfrontByCategory[c])} | ${cell(b.afterLoadByCategory[c], h.afterLoadByCategory[c])} |`
			);
		}
		out.push('');
	}
	out.push('</details>', '');
}

out.push(
	'<details><summary>How to read this</summary>',
	'',
	'- **Upfront JS**: the scripts the HTML asks for and their static imports, needed before the page is interactive. **Total JS** adds everything fetched within 4 s after `load` (lazy chunks such as three.js or mermaid).',
	`- JS and CSS are gzip sizes of the built files; images as stored. ⚠️ marks JS growth over ${kb(minBytes)} **and** ${minPercent}% (set in \`perf/config.json\`); ✅ marks the same drop.`,
	'- Images are lazy-loaded, so how many arrive within the measuring window varies between runs; treat that column as a rough signal.',
	`- Timings are medians of ${a.runs ?? 3} loads on a shared CI runner with no GPU (WebGL renders in software). Compare base and head with each other, not with real devices. Mobile is a Pixel 7 with 4× CPU throttling.`,
	'- Sizes are reported, never enforced: this check fails only when a page errors or returns the wrong status.',
	...(a['history-url'] ? [`- History on \`main\`: [perf-data](${a['history-url']})`] : []),
	'</details>'
);

fs.writeFileSync(a.out, out.join('\n') + '\n');
console.log(`perf: wrote ${a.out} (${head.length} rows, ${regressions} regressions)`);
