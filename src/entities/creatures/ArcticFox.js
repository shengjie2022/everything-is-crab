import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class ArcticFox extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '北极狐', tier: 2, hp: 35, atk: 10, def: 3, spd: 100,
      xp: 30, size: 11, aggro: 110, range: 25, diet: 'carni',
      color: '#cfd8dc', water: false, isBoss: false,
      tiles: null, type: 'arctic_fox', ...data
    });
    this.hitAndRunCD = 0;
    this.hitAndRunCooldown = 3;
    this.retreating = false;
  }

  updateAI(dt, game) {
    this.hitAndRunCD = Math.max(0, this.hitAndRunCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Hit and run tactics
    if (this.retreating) {
      this.aiState = AI.FLEE;

      if (dist > 80) {
        this.retreating = false;
        this.hitAndRunCD = this.hitAndRunCooldown;
      }
    } else {
      if (dist < 30 && this.hitAndRunCD <= 0) {
        // Attack then retreat
        if (this.atkCD <= 0) {
          this.performAttack(game);
          this.retreating = true;
        }
      } else if (dist < 140) {
        this.aiState = AI.HUNT;
        this.target = player;
      } else {
        this.aiState = AI.WANDER;
      }
    }
  }

  move(dt, game) {
    if (this.retreating) {
      // Fast retreat away from player
      if (this.target) {
        const away = this.angleTo(this.target) + Math.PI;
        this.facing = away;
        const dx = Math.cos(away);
        const dy = Math.sin(away);

        this.x += dx * this.speed * 1.3 * dt;
        this.y += dy * this.speed * 1.3 * dt;
      }
    } else {
      super.move(dt, game);
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;

    // Quick strike
    game.combat.creatureAttack(this, this.target, this.atk * 1.2);
    this.atkCD = 1.0;

    if (game.particleSystem) {
      game.particleSystem.emit(this.target.x, this.target.y, '#cfd8dc', 6);
    }
  }
}
