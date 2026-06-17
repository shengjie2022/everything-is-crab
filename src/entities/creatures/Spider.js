import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class Spider extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '蜘蛛', tier: 3, hp: 45, atk: 12, def: 3, spd: 50,
      xp: 25, size: 13, aggro: 0.8, range: 80, diet: 'carnivore',
      color: '#4a148c', water: false, isBoss: false,
      tiles: null, type: 'spider', ...data
    });
    this.inAmbush = true;
    this.webCD = 0;
    this.webCooldown = 4;
  }

  updateAI(dt, game) {
    this.webCD = Math.max(0, this.webCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    if (this.inAmbush) {
      if (dist < 80) {
        this.inAmbush = false;
        this.aiState = AI.HUNT;
        this.target = player;
      }
      return; // Stay still in ambush
    }

    if (dist < this.atkRange && this.webCD <= 0) {
      this.fireWeb(game, player);
    }

    if (dist < 25 && this.atkCD <= 0) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 150) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
      this.inAmbush = true; // Re-enter ambush
    }
  }

  fireWeb(game, target) {
    const angle = this.angleTo(target);
    const p = new Projectile(this.x, this.y, angle, 120, 0, this, {
      color: '#e0e0e0', radius: 6, lifetime: 1.5,
      effect: 'slow', effectDuration: 2.5
    });
    game.addProjectile(p);
    this.webCD = this.webCooldown;
  }

  move(dt, game) {
    if (this.inAmbush) return; // Don't move while in ambush
    super.move(dt, game);
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.0;
  }
}
