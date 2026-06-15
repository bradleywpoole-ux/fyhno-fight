import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

const [, , PATH] = process.argv;
if (!PATH) {
  console.error('Usage: node scripts/strip-bg.mjs <path-to-png>');
  process.exit(1);
}

const TOLERANCE = 12;

const png = PNG.sync.read(readFileSync(PATH));
const { width, height, data } = png;

const br = data[0], bg = data[1], bb = data[2];

let changed = 0;
for (let i = 0; i < data.length; i += 4) {
  if (
    Math.abs(data[i]     - br) <= TOLERANCE &&
    Math.abs(data[i + 1] - bg) <= TOLERANCE &&
    Math.abs(data[i + 2] - bb) <= TOLERANCE
  ) {
    data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 0;
    changed++;
  }
}

writeFileSync(PATH, PNG.sync.write(png));
console.log(`Sampled bg: rgb(${br}, ${bg}, ${bb})`);
console.log(`Replaced ${changed} / ${width * height} pixels with transparency`);
