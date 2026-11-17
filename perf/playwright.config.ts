/**
 * Perf suite: measures a static build page by page. Run `pnpm exec vite build && pnpm perf`.
 *
 * PERF_BUILD_DIR  build to serve (default: build)
 * PERF_OUT        where per-page JSON results go (default: perf-results/local)
 * PERF_RUNS       page loads per test; timing is the median (default: 3)
 * PERF_PORT       port for the static server (default: 4321)
 */
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

// Absolute, so the test workers and the server resolve them the same way.
process.env.PERF_BUILD_DIR = path.resolve(process.env.PERF_BUILD_DIR ?? 'build');
process.env.PERF_OUT = path.resolve(process.env.PERF_OUT ?? 'perf-results/local');
const port = Number(process.env.PERF_PORT ?? 4321);

export default defineConfig({
	testDir: '.',
	// Not *.spec.ts, so vitest doesn't pick these up.
	testMatch: '*.perf.ts',
	outputDir: path.resolve('test-results/perf'),
	// One page at a time, so timings don't compete for the CPU.
	workers: 1,
	fullyParallel: false,
	retries: 0,
	timeout: 5 * 60_000,
	reporter: [['list']],
	use: {
		baseURL: `http://localhost:${port}`,
		// CI runners have no GPU; allow WebGL through software rendering.
		launchOptions: { args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }
	},
	projects: [
		{
			name: 'desktop',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }
		},
		{ name: 'mobile', use: { ...devices['Pixel 7'] }, metadata: { cpuThrottling: 4 } }
	],
	webServer: {
		command: `node serve.mjs "${process.env.PERF_BUILD_DIR}" ${port}`,
		url: `http://localhost:${port}/`,
		reuseExistingServer: false,
		stdout: 'ignore'
	}
});
