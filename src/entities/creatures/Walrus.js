import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Walrus extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '海象', tier: 3, hp: 95, atk: 20, def: 9, spd: 45,
      xp: 60, size: 20, aggro: 100, range: 35, diet: 'carni',
      color: '#795548', water: false, isBoss: false,
      tiles: null, type: 'walrus', ...data
    });
    this.chargeCD = 0;
    this.isCharging = false;
    this.slamCD = 0;
  }

  updateAI(dt, game) {
    this.chargeCD = Math.max(0, this.chargeCD - dt);
    this.slamCD = Math.max(0, this.slamCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Charge attack
    if (dist < 150 && dist > 50 && this.chargeCD <= 0 && !this.isCharging) {
      this.isCharging = true;
      this.chargeCD = 6;
      this.facing = this.angleTo(player);
      this.speed = 120;
      this.aiState = AI.HUNT;
      this.target = player;
      return;
    }

    if (this.isCharging) {
      if (dist < 30) {
        // AoE slam on arrival
        this.isCharging = false;
        this.speed = 45;
        this._slamAttack(game);
      }
      this.aiState = AI.HUNT;
      this.target = player;
      return;
    }

    if (dist < this.atkRange + 10) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < this.aggro) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }

    this.speed = 45;
  }

  _slamAttack(game) {
    // AoE damage in radius
    const slamRadius = 50;
    const player = game.player;
    if (player && !player.dead && this.distTo(player) < slamRadius) {
      game.combat.creatureAttack(this, player, this.atk * 1.5);
    }
    if (game.camera) game.camera.shake(6, 400);
    if (game.particleSystem) {
      game.particleSystem.emit(this.x, this.y, '#795548', 8);
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.8;
  }
}
