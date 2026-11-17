/**
 * One test per page kind and device: loads the page PERF_RUNS times in a fresh context, records the
 * bytes it pulls in and its timing, and writes `<PERF_OUT>/<device>/<page>.json`.
 * Fails only if the page errors or returns an unexpected status; sizes are reported, not asserted.
 */
import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Browser, type BrowserContextOptions } from '@playwright/test';
import { PAGES, type PageKind } from './pages';
import {
	fileForPath,
	resourceKind,
	sizeOf,
	sumJs,
	upfrontJs,
	type JsBytes,
	type ResourceKind
} from './bundle';

const ROOT = process.env.PERF_BUILD_DIR!;
const OUT = process.env.PERF_OUT!;
const RUNS = Number(process.env.PERF_RUNS ?? 3);
// Lazy chunks (three.js, mermaid) start after hydration; give them time to arrive.
const SETTLE_MS = 4000;
const READY_TIMEOUT_MS = 20_000;

export interface Timing {
	/** ms from navigation start */
	load: number;
	lcp: number | null;
	/** Total blocking time: sum of (long task − 50 ms). */
	tbt: number;
	longestTask: number;
	/** When `PageKind.ready` appeared; null if not waited for or it never did. */
	ready: number | null;
}

export interface PageResult {
	page: string;
	/** Position in PAGES, for stable report order. */
	order: number;
	name: string;
	path: string;
	device: string;
	status: number;
	bytes: {
		upfrontJs: JsBytes;
		afterLoadJs: JsBytes;
		/** gzip */
		css: number;
		/** gzip */
		html: number;
		/** as stored; already compressed */
		font: number;
		/** as stored; already compressed */
		image: number;
		requests: number;
	};
	/** Medians over `runs`. */
	timing: Timing;
	runs: Timing[];
}

const median = (xs: number[]) => {
	const s = [...xs].sort((a, b) => a - b);
	return s[Math.floor(s.length / 2)];
};

async function loadOnce(
	browser: Browser,
	options: BrowserContextOptions,
	kind: PageKind,
	device: string,
	cpuThrottling: number
) {
	const context = await browser.newContext(options);
	const page = await context.newPage();
	if (cpuThrottling > 1) {
		const cdp = await context.newCDPSession(page);
		await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpuThrottling });
	}

	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	const origin = new URL(options.baseURL!).origin;
	const files = new Set<string>();
	let requests = 0;
	page.on('requestfinished', (req) => {
		const url = new URL(req.url());
		if (url.origin !== origin) return;
		requests++;
		files.add(fileForPath(ROOT, url.pathname) ?? path.join(ROOT, '404.html'));
	});

	await page.addInitScript(() => {
		const perf = { longTasks: [] as number[], lcp: null as number | null };
		Object.assign(window, { __perf: perf });
		new PerformanceObserver((list) => {
			for (const e of list.getEntries()) perf.longTasks.push(e.duration);
		}).observe({ type: 'longtask', buffered: true });
		new PerformanceObserver((list) => {
			for (const e of list.getEntries()) perf.lcp = e.startTime;
		}).observe({ type: 'largest-contentful-paint', buffered: true });
	});

	const response = await page.goto(kind.path, { waitUntil: 'load' });
	let ready: number | null = null;
	if (kind.ready?.devices.includes(device)) {
		ready = await page
			.waitForSelector(kind.ready.selector, { timeout: READY_TIMEOUT_MS })
			.then(() => page.evaluate(() => Math.round(performance.now())))
			.catch(() => null);
	}
	await page.waitForTimeout(SETTLE_MS);

	const timing = await page.evaluate(() => {
		const { longTasks, lcp } = (
			window as unknown as { __perf: { longTasks: number[]; lcp: number | null } }
		).__perf;
		const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
		return {
			load: Math.round(nav.loadEventEnd),
			lcp: lcp === null ? null : Math.round(lcp),
			tbt: Math.round(longTasks.reduce((a, d) => a + Math.max(0, d - 50), 0)),
			longestTask: Math.round(Math.max(0, ...longTasks))
		};
	});
	await context.close();
	return { status: response?.status() ?? 0, errors, files, requests, timing: { ...timing, ready } };
}

for (const kind of PAGES) {
	test(kind.name, async ({ browser }, testInfo) => {
		const device = testInfo.project.name;
		const use = testInfo.project.use;
		const options: BrowserContextOptions = {
			baseURL: use.baseURL,
			viewport: use.viewport,
			userAgent: use.userAgent,
			deviceScaleFactor: use.deviceScaleFactor,
			isMobile: use.isMobile,
			hasTouch: use.hasTouch
		};
		const cpuThrottling =
			(testInfo.project.metadata as { cpuThrottling?: number }).cpuThrottling ?? 1;

		const runs = [];
		for (let i = 0; i < RUNS; i++) {
			const run = await loadOnce(browser, options, kind, device, cpuThrottling);
			expect(run.status, 'document status').toBe(kind.status ?? 200);
			expect(run.errors, 'uncaught page errors').toEqual([]);
			runs.push(run);
		}

		// Bytes are deterministic for a build; take them from the first load.
		const first = runs[0];
		const htmlFile = fileForPath(ROOT, kind.path) ?? path.join(ROOT, '404.html');
		const upfront = upfrontJs(ROOT, htmlFile);
		const byKind: Partial<Record<ResourceKind, number>> = {};
		for (const f of first.files) {
			const k = resourceKind(f);
			const s = sizeOf(f);
			byKind[k] = (byKind[k] ?? 0) + (k === 'font' || k === 'image' ? s.raw : s.gz);
		}
		const afterLoad = [...first.files].filter(
			(f) => resourceKind(f) === 'js' && !upfront.has(path.resolve(f))
		);

		const timings = runs.map((r) => r.timing);
		const medianOf = (k: keyof Timing) => {
			const xs = timings.map((t) => t[k]).filter((x): x is number => x !== null);
			return xs.length ? median(xs) : null;
		};
		const result: PageResult = {
			page: kind.id,
			order: PAGES.indexOf(kind),
			name: kind.name,
			path: kind.path,
			device,
			status: first.status,
			bytes: {
				upfrontJs: sumJs(ROOT, upfront),
				afterLoadJs: sumJs(ROOT, afterLoad),
				css: byKind.css ?? 0,
				html: byKind.html ?? 0,
				font: byKind.font ?? 0,
				image: byKind.image ?? 0,
				requests: first.requests
			},
			timing: {
				load: medianOf('load')!,
				lcp: medianOf('lcp'),
				tbt: medianOf('tbt')!,
				longestTask: medianOf('longestTask')!,
				ready: medianOf('ready')
			},
			runs: timings
		};

		const file = path.join(OUT, device, `${kind.id}.json`);
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, JSON.stringify(result, null, '\t'));
		await testInfo.attach('result', {
			body: JSON.stringify(result, null, '\t'),
			contentType: 'application/json'
		});
	});
}
