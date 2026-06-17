import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class SnowLeopard extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '雪豹', tier: 3, hp: 70, atk: 24, def: 5, spd: 110,
      xp: 65, size: 14, aggro: 150, range: 40, diet: 'carni',
      color: '#b0bec5', water: false, isBoss: false,
      tiles: null, type: 'snow_leopard', ...data
    });
    this.pounceCD = 0;
    this.isPouncing = false;
    this.pounceTimer = 0;
  }

  updateAI(dt, game) {
    this.pounceCD = Math.max(0, this.pounceCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Pounce dash
    if (this.isPouncing) {
      this.pounceTimer -= dt;
      if (this.pounceTimer <= 0 || dist < 15) {
        this.isPouncing = false;
        this.speed = 110;
        if (dist < 30) {
          game.combat.creatureAttack(this, player, this.atk * 1.6);
          if (game.particleSystem) {
            game.particleSystem.emit(player.x, player.y, '#b0bec5', 5);
          }
        }
      }
      return;
    }

    // Initiate pounce from medium range
    if (dist < 120 && dist > 40 && this.pounceCD <= 0) {
      this.isPouncing = true;
      this.pounceTimer = 0.25;
      this.pounceCD = 5;
      this.facing = this.angleTo(player);
      this.speed = 300;
      this.aiState = AI.HUNT;
      this.target = player;
      return;
    }

    if (this.getHpPct() < 0.15) {
      this.aiState = AI.FLEE;
      return;
    }

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
  }
}
