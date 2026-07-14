# Player Profile — portfolio

A single-page personal site framed as a game profile, built with SvelteKit:

- **Hero** — a TCG-style trading card intro with a foil shimmer border.
- **Quest Log** — a Steam/Netflix-style showcase of games. Hover (desktop) or scroll-into-center (mobile) autoplays a muted preview; only one plays at a time. Click for a modal with the trailer, full screenshot gallery, and notes.
- **Atlas** — a travel timeline where each stop is a fanned stack of photos that opens a fullscreen slideshow with per-photo info.
- **Handles** — a row of external social links.

Everything respects `prefers-reduced-motion` and has keyboard parity for every click interaction.

## Editing content

All content is data-driven — no strings are hardcoded in markup:

- `src/data/games.js` — Quest Log cards (title, tags, `youtubeId`, cover, screenshots).
- `src/data/travel.js` — Atlas stops (place, note, photos with date/time/location).
- `src/data/handles.js` — social links.
- `src/lib/Hero.svelte` — the trading-card content lives in the `card` constant at the top of the file.

Placeholder images come from picsum.photos; swap them for your own URLs or imports from `src/lib/images`.

## Fonts

- `--pixel` → **EggHeadPixBit** (bundled in `static/`, used for headings/titles only).
- `--mono` → IBM Plex Mono, `--sans` → IBM Plex Sans (loaded from Google Fonts in `src/app.html`).

## Developing

```bash
npm install
npm run dev
```

## Building

```bash
npm run build      # production build
npm run preview    # preview the build
npm run check      # type-check
```
