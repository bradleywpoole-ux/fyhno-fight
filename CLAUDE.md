# Fyhno Fight — Instructions for Claude Code

## Project overview

Fyhno Fight is a 2D pixel-art platformer designed by **Lydia (age 10)** with her dad Brad. A young fire dragon named Fyhno flies through 25 levels to rescue her captured family and friends from an evil sorcerer, collecting coins, dodging enemies, and earning powers. Built with Phaser 4. Shipped as a PWA, played on iPad in landscape. This is Lydia's second project; the lessons from her first project (Soar) are baked into how we work here.

## Authoritative references

Read these before making any non-trivial decision:

- **[`docs/fyhno_fight_game_design.docx`](docs/fyhno_fight_game_design.docx)** — Lydia's full game design. Story, characters, controls, hearts, coins, the 25-level arc, the first three levels in detail, art strategy, risks. Every creative call is in here.
- **[`docs/fyhno_fight_phase_0_decisions.md`](docs/fyhno_fight_phase_0_decisions.md)** — The six architecture decisions made before any code. When something later asks "why did we choose X," the answer is here.

If a request to you contradicts either doc, ask Brad before proceeding.

## Phase 0 decisions (summary)

1. **Framework:** Phaser 4 (installed via npm). Updated from doc's "Phaser 3" default — Phaser 4 was released April 2026.
2. **Sprite resolution:** 32x32 base, scaled up via Phaser's pixel-art mode.
3. **Color palette:** Endesga 32, soft enforcement. Strict for Fyhno and UI; 4-6 palette colors + 1-2 accents per captive dragon; backgrounds guided but allowed to drift if forcing makes them ugly.
4. **Asset strategy (Path A, license-clean):** Environments/effects/UI from Kenney only (CC0); heroes/characters from Midjourney; music CC0 only; fonts CC0 pixel-art only. **Every asset recorded in `ASSETS.md`** at download time with source and license.
5. **Repo structure (hybrid):** One `GameScene.js` runs all levels from JSON files in `src/data/level-XX.json`. The five boss levels (5, 10, 15, 20, 25) each get an additional `src/boss-logic/boss-XX.js` for their unique fight code.
6. **Save state:** `localStorage` wrapped by `src/services/SaveManager.js`. Versioned schema, single source of truth. The rest of the code never touches `localStorage` directly. (Not built yet — next step after scaffold.)

## Working rhythm — Lydia is the design and art authority

Lydia owns every visual, level layout, and creative call. Phase 0 was technical-only by design and is done; from Phase 1 on, anything visual, narrative, or game-feel is hers.

**When you hit a moment that needs her call — sprite look, color choice, coin patterns, captive names, level layouts, win-screen feel, music pick, anything Lydia would have an opinion about — flag it clearly with "Lydia's call:" so Brad pauses and brings her in instead of deciding himself.** Same pattern as Soar. It keeps her ownership real and keeps Brad from accidentally becoming a bottleneck on his daughter's own game.

## Soar lessons (carried forward — apply them)

These are the discipline checks. They are why Phase 0 happened before Phase 1.

- **Design before architecture.** The game design document existed in full before any architecture talk.
- **Architecture before code.** The six Phase 0 decisions were made before any file was written.
- **Don't ship half-baked.** Level 1 is finished before Level 2 starts. Each level is actually good, not "good enough."
- **Don't rework if we can plan instead.** Pause and plan when you feel a fork coming. The Soar trap was building first, deciding later, then rebuilding. We don't do that here.

## Phase 1 — complete (2026-06-18)

Shipped a live, playable test build at **https://bradleywpoole-ux.github.io/fyhno-fight/** containing: title screen with Fyhno (idle pose), GameScene with mountain-sky background and flying Fyhno controlled by arrow keys + on-screen D-pad, 3-heart UI placeholder (no damage logic yet), looping main theme music. Repo deploys automatically on push to main via GitHub Actions.

