import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const cx = GAME_WIDTH / 2;

    this.add
      .text(cx, GAME_HEIGHT * 0.35, 'Fyhno Fight', {
        fontFamily: 'monospace',
        fontSize: '96px',
        color: COLORS.HERO_ORANGE,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, GAME_HEIGHT * 0.5, 'Designed by Lydia', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: COLORS.UI_TEXT,
      })
      .setOrigin(0.5);

    this.add
      .text(cx, GAME_HEIGHT * 0.75, 'Tap to start', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: COLORS.UI_TEXT_DIM,
      })
      .setOrigin(0.5);
  }
}
