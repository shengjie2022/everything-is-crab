import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Python extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '蟒蛇', tier: 3, hp: 80, atk: 16, def: 5, spd: 40,
      xp: 55, size: 18, aggro: 120, range: 30, diet: 'carni',
      color: '#4a6741', water: false, isBoss: false,
      tiles: null, type: 'python', ...data
    });
    this.inAmbush = true;
    this.constrictCD = 0;
    this.constrictCooldown = 6;
    this.constrictDuration = 0;
  }

  updateAI(dt, game) {
    this.constrictCD = Math.max(0, this.constrictCD - dt);
    this.constrictDuration = Math.max(0, this.constrictDuration - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Ambush behavior - stay still until player is close
    if (this.inAmbush) {
      if (dist < 100) {
        this.inAmbush = false;
        this.aiState = AI.HUNT;
        this.target = player;
      }
      return;
    }

    // Constrict attack at very close range
    if (dist < 35 && this.constrictCD <= 0) {
      this.constrictAttack(game, player);
    }

    if (dist < this.atkRange) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 180) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
      this.inAmbush = true;
    }
  }

  constrictAttack(game, player) {
    // High damage close-range attack that briefly slows player
    game.combat.creatureAttack(this, player, this.atk * 1.8);
    this.constrictCD = this.constrictCooldown;
    this.constrictDuration = 2;

    // Apply slow effect to player
    if (player.statusEffects) {
      player.statusEffects.slow = 2;
    }

    if (game.particleSystem) {
      game.particleSystem.emit(player.x, player.y, '#4a6741', 8);
    }
    if (game.camera) game.camera.shake(4, 0.3);
  }

  move(dt, game) {
    if (this.inAmbush) return; // Don't move while in ambush
    super.move(dt, game);
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.5;
  }
}
