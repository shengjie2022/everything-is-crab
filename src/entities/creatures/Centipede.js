import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Centipede extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '蜈蚣', tier: 1, hp: 20, atk: 6, def: 1, spd: 65,
      xp: 12, size: 8, aggro: 80, range: 20, diet: 'carni',
      color: '#8b4513', water: false, isBoss: false,
      tiles: null, type: 'centipede', ...data
    });
    this.fleeThreshold = 90;
  }

  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Flee when damaged below 50%
    if (this.hp < this.maxHp * 0.5 && dist < 150) {
      this.aiState = AI.FLEE;
      this.target = player;
      return;
    }

    // Quick bite then flee
    if (dist < this.atkRange + 10) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < this.aggro) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.0;
    // Hit and run — flee after attacking
    this.aiState = AI.FLEE;
  }
}
