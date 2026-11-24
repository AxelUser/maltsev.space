# Review file format

Write one file per redditor next to the post:

- `src/posts/<slug>/review.newcomer.json`
- `src/posts/<slug>/review.expert.json`

They are gitignored (`src/posts/*/review.*.json`) and must stay local. The dev server reads them and shows
them on `/blog/<slug>` (see `src/lib/plugins/vite-post-review.js` and `src/lib/components/dev/review`).
Overwriting a file reloads the overlay.

```json
{
	"reviewer": "expert",
	"handle": "u/actually_its_more_nuanced",
	"post": "010-cuckoo-filters",
	"created": "2026-11-22",
	"comments": [
		{
			"id": "e1",
			"anchor": {
				"quote": "b1 ^ (hash(fp) == b2)",
				"heading": "fingerprints-and-partial-key-cuckoo-hashing"
			},
			"severity": "must",
			"score": 320,
			"body": "This XORs `b1` with a boolean. Write `(b1 ^ hash(fp)) === b2`.",
			"check": "checked: ran in node, 6 ^ (x == 15) gives 6",
			"replyTo": "n4",
			"status": "open"
		}
	]
}
```

Fields:

- `id`: unique within the post. Newcomer ids are `n1, n2, …`, expert ids are `e1, e2, …`.
- `anchor.quote`: exact text copied from `index.svx`, as markdown source. Keep it to one sentence or less, so
  the overlay can find it on the page. For a formula, quote the text just before it, or the LaTeX, and set
  `heading`.
- `anchor.heading`: id of the section heading the quote is under. Rule: lowercase, drop characters other
  than letters, digits, spaces and hyphens, then turn spaces into hyphens. Example:
  "Migrating to a `uint` Table" becomes `migrating-to-a-uint-table`.
- `severity`: `must` (wrong or misleading), `should` (confusing, missing step, unsupported claim),
  `consider` (style, scope), `keep` (good, don't cut it).
- `score`: ordering only. About 100–500 for must, 20–100 for should, 1–20 for consider and keep.
- `body`: markdown. It can use `` `code` ``, fenced code with a language, `$inline$` and `$$block$$` LaTeX,
  links to headings (`[the deletion section](#deletion)`) and other notes (`/blog/<slug>#<heading>`).
- `check`: expert only. `checked: <what was checked>` or `hunch`.
- `replyTo`: id of a comment in the other file. Use it when both redditors hit the same line. The reply
  shows under that comment.
- `status`: `open` when written. The author sets `done` or `discarded` in the overlay.
- Don't write `outdated`. The dev server sets it when `anchor.quote` is no longer in `index.svx`, and the
  overlay keeps the comment visible with an "outdated" label. This is why the quote must be copied exactly.
