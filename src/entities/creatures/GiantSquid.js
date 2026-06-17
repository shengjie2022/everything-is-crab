import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class GiantSquid extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '大王乌贼', tier: 3, hp: 75, atk: 16, def: 5, spd: 70,
      xp: 55, size: 18, aggro: 120, range: 70, diet: 'carni',
      color: '#880e4f', water: true, isBoss: false,
      tiles: null, type: 'giant_squid', ...data
    });
    this.inkCD = 0;
    this.inkCooldown = 7;
    this.grabCD = 0;
    this.grabCooldown = 4.5;
  }

  updateAI(dt, game) {
    this.inkCD = Math.max(0, this.inkCD - dt);
    this.grabCD = Math.max(0, this.grabCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Ink cloud ability
    if (dist < 120 && this.inkCD <= 0) {
      this.deployInkCloud(game);
    }

    // Tentacle grab - stronger than octopus
    if (dist < this.range && this.grabCD <= 0) {
      this.tentacleGrab(game, player);
    }

    if (dist < 150) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else if (dist < this.atkRange) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  deployInkCloud(game) {
    // Larger, longer-lasting ink cloud than octopus
    const p = new Projectile(this.x, this.y, 0, 0, 5, this, {
      color: '#1a0011', radius: 15, lifetime: 4,
      stationary: true, aoe: true, aoeRadius: 70,
      effect: 'blind', effectDuration: 3
    });
    game.addProjectile(p);
    this.inkCD = this.inkCooldown;

    if (game.particleSystem) {
      game.particleSystem.emit(this.x, this.y, '#1a0011', 20);
    }
    if (game.audio) game.audio.playSfx('ink');
  }

  tentacleGrab(game, player) {
    const angle = this.angleTo(player);
    const pullDist = 45; // Stronger pull than octopus

    // Pull player toward squid
    player.x -= Math.cos(angle) * pullDist;
    player.y -= Math.sin(angle) * pullDist;

    // Deal damage on grab
    game.combat.creatureAttack(this, player, this.atk * 0.5);

    this.grabCD = this.grabCooldown;

    if (game.particleSystem) {
      game.particleSystem.emit(player.x, player.y, '#880e4f', 10);
    }
    if (game.camera) game.camera.shake(5, 0.3);
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.4;
  }
}
