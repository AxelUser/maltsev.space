---
name: redditor-audit
description: 'Review a blog post like a Reddit thread: a newcomer and a domain expert both challenge it. Verified comments go to local review files that show next to the post in dev mode.'
disable-model-invocation: true
---

# Redditor audit

Spawn two redditors on one post. Audit what they say. Write their comments to local review files.

Defer to their fresh eyes on what is confusing or wrong. Don't defend the post for the author, and don't
let a redditor get away with a comment that isn't true.

## Scope

Use the post the caller names: a number (`012`), a slug, or a path. Otherwise use the
`src/posts/*/index.md` changed against `main`, including the working tree. If several changed, ask which.
If none changed, ask.

The scope is the post's `index.md` and its colocated files (`steps.ts`, `live-cover.svelte`, …). Readers
see interactive components (`<Stepper>`, `<ByteLanes>`, `<PostRef>`) rendered on the page. The redditors
read markdown, so tell them which components appear and what their props show (read the colocated
`steps.ts`). A component is never "missing content".

## Steps

1. Read the front matter (`title`, `preview`, `tags`, `keywords`) and the headings. Name the expert's field
   in a few words, e.g. "C# performance and low-level bit manipulation" or "probabilistic data structures".
   If `review.*.json` files already exist next to the post, collect the comments with `"status": "discarded"`.
   The author rejected them.
2. Spawn both redditors in the same turn, with fresh context. In Claude Code use `Agent` with
   `subagent_type: general-purpose`. Other harnesses: `task` (`general`) in OpenCode, `spawn_agent` in Codex.
   With no subagent tool, run each prompt yourself in a separate pass, newcomer first, and don't let what
   you know from one leak into the other.
   - Newcomer: [`references/newcomer.md`](references/newcomer.md) verbatim, then the post path and the list
     of components on the page. Nothing else. Their lack of context is the point.
   - Expert: [`references/expert.md`](references/expert.md) verbatim, then the post path, the component
     list and the field.
   - Give both the discarded comments from step 1 as "The author rejected these. Don't repeat them."
3. Audit each report before writing anything:
   - Every comment quotes the post. Check that the quote appears verbatim in `index.md` (ignoring
     whitespace). Drop comments whose quote isn't there. Shorten quotes longer than one sentence to the
     part that matters.
   - Drop comments that invent facts about the post (a section that isn't there, a claim it doesn't make),
     complain about something a listed component already shows, or say nothing fixable ("add more
     examples" with no place or example).
   - Check the expert's `[checked]` claims that you can check cheaply: read the cited doc or source, or run
     the snippet. A refuted claim is dropped. A claim you can't confirm becomes `hunch`.
   - Rewrite comments that break the Language rules in the persona files: hard words, idioms, more than 3
     sentences, dashes. Keep the meaning and the voice.
   - Check every heading id against the post's headings.
   - When both redditors hit the same line, the expert's comment becomes a reply (`replyTo`) to the
     newcomer's. When the expert disagrees with a newcomer comment (the post is right, the newcomer
     misread it), keep both and say so in the reply. The author still learns the line misleads.
   - If you drop more than half of one report, rerun that redditor once and name what went wrong. Keep
     what survives the rerun.
4. Write `review.newcomer.json` and `review.expert.json` next to the post, in the format from
   [`references/review-format.md`](references/review-format.md). Overwrite old files. Never write them
   anywhere else, and never commit them. Don't edit the post.

## Report

Keep the terminal report short. The comments themselves live in the review files.

```markdown
Reviewed <post title>: <n> comments from u/<newcomer>, <n> from u/<expert>.

Must fix:

- <section>: <one line> (u/<handle>)

Should fix: <n> · Consider: <n> · Keep: <n>
Dropped <n> comments: <one short reason each>. Reruns: <none | which and why>.

Run `pnpm dev`, open `/blog/<slug>` and click **Review** in the bottom-left corner.
```
