# Hi! 👋

This is the source code of my personal web-site. It's built using Svelte and SvelteKit - a robust framework for building web applications.

From here I will share my experience on software development topics. I don't have comments yet. However you're free to open an issue if you found a mistake or want to discuss any article.

[Go and check it out!](https://www.maltsev.space/)

## Getting Started

Once you've cloned the project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm dev
```

## Building

To create a production version of the site:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

## Performance checks

`perf/` measures every page kind (listed in `perf/pages.ts`) on desktop and on mobile (Pixel 7, 4× CPU
throttling). For each page it records the JS needed before the page is interactive, all JS including lazy
chunks, CSS, images, LCP and blocking time.

```bash
pnpm exec vite build && pnpm perf   # results in perf-results/local/<device>/<page>.json
```

`.github/workflows/perf.yml` runs it on every PR to `main` and on every push to `main`:

- **PRs** get one comment comparing the PR with its base, which is updated on each new commit.
- **Pushes to `main`** are recorded on the `perf-data` branch: `history.jsonl` holds the data and its
  README has trend charts.

Numbers are only reported. The check fails only when a page errors.

## Technology Stack

- **Language**: TypeScript
- **UI Framework**: Svelte 5
- **Routing**: SvelteKit
- **Styling**: OpenProps
