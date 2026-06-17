# Assets — Paper Trail

Every asset that ships with Fyhno Fight is recorded here at the moment it enters the repo: what it is, where it came from, what license it carries, when we added it, and where it is used in the game.

This file is the authoritative source of asset provenance. Per the Phase 0 asset strategy (Path A, license-clean):

- **Environments / effects / UI:** Kenney (CC0) or self-generated (original work)
- **Heroes & characters:** Midjourney
- **Music:** CC0 only
- **Fonts:** CC0 pixel-art fonts only

If an asset cannot be recorded in this file with a known source and license, it does not go in the repo. No exceptions.

## Character sprites

Midjourney V7 (AI-generated). License: Midjourney commercial terms apply. Path A accepts residual AI-image copyright ambiguity per Phase 0 — the deliberately accepted tradeoff for visual quality and pipeline speed.

| Path | Source | Added | Notes |
| ---- | ------ | ----- | ----- |
| `assets/sprites/fyhno/fyhno-source-standing.png` | Midjourney V7 | 2026-06-01 | Master source, standing pose. Not loaded by game. |
| `assets/sprites/fyhno/fyhno-idle.png` | Derived from `fyhno-source-standing.png` | 2026-06-04 | 64×64 game-ready idle sprite. Background stripped via `scripts/strip-bg.mjs`. Used in TitleScene. |
| `assets/sprites/fyhno/fyhno-source-flying.png` | Midjourney V7 | 2026-06-15 | Master source, flying pose. Used image-reference of standing source for character consistency. Not loaded by game. |
| `assets/sprites/fyhno/fyhno-flying.png` | Derived from `fyhno-source-flying.png` | 2026-06-15 | 64×64 game-ready flying sprite. Background stripped via `scripts/strip-bg.mjs`. Used in GameScene. |

## Backgrounds

Midjourney V7 (AI-generated). Same license posture as character sprites.

| Path | Source | Added | Notes |
| ---- | ------ | ----- | ----- |
| `assets/backgrounds/mountain-sky-source.png` | Midjourney V7 | 2026-06-04 | Master source, 1456×816. Not loaded by game. |
| `assets/backgrounds/mountain-sky.png` | Derived from `mountain-sky-source.png` | 2026-06-04 | 1280×720 game-ready. Resized via `scripts/resize-bg.mjs` (nearest-neighbor). Used in GameScene. |

## UI sprites

Self-generated via Node scripts using the Endesga 32 palette. License: original work, no attribution required.

| Path | Source | Added | Notes |
| ---- | ------ | ----- | ----- |
| `assets/sprites/ui/heart.png` | `scripts/make-heart.mjs` | 2026-06-15 | 8×7 pixel-art heart in Endesga 32 palette. Used in GameScene hearts UI. |
| `assets/sprites/ui/dpad-arrow.png` | `scripts/make-arrow.mjs` | 2026-06-15 | 16×16 D-pad arrow button in Endesga 32 palette. Used 4× in GameScene D-pad (rotated 0°/90°/180°/270°). |
| `assets/sprites/ui/icon-192.png` | `scripts/make-icons.mjs` | 2026-06-17 | 192×192 PWA app icon. Composites `fyhno-flying.png` on Endesga 32 `blue_mid` background with bold monospace "Fyhno" label. **License caveat:** inherits Midjourney terms from the embedded Fyhno sprite (see Character sprites). Referenced by PWA manifest. |
| `assets/sprites/ui/icon-512.png` | `scripts/make-icons.mjs` | 2026-06-17 | 512×512 PWA app icon. Same composition as `icon-192.png`. **License caveat:** inherits Midjourney terms from the embedded Fyhno sprite (see Character sprites). Referenced by PWA manifest. |

## Palettes

Reference assets used by the art pipeline. Not loaded by the game.

| Path | Source | Added | Notes |
| ---- | ------ | ----- | ----- |
| `assets/palettes/endesga-32.png` | [Endesga 32 on lospec.com](https://lospec.com/palette-list/endesga-32) — designed by Joran "Endesga" Mol | 2026-06-02 | Free use. Project-wide reference palette. |

## Audio

CC0 / Public Domain. No attribution required, but recorded for our own paper trail.

| Path | Source | Added | Notes |
| ---- | ------ | ----- | ----- |
| `assets/audio/main-theme.mp3` | "Moon Chime" by obscure music on [OpenGameArt.org](https://opengameart.org/content/moon-chime) (original filename: `tipa16.mp3`) | 2026-06-15 | Looping main theme. Played from BootScene; persists across scenes via Phaser's global SoundManager. |

## Code dependencies (npm)

| Package | Version | License | Notes |
| ------- | ------- | ------- | ----- |
| `phaser` | ^4.0.0 | MIT | Game engine. |
| `vite` | ^5.4.0 | MIT | Dev server / build tool. |
| `pngjs` | ^7.x (devDependency) | MIT | PNG read/write. Used only by `scripts/*` (asset processing); not bundled into game. |
| `canvas` | ^3.x (devDependency) | MIT | Canvas2D API for Node. Used only by `scripts/make-icons.mjs` for image composition + text rendering; not bundled into game. |
