// Appends a run on main to history.jsonl and regenerates the README with trend charts.
// Usage:
//   node perf/history.mjs --results <resultsDir> --data <perf-data checkout> --sha <sha>
//     --date <iso> --subject <commit subject> [--repo <owner/name>]
import fs from 'node:fs';
import path from 'node:path';
import { args, deltaKb, kb, key, ms, readHistory, readResults } from './results.mjs';

const CHART_COMMITS = 50;
// "Δ vs N runs ago" in the latest table.
const COMPARE_BACK = 10;

const a = args();
const file = path.join(a.data, 'history.jsonl');
const entry = { sha: a.sha, date: a.date, subject: a.subject, results: readResults(a.results) };

// Re-running a commit replaces its entry instead of adding a duplicate point.
const history = readHistory(file).filter((e) => e.sha !== entry.sha);
history.push(entry);
fs.writeFileSync(file, history.map((e) => JSON.stringify(e)).join('\n') + '\n');

const latest = entry.results;
const older = history.at(-1 - COMPARE_BACK) ?? history[0];
const olderByKey = new Map(older.results.map((r) => [key(r), r]));
const commitLink = (sha) =>
	a.repo
		? `[\`${sha.slice(0, 7)}\`](https://github.com/${a.repo}/commit/${sha})`
		: `\`${sha.slice(0, 7)}\``;

const md = [
	'# Performance history',
	'',
	'Measured on every push to `main` by `.github/workflows/perf.yml`; this branch is written by CI only.',
	'JS and CSS sizes are gzip. Timings are medians of 3 loads on a shared runner without a GPU, so watch their trend, not single values.',
	'',
	`Latest: ${commitLink(entry.sha)} ${entry.subject} (${entry.date.slice(0, 10)}). ${history.length} runs recorded.`,
	'',
	'## Latest',
	'',
	`| Page | Device | Upfront JS | Total JS | Total JS vs ${commitLink(older.sha)} | LCP | Blocking time |`,
	'|---|---|--:|--:|--:|--:|--:|'
];
for (const r of latest) {
	const o = olderByKey.get(key(r));
	md.push(
		`| ${r.name} | ${r.device} | ${kb(r.upfrontJs)} | ${kb(r.totalJs)} | ${o ? deltaKb(r.totalJs - o.totalJs) : '—'} | ${ms(r.timing.lcp)} | ${ms(r.timing.tbt)} |`
	);
}

const recent = history.slice(-CHART_COMMITS);
/**
 * Single-series line chart; mermaid xychart has no legend, so the title names the series.
 * Starts at the first run that measured this page, and carries the last value over runs that didn't.
 */
const chart = (title, unit, values) => {
	const start = values.findIndex((v) => v != null);
	if (start < 0) return [];
	let last = values[start];
	const points = values.slice(start).map((v) => (last = v ?? last));
	const labels = recent.slice(start).map((e) => `"${e.sha.slice(0, 7)}"`);
	return [
		'```mermaid',
		'xychart-beta',
		`  title "${title}"`,
		`  x-axis [${labels.join(', ')}]`,
		`  y-axis "${unit}" 0 --> ${Math.ceil(Math.max(1, ...points) * 1.15)}`,
		`  line [${points.join(', ')}]`,
		'```',
		''
	];
};
const series = (page, device, pick) =>
	recent.map((e) => {
		const r = e.results.find((x) => x.page === page && x.device === device);
		return r ? pick(r) : null;
	});

md.push('', `## Trends (last ${recent.length} runs)`, '');
for (const r of latest.filter((x) => x.device === 'desktop')) {
	md.push(`### ${r.name}`, '');
	md.push(
		...chart(
			`${r.name}: total JS, desktop (KB gzip)`,
			'KB',
			series(r.page, 'desktop', (x) => +(x.totalJs / 1024).toFixed(1))
		)
	);
	md.push(
		...chart(
			`${r.name}: blocking time, mobile (ms)`,
			'ms',
			series(r.page, 'mobile', (x) => x.timing.tbt)
		)
	);
}

fs.writeFileSync(path.join(a.data, 'README.md'), md.join('\n'));
console.log(`perf: history has ${history.length} runs; README regenerated`);
