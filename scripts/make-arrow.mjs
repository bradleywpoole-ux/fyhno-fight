import { writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

// Endesga 32 — RGBA
// Pattern characters: '.' = B, 'X' = X, 'H' = H, 'L' = L
const B = [58, 68, 102, 153];    // navy_mid @ 60% alpha — button background
const X = [38, 43, 68, 255];     // navy_dark — outline
const H = [255, 255, 255, 255];  // white — arrow fill
const L = [192, 203, 220, 255];  // gray_light — arrow highlight (upper-left)

// 16 wide × 16 tall — D-pad arrow button (points up; rotate at draw time for L/R/D)
const pattern = [
  [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
  [X, B, B, B, B, B, B, B, B, B, B, B, B, B, B, X],
  [X, B, B, B, B, B, B, L, X, B, B, B, B, B, B, X],
  [X, B, B, B, B, B, L, H, H, X, B, B, B, B, B, X],
  [X, B, B, B, B, L, H, H, H, H, X, B, B, B, B, X],
  [X, B, B, B, L, H, H, H, H, H, H, X, B, B, B, X],
  [X, B, B, L, H, H, H, H, H, H, H, H, X, B, B, X],
  [X, B, L, H, H, H, H, H, H, H, H, H, H, X, B, X],
  [X, B, X, X, X, X, X, X, X, X, X, X, X, X, B, X],
  [X, B, B, B, B, B, B, B, B, B, B, B, B, B, B, X],
  [X, B, B, B, B, B, B, B, B, B, B, B, B, B, B, X],
  [X, B, B, B, B, B, B, B, B, B, B, B, B, B, B, X],
  [X, B, B, B, B, B, B, B, B, B, B, B, B, B, B, X],
  [X, B, B, B, B, B, B, B, B, B, B, B, B, B, B, X],
  [X, B, B, B, B, B, B, B, B, B, B, B, B, B, B, X],
  [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
];

const WIDTH = 16;
const HEIGHT = 16;
const OUT_PATH = 'assets/sprites/ui/dpad-arrow.png';

const png = new PNG({ width: WIDTH, height: HEIGHT });
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const [r, g, b, a] = pattern[y][x];
    const idx = (y * WIDTH + x) * 4;
    png.data[idx]     = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;
    png.data[idx + 3] = a;
  }
}

writeFileSync(OUT_PATH, PNG.sync.write(png));
console.log(`Wrote ${WIDTH}x${HEIGHT} D-pad arrow sprite: ${OUT_PATH}`);
