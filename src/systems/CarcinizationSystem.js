import { CRAB_THRESHOLDS, ZERO_CRAB_BONUS } from '../data/evolution.js';

export class CarcinizationSystem {
  constructor(game) {
    this.game = game;
    this.value = 0;
    this.reachedThresholds = new Set();
  }

  reset() {
    this.value = 0;
    this.reachedThresholds.clear();
  }

  add(amt) {
    this.value += amt;

    // Check if any thresholds have been newly reached
    for (const threshold of CRAB_THRESHOLDS) {
      if (this.value >= threshold.val && !this.reachedThresholds.has(threshold.val)) {
        this.reachedThresholds.add(threshold.val);
        this._applyReward(threshold);
      }
    }
  }

  _applyReward(threshold) {
    const player = this.game.player;

    // Apply bonus stats to player
    player.applyCrabBonus(threshold.bonus);

    // Visual/audio feedback
    this.game.particleSystem.emit(player.x, player.y, '#f80', 25, { speed: 200, life: 1.0 });
    this.game.particleSystem.addText(
      player.x,
      player.y - 40,
      threshold.name,
      '#f80'
    );
    this.game.particleSystem.addText(
      player.x,
      player.y - 60,
      threshold.desc,
      '#fa0'
    );
    this.game.camera.shake(6, 400);
    this.game.audio.playSfx('crab');
  }

  checkZeroBonus() {
    // If crab value is exactly 0 and player has unlocked 5+ evolutions,
    // apply the zero-crab bonus (anti-crab path reward)
    if (this.value !== 0) return false;
    if (this.game.evolution.unlockedCount < 6) return false; // base + 5 evolutions
    if (this.reachedThresholds.has('zero')) return false;

    this.reachedThresholds.add('zero');
    const player = this.game.player;

    player.applyCrabBonus(ZERO_CRAB_BONUS.bonus);

    this.game.particleSystem.emit(player.x, player.y, '#0ff', 25, { speed: 200, life: 1.0 });
    this.game.particleSystem.addText(
      player.x,
      player.y - 40,
      '反蟹化觉醒',
      '#0ff'
    );
    this.game.particleSystem.addText(
      player.x,
      player.y - 60,
      ZERO_CRAB_BONUS.desc,
      '#0ff'
    );
    this.game.camera.shake(6, 400);
    this.game.audio.playSfx('crab');
    return true;
  }

  getProgress() {
    // Find the next threshold above current value
    let next = null;
    let current = null;

    const sorted = [...CRAB_THRESHOLDS].sort((a, b) => a.val - b.val);

    for (const t of sorted) {
      if (this.value >= t.val) {
        current = t;
      } else {
        if (!next) next = t;
      }
    }

    if (!next) {
      // All thresholds reached
      return {
        current: current,
        next: null,
        progress: 1.0
      };
    }

    const prevVal = current ? current.val : 0;
    const range = next.val - prevVal;
    const progress = range > 0 ? (this.value - prevVal) / range : 0;

    return {
      current: current,
      next: next,
      progress: Math.max(0, Math.min(1, progress))
    };
  }

  getLevel() {
    let count = 0;
    for (const t of CRAB_THRESHOLDS) {
      if (this.reachedThresholds.has(t.val)) count++;
    }
    return count;
  }
}
