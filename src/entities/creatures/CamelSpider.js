import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class CamelSpider extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '骆驼蜘蛛', tier: 3, hp: 55, atk: 20, def: 4, spd: 110,
      xp: 50, size: 14, aggro: 140, range: 30, diet: 'carni',
      color: '#d4a44a', water: false, isBoss: false,
      tiles: null, type: 'camel_spider', ...data
    });
    this.chargeCD = 0;
    this.chargeCooldown = 4;
    this.isCharging = false;
    this.chargeSpeed = 220;
  }

  updateAI(dt, game) {
    this.chargeCD = Math.max(0, this.chargeCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Extremely aggressive - charge at player from distance
    if (dist < 200 && dist > 60 && this.chargeCD <= 0 && !this.isCharging) {
      this.startCharge(player);
    }

    if (this.isCharging) {
      // Continue charging
      if (dist < 25 || this.chargeCD > this.chargeCooldown - 1.5) {
        this.isCharging = false;
      }
    }

    if (dist < this.atkRange) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 250) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  startCharge(player) {
    this.isCharging = true;
    this.chargeCD = this.chargeCooldown;
    this.facing = this.angleTo(player);
    this.speed = this.chargeSpeed;

    setTimeout(() => {
      this.speed = 110;
      this.isCharging = false;
    }, 1500);
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;

    // Extra damage during charge
    const damage = this.isCharging ? this.atk * 1.5 : this.atk;
    game.combat.creatureAttack(this, this.target, damage);
    this.atkCD = 0.9;

    if (this.isCharging && game.camera) {
      game.camera.shake(5, 0.2);
    }
  }

  move(dt, game) {
    if (this.isCharging) {
      // Move straight during charge
      const dx = Math.cos(this.facing);
      const dy = Math.sin(this.facing);
      this.x += dx * this.chargeSpeed * dt;
      this.y += dy * this.chargeSpeed * dt;
    } else {
      super.move(dt, game);
    }
  }
}
