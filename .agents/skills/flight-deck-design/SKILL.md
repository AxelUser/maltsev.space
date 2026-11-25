---
name: flight-deck-design
description: The "Flight Deck" design language of maltsev.space, covering design principles, colour tokens, typography, primitives and interaction rules. Load before writing or changing any markup, Tailwind classes, layout, component visuals, animation or new visual elements, so the result matches the existing design without polishing.
---

# Flight Deck design

The site looks like a flight deck HUD: flat, square-cornered surfaces, thin corner brackets instead of boxes,
mono uppercase captions, and four "livery" stripes as the only accent colours. Day mode is an icy,
overexposed field. Night mode is deep space with stars.

All tokens and primitives live in `src/app.css` (Tailwind v4 `@theme` and `@utility`). Style with utilities in
markup. Do not add `<style>` blocks.

## Principles

1. **HUD, not cards.** Surfaces are flat with square corners. Only avatars and app icons are rounded. A
   container gets `hud` brackets or a single `border-line` hairline, never both, and no shadows except
   `shadow-frame` on images.
2. **Colour is scarce.** Neutral `canvas`, `surface`, `ink` and `line` carry the page. `livery-1`…`livery-4` are
   accents only: a flag, a stripe, a hover bracket. Never use them for large fills or body text.
3. **Both themes, always.** Use only semantic tokens. They are `light-dark(<day>, <night>)`, so one class
   works in both themes. Never hardcode hex or Tailwind palette colours (`gray-500`, `orange-600`). If a new
   colour is truly needed, add a token to `:root` and `@theme inline` in `app.css`.
4. **Typography has roles.** `font-display` (Saira, with `font-stretch-[108%]`…`[115%]`) is for headings and UI
   labels, `font-sans` (IBM Plex Sans) for reading text, `font-mono` (IBM Plex Mono) for meta. Use `eyebrow`
   only for context captions ("Linked note · 009", "Previous", "Series · 3 parts").
5. **One interaction language.** Hover is `bg-surface` plus a bracket recolour (`hover:[--hud-c:…]`), or
   `text-link`. Arrow links nudge with `translate-x`. Images zoom to 1.02 (`HoverZoom`). Focus uses the global
   `livery-2` outline, so don't restyle it.
6. **Motion is cheap and polite.** Animate only `transform` and `opacity`. Pause long-running motion when it
   is off-screen (IntersectionObserver, see `cover/live-cover.svelte`). `prefers-reduced-motion` already stops
   everything globally, so don't add per-component checks for CSS motion. JS loops must check it themselves.
7. **Performance is part of the design.** The first paint is a static image or plain markup. Heavy visuals
   (three.js scenes, mermaid, interactive steppers) load lazily and enhance it progressively. Mobile and
   coarse pointers keep the still version when the effect is expensive. After adding a visual, run the
   `perf-check` skill.
8. **Reuse before inventing.** Check `#lib/components` first (catalogue in
   [references/components.md](references/components.md)). A repeated visual idea becomes an `@utility` in
   `app.css` or a `ui/` component, not a copy-pasted string of arbitrary values.

## Colour tokens

| Utility suffix                | Meaning                                                  |
| ----------------------------- | -------------------------------------------------------- |
| `canvas`                      | page background                                          |
| `surface`                     | raised fills: hover states, code blocks, inputs          |
| `ink`, `ink-2`, `ink-3`       | primary / secondary / meta text                          |
| `line`, `line-2`              | hairlines and dividers / stronger outlines, HUD brackets |
| `link`                        | links and hover highlights                               |
| `livery-1` … `livery-4`       | red-orange, amber, gold, teal. Accents only              |
| `on-livery`                   | text on a livery fill                                    |
| `sat`, `planet-a`, `planet-b` | orbit illustration only                                  |

- Section colours: Blog `livery-1`, About `livery-2`, Misc (art, music) `livery-4` (`sections` in `src/lib/config.ts`).
- Tag colours come from `src/lib/content/tags.json`, which the OG image generator also reads.
- `dark:` targets Night, whether it was chosen explicitly or comes from Auto on a dark OS. The theme switch
  only sets `color-scheme` on `<html>`.

## Primitives (`app.css`)

| Utility        | What                                                                       |
| -------------- | -------------------------------------------------------------------------- |
| `hud`          | corner brackets. Recolour with `[--hud-c:var(--color-livery-2)]`           |
| `chevron`      | slanted leading edge (buttons, tags, nav flags). Cut width: `[--cut:12px]` |
| `livery`       | the four stripes as a background                                           |
| `eyebrow`      | mono 11.5px uppercase caption in `ink-3`                                   |
| `badge`        | translucent label over images (AI flag, live cover toggle)                 |
| `shadow-frame` | soft drop shadow for images                                                |

Layout tokens: `max-w-page` (1180px), `max-w-article` (720px), `h-header` / `pt-header` (72px).
Breakpoints: `xs` 520, `sm` 640, `md` 768, `lg` 900, `xl` 1024, `2xl` 1440 (post index sidebar).

## Checklist before finishing UI work

- [ ] No `rounded-*`, no `<style>`, no raw colours. Only tokens from the table above.
- [ ] Checked in both Day and Night (toggle `ThemeSwitch` or set `color-scheme` on `<html>`).
- [ ] Hover, focus and arrow behaviour match principle 5.
- [ ] Only `transform`/`opacity` animate, and long loops pause off-screen.
- [ ] Works on small phones. Breakpoints come from the list above, not arbitrary `min-[…]`.
- [ ] Existing components reused. See [references/components.md](references/components.md).
- [ ] New visual or heavier loading → `perf-check`.
