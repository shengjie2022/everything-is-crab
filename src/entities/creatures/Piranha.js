import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Piranha extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '食人鱼', tier: 2, hp: 30, atk: 14, def: 2, spd: 100,
      xp: 28, size: 9, aggro: 120, range: 25, diet: 'carni',
      color: '#e53935', water: true, isBoss: false,
      tiles: null, type: 'piranha', ...data
    });
    this.bloodFrenzy = false;
  }

  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Blood frenzy when player is low HP — faster and more aggressive
    this.bloodFrenzy = player.getHpPct() < 0.5;
    if (this.bloodFrenzy) {
      this.speed = 140;
    } else {
      this.speed = 100;
    }

    if (dist < this.atkRange + 10) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < (this.bloodFrenzy ? this.aggro * 1.5 : this.aggro)) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    const dmg = this.bloodFrenzy ? this.atk * 1.3 : this.atk;
    game.combat.creatureAttack(this, this.target, dmg);
    this.atkCD = this.bloodFrenzy ? 0.6 : 1.0;
  }
}
