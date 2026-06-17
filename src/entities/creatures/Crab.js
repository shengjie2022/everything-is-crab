import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Crab extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '螃蟹', tier: 2, hp: 40, atk: 10, def: 6, spd: 35,
      xp: 15, size: 12, aggro: 0.6, range: 30, diet: 'omnivore',
      color: '#e53935', water: false, isBoss: false,
      tiles: null, type: 'crab', ...data
    });
  }

  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    if (dist < this.atkRange && this.atkCD <= 0) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 120) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    const dist = this.distTo(this.target);
    const bonusAtk = dist < 20 ? 5 : 0;

    const origAtk = this.atk;
    this.atk += bonusAtk;
    game.combat.creatureAttack(this, this.target);
    this.atk = origAtk;

    if (game.particleSystem) {
      game.particleSystem.emit(this.target.x, this.target.y, '#ff5722', 8);
    }
    if (game.audio) game.audio.playSfx('claw');

    this.atkCD = 1.0;
  }
}
