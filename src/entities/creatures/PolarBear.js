import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class PolarBear extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '北极熊', tier: 3, hp: 100, atk: 22, def: 8, spd: 55,
      xp: 60, size: 20, aggro: 130, range: 35, diet: 'carni',
      color: '#eceff1', water: false, isBoss: false,
      tiles: null, type: 'polar_bear', ...data
    });
    this.chargeCD = 0;
    this.chargeCooldown = 6;
    this.swipeCD = 0;
    this.swipeCooldown = 4;
    this.isCharging = false;
  }

  updateAI(dt, game) {
    this.chargeCD = Math.max(0, this.chargeCD - dt);
    this.swipeCD = Math.max(0, this.swipeCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Charge attack from medium distance
    if (dist < 150 && dist > 50 && this.chargeCD <= 0 && !this.isCharging) {
      this.startCharge(player);
    }

    // Swipe stun at close range
    if (dist < 40 && this.swipeCD <= 0) {
      this.swipeAttack(game, player);
    }

    if (dist < this.atkRange) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 180) {
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
    this.speed = 140;

    setTimeout(() => {
      this.speed = 55;
      this.isCharging = false;
    }, 2000);
  }

  swipeAttack(game, player) {
    // Powerful swipe that stuns
    game.combat.creatureAttack(this, player, this.atk * 1.3);
    this.swipeCD = this.swipeCooldown;

    // Apply stun effect
    if (player.statusEffects) {
      player.statusEffects.stun = 1.5;
    }

    // Knockback
    const angle = this.angleTo(player);
    player.x += Math.cos(angle) * 40;
    player.y += Math.sin(angle) * 40;

    if (game.particleSystem) {
      game.particleSystem.emit(player.x, player.y, '#eceff1', 10);
    }
    if (game.camera) game.camera.shake(6, 0.3);
  }

  move(dt, game) {
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
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.8;
  }
}
