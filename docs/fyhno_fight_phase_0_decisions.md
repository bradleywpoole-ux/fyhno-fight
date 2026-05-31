# Fyhno Fight — Phase 0 Architecture Decisions

**Designed by:** Lydia (age 10), with Brad and Claude
**Phase 0 completed:** May 31, 2026
**Status:** All six architecture questions answered. Ready for Phase 1.

---

## What Phase 0 was

Before writing any code for Fyhno Fight, Brad and Claude walked through six architecture decisions one at a time. This document records the calls made, the reasoning, and the residual risks. It is a permanent reference for the project — when a question comes up later about why we chose X over Y, the answer lives here.

Lydia was not in Phase 0 by design — these are technical infrastructure decisions, not creative or design calls. Lydia's authority resumes in Phase 1 for every visual, design, and level decision.

---

## The six decisions

### 1. Game framework — Phaser 3

The industry standard for 2D web games. Handles every feature in the design doc out of the box: sprite sheets, animations, Arcade physics with per-object gravity toggle (critical for free-flight plus possible land-and-walk), scene management (Title, Level, Win, Village, Chest), collision detection, particle effects, sound. Has the largest community and documentation surface — when something breaks at 9pm on a Tuesday, the answer exists.

Rejected: vanilla JS (would require writing a small game engine before building the game), Kaboom.js or KAPLAY (friendlier on day one but smaller community, less battle-tested for 25-level scope, recent maintainer change introduced uncertainty).

Key Phaser feature we will lean on: Scenes map directly to the design doc's screens (Title, GameScene, WinScene, ChestScene, VillageScene). Arcade physics per-object gravity setting means the land-and-walk experiment from the doc is roughly 5 lines of code instead of an afternoon's work in vanilla.

### 2. Sprite resolution — 32x32 base

Enough detail for visually distinct captive dragons and recognizable accessories (crown, hairband, fire boots, wizard hat). Deepest free-library support at this size. Midjourney's sweet spot for pixel-art prompts — enough canvas to express character clearly, few enough pixels to clean up cleanly.

Rejected: 16x16 (too little room for visible accessories and 24 distinct dragons), 64x64 (4x the asset data, animation work explodes, free library ecosystem thins out).

On-screen display size is independent — Phaser's pixel art mode scales 32x32 sprites cleanly to whatever size each level needs.

### 3. Color palette — Soft palette, Endesga 32

Anchored on the Endesga 32 palette (a 32-color palette designed by pixel artist Endesga / Joran Mol, widely used in indie pixel art). Enforcement is soft, not strict:

- Fyhno and UI elements: strictly snapped to palette (she is the consistent character — like Ki Ki was for Soar)
- Captive dragons: 4-6 palette colors plus 1-2 unique accent colors per dragon (each captive has visual identity)
- Backgrounds and tilesets: guided toward palette but allowed slight drift if forcing makes them ugly

Rejected: strict 16-color palette (too restrictive for 32x32 plus 25 levels plus 24 unique dragons), free palette (recreates the Soar consistency problem at scale).

Pipeline for every Midjourney character: generate with "pixel art, Endesga 32 palette" in prompt, downsample to 32x32, snap colors to palette in image editor (~30 seconds per sprite). This solves the Soar problem by design.

### 4. Asset libraries — Three layers, Path A (license-clean)

After a separate license-risk discussion, we committed to Path A: practical zero-risk on a free family project, accepting only the residual AI-image copyright ambiguity which has no practical implications here.

- Environments, effects, UI tiles: Kenney only (CC0 — public domain, no attribution required, no license complexity)
- Heroes and characters: Midjourney (Fyhno, 24 captives, sorcerer, bosses, enemies)
- Music: CC0 only — specifically CC0, not "free" generally
- Fonts: CC0 pixel-art fonts only
- Phaser: MIT licensed (handled automatically by Claude Code at setup)

Removed from the original plan: the "opportunistic small packs" layer. We stay Kenney-only for non-character art to keep the license surface zero.

ASSETS.md in the repo will record every asset's source and license at the moment of download.

### 5. Repo structure — Hybrid: data for levels, code for boss logic

Every regular level is a JSON file (level-XX.json) read by a single GameScene.js. The five boss levels (5, 10, 15, 20, 25) additionally have a code file (boss-XX.js) for their unique fight logic.

Rejected: levels-as-code per level (couples engine to content, levels cannot be edited without touching code), one-big-levels.json (huge file, noisy git history, conflicts hard to untangle), pure data (boss logic does not fit cleanly).

Planned repo layout:

