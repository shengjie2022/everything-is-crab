import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class FrostCrab extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '霜巨人蟹', tier: 5, hp: 650, atk: 20, def: 12, spd: 35,
      xp: 500, size: 32, aggro: 1, range: 130, diet: 'carnivore',
      color: '#88ccee', water: false, isBoss: true,
      tiles: null, type: 'frost_crab', ...data
    });
    this.phase = 1;
    this.freezeRayCD = 0;
    this.icicleCD = 0;
    this.shieldCD = 0;
    this.shieldActive = false;
    this.shieldTimer = 0;
    this.enraged = false;
  }

  get hpPct() { return this.hp / this.maxHp; }

  updateAI(dt, game) {
    this.freezeRayCD = Math.max(0, this.freezeRayCD - dt);
    this.icicleCD = Math.max(0, this.icicleCD - dt);
    this.shieldCD = Math.max(0, this.shieldCD - dt);

    if (this.shieldActive) {
      this.shieldTimer -= dt * 1000;
      if (this.shieldTimer <= 0) this.shieldActive = false;
    }

    // Phase transitions
    if (this.hpPct <= 0.33 && this.phase < 3) {
      this.phase = 3;
      if (!this.enraged) { this.speed += 15; this.enraged = true; }
    } else if (this.hpPct <= 0.66 && this.phase < 2) {
      this.phase = 2;
    }

    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    this.aiState = AI.HUNT;
    this.target = player;

    const cdMult = this.phase === 3 ? 0.6 : 1;

    // Freeze ray (fan-shaped)
    if (this.freezeRayCD <= 0) {
      this._freezeRay(game);
      this.freezeRayCD = 3.5 * cdMult;
    }

    // Icicle summon (phase 2+)
    if (this.phase >= 2 && this.icicleCD <= 0) {
      this._icicles(game);
      this.icicleCD = 5 * cdMult;
    }

    // Cold shield (phase 2+)
    if (this.phase >= 2 && this.shieldCD <= 0 && !this.shieldActive) {
      this.shieldActive = true;
      this.shieldTimer = 3000;
      this.shieldCD = 10 * cdMult;
    }
  }

  takeDamage(amt, ax, ay) {
    // Shield reduces incoming damage and slows attacker
    if (this.shieldActive) {
      amt *= 0.5;
    }
    return super.takeDamage(amt, ax, ay);
  }

  _freezeRay(game) {
    const baseAngle = this.target ? this.angleTo(this.target) : 0;
    const count = this.phase === 3 ? 7 : 5;
    const spread = Math.PI / 3;

    for (let i = 0; i < count; i++) {
      const angle = baseAngle - spread / 2 + (spread / (count - 1)) * i;
      const p = new Projectile(this.x, this.y, angle, 140, this.atk * 0.8, this, {
        color: '#aaeeff', radius: 5, lifetime: 2,
        effect: 'slow', effectDuration: 2.5
      });
      game.addProjectile(p);
    }
  }

  _icicles(game) {
    if (!this.target) return;
    const count = this.phase === 3 ? 5 : 3;
    for (let i = 0; i < count; i++) {
      const ox = this.target.x + (Math.random() - 0.5) * 80;
      const oy = this.target.y + (Math.random() - 0.5) * 80;
      // Delayed stationary icicle
      const p = new Projectile(ox, oy, 0, 0, this.atk * 1.2, this, {
        color: '#66bbdd', radius: 8, lifetime: 1.5,
        stationary: true, aoe: true, aoeRadius: 30
      });
      game.addProjectile(p);
    }
    if (game.camera) game.camera.shake(4, 0.3);
  }

  die() {
    super.die();
  }
}
