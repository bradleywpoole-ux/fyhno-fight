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

## TODOs from scaffold

- Real PWA icons at `assets/sprites/ui/icon-{192,512}.png` (manifest references them, files don't exist yet)
- Build `src/services/SaveManager.js`
- Verify Phaser 4 installs cleanly from npm as `phaser@^4.0.0`; if not, find the correct package name
