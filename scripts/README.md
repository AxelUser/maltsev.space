# OG Image Generation

Generates an Open Graph card (1536 × 1024 JPEG) for every published blog post, in the site's Flight Deck style (Night mode): note number and date, title, preview, livery-coloured tags, the post cover in HUD brackets, and the livery stripe along the bottom.

## Usage

```bash
pnpm run generate-og        # only posts without an image (runs before every build)
pnpm run generate-og:force  # regenerate everything, e.g. after changing the template
```

Output: `static/images/og/<slug>.jpg`. Pages fall back to the post's `hero.jpg` when no OG image exists.

## How it works

1. `generate-og-images.js` reads each `src/posts/<slug>/index.md` front matter (`title`, `preview`, `date`, `tags`, `draft`).
2. Tag labels and colours come from `src/lib/content/tags.json`, the same file the site uses, so cards and pages always agree.
3. One headless Chromium renders `og-template.html`, calls `window.setContent({...})`, waits for fonts and the cover, and screenshots the card.

## Customising

- Layout and colours: `og-template.html`. Its `:root` mirrors the Night tokens in `src/app.css`; keep them in sync if the palette changes.
- Title size steps down for long titles inside `setContent`.

Playwright needs Chromium: `npx playwright install chromium`.
