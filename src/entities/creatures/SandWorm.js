import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class SandWorm extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '沙海蠕虫', tier: 5, hp: 550, atk: 25, def: 6, spd: 50,
      xp: 500, size: 30, aggro: 1, range: 140, diet: 'carnivore',
      color: '#c4944a', water: false, isBoss: true,
      tiles: null, type: 'sand_worm', ...data
    });
    this.phase = 1;
    this.burrowed = false;
    this.burrowTimer = 0;
    this.shockwaveCD = 0;
    this.sandstormCD = 0;
    this.devourCD = 0;
    this.enraged = false;
  }

  get hpPct() { return this.hp / this.maxHp; }

  updateAI(dt, game) {
    this.shockwaveCD = Math.max(0, this.shockwaveCD - dt);
    this.sandstormCD = Math.max(0, this.sandstormCD - dt);
    this.devourCD = Math.max(0, this.devourCD - dt);

    // Phase transitions
    if (this.hpPct <= 0.33 && this.phase < 3) {
      this.phase = 3;
      if (!this.enraged) { this.speed += 25; this.enraged = true; }
    } else if (this.hpPct <= 0.66 && this.phase < 2) {
      this.phase = 2;
    }

    // Burrow mechanic
    if (this.burrowed) {
      this.burrowTimer -= dt * 1000;
      this.invincible = 2;
      if (this.burrowTimer <= 0) {
        this.burrowed = false;
        // Emerge with shockwave
        this._emergeShockwave(game);
      }
      return;
    }

    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    this.aiState = AI.HUNT;
    this.target = player;

    const cdMult = this.phase === 3 ? 0.6 : 1;

    // Shockwave AOE
    if (this.shockwaveCD <= 0) {
      this._shockwave(game);
      this.shockwaveCD = 4 * cdMult;
    }

    // Sandstorm (phase 2+)
    if (this.phase >= 2 && this.sandstormCD <= 0) {
      this._sandstorm(game);
      this.sandstormCD = 6 * cdMult;
    }

    // Burrow attack (phase 2+)
    if (this.phase >= 2 && this.devourCD <= 0 && this.distTo(player) > 100) {
      this.burrowed = true;
      this.burrowTimer = this.enraged ? 1200 : 1800;
      // Teleport near player
      const angle = Math.random() * Math.PI * 2;
      this.x = player.x + Math.cos(angle) * 60;
      this.y = player.y + Math.sin(angle) * 60;
      this.devourCD = 8 * cdMult;
    }
  }

  _shockwave(game) {
    const p = new Projectile(this.x, this.y, 0, 0, this.atk * 1.2, this, {
      color: '#d4a44a', radius: 20, lifetime: 0.6,
      stationary: true, aoe: true, aoeRadius: 70
    });
    game.addProjectile(p);
    if (game.camera) game.camera.shake(5, 0.3);
  }

  _emergeShockwave(game) {
    const p = new Projectile(this.x, this.y, 0, 0, this.atk * 1.5, this, {
      color: '#e4b44a', radius: 25, lifetime: 0.8,
      stationary: true, aoe: true, aoeRadius: 90
    });
    game.addProjectile(p);
    if (game.camera) game.camera.shake(8, 0.5);
  }

  _sandstorm(game) {
    // 8 slow projectiles in a ring
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const p = new Projectile(this.x, this.y, angle, 80, this.atk * 0.5, this, {
        color: '#c4a44a', radius: 6, lifetime: 3,
        effect: 'slow', effectDuration: 2
      });
      game.addProjectile(p);
    }
  }

  die() {
    super.die();
  }
}
