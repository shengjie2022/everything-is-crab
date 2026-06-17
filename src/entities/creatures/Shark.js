import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Shark extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '鲨鱼', tier: 3, hp: 90, atk: 24, def: 5, spd: 100,
      xp: 60, size: 18, aggro: 160, range: 40, diet: 'carni',
      color: '#546e7a', water: true, isBoss: false,
      tiles: null, type: 'shark', ...data
    });
    this.chargeCD = 0;
    this.chargeCooldown = 5;
    this.isCharging = false;
    this.bloodFrenzy = false;
  }

  updateAI(dt, game) {
    this.chargeCD = Math.max(0, this.chargeCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);
    const playerLowHp = player.getHpPct() < 0.4;

    // Blood frenzy when target is low HP
    this.bloodFrenzy = playerLowHp;

    // Charge attack with knockback
    if (dist < 180 && dist > 50 && this.chargeCD <= 0 && !this.isCharging) {
      this.startCharge(player);
    }

    const effectiveAggro = this.bloodFrenzy ? this.aggro * 1.5 : this.aggro;

    if (this.isCharging) {
      this.aiState = AI.ATTACK;
      this.target = player;

      if (dist < 30) {
        this.endCharge();
      }
    } else if (dist < effectiveAggro) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else if (dist < this.atkRange) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  startCharge(player) {
    this.isCharging = true;
    this.chargeCD = this.chargeCooldown;
    this.facing = this.angleTo(player);
    this.speed = 200;
  }

  endCharge() {
    this.isCharging = false;
    this.speed = 100;
  }

  move(dt, game) {
    // Faster during blood frenzy
    if (this.bloodFrenzy && !this.isCharging) {
      this.speed = 130;
    } else if (!this.isCharging) {
      this.speed = 100;
    }

    if (this.isCharging) {
      const dx = Math.cos(this.facing);
      const dy = Math.sin(this.facing);
      this.x += dx * this.speed * dt;
      this.y += dy * this.speed * dt;
    } else {
      super.move(dt, game);
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;

    // Charge attack with knockback
    const damage = this.isCharging ? this.atk * 1.5 : this.atk;
    const bonusDamage = this.bloodFrenzy ? damage * 1.2 : damage;

    game.combat.creatureAttack(this, this.target, bonusDamage);

    if (this.isCharging) {
      // Knockback
      const angle = this.angleTo(this.target);
      this.target.x += Math.cos(angle) * 50;
      this.target.y += Math.sin(angle) * 50;

      if (game.camera) game.camera.shake(7, 0.3);
      this.endCharge();
    }

    this.atkCD = 1.5;
  }
}
