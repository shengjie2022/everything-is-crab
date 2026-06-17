import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class SnowyOwl extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '雪鸮', tier: 2, hp: 30, atk: 14, def: 2, spd: 90,
      xp: 35, size: 12, aggro: 150, range: 50, diet: 'carni',
      color: '#fafafa', water: false, isBoss: false,
      tiles: null, type: 'snowy_owl', ...data
    });
    this.diveCD = 0;
    this.diveCooldown = 4;
    this.isDiving = false;
    this.diveInvincible = false;
  }

  updateAI(dt, game) {
    this.diveCD = Math.max(0, this.diveCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Swoop down from distance
    if (dist < 180 && dist > 40 && this.diveCD <= 0 && !this.isDiving) {
      this.startDive(player);
    }

    if (this.isDiving) {
      this.aiState = AI.ATTACK;
      this.target = player;

      if (dist < 25) {
        // Dive hit — perform attack on impact
        this.performAttack(game);
        this.endDive();
      }
    } else if (dist < 200) {
      this.target = player;
      const atkDist = this.atkRange + this.radius + player.radius;
      if (dist < atkDist) {
        // In melee range — attack normally
        this.aiState = AI.ATTACK;
        if (this.atkCD <= 0) {
          this.performAttack(game);
        }
      } else {
        this.aiState = AI.HUNT;
      }
    } else {
      this.aiState = AI.WANDER;
    }
  }

  startDive(player) {
    this.isDiving = true;
    this.diveInvincible = true;
    this.invincible = true;
    this.diveCD = this.diveCooldown;
    this.speed = 200;
    this.facing = this.angleTo(player);
  }

  endDive() {
    this.isDiving = false;
    this.diveInvincible = false;
    this.invincible = false;
    this.speed = 90;
  }

  move(dt, game) {
    if (this.isDiving) {
      // Dive straight at target
      if (this.target) {
        const angle = this.angleTo(this.target);
        this.x += Math.cos(angle) * this.speed * dt;
        this.y += Math.sin(angle) * this.speed * dt;
      }
    } else {
      super.move(dt, game);
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;

    // Dive attack does extra damage
    const damage = this.isDiving ? this.atk * 1.8 : this.atk;
    game.combat.creatureAttack(this, this.target, damage);
    this.atkCD = 1.2;

    if (this.isDiving) {
      this.endDive();
    }
  }

  takeDamage(amount, attacker, game) {
    // Invincible during dive
    if (this.diveInvincible) return;
    super.takeDamage(amount, attacker, game);
  }
}
