import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class Frog extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '青蛙', tier: 2, hp: 30, atk: 8, def: 2, spd: 55,
      xp: 12, size: 11, aggro: 0.5, range: 100, diet: 'carnivore',
      color: '#4caf50', water: false, isBoss: false,
      tiles: null, type: 'frog', ...data
    });
    this.tongueCD = 0;
    this.jumpCD = 0;
    this.jumpCooldown = 3;
  }

  updateAI(dt, game) {
    this.tongueCD = Math.max(0, this.tongueCD - dt);
    this.jumpCD = Math.max(0, this.jumpCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Jump dodge when player is very close
    if (dist < 50 && this.jumpCD <= 0) {
      this.jumpDodge(player);
      return;
    }

    if (dist < this.atkRange && this.tongueCD <= 0) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 150) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  jumpDodge(player) {
    const away = this.angleTo(player) + Math.PI;
    this.x += Math.cos(away) * 70;
    this.y += Math.sin(away) * 70;
    this.jumpCD = this.jumpCooldown;
    this.invincible = true;
    setTimeout(() => { this.invincible = false; }, 200);
  }

  performAttack(game) {
    if (this.tongueCD > 0 || !this.target) return;
    const angle = this.angleTo(this.target);
    const p = new Projectile(this.x, this.y, angle, 250, this.atk, this, {
      color: '#e91e63', radius: 4, lifetime: 0.35
    });
    game.addProjectile(p);
    this.tongueCD = 1.5;
    this.atkCD = 1.5;
  }
}
