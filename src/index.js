import { Game } from './Game.js';

// Catch errors early
window.onerror = (msg, src, line, col, err) => {
  console.error(`[ERROR] ${msg} at ${src}:${line}:${col}`, err);
};
window.addEventListener('unhandledrejection', e => {
  console.error('[PROMISE]', e.reason);
});

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

// Expose for debugging
window.game = game;
