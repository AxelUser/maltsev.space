# maltsev.space

Personal blog of Aleksey Maltsev. Static SvelteKit site with a "flight deck" space theme.

## Stack

- pnpm
- TypeScript
- Svelte 5 (runes)
- SvelteKit + adapter-static
- Tailwind CSS v4 (tokens in `src/app.css`)
- mdsvex posts
- three.js live covers
- Storybook

## Map

- `src/routes`: pages (`/`, `/blog`, `/blog/[slug]`, `/about`, `/misc`)
- `src/lib/components`: `ui`, `layout`, `posts`, `cover`, `visualization`, `home`, `about`, `art`, `markdown`
- `mdsvex.config.ts`: mdsvex options. `src/lib/plugins`: the custom mdsvex plugins for callouts, svgbob, mermaid and post references
- `src/lib/content`: all copy and data (bio, career, art, tags). Pages only lay it out
- `src/posts/NNN-slug/index.svx`: posts, with colocated `steps.ts`, `live-cover.svelte`, `scene.ts`
- `perf/`: page performance suite · `scripts/`: OG image generator

## Commands

- `pnpm dev`
- `pnpm check` (types)
- `pnpm lint`
- `pnpm format`
- `pnpm build`
- `pnpm perf`

## Skills: load before working

- Editing any `.svelte` / `.svelte.ts`: `svelte-core-bestpractices`, `svelte-code-writer`, `project-conventions`
- Any markup, styling or new visual: `flight-deck-design`
- After changes to loading, hydration, visuals, deps, images or fonts: `perf-check`

## Hard rules

- Style with Tailwind utilities and `app.css` tokens. No `<style>` blocks, no raw hex colours, no border radius.
- Reuse `#lib/components` before writing new markup.
- Copy and data go in `#lib/content`, not in pages.
- Before calling a task done, run `pnpm check` and `pnpm lint`.
