import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Beetle extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '甲虫', tier: 1, hp: 20, atk: 0, def: 4, spd: 40,
      xp: 5, size: 10, aggro: 0, range: 0, diet: 'herbivore',
      color: '#6d4c41', water: false, isBoss: false,
      tiles: null, type: 'beetle', ...data
    });
    this.fleeThreshold = 100;
  }

  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) {
      this.aiState = AI.WANDER;
      return;
    }

    const dist = this.distTo(player);

    // Flee when player is close or when damaged
    if (dist < this.fleeThreshold || this.hp < this.maxHp) {
      this.aiState = AI.FLEE;
      this.target = player;
      return;
    }

    // Default wander behavior
    if (this.aiState !== AI.WANDER) {
      this.aiState = AI.WANDER;
    }

    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.wanderTimer = 2 + Math.random() * 3;
    }
  }

  move(dt, game) {
    if (this.aiState === AI.FLEE && this.target) {
      const angle = this.angleTo(this.target) + Math.PI; // Run away
      this.x += Math.cos(angle) * this.speed * dt;
      this.y += Math.sin(angle) * this.speed * dt;
      this.facing = angle;
    } else {
      this.x += Math.cos(this.wanderAngle) * this.speed * 0.5 * dt;
      this.y += Math.sin(this.wanderAngle) * this.speed * 0.5 * dt;
      this.facing = this.wanderAngle;
    }
  }

  performAttack() {
    // Beetles never attack
  }
}