What this means: the framework is proven end-to-end. Phaser 4 + Vite + PWA + GitHub Pages + subdirectory base path + service worker all working together. From here, every change is content, not plumbing.

## Operational habits established in Phase 1

- **SW cache invalidation:** every commit that ships visible changes bumps `CACHE_VERSION` in `public/service-worker.js` (e.g. `fyhno-fight-v3` → `v4`). Without this, the iPad's installed PWA keeps serving cached old content. Format is sequential — no semantic meaning, just an invalidation key.
- **iPad two-launch update pattern:** after a deploy, the iPad PWA needs to be launched once (downloads new SW + purges old cache in the background), closed, then relaunched (serves fresh content). Documented in the SW header comment.
- **Asset paper trail:** every new asset gets recorded in `ASSETS.md` at the moment it enters the repo. Verified up-to-date through Phase 1.
- **Static files live in `public/`**, not at repo root. Vite copies `public/` verbatim into `dist/` during build. Anything outside `public/` won't be in the production build unless it's imported by source code.

## Polish items deferred (not blocking Phase 2)

- **iPad canvas centering** is currently solved by a CSS workaround (`body { display: flex; ... }`) rather than tuning Phaser's `scale.mode` / `scale.autoCenter`. The CSS fix works around iOS PWA's 100vh quirk. Cleaner long-term fix would be to investigate Phaser's scale-to-fit behavior on iOS standalone and address at the engine level. Low priority — current solution works.
- **Source-PNG bloat:** `public/assets/sprites/fyhno/fyhno-source-*.png` and `mountain-sky-source.png` together add ~5 MB to every deploy. They're masters, not loaded by the game. Standard fix: split into `public/assets/` (game-ready) + `art-source/` (masters), update `scripts/strip-bg.mjs` and `scripts/resize-bg.mjs` accordingly. Defer until deploy size becomes annoying.
- **`src/services/SaveManager.js`** exists as a scaffold (loaded on boot via `main.js`) but no game state flows through it yet. Real implementation needed when Phase 2+ introduces coin counts, hearts state, captives rescued, accessories unlocked.
- **Dev-mode SW caching:** the SW registers in `npm run dev` mode too, which can cache stale HMR'd assets across reloads. Easy fix when needed: gate registration on `location.hostname !== 'localhost'` in `index.html`.
- **PWA splash screen** uses default iOS look. If Lydia wants a custom splash, that's a separate piece of art + manifest config.
- **Coin spin animation:** the static gold coin (`public/assets/sprites/ui/coin.png`) was designed as frame 1 of a future 4-frame spin (per the design doc's "spinning animation" note). Frames 2–4 (mid-rotation 3/4 view, edge-on white strip, mirrored 3/4 view) can be generated by extending `scripts/make-coin.mjs` and wired into Phaser as a sprite-sheet animation. Defer until Lydia asks; static coin reads fine.
- **CC0 pixel-art font for UI text:** the Phase 2 coin counter and the PWA icon's "Fyhno" label use Phaser/Canvas `Text` with `bold monospace`. The smooth anti-aliased glyphs sit slightly oddly next to chunky pixel sprites. Per Phase 0 ("Fonts: CC0 pixel-art fonts only"), the right fix is a pixel font Lydia picks — own dedicated session. All UI text — counter, win screens, level select — swaps in one pass once she picks.
- **Parallax background art:** Phase 2 step 3 ships a 2-layer placeholder (solid sky + 4× tiled `mountain-sky.png` at scroll factor 0.5). The mountain image is not tileable so a visible seam appears every viewport-width. The mountain band also only covers the upper half of the 1440-tall world; the lower half shows solid sky color. Replace with proper layered art Lydia picks — Kenney CC0 parallax pack, new Midjourney generations, or her own — once we hit the parallax-art session.
- **Dev-only 'C'-to-complete shortcut** in `GameScene.update()` triggers `completeLevel()` instantly to speed up testing. Strip the listener before any real ship (it's marked with a `DEV-ONLY:` comment).
