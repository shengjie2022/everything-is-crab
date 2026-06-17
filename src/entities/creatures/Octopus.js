import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class Octopus extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '章鱼', tier: 3, hp: 55, atk: 10, def: 4, spd: 40,
      xp: 28, size: 14, aggro: 0.6, range: 70, diet: 'carnivore',
      color: '#7b1fa2', water: true, isBoss: false,
      tiles: null, type: 'octopus', ...data
    });
    this.inkCD = 0;
    this.inkCooldown = 8;
    this.grabCD = 0;
    this.grabCooldown = 5;
  }

  updateAI(dt, game) {
    this.inkCD = Math.max(0, this.inkCD - dt);
    this.grabCD = Math.max(0, this.grabCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Ink cloud when player is mid-range
    if (dist < 100 && this.inkCD <= 0) {
      this.deployInk(game);
    }

    // Tentacle grab when close
    if (dist < 70 && this.grabCD <= 0) {
      this.tentacleGrab(game, player);
    }

    if (dist < 120) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  deployInk(game) {
    const p = new Projectile(this.x, this.y, 0, 0, 3, this, {
      color: '#311b92', radius: 10, lifetime: 3,
      stationary: true, aoe: true, aoeRadius: 50,
      effect: 'slow', effectDuration: 2
    });
    game.addProjectile(p);
    this.inkCD = this.inkCooldown;
    if (game.audio) game.audio.playSfx('ink');
  }

  tentacleGrab(game, player) {
    const angle = this.angleTo(player);
    const pullDist = 30;
    player.x -= Math.cos(angle) * pullDist;
    player.y -= Math.sin(angle) * pullDist;
    this.grabCD = this.grabCooldown;

    if (game.particleSystem) {
      game.particleSystem.emit(player.x, player.y, '#9c27b0', 6);
    }
    if (game.camera) game.camera.shake(3, 0.2);
  }
}
