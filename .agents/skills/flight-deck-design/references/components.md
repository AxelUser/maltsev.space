# Component catalogue

Import from the folder barrels, e.g. `import { Button, Figure } from '$lib/components/ui'`. Read a
component's props before using it. Don't guess them.

## `ui/`: primitives

| Component                                         | Use                                                                     |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| `Button`                                          | `variant`: `primary` (livery chevron) or `ghost`. `href` renders a link |
| `Tag`                                             | post tag in its livery colour (`tags.json`)                             |
| `Chip`                                            | small neutral label                                                     |
| `HudBox`                                          | container with `hud` brackets                                           |
| `Frame` (`Figure.Media`)                          | framed 3:2 or natural-ratio box for media                               |
| `Figure.Root` / `.Media` / `.Corner` / `.Caption` | framed media with corner overlays and a caption                         |
| `Picture`                                         | enhanced image with blurred placeholder. `sizes` is required            |
| `HoverZoom.Area` / `.Target`                      | the shared 1.02 image zoom on hover                                     |
| `AiFlag`                                          | marks AI-generated imagery                                              |
| `LoadingOverlay`                                  | overlay while a lazy visual loads                                       |
| `PageHeader`, `SectionHeading`                    | page title block, section heading                                       |
| `TechList`, `PillLinks`                           | tech stack list, row of pill links                                      |

## `layout/`

`Container` (page column, `max-w-page`, `as` prop), `SiteHeader`, `SiteFooter`, `ThemeSwitch`, `Starfield`,
`ReadingProgress`.

## `posts/`

- `PostImage`: inline post image by public URL. `ai` flags it as AI-generated.
- `PostRef`: inline card for another note. Place it after the paragraph that first links to it. `hash`
  deep-links a heading.
- `PostCard` (blog grid), `PostRow` / `PostRows` (lists), `PostFeature` (home), `PostsByYear`, `PostMeta`
  (tag + date meta line), `SeriesCard`, `SeriesParts`, `PostPager`, `PostIndex` (all-notes rail beside a
  post, `2xl` and up).

### Note links: every link to a note

Built from `posts/note-link`:

- `NoteLink`: the `<a>`, with hover group, zoom area and accent. `boxed` adds brackets.
- `NoteThumb`: hero image. Use `framed` for big cards.
- `NoteTitle`: `lg` featured, `md` cards and rows, `sm` pager and series parts.
- `NoteArrow`: the arrow. `label` gives "Read the note →"-style calls to action.

Rules:

- Hover is the same everywhere: title turns `text-link`, image zooms 1.02, arrow nudges. Boxed links also get
  `bg-surface` and brackets in the accent.
- The accent is always Blog `livery-1`. No hairline-bordered link boxes.
- One arrow per link, always `NoteArrow`. Rows and boxed links put it in a trailing column. Cards without
  one (blog grid, series parts) put it inline after the title's last word, joined with `&nbsp;`.
- `PostMeta` is the meta line. Eyebrows are only for context ("Linked note · 009", "Previous").

## `cover/`

`PostCover` (still image, upgrades to the live scene on desktop with a fine pointer), `LiveCover` (lazy
scene, plays only while ≥50 % visible), `SceneCanvas`, `LiveCoverToggle`. A post opts in with
`liveCover: true` in front matter and a colocated `live-cover.svelte`, loaded through
`getPostLiveCover(slug)`.

## `visualization/`

Interactive explainers for posts: `array-steps` (`Stepper`, `ArrayView`), `bloom-filters`, `byte-lanes`,
`ps1` (three.js kit), and `common` (`DisplayCard`, `LabeledInput`, `ParameterGroup`) for their controls.
Build new explainers from `common` so controls look the same.

## `home/`, `about/`, `art/`

Page sections composed from the above (`Hero`, `OrbitFigure`, `DestinationCard`, `CareerTimeline`,
`Gallery`, `Lightbox`, `TrackList`, …). Their data comes from `$lib/content`.

## Images

- Use `Picture` (or `<enhanced:img>`) with `getPostHeroImage()`, `getArtImage()` or `getPostImage()`.
- Always pass a realistic `sizes` for the layout slot (e.g. `(min-width: 768px) 560px, 100vw`, see `art/gallery.svelte`).
- `art-image` and `post-image` are imported directly from `$lib/utils/art-image` / `$lib/utils/post-image`,
  not from the barrel, so only the pages using them ship their image maps.
