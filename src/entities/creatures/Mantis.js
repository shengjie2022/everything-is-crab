import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Mantis extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '螳螂', tier: 2, hp: 45, atk: 18, def: 3, spd: 70,
      xp: 35, size: 12, aggro: 130, range: 35, diet: 'carni',
      color: '#4caf50', water: false, isBoss: false,
      tiles: null, type: 'mantis', ...data
    });
    this.ambushCD = 0;
    this.isAmbushing = false;
    this.ambushTimer = 0;
  }

  updateAI(dt, game) {
    this.ambushCD = Math.max(0, this.ambushCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Ambush: stay still until player is close, then strike
    if (this.isAmbushing) {
      this.ambushTimer -= dt;
      if (this.ambushTimer <= 0) {
        this.isAmbushing = false;
      }
      return;
    }

    if (dist < 60 && this.ambushCD <= 0) {
      // Ambush strike — dash toward player
      this.isAmbushing = true;
      this.ambushTimer = 0.3;
      this.ambushCD = 4;
      this.facing = this.angleTo(player);
      this.speed = 200;
      this.aiState = AI.ATTACK;
      this.target = player;
      return;
    }

    if (dist < this.atkRange + 10) {
      this.aiState = AI.ATTACK;
      this.target = player;
      this.speed = 70;
    } else if (dist < this.aggro) {
      // Creep slowly toward prey
      this.aiState = AI.HUNT;
      this.target = player;
      this.speed = 35;
    } else {
      this.aiState = AI.WANDER;
      this.speed = 70;
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    const dmgMult = this.isAmbushing ? 1.8 : 1.0;
    game.combat.creatureAttack(this, this.target, this.atk * dmgMult);
    this.atkCD = 1.2;
    this.speed = 70;
  }
}
