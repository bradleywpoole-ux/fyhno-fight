import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'node:fs';

const FYHNO_PATH = 'assets/sprites/fyhno/fyhno-flying.png';
const BG_COLOR = '#0099db'; // Endesga 32 blue_mid

const icons = [
  {
    size: 192,
    out: 'assets/sprites/ui/icon-192.png',
    fyhnoSize: 128,
    fyhnoY: 12,
    fontSize: 36,
    textBaselineY: 176,
  },
  {
    size: 512,
    out: 'assets/sprites/ui/icon-512.png',
    fyhnoSize: 384,
    fyhnoY: 24,
    fontSize: 90,
    textBaselineY: 480,
  },
];

const fyhno = await loadImage(FYHNO_PATH);

for (const cfg of icons) {
  const canvas = createCanvas(cfg.size, cfg.size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, cfg.size, cfg.size);

  ctx.imageSmoothingEnabled = false;
  const fyhnoX = (cfg.size - cfg.fyhnoSize) / 2;
  ctx.drawImage(fyhno, fyhnoX, cfg.fyhnoY, cfg.fyhnoSize, cfg.fyhnoSize);

  ctx.fillStyle = 'white';
  ctx.font = `bold ${cfg.fontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Fyhno', cfg.size / 2, cfg.textBaselineY);

  writeFileSync(cfg.out, canvas.toBuffer('image/png'));
  console.log(`Wrote ${cfg.size}×${cfg.size}: ${cfg.out}`);
}
