// Shared by report.mjs and history.mjs: loads results into compact rows and formats numbers.
import fs from 'node:fs';
import path from 'node:path';

/**
 * @typedef {{ page: string, order: number, name: string, device: string, upfrontJs: number, afterLoadJs: number,
 *   totalJs: number, css: number, image: number, font: number, requests: number,
 *   upfrontByCategory: Record<string, number>, afterLoadByCategory: Record<string, number>,
 *   timing: { load: number, lcp: number | null, tbt: number, longestTask: number, ready: number | null } }} Row
 * Sizes are bytes: JS and CSS gzip, fonts and images as stored.
 */

/** Rows from a perf-results directory (`<device>/<page>.json`), in suite order. */
export function readResults(dir) {
	/** @type {Row[]} */
	const rows = [];
	for (const device of fs.readdirSync(dir).sort()) {
		const d = path.join(dir, device);
		if (!fs.statSync(d).isDirectory()) continue;
		for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.json'))) {
			const r = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
			rows.push({
				page: r.page,
				order: r.order ?? 0,
				name: r.name,
				device: r.device,
				upfrontJs: r.bytes.upfrontJs.gz,
				afterLoadJs: r.bytes.afterLoadJs.gz,
				totalJs: r.bytes.upfrontJs.gz + r.bytes.afterLoadJs.gz,
				css: r.bytes.css,
				image: r.bytes.image,
				font: r.bytes.font,
				requests: r.bytes.requests,
				upfrontByCategory: r.bytes.upfrontJs.byCategory,
				afterLoadByCategory: r.bytes.afterLoadJs.byCategory,
				timing: r.timing
			});
		}
	}
	// Suite order, desktop before mobile.
	return rows.sort((x, y) => x.order - y.order || x.device.localeCompare(y.device));
}

/** Entries of history.jsonl, oldest first. */
export function readHistory(file) {
	if (!fs.existsSync(file)) return [];
	return fs
		.readFileSync(file, 'utf8')
		.split('\n')
		.filter(Boolean)
		.map((l) => JSON.parse(l));
}

export const key = (r) => `${r.page}:${r.device}`;

export const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

/** "+1.2 KB" / "−3.0 KB" / "±0" */
export const deltaKb = (d) =>
	Math.abs(d) < 51 ? '±0' : `${d > 0 ? '+' : '−'}${(Math.abs(d) / 1024).toFixed(1)} KB`;

export const ms = (v) => (v == null ? '—' : `${Math.round(v)} ms`);

export const deltaMs = (d) =>
	d == null || d === 0 ? '±0' : `${d > 0 ? '+' : '−'}${Math.abs(Math.round(d))}`;

/** Parses `--name value` pairs. */
export function args(argv = process.argv.slice(2)) {
	const out = {};
	for (let i = 0; i < argv.length; i += 2) out[argv[i].replace(/^--/, '')] = argv[i + 1];
	return out;
}
