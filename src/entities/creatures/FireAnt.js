import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class FireAnt extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '火蚁', tier: 1, hp: 12, atk: 5, def: 1, spd: 80,
      xp: 10, size: 6, aggro: 70, range: 15, diet: 'carni',
      color: '#ff6d00', water: false, isBoss: false,
      tiles: null, type: 'fire_ant', ...data
    });
  }

  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Swarm bonus speed from nearby fire ants
    const nearby = game.getCreatures().filter(c =>
      c instanceof FireAnt && c !== this && !c.dead && this.distTo(c) < 50
    );
    this.speed = 80 + nearby.length * 6;

    if (dist < this.atkRange + 10) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < this.aggro + nearby.length * 20) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 0.7;
  }
}
