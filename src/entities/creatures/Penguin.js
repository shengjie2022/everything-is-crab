import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Penguin extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '企鹅', tier: 1, hp: 25, atk: 4, def: 3, spd: 60,
      xp: 15, size: 10, aggro: 50, range: 15, diet: 'herb',
      color: '#263238', water: false, isBoss: false,
      tiles: null, type: 'penguin', ...data
    });
    this.fleeThreshold = 80;
  }

  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Penguins flee from threats
    if (dist < this.fleeThreshold || this.hp < this.maxHp) {
      this.aiState = AI.FLEE;
      this.target = player;
      return;
    }

    // Waddle around peacefully
    this.aiState = AI.WANDER;
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.wanderTimer = 2 + Math.random() * 3;
    }
  }

  performAttack() {
    // Penguins don't attack
  }
}
