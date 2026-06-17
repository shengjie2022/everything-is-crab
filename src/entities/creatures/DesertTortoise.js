import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class DesertTortoise extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '沙龟', tier: 2, hp: 60, atk: 6, def: 10, spd: 30,
      xp: 30, size: 14, aggro: 60, range: 20, diet: 'herb',
      color: '#8d6e63', water: false, isBoss: false,
      tiles: null, type: 'desert_tortoise', ...data
    });
    this.inShell = false;
    this.shellTimer = 0;
    this.baseDef = this.def;
  }

  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) {
      this.inShell = false;
      this.def = this.baseDef;
      this.aiState = AI.WANDER;
      return;
    }

    const dist = this.distTo(player);

    // Shell timer
    if (this.inShell) {
      this.shellTimer -= dt;
      if (this.shellTimer <= 0) {
        this.inShell = false;
        this.def = this.baseDef;
      }
    }

    // Retreat into shell when threatened
    if (dist < 60 || this.hp < this.maxHp * 0.7) {
      if (!this.inShell) {
        this.inShell = true;
        this.shellTimer = 3;
        this.def = this.baseDef * 3;
      }
      // Stay still in shell
      this.aiState = AI.WANDER;
      this.speed = 0;
      return;
    }

    this.speed = 30;
    this.aiState = AI.WANDER;
  }

  performAttack() {
    // Tortoises don't attack
  }
}
