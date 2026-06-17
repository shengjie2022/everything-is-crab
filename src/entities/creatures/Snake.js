import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class Snake extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '蛇', tier: 3, hp: 35, atk: 14, def: 2, spd: 55,
      xp: 22, size: 12, aggro: 0.7, range: 110, diet: 'carnivore',
      color: '#388e3c', water: false, isBoss: false,
      tiles: null, type: 'snake', ...data
    });
    this.venomCD = 0;
    this.venomCooldown = 2.5;
  }

  updateAI(dt, game) {
    this.venomCD = Math.max(0, this.venomCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    if (dist < this.atkRange && this.venomCD <= 0) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 160) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  performAttack(game) {
    if (this.venomCD > 0 || !this.target) return;

    const angle = this.angleTo(this.target);
    const p = new Projectile(this.x, this.y, angle, 160, this.atk, this, {
      color: '#76ff03', radius: 4, lifetime: 1.5,
      effect: 'poison', effectDuration: 3
    });
    game.addProjectile(p);

    if (game.audio) game.audio.playSfx('venom');
    this.venomCD = this.venomCooldown;
    this.atkCD = this.venomCooldown;
  }
}
