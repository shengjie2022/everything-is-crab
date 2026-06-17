import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Scorpion extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '蝎子', tier: 3, hp: 50, atk: 15, def: 5, spd: 45,
      xp: 30, size: 13, aggro: 0.7, range: 30, diet: 'carnivore',
      color: '#f57f17', water: false, isBoss: false,
      tiles: null, type: 'scorpion', ...data
    });
    this.burrowCD = 0;
    this.burrowCooldown = 6;
    this.burrowed = false;
    this.burrowTimer = 0;
  }

  updateAI(dt, game) {
    this.burrowCD = Math.max(0, this.burrowCD - dt);
    if (this.burrowed) {
      this.burrowTimer -= dt;
      if (this.burrowTimer <= 0) { this.burrowed = false; this.invincible = false; }
      return;
    }

    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }
    const dist = this.distTo(player);

    // Burrow dodge when low HP and player close
    if (this.hp < this.maxHp * 0.3 && dist < 60 && this.burrowCD <= 0) {
      this.burrow();
      return;
    }

    if (dist < this.atkRange && this.atkCD <= 0) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else if (dist < 130) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  burrow() {
    this.burrowed = true;
    this.invincible = true;
    this.burrowTimer = 1.5;
    this.burrowCD = this.burrowCooldown;
  }

  move(dt, game) {
    if (this.burrowed) return;
    super.move(dt, game);
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;

    // Tail sting with poison
    game.combat.creatureAttack(this, this.target);

    // Apply poison via direct HP drain over time
    this.target.poisoned = true;
    this.target.poisonTimer = 3;
    this.target.poisonDmg = 4;

    if (game.particleSystem) {
      game.particleSystem.emit(this.target.x, this.target.y, '#ff6f00', 6);
    }
    if (game.audio) game.audio.playSfx('sting');
    this.atkCD = 1.2;
  }
}
