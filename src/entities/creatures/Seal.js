import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Seal extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '海豹', tier: 2, hp: 50, atk: 8, def: 4, spd: 65,
      xp: 25, size: 14, aggro: 70, range: 20, diet: 'omni',
      color: '#90a4ae', water: true, isBoss: false,
      tiles: null, type: 'seal', ...data
    });
    this.ramCD = 0;
    this.ramCooldown = 4;
    this.inWater = false;
  }

  updateAI(dt, game) {
    this.ramCD = Math.max(0, this.ramCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    // Check if in water
    this.inWater = game.tileMap.isWater(this.x, this.y);

    const dist = this.distTo(player);

    // Mostly passive, but rams nearby threats
    if (dist < 50 && this.ramCD <= 0) {
      this.ramAttack(game, player);
    } else if (dist < 90) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  ramAttack(game, player) {
    const angle = this.angleTo(player);

    // Ram with knockback
    game.combat.creatureAttack(this, player, this.atk * 1.5);
    this.ramCD = this.ramCooldown;

    // Knockback
    player.x += Math.cos(angle) * 35;
    player.y += Math.sin(angle) * 35;

    if (game.particleSystem) {
      game.particleSystem.emit(player.x, player.y, '#90a4ae', 8);
    }
    if (game.camera) game.camera.shake(4, 0.2);
  }

  move(dt, game) {
    // Faster in water
    const speedMult = this.inWater ? 1.5 : 1.0;
    const originalSpeed = this.speed;
    this.speed = 65 * speedMult;

    super.move(dt, game);

    this.speed = originalSpeed;
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.6;
  }
}
