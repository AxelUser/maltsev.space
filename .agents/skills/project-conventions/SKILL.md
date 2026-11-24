---
name: project-conventions
description: Code conventions specific to the maltsev.space repo, covering file naming, barrel exports, props typing, variants with cva and cn, shared state, browser-only code, posts and stories. Load together with the Svelte skills whenever creating or editing a component, module, post or story in this project.
---

# Project conventions

Generic Svelte 5 guidance lives in `svelte-core-bestpractices` and `svelte-code-writer`. This skill covers only
what this repo does its own way. When in doubt, copy the nearest existing component.

## Files and exports

- Filenames are kebab-case: `post-card.svelte`, `simple-bloom-filter.ts`.
- Every component folder has an `index.ts` that re-exports PascalCase names:
  `export { default as PostCard } from './post-card.svelte';`. Add new components there.
- Compound components export a namespace: `export * as Figure from './figure'`, used as `<Figure.Root>`.
- Import from barrels (`$lib/components/ui`, `$lib/utils`). The exception is per-page heavy maps
  (`$lib/utils/art-image`, `$lib/utils/post-image`), which are imported directly to keep other pages light.

## Components

```svelte
<!--
	@component
	One or two lines on what it is and any non-obvious behaviour.

	<Thing variant="ghost">…</Thing>
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cva, type VariantProps } from 'class-variance-authority';
	import { cn } from '$lib/utils';

	const thing = cva('base utilities', {
		variants: { variant: { primary: '…', ghost: '…' } }
	});

	interface Props extends VariantProps<typeof thing> {
		/** JSDoc for anything not obvious from the name. */
		href?: string;
		class?: string;
		children: Snippet;
	}

	const { variant = 'primary', href, class: className, children }: Props = $props();
</script>
```

- Props: `interface Props` plus a destructured `$props()` with defaults. Accept `class` as `className` and
  merge it last with `cn()` (`src/lib/utils/cn.ts`, clsx + tailwind-merge).
- Variants use `cva` (see `ui/button.svelte`). Don't build variant classes with ternaries in markup.
- Callback props (`onready`, `onerror`, `onclick`), not events or dispatchers.
- Add an `@component` header for anything with non-obvious behaviour (see `cover/live-cover.svelte`).

## Logic and state

- Keep templates thin. Pure logic (step generation, math, hashing) goes in a sibling `.ts` file, like
  `visualization/*/helpers.ts` or a post's `steps.ts`, so it is easy to read and test.
- Shared reactive state lives in `src/lib/stores/*.svelte.ts` as an exported `$state` object
  (`live-cover.svelte.ts`). Mutate its properties; don't reassign the export.
- Browser-only code is guarded with `browser` from `$app/environment` (see `utils/device.ts`), or runs in
  `onMount`. The site is prerendered, so module top level runs on the server.
- Prefer `runed` helpers (`useIntersectionObserver`, …) and `svelte/reactivity` `MediaQuery` over manual
  listeners.
- Heavy dependencies (three.js, mermaid) are only ever loaded with dynamic `import()` behind a loader, as
  `getPostLiveCover()` in `utils/post-live-cover.ts` does.

## Content and posts

- Copy and data live in `src/lib/content` (`bio.ts`, `career.ts`, `art.ts`, `tags.json`, …). Components take
  data through props.
- A post is `src/posts/NNN-slug/index.svx` (mdsvex) with front matter (`date`, `tags`, `keywords`, `title`,
  `preview`, `draft`, optional `aiCover`, `coverCaption`, `liveCover`). Post-only data goes next to it
  (`steps.ts`, `live-cover.svelte`, `scene.ts`).
- Posts use the mdsvex 1.x markdown dialect, not CommonMark. Write `*strong*` and `_em_`, callouts as
  `:::info[Title]`, display math in a `math` fence, inline math as $`x`$, and `::toc` for a contents list.
- Components used inside posts are imported in the post's `<script>` from `$lib/components` or a
  `$lib/components/visualization/<name>` barrel.
- A new tag needs an entry in `src/lib/content/tags.json`, because it drives both the UI and OG images.

## Stories

New `ui/` and `visualization/` components get a story in `src/stories/<area>/<name>.stories.svelte` using
`defineMeta` from `@storybook/addon-svelte-csf` and importing `../../app.css` (see
`src/stories/ui/tag.stories.svelte`).

## Done means

`pnpm check` and `pnpm lint` both pass (`pnpm format` fixes formatting).
