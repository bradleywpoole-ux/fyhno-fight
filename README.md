# Fyhno Fight

A 2D pixel-art platformer where a young red-and-orange fire dragon named Fyhno flies through 25 levels to rescue her captured family and friends from an evil sorcerer — collecting coins, dodging enemies, earning powers, and growing from a scared survivor into the hero who frees her whole village.

**Designed by Lydia (age 10)** with her dad Brad. Built with Claude Code.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).

## Build for production

```bash
npm run build
npm run preview
```

## Project documents

- [`docs/fyhno_fight_game_design.docx`](docs/fyhno_fight_game_design.docx) — the full game design, all of Lydia's calls
- [`docs/fyhno_fight_phase_0_decisions.md`](docs/fyhno_fight_phase_0_decisions.md) — the six architecture decisions made before Phase 1

## Status

Phase 1 scaffold complete. Phaser 4 boots, Title screen renders. No game logic yet.

## TODOs from scaffold

- Create real PWA icons at `assets/sprites/ui/icon-192.png` and `icon-512.png` (manifest currently references these paths but the files do not exist)
- Build `src/services/SaveManager.js` (next step)
- Generate Fyhno's sprite (Lydia picks from 4 Midjourney options)

## Credits

- Game design, art direction, story, level layouts: Lydia
- Code & infrastructure: Brad + Claude Code
- Engine: [Phaser 4](https://phaser.io) (MIT)
