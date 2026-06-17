import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class HornedLizard extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '角蜥', tier: 2, hp: 40, atk: 8, def: 7, spd: 60,
      xp: 30, size: 12, aggro: 90, range: 25, diet: 'omni',
      color: '#a0845a', water: false, isBoss: false,
      tiles: null, type: 'horned_lizard', ...data
    });
    this.bloodSquirtCD = 0;
    this.bloodSquirtCooldown = 5;
    this.defensive = true;
  }

  updateAI(dt, game) {
    this.bloodSquirtCD = Math.max(0, this.bloodSquirtCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Blood squirt when low HP
    if (this.getHpPct() < 0.35 && this.bloodSquirtCD <= 0 && dist < 100) {
      this.bloodSquirt(game, player);
    }

    // Defensive behavior - less aggressive
    if (dist < 40) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 120) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  bloodSquirt(game, target) {
    const angle = this.angleTo(target);

    // Fire multiple blood projectiles in a spread
    for (let i = -1; i <= 1; i++) {
      const spreadAngle = angle + (i * 0.3);
      const p = new Projectile(this.x, this.y, spreadAngle, 150, this.atk * 0.8, this, {
        color: '#c62828', radius: 4, lifetime: 0.8,
        effect: 'bleed', effectDuration: 3
      });
      game.addProjectile(p);
    }

    this.bloodSquirtCD = this.bloodSquirtCooldown;

    if (game.particleSystem) {
      game.particleSystem.emit(this.x, this.y, '#c62828', 10);
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.5;
  }

  takeDamage(amount, attacker, game) {
    // High defense reduces damage
    const reducedAmount = Math.max(1, amount - this.def * 0.8);
    super.takeDamage(reducedAmount, attacker, game);
  }
}
