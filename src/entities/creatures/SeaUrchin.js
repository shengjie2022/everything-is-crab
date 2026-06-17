import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class SeaUrchin extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '海胆', tier: 1, hp: 20, atk: 8, def: 6, spd: 15,
      xp: 15, size: 10, aggro: 30, range: 15, diet: 'passive',
      color: '#4a148c', water: true, isBoss: false,
      tiles: null, type: 'sea_urchin', ...data
    });
  }

  updateAI(dt, game) {
    // Sea urchins barely move — passive spine damage
    this.aiState = AI.WANDER;
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.wanderTimer = 4 + Math.random() * 5;
    }
  }

  // Contact damage via spine — handled by proximity in update
  update(dt, game) {
    super.update(dt, game);
    if (this.dead) return;

    const player = game.player;
    if (!player || player.dead) return;

    // Spine contact damage
    const dist = this.distTo(player);
    if (dist < this.radius + (player.radius || 12) + 5) {
      if (this.atkCD <= 0) {
        game.combat.creatureAttack(this, player);
        this.atkCD = 1.5;
      }
    }
  }

  performAttack() {
    // Handled by contact in update
  }
}
