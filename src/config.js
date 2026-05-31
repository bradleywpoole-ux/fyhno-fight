// Game-wide constants. Imported by main.js and any scene that needs them.

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// Sprites are authored at 32x32 and scaled up for display via Phaser's pixel-art mode.
export const SPRITE_BASE = 32;
export const DISPLAY_SCALE = 2;

// Endesga 32 palette — designed by Joran "Endesga" Mol.
// Soft enforcement: strict for Fyhno and UI, accents allowed for captives, guided for backgrounds.
export const ENDESGA_32 = {
  red_dark: '#be4a2f',
  red_mid: '#d77643',
  skin_light: '#ead4aa',
  skin_mid: '#e4a672',
  brown_mid: '#b86f50',
  brown_dark: '#733e39',
  brown_darkest: '#3e2731',
  red_blood: '#a22633',
  red_bright: '#e43b44',
  orange: '#f77622',
  yellow_orange: '#feae34',
  yellow: '#fee761',
  green_bright: '#63c74d',
  green_mid: '#3e8948',
  green_dark: '#265c42',
  green_darkest: '#193c3e',
  blue_dark: '#124e89',
  blue_mid: '#0099db',
  cyan: '#2ce8f5',
  white: '#ffffff',
  gray_light: '#c0cbdc',
  gray_mid: '#8b9bb4',
  gray_dark: '#5a6988',
  navy_mid: '#3a4466',
  navy_dark: '#262b44',
  black: '#181425',
  pink_hot: '#ff0044',
  purple_dark: '#68386c',
  pink_mid: '#b55088',
  pink_light: '#f6757a',
  tan_light: '#e8b796',
  tan_mid: '#c28569',
};

// Semantic aliases — code refers to these so palette swaps stay easy.
export const COLORS = {
  HERO_RED: ENDESGA_32.red_bright,
  HERO_ORANGE: ENDESGA_32.orange,
  UI_TEXT: ENDESGA_32.white,
  UI_TEXT_DIM: ENDESGA_32.gray_light,
  UI_BG: ENDESGA_32.black,
  UI_ACCENT: ENDESGA_32.yellow,
};
