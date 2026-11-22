---
name: perf-check
description: Run and read the maltsev.space page performance suite (Playwright, desktop and throttled mobile), alone or compared against main. Use after major UI changes, such as content loading or hydration changes, new visuals, animations or live covers, new dependencies, image or font changes, or a new page kind. Also use when the user asks about bundle size, LCP or blocking time.
---

# Perf check

`perf/` builds nothing itself. It serves a static build (`perf/serve.mjs`) and loads every page kind in
`perf/pages.ts` on `desktop` (1440×900) and `mobile` (Pixel 7, 4× CPU throttling). For each page it records
upfront JS (needed before interactive), total JS including lazy chunks, CSS, images, LCP and total blocking
time. CI (`.github/workflows/perf.yml`) runs the same suite on every PR and posts a comparison comment.

## When

Run it after: changes to how content loads or hydrates, new visuals, animations, live covers or
visualizations, new or upgraded dependencies, changes to images or fonts, or a new route.
Skip it for copy edits and small style tweaks.

## Quick run (current tree only)

```bash
pnpm exec vite build && pnpm perf
```

Results go to `perf-results/local/<device>/<page>.json`. `vite build` skips OG image generation, which
`pnpm build` would run.

## Compare with `main` (preferred after a real change)

This mirrors CI. Paths are relative to the repo root, and all outputs are git-ignored.

```bash
# 1. Base build in a separate worktree
git worktree add --detach ../maltsev-perf-base main
(cd ../maltsev-perf-base && pnpm install --frozen-lockfile && pnpm exec vite build)
rm -rf perf-builds/base perf-results/base && mkdir -p perf-builds
mv ../maltsev-perf-base/build perf-builds/base

# 2. Head build from the working tree
rm -rf perf-builds/head perf-results/head
pnpm exec vite build && mv build perf-builds/head

# 3. Measure both with this tree's suite
PERF_BUILD_DIR=perf-builds/base PERF_OUT=perf-results/base pnpm perf
PERF_BUILD_DIR=perf-builds/head PERF_OUT=perf-results/head pnpm perf

# 4. Report
node perf/report.mjs --head perf-results/head --base perf-results/base \
  --head-label "working tree" --base-label "main ($(git rev-parse --short main))" \
  --out perf-results/report.md

# 5. Clean up
git worktree remove --force ../maltsev-perf-base
```

In PowerShell, set the env vars first: `$env:PERF_BUILD_DIR='perf-builds/base'; $env:PERF_OUT='perf-results/base'; pnpm perf`.
Then clear them with `Remove-Item Env:PERF_BUILD_DIR, Env:PERF_OUT`.

If Playwright's browser is missing, run `pnpm exec playwright install chromium`.

Knobs: `PERF_RUNS` (loads per page, timing is the median, default 3) and `PERF_PORT` (default 4321).

## Reading the results

- Read `perf-results/report.md`. It flags JS regressions above the thresholds in `perf/config.json` (more
  than 5 KB and more than 5 %).
- Sizes are deterministic, so trust their deltas. The JS breakdown by chunk type (framework, layout, page,
  posts, mermaid, three) shows where bytes went.
- Timings (LCP, blocking time) are noisy, especially on mobile. Before acting on a timing delta, re-run both
  sides with `PERF_RUNS=5` into fresh output dirs (e.g. `perf-results/rerun-base`, `perf-results/rerun-head`).
- Expected shape: heavy libraries (three.js, mermaid) show up only in total JS, never in upfront JS. Mobile
  should not load the three.js chunk at all for live covers.

## Adding a page kind

When a change adds a new kind of page or a visual that existing entries don't cover, add an entry to
`PAGES` in `perf/pages.ts`. Keep `id` stable, because renaming it breaks the history trend. For visuals that
start lazily, add `ready: { selector, devices }` (see `post-live-cover`, which waits for
`[data-live-cover="playing"]` on desktop).

## Report back

Tell the user which pages and devices changed meaningfully (size first, then timing), quote any flagged
regression, and say whether timing deltas held up on a re-run.
