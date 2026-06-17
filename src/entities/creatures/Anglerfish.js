import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Anglerfish extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '鮟鱇', tier: 2, hp: 45, atk: 14, def: 4, spd: 50,
      xp: 35, size: 13, aggro: 90, range: 30, diet: 'carni',
      color: '#37474f', water: true, isBoss: false,
      tiles: null, type: 'anglerfish', ...data
    });
    this.inAmbush = true;
    this.lureActive = false;
    this.lureCD = 0;
    this.lureCooldown = 10;
    this.lureRange = 100;
  }

  updateAI(dt, game) {
    this.lureCD = Math.max(0, this.lureCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Lure ability attracts pickups
    if (dist < 150 && this.lureCD <= 0 && !this.lureActive) {
      this.activateLure(game);
    }

    if (this.lureActive) {
      this.attractPickups(game, dt);
    }

    // Ambush behavior
    if (this.inAmbush) {
      if (dist < 70) {
        this.inAmbush = false;
        this.aiState = AI.HUNT;
        this.target = player;
      }
      return;
    }

    // Ambush strike when player approaches
    if (dist < this.atkRange) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 140) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
      this.inAmbush = true;
      this.lureActive = false;
    }
  }

  activateLure(game) {
    this.lureActive = true;
    this.lureCD = this.lureCooldown;

    setTimeout(() => {
      this.lureActive = false;
    }, 5000);
  }

  attractPickups(game, dt) {
    // Attract nearby pickups
    if (game.pickups) {
      game.pickups.forEach(pickup => {
        const dist = Math.sqrt(
          (pickup.x - this.x) ** 2 + (pickup.y - this.y) ** 2
        );

        if (dist < this.lureRange) {
          const angle = Math.atan2(this.y - pickup.y, this.x - pickup.x);
          pickup.x += Math.cos(angle) * 80 * dt;
          pickup.y += Math.sin(angle) * 80 * dt;
        }
      });
    }
  }

  move(dt, game) {
    if (this.inAmbush) return; // Don't move while in ambush
    super.move(dt, game);
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;

    // Powerful ambush strike
    const damage = this.inAmbush ? this.atk * 2 : this.atk;
    game.combat.creatureAttack(this, this.target, damage);
    this.atkCD = 1.5;

    if (this.inAmbush) {
      this.inAmbush = false;
    }
  }
}
