// ─── BiomeEffects.js ─── Environmental hazards per biome ───
import { CONFIG } from '../config.js';

export class BiomeEffects {
  constructor(game) {
    this.game = game;
    this.blizzardTimer = 0;
    this.blizzardActive = false;
    this.blizzardDuration = 8000;  // 8s blizzard
    this.blizzardCooldown = 20000; // 20s between blizzards
    this.blizzardClock = 15000;    // first blizzard after 15s
  }

  update(dt) {
    const g = this.game;
    const p = g.player;
    if (!p || p.dead) return;

    const biomeId = this._getPlayerBiome();
    const dtMs = dt * 1000;

    switch (biomeId) {
      case 0: this._rainforestEffects(p, dt); break;
      case 1: this._desertEffects(p, dt, g); break;
      case 2: this._tundraEffects(p, dt, dtMs); break;
      case 3: this._deepSeaEffects(p, dt); break;
    }
  }

  _getPlayerBiome() {
    const g = this.game;
    const p = g.player;
    if (!p || !g.tileMap || !g.tileMap.biomeMap) return 0;
    const c = Math.floor(p.x / CONFIG.TILE_SIZE);
    const r = Math.floor(p.y / CONFIG.TILE_SIZE);
    const i = r * CONFIG.MAP_COLS + c;
    if (i < 0 || i >= g.tileMap.biomeMap.length) return 0;
    return g.tileMap.biomeMap[i];
  }

  getPlayerBiome() {
    return this._getPlayerBiome();
  }

  // Rainforest: swamp areas cause extra slowdown (handled by tile speed)
  _rainforestEffects(p, dt) {
    // Swamp/mud extra slow is handled by tile speed multiplier already
    // No additional damage effect
  }

  // Desert: daytime heat damage (1HP/s), oasis/water tiles heal
  _desertEffects(p, dt, game) {
    const dn = this.game.dayNight;
    // Heat damage during day only
    if (dn && (dn.phase === 'day' || dn.phase === 'dawn')) {
      // Check if player is on water (oasis) — no damage
      const tile = this.game.tileMap.getAt(p.x, p.y);
      if (tile === 2) { // WATER tile — oasis healing
        p.heal(2 * dt);
      } else {
        // Heat damage: 1 HP/s
        if (!p.traits.includes('heat_resist')) {
          p.hp -= 1 * dt;
          if (p.hp < 1) p.hp = 1; // Don't kill from heat alone
        }
      }
    }
  }

  // Tundra: periodic blizzard events (reduced vision + speed debuff)
  _tundraEffects(p, dt, dtMs) {
    this.blizzardClock -= dtMs;

    if (this.blizzardActive) {
      this.blizzardTimer -= dtMs;
      if (this.blizzardTimer <= 0) {
        this.blizzardActive = false;
        this.blizzardClock = this.blizzardCooldown;
      }
    } else if (this.blizzardClock <= 0) {
      this.blizzardActive = true;
      this.blizzardTimer = this.blizzardDuration;
    }
  }

  // Deep sea: pressure damage when far from center of quadrant
  _deepSeaEffects(p, dt) {
    const centerX = CONFIG.WORLD_WIDTH * 0.75;
    const centerY = CONFIG.WORLD_HEIGHT * 0.75;
    const dist = Math.hypot(p.x - centerX, p.y - centerY);
    const maxDist = CONFIG.WORLD_WIDTH * 0.3;

    if (dist > maxDist * 0.6) {
      const pressure = ((dist - maxDist * 0.6) / (maxDist * 0.4));
      if (!p.traits.includes('pressure_resist')) {
        p.hp -= pressure * 2 * dt;
        if (p.hp < 1) p.hp = 1;
      }
    }
  }

  isBlizzardActive() {
    return this.blizzardActive;
  }

  getBlizzardIntensity() {
    if (!this.blizzardActive) return 0;
    const progress = 1 - this.blizzardTimer / this.blizzardDuration;
    // Ramp up then ramp down
    if (progress < 0.2) return progress / 0.2;
    if (progress > 0.8) return (1 - progress) / 0.2;
    return 1;
  }
}
