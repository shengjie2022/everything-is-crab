import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class PoisonFrog extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '毒蛙', tier: 2, hp: 25, atk: 6, def: 2, spd: 90,
      xp: 25, size: 10, aggro: 80, range: 60, diet: 'carni',
      color: '#ff4081', water: false, isBoss: false,
      tiles: null, type: 'poison_frog', ...data
    });
    this.hopTimer = 0;
    this.hopInterval = 1.5;
    this.poisonCloudCD = 0;
  }

  updateAI(dt, game) {
    this.hopTimer -= dt;
    this.poisonCloudCD = Math.max(0, this.poisonCloudCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Hop movement pattern
    if (this.hopTimer <= 0) {
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.hopTimer = this.hopInterval;
    }

    if (dist < 120) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  takeDamage(amount, attacker, game) {
    super.takeDamage(amount, attacker, game);

    // Release poison cloud when attacked
    if (!this.dead && this.poisonCloudCD <= 0) {
      this.releasePoisonCloud(game);
    }
  }

  releasePoisonCloud(game) {
    const p = new Projectile(this.x, this.y, 0, 0, 4, this, {
      color: '#76ff03', radius: 8, lifetime: 2.5,
      stationary: true, aoe: true, aoeRadius: 45,
      effect: 'poison', effectDuration: 3
    });
    game.addProjectile(p);
    this.poisonCloudCD = 4;

    if (game.particleSystem) {
      game.particleSystem.emit(this.x, this.y, '#76ff03', 12);
    }
  }

  move(dt, game) {
    // Hopping movement - only move during hop intervals
    if (this.hopTimer > this.hopInterval - 0.3) {
      super.move(dt, game);
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.8;
  }
}
