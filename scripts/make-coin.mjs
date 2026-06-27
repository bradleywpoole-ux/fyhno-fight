import { writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

// Endesga 32 — RGBA
// Pattern characters: '.' = T, 'X' = X, 'H' = H, 'L' = L
const T = [0, 0, 0, 0];             // transparent
const X = [0xbe, 0x4a, 0x2f, 0xff]; // red_dark      (outline)
const H = [0xfe, 0xae, 0x34, 0xff]; // yellow_orange (gold body)
const L = [0xfe, 0xe7, 0x61, 0xff]; // yellow        (highlight, upper-left)

// 8 wide × 8 tall — symmetric gold coin (Lydia's Option 4, spin deferred)
const pattern = [
  [T, T, X, X, X, X, T, T],
  [T, X, L, L, H, H, X, T],
  [X, L, L, L, H, H, H, X],
  [X, L, L, H, H, H, H, X],
  [X, H, H, H, H, H, H, X],
  [X, H, H, H, H, H, H, X],
  [T, X, H, H, H, H, X, T],
  [T, T, X, X, X, X, T, T],
];

const WIDTH = 8;
const HEIGHT = 8;
const OUT_PATH = 'public/assets/sprites/ui/coin.png';

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
console.log(`Wrote ${WIDTH}x${HEIGHT} coin sprite: ${OUT_PATH}`);
