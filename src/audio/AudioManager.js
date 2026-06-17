import { createSfx } from './sfx.js';
import { createBgm } from './bgm.js';

export class AudioManager {
  constructor() {
    this.ctx = null;        // AudioContext, lazy-init on first user interaction
    this.sfxGain = null;
    this.bgmGain = null;
    this.masterGain = null;
    this.sfx = {};          // named sfx buffer functions
    this.bgm = null;        // current bgm controller object
    this.bgmPlaying = false;
    this.muted = false;
  }

  init() {
    // Create AudioContext + gain node chain:  sfx/bgm -> master -> destination
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.connect(this.masterGain);

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.3;
    this.bgmGain.connect(this.masterGain);

    // Pre-generate sfx function map
    this.sfx = createSfx(this.ctx);
  }

  playSfx(name) {
    if (!this.ctx || this.muted) return;
    const fn = this.sfx[name];
    if (fn) fn(this.ctx, this.sfxGain);
  }

  startBgm(phase) {
    // phase: 'day' or 'night'
    if (!this.ctx || this.muted) return;
    this.stopBgm();
    this.bgm = createBgm(this.ctx, this.bgmGain, phase);
    this.bgmPlaying = true;
  }

  stopBgm() {
    if (this.bgm && this.bgm.stop) {
      try { this.bgm.stop(); } catch (e) { /* already stopped */ }
    }
    this.bgm = null;
    this.bgmPlaying = false;
  }

  updateBgm(phase) {
    // Switch bgm when the day/night phase changes
    if (!this.ctx) return;
    const isNight = (phase === 'night' || phase === 'dusk');
    const currentNight = this.bgm && this.bgm._night;
    if (isNight !== currentNight) {
      this.startBgm(isNight ? 'night' : 'day');
    }
  }

  toggle() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : 1;
    }
    if (this.muted) {
      this.stopBgm();
    }
  }
}