fyhno-fight/
- index.html
- README.md
- ASSETS.md
- LICENSE
- manifest.json
- service-worker.js
- src/
  - main.js
  - config.js
  - scenes/ (BootScene, TitleScene, LevelSelectScene, GameScene, WinScene, ChestScene, VillageScene)
  - entities/ (Fyhno, Coin, Enemy, EnemyCharger, Fireball, etc.)
  - boss-logic/ (boss-05 through boss-25, escape hatch for boss levels)
  - services/SaveManager.js
  - data/ (level-01.json through level-25.json, unlocks.json)
- assets/
  - sprites/ (fyhno, captives, enemies, ui)
  - tilesets/ (mountain, forest, caves, fortress)
  - effects/
  - audio/
  - fonts/

When Lydia decides level 1 needs the coins shaped like a heart instead of a wave, the change is one JSON file. Engine code is never touched. Zero risk of breaking other levels.

### 6. Save state — localStorage with SaveManager wrapper

A single src/services/SaveManager.js file owns all localStorage interaction. The rest of the codebase calls methods like saveManager.unlockAccessory("crown") or saveManager.markLevelComplete(7) and never touches localStorage directly.

Built in from day one:
- Versioning — every save tagged with a schema version. Future additions get clean migration paths instead of breaking old saves.
- Single source of truth — one file knows about localStorage. Refactoring later is a one-file operation.
- Reset Progress — one method call. Useful for testing, useful for cousins playing fresh.
- dumpState() — pretty-prints current save to console. Debugging progression bugs becomes a 10-second task.
- Future profiles — easy extension if and when we want separate saves per cousin.

Rejected: raw localStorage (Soar's pattern — fine for Soar's tiny state, painful for Fyhno Fight's structured progression), IndexedDB (overkill, more complex API, iOS Safari quirks), cloud save (requires backend, costs money, privacy concerns with a minor user, completely unnecessary for a single-iPad family game).

---

## What we are explicitly accepting (residual risks)

Recorded so they do not sneak up on us:

1. Phaser 3 vs 4 timing. Phaser 4 has been in development. Right before we install in Phase 1, do a fresh check on which version is the stable recommendation. Default plan: Phaser 3. Pivot only if Phaser 4 has landed stable with a clean migration story.

2. Endesga 32's continued currency. Strong palette today; pixel-art community trends shift. Quick verification before art generation starts in Phase 1.

3. Kenney pack specifics. We have committed to "Kenney as backbone" without picking which specific packs. That is a Phase 1 task at the moment we are ready to download — not blocking anything now.

4. Land-and-walk mechanic. Design doc says try it, pivot to flight-only if it is a quagmire. Phaser's per-object gravity makes this technically easy; the level design implications are where the cost hides. Decision after level 1.

5. AI-generated image copyright ambiguity. Path A accepts this. Free family game, no practical risk, decision recorded.

---

## Phase 1 plan (next session)

"Fyhno and the empty level." Order:

1. Verify two open items — Phaser version, Endesga 32 currency. ~10 minutes.
2. Create the new GitHub repo — bradleywpoole-ux/fyhno-fight.
3. Scaffold project structure — Claude Code creates all folders planned above, plus LICENSE, README.md, ASSETS.md, manifest.json, service-worker.js, Phaser config, empty BootScene and TitleScene to verify Phaser runs on iPad.
4. Build SaveManager.js — write once, test, then never think about save plumbing again.
5. Generate Fyhno in Midjourney — 4 pixel-art options, palette-aware prompts. Lydia picks.
6. Build Fyhno's sprite states — idle, flying — palette-snap them, load into game.
7. Build empty Mountain Sky level — Kenney mountain tileset, scrolling, controls, hearts displayed, music playing, no goal yet. Phase 1 milestone from doc: "Fyhno flying in the world that will become level 1."

Steps 1-4 are Brad-and-Claude work. Step 5 is Lydia. Steps 6-7 are Brad-and-Claude with Lydia checking in.

---

## Working rhythm (recorded)

Phase 0 = Brad and Claude, technical only. Done.

Phase 1 onward = Lydia is the design and art authority on every visual, level layout, and creative call. When those moments arrive, Claude flags them clearly with "Lydia's call" so Brad knows to pause and bring her in rather than answering himself.

Same pattern as Soar — keeps her ownership real, keeps Brad from accidentally becoming a bottleneck on her own game.

---

Phase 0 complete. Architecture decisions made before any code, exactly as the design doc prescribed. The Soar lesson applied.

Phase 1 next.
