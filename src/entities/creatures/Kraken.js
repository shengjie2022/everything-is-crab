import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class Kraken extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '克拉肯', tier: 5, hp: 700, atk: 18, def: 7, spd: 40,
      xp: 500, size: 34, aggro: 1, range: 160, diet: 'carnivore',
      color: '#4a0080', water: true, isBoss: true,
      tiles: null, type: 'kraken_boss', ...data
    });
    this.phase = 1;
    this.tentacleCD = 0;
    this.inkCD = 0;
    this.whirlpoolCD = 0;
    this.enraged = false;
  }

  get hpPct() { return this.hp / this.maxHp; }

  updateAI(dt, game) {
    this.tentacleCD = Math.max(0, this.tentacleCD - dt);
    this.inkCD = Math.max(0, this.inkCD - dt);
    this.whirlpoolCD = Math.max(0, this.whirlpoolCD - dt);

    // Phase transitions
    if (this.hpPct <= 0.33 && this.phase < 3) {
      this.phase = 3;
      if (!this.enraged) { this.speed += 20; this.enraged = true; }
    } else if (this.hpPct <= 0.66 && this.phase < 2) {
      this.phase = 2;
    }

    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    this.aiState = AI.HUNT;
    this.target = player;

    const cdMult = this.phase === 3 ? 0.6 : 1;

    // Tentacle sweep (multi-directional)
    if (this.tentacleCD <= 0) {
      this._tentacleSweep(game);
      this.tentacleCD = 3 * cdMult;
    }

    // Ink mist (phase 2+)
    if (this.phase >= 2 && this.inkCD <= 0) {
      this._inkMist(game);
      this.inkCD = 7 * cdMult;
    }

    // Whirlpool (phase 2+)
    if (this.phase >= 2 && this.whirlpoolCD <= 0) {
      this._whirlpool(game);
      this.whirlpoolCD = 8 * cdMult;
    }
  }

  _tentacleSweep(game) {
    const tentacles = this.phase === 3 ? 10 : this.phase === 2 ? 8 : 6;
    for (let i = 0; i < tentacles; i++) {
      const angle = (i / tentacles) * Math.PI * 2;
      const p = new Projectile(this.x, this.y, angle, 120, this.atk, this, {
        color: '#7b1fa2', radius: 6, lifetime: 1.5
      });
      game.addProjectile(p);
    }
  }

  _inkMist(game) {
    // Large stationary damage zone
    const p = new Projectile(this.x, this.y, 0, 0, this.atk * 0.6, this, {
      color: '#1a0033', radius: 30, lifetime: 4,
      stationary: true, aoe: true, aoeRadius: 80,
      effect: 'slow', effectDuration: 2
    });
    game.addProjectile(p);
  }

  _whirlpool(game) {
    if (!this.target) return;
    // Pull player toward center + damage
    const p = new Projectile(this.target.x, this.target.y, 0, 0, this.atk * 0.8, this, {
      color: '#311b92', radius: 15, lifetime: 3,
      stationary: true, aoe: true, aoeRadius: 100
    });
    game.addProjectile(p);
    if (game.camera) game.camera.shake(6, 0.4);
  }

  die() {
    super.die();
  }
}
