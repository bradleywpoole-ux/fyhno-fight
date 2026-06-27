import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

const SPEED = 200;
const SPRITE_HALF = 128;
const HEART_SCALE = 4;
const HEART_GAP = 8;
const HEART_MARGIN = 16;
const HEART_W = 8 * HEART_SCALE;
const COIN_COUNTER_MARGIN = 16;
const COIN_COUNTER_FONT_SIZE = 32;
const COIN_COUNTER_GAP = 8;
const COIN_COUNTER_ICON_SCALE = 4;
const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 1440;
const CAMERA_DEADZONE_W = 400;
const CAMERA_DEADZONE_H = 240;
const CAMERA_LERP = 0.1;
const CAPTIVE_X = 4800;
const CAPTIVE_Y = 720;
const CAPTIVE_W = 64;
const CAPTIVE_H = 96;
const SKY_COLOR = 0x0099db;
const DPAD_SCALE = 4;
const DPAD_BTN = 16 * DPAD_SCALE;
const DPAD_CENTER_X = 96;
const DPAD_CENTER_Y = GAME_HEIGHT - 96;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, SKY_COLOR)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    for (let i = 0; i < 4; i++) {
      this.add
        .image(i * GAME_WIDTH, 0, 'mountain-sky')
        .setOrigin(0, 0)
        .setScrollFactor(0.5);
    }

    this.coins = [];
    [[590, 400], [2500, 200], [4400, 1100]].forEach(([x, y]) => {
      const coin = this.physics.add.image(x, y, 'coin').setOrigin(0.5).setScale(4);
      coin.body.setAllowGravity(false);
      coin.setImmovable(true);
      this.coins.push(coin);
    });
    this.textures.get('coin').setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.fyhno = this.physics.add
      .sprite(640, 720, 'fyhno-flying')
      .setOrigin(0.5)
      .setScale(4);
    this.fyhno.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.fyhno.body.setAllowGravity(false);
    this.fyhno.body.setSize(40, 40);

    this.captive = this.add.rectangle(CAPTIVE_X, CAPTIVE_Y, CAPTIVE_W, CAPTIVE_H, 0xff0044);
    this.physics.add.existing(this.captive, true);
    this.add
      .text(CAPTIVE_X, CAPTIVE_Y - CAPTIVE_H / 2 - 8, 'CAPTIVE', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 1);

    this.levelComplete = false;

    this.physics.add.overlap(this.fyhno, this.coins, (_fyhno, coin) => {
      coin.destroy();
      this.coinCount += 1;
      this.coinCountText.setText(String(this.coinCount));
      this.coinIcon.x = this.coinCountText.x - this.coinCountText.width - COIN_COUNTER_GAP;
    });
    this.physics.add.overlap(this.fyhno, this.captive, () => this.completeLevel());

    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      const heart = this.add
        .image(HEART_MARGIN + i * (HEART_W + HEART_GAP), HEART_MARGIN, 'heart')
        .setOrigin(0, 0)
        .setScale(HEART_SCALE)
        .setScrollFactor(0);
      this.hearts.push(heart);
    }
    this.textures.get('heart').setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.coinCount = 0;
    this.coinCountText = this.add
      .text(GAME_WIDTH - COIN_COUNTER_MARGIN, COIN_COUNTER_MARGIN, '0', {
        fontFamily: 'monospace',
        fontSize: `${COIN_COUNTER_FONT_SIZE}px`,
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0);

    this.coinIcon = this.add
      .image(0, COIN_COUNTER_MARGIN, 'coin')
      .setOrigin(1, 0)
      .setScale(COIN_COUNTER_ICON_SCALE)
      .setScrollFactor(0);
    this.coinIcon.x = this.coinCountText.x - this.coinCountText.width - COIN_COUNTER_GAP;

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
        .setInteractive()
        .setScrollFactor(0);
      btn.on('pointerdown',      () => { this.touchInput[dir] = true; });
      btn.on('pointerup',        () => { this.touchInput[dir] = false; });
      btn.on('pointerupoutside', () => { this.touchInput[dir] = false; });
    });
    this.textures.get('dpad-arrow').setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.fyhno, true, CAMERA_LERP, CAMERA_LERP);
    this.cameras.main.setDeadzone(CAMERA_DEADZONE_W, CAMERA_DEADZONE_H);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.dir = new Phaser.Math.Vector2();

    // DEV-ONLY: press 'C' to complete the level instantly (skip the flight to x=4800). Strip before any real ship.
    this.input.keyboard.on('keydown-C', () => this.completeLevel());
  }

  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 'LEVEL 1', {
        fontFamily: 'monospace',
        fontSize: '72px',
        color: '#feae34',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, 'COMPLETED', {
        fontFamily: 'monospace',
        fontSize: '56px',
        color: '#feae34',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
  }

  update(_time, delta) {
    if (this.levelComplete) return;

    this.dir.set(
      (this.cursors.right.isDown || this.touchInput.right ? 1 : 0) - (this.cursors.left.isDown || this.touchInput.left ? 1 : 0),
      (this.cursors.down.isDown || this.touchInput.down ? 1 : 0) - (this.cursors.up.isDown || this.touchInput.up ? 1 : 0)
    );
    if (this.dir.lengthSq() > 0) this.dir.normalize();

    const step = SPEED * (delta / 1000);
    this.fyhno.x = Phaser.Math.Clamp(
      this.fyhno.x + this.dir.x * step,
      SPRITE_HALF,
      WORLD_WIDTH - SPRITE_HALF
    );
    this.fyhno.y = Phaser.Math.Clamp(
      this.fyhno.y + this.dir.y * step,
      SPRITE_HALF,
      WORLD_HEIGHT - SPRITE_HALF
    );
  }
}
