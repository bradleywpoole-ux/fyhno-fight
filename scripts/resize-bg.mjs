import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

const [, , inputPath, outputPath, wArg, hArg] = process.argv;
if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/resize-bg.mjs <input.png> <output.png> [width=1280] [height=720]');
  process.exit(1);
}

const dstW = wArg ? parseInt(wArg, 10) : 1280;
const dstH = hArg ? parseInt(hArg, 10) : 720;

const src = PNG.sync.read(readFileSync(inputPath));
const { width: srcW, height: srcH, data: srcData } = src;

const dst = new PNG({ width: dstW, height: dstH });
const dstData = dst.data;

for (let y = 0; y < dstH; y++) {
  const sy = Math.min(srcH - 1, Math.floor((y + 0.5) * srcH / dstH));
  for (let x = 0; x < dstW; x++) {
    const sx = Math.min(srcW - 1, Math.floor((x + 0.5) * srcW / dstW));
    const srcIdx = (sy * srcW + sx) * 4;
    const dstIdx = (y * dstW + x) * 4;
    dstData[dstIdx]     = srcData[srcIdx];
    dstData[dstIdx + 1] = srcData[srcIdx + 1];
    dstData[dstIdx + 2] = srcData[srcIdx + 2];
    dstData[dstIdx + 3] = srcData[srcIdx + 3];
  }
}

writeFileSync(outputPath, PNG.sync.write(dst));
console.log(`Resized ${srcW}x${srcH} → ${dstW}x${dstH} (nearest-neighbor)`);
console.log(`Wrote: ${outputPath}`);
