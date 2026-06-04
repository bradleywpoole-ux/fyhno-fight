import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.js';

const SPEED = 200;
const SPRITE_HALF = 128;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.UI_BG);

    this.fyhno = this.add
      .sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'fyhno-idle')
      .setOrigin(0.5)
      .setScale(4);
    this.fyhno.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.dir = new Phaser.Math.Vector2();
  }

  update(_time, delta) {
    this.dir.set(
      (this.cursors.right.isDown ? 1 : 0) - (this.cursors.left.isDown ? 1 : 0),
      (this.cursors.down.isDown ? 1 : 0) - (this.cursors.up.isDown ? 1 : 0)
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
