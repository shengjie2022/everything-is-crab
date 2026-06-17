import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class ArmyAnt extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '行军蚁', tier: 1, hp: 15, atk: 4, def: 1, spd: 70,
      xp: 10, size: 6, aggro: 60, range: 15, diet: 'carni',
      color: '#5d4037', water: false, isBoss: false,
      tiles: null, type: 'army_ant', ...data
    });
    this.alwaysHunt = true;
  }

  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Army ants always hunt - swarm behavior
    if (dist < 200) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else if (dist < 25) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else {
      // Still hunt even at medium range
      this.aiState = AI.HUNT;
      this.target = player;
    }

    // Check for nearby army ants to coordinate
    const nearbyAnts = game.creatures.filter(c =>
      c instanceof ArmyAnt &&
      c !== this &&
      !c.dead &&
      this.distTo(c) < 50
    );

    // Get bonus aggression when in a swarm
    if (nearbyAnts.length > 0) {
      this.speed = 70 + (nearbyAnts.length * 5); // Faster in groups
    } else {
      this.speed = 70;
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 0.8; // Fast attacks
  }

  // Army ants don't flee
  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Check for swarm bonus
    const nearbyAnts = game.creatures.filter(c =>
      c instanceof ArmyAnt &&
      c !== this &&
      !c.dead &&
      this.distTo(c) < 50
    );

    if (nearbyAnts.length > 0) {
      this.speed = 70 + (nearbyAnts.length * 5);
    } else {
      this.speed = 70;
    }

    // Always aggressive
    if (dist < this.atkRange + 10) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 250) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }
}
