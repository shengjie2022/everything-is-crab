import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class MorayEel extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '海鳗', tier: 2, hp: 50, atk: 16, def: 3, spd: 80,
      xp: 40, size: 14, aggro: 100, range: 35, diet: 'carni',
      color: '#33691e', water: true, isBoss: false,
      tiles: null, type: 'moray_eel', ...data
    });
    this.lungeCD = 0;
    this.isLunging = false;
    this.lungeTimer = 0;
  }

  updateAI(dt, game) {
    this.lungeCD = Math.max(0, this.lungeCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    if (this.isLunging) {
      this.lungeTimer -= dt;
      if (this.lungeTimer <= 0 || dist < 15) {
        this.isLunging = false;
        this.speed = 80;
      }
      return;
    }

    // Lunge attack from ambush range
    if (dist < 70 && dist > 25 && this.lungeCD <= 0) {
      this.isLunging = true;
      this.lungeTimer = 0.2;
      this.lungeCD = 3;
      this.facing = this.angleTo(player);
      this.speed = 250;
      this.aiState = AI.HUNT;
      this.target = player;
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
    const dmg = this.isLunging ? this.atk * 1.4 : this.atk;
    game.combat.creatureAttack(this, this.target, dmg);
    this.atkCD = 1.3;
  }
}
