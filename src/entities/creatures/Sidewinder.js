import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Sidewinder extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '角响蛇', tier: 2, hp: 45, atk: 14, def: 3, spd: 90,
      xp: 35, size: 12, aggro: 110, range: 30, diet: 'carni',
      color: '#c4944a', water: false, isBoss: false,
      tiles: null, type: 'sidewinder', ...data
    });
    this.sidestepCD = 0;
    this.sidestepDir = 1;
  }

  updateAI(dt, game) {
    this.sidestepCD = Math.max(0, this.sidestepCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    if (dist < this.atkRange + 10) {
      this.aiState = AI.ATTACK;
      this.target = player;

      // Sidestep after attacking to dodge
      if (this.sidestepCD <= 0) {
        this.sidestepCD = 2;
        this.sidestepDir *= -1;
        const perpAngle = this.angleTo(player) + Math.PI / 2 * this.sidestepDir;
        this.x += Math.cos(perpAngle) * 25;
        this.y += Math.sin(perpAngle) * 25;
      }
    } else if (dist < this.aggro) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }

    if (this.getHpPct() < 0.2) {
      this.aiState = AI.FLEE;
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.2;
  }
}
