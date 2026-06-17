import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class Boss extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '森蚺女王', tier: 5, hp: 600, atk: 22, def: 8, spd: 45,
      xp: 500, size: 28, aggro: 1, range: 150, diet: 'carnivore',
      color: '#1b5e20', water: false, isBoss: true,
      tiles: null, type: 'boss', ...data
    });
    this.phase = 1;
    this.barrageCD = 0;
    this.sweepCD = 0;
    this.summonCD = 0;
    this.enraged = false;
  }

  get hpPct() { return this.hp / this.maxHp; }

  updateAI(dt, game) {
    this.barrageCD = Math.max(0, this.barrageCD - dt);
    this.sweepCD = Math.max(0, this.sweepCD - dt);
    this.summonCD = Math.max(0, this.summonCD - dt);

    // Update phase
    if (this.hpPct <= 0.33 && this.phase < 3) {
      this.phase = 3;
      if (!this.enraged) { this.speed += 30; this.enraged = true; }
    } else if (this.hpPct <= 0.66 && this.phase < 2) {
      this.phase = 2;
    }

    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    this.aiState = AI.HUNT;
    this.target = player;

    const cdMult = this.phase === 3 ? 0.6 : 1;

    // Phase abilities
    if (this.barrageCD <= 0) {
      this.venomBarrage(game);
      this.barrageCD = 3 * cdMult;
    }
    if (this.phase >= 2 && this.sweepCD <= 0) {
      this.tailSweep(game);
      this.sweepCD = 5 * cdMult;
    }
    if (this.phase >= 2 && this.summonCD <= 0) {
      this.summonSnakes(game);
      this.summonCD = 10 * cdMult;
    }
  }

  venomBarrage(game) {
    const count = this.phase === 3 ? 7 : 5;
    const baseAngle = this.target ? this.angleTo(this.target) : 0;
    const spread = Math.PI / 4;

    for (let i = 0; i < count; i++) {
      const angle = baseAngle - spread / 2 + (spread / (count - 1)) * i;
      const p = new Projectile(this.x, this.y, angle, 160, this.atk, this, {
        color: '#76ff03', radius: 5, lifetime: 2,
        effect: 'poison', effectDuration: 3
      });
      game.addProjectile(p);
    }
    if (game.audio) game.audio.playSfx('bossAttack');
  }

  tailSweep(game) {
    const p = new Projectile(this.x, this.y, 0, 0, this.atk * 1.5, this, {
      color: '#2e7d32', radius: 15, lifetime: 0.5,
      stationary: true, aoe: true, aoeRadius: 60
    });
    game.addProjectile(p);
    if (game.camera) game.camera.shake(6, 0.4);
    if (game.audio) game.audio.playSfx('sweep');
  }

  summonSnakes(game) {
    if (game.spawn && game.spawn.spawnSnakeNear) {
      game.spawn.spawnSnakeNear(this.x, this.y);
      game.spawn.spawnSnakeNear(this.x, this.y);
    }
  }

  die() {
    super.die();
    // Boss kill event - game handles victory via isBoss flag
  }
}
