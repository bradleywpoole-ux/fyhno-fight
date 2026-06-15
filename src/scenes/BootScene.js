import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.image('fyhno-idle', 'assets/sprites/fyhno/fyhno-idle.png');
    this.load.image('fyhno-flying', 'assets/sprites/fyhno/fyhno-flying.png');
    this.load.image('mountain-sky', 'assets/backgrounds/mountain-sky.png');
    this.load.image('heart', 'assets/sprites/ui/heart.png');
    this.load.audio('main-theme', 'assets/audio/main-theme.mp3');
  }

  create() {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Loading...', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: COLORS.UI_TEXT,
      })
      .setOrigin(0.5);

    this.time.delayedCall(200, () => this.scene.start('TitleScene'));

    const music = this.sound.add('main-theme', { loop: true, volume: 0.5 });
    music.play();
  }
}
