import { writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

// Endesga 32 — RGBA
const T = [0, 0, 0, 0];             // transparent
const X = [0xa2, 0x26, 0x33, 0xff]; // red_blood   (outline)
const H = [0xe4, 0x3b, 0x44, 0xff]; // red_bright  (fill)
const L = [0xea, 0xd4, 0xaa, 0xff]; // skin_light  (highlight)

// 8 wide × 7 tall
const pattern = [
  [T, X, X, T, T, X, X, T],
  [X, H, L, X, X, H, H, X],
  [X, L, L, H, H, H, H, X],
  [X, H, H, H, H, H, H, X],
  [T, X, H, H, H, H, X, T],
  [T, T, X, H, H, X, T, T],
  [T, T, T, X, X, T, T, T],
];

const WIDTH = 8;
const HEIGHT = 7;
const OUT_PATH = 'assets/sprites/ui/heart.png';

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
console.log(`Wrote ${WIDTH}x${HEIGHT} heart sprite: ${OUT_PATH}`);
