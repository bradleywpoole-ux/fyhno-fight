import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

const SPEED = 200;
const SPRITE_HALF = 128;
const HEART_SCALE = 4;
const HEART_GAP = 8;
const HEART_MARGIN = 16;
const HEART_W = 8 * HEART_SCALE;
const DPAD_SCALE = 4;
const DPAD_BTN = 16 * DPAD_SCALE;
const DPAD_CENTER_X = 96;
const DPAD_CENTER_Y = GAME_HEIGHT - 96;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.add.image(0, 0, 'mountain-sky').setOrigin(0, 0);

    this.fyhno = this.add
      .sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'fyhno-flying')
      .setOrigin(0.5)
      .setScale(4);
    this.fyhno.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      const heart = this.add
        .image(HEART_MARGIN + i * (HEART_W + HEART_GAP), HEART_MARGIN, 'heart')
        .setOrigin(0, 0)
        .setScale(HEART_SCALE);
      this.hearts.push(heart);
    }
    this.textures.get('heart').setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.touchInput = { up: false, down: false, left: false, right: false };
    const dpadButtons = [
      { dir: 'up',    x: DPAD_CENTER_X,             y: DPAD_CENTER_Y - DPAD_BTN, rotation: 0 },
      { dir: 'right', x: DPAD_CENTER_X + DPAD_BTN,  y: DPAD_CENTER_Y,            rotation: Math.PI / 2 },
      { dir: 'down',  x: DPAD_CENTER_X,             y: DPAD_CENTER_Y + DPAD_BTN, rotation: Math.PI },
      { dir: 'left',  x: DPAD_CENTER_X - DPAD_BTN,  y: DPAD_CENTER_Y,            rotation: -Math.PI / 2 },
    ];
    dpadButtons.forEach(({ dir, x, y, rotation }) => {
      const btn = this.add
        .image(x, y, 'dpad-arrow')
        .setOrigin(0.5, 0.5)
        .setScale(DPAD_SCALE)
        .setRotation(rotation)
        .setInteractive();
      btn.on('pointerdown',      () => { this.touchInput[dir] = true; });
      btn.on('pointerup',        () => { this.touchInput[dir] = false; });
      btn.on('pointerupoutside', () => { this.touchInput[dir] = false; });
    });
    this.textures.get('dpad-arrow').setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.dir = new Phaser.Math.Vector2();
  }

  update(_time, delta) {
    this.dir.set(
      (this.cursors.right.isDown || this.touchInput.right ? 1 : 0) - (this.cursors.left.isDown || this.touchInput.left ? 1 : 0),
      (this.cursors.down.isDown || this.touchInput.down ? 1 : 0) - (this.cursors.up.isDown || this.touchInput.up ? 1 : 0)
    );
    if (this.dir.lengthSq() > 0) this.dir.normalize();

    const step = SPEED * (delta / 1000);
    this.fyhno.x = Phaser.Math.Clamp(
      this.fyhno.x + this.dir.x * step,
      SPRITE_HALF,
      GAME_WIDTH - SPRITE_HALF
    );
    this.fyhno.y = Phaser.Math.Clamp(
      this.fyhno.y + this.dir.y * step,
      SPRITE_HALF,
      GAME_HEIGHT - SPRITE_HALF
    );
  }
}
