import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class Jellyfish extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '水母', tier: 2, hp: 25, atk: 6, def: 1, spd: 40,
      xp: 25, size: 14, aggro: 50, range: 45, diet: 'passive',
      color: '#e1bee7', water: true, isBoss: false,
      tiles: null, type: 'jellyfish', ...data
    });
    this.pulseCD = 0;
    this.pulseCooldown = 6;
    this.driftAngle = Math.random() * Math.PI * 2;
    this.contactDamage = true;
  }

  updateAI(dt, game) {
    this.pulseCD = Math.max(0, this.pulseCD - dt);
    const player = game.player;

    // Drift around passively
    this.driftAngle += (Math.random() - 0.5) * 0.1;
    this.wanderAngle = this.driftAngle;
    this.aiState = AI.WANDER;

    if (!player || player.dead) return;

    const dist = this.distTo(player);

    // Electric pulse when player is near
    if (dist < 80 && this.pulseCD <= 0) {
      this.electricPulse(game);
    }

    // Contact damage with slow effect
    if (dist < this.radius + player.radius + 5) {
      this.contactHit(game, player);
    }
  }

  electricPulse(game) {
    // AOE electric pulse
    const p = new Projectile(this.x, this.y, 0, 0, this.atk * 1.5, this, {
      color: '#7e57c2', radius: 12, lifetime: 1.5,
      stationary: true, aoe: true, aoeRadius: 60,
      effect: 'shock', effectDuration: 2
    });
    game.addProjectile(p);
    this.pulseCD = this.pulseCooldown;

    if (game.particleSystem) {
      game.particleSystem.emit(this.x, this.y, '#7e57c2', 15);
    }
  }

  contactHit(game, player) {
    if (this.atkCD > 0) return;

    // Contact damage with slow
    game.combat.creatureAttack(this, player, this.atk * 0.8);

    if (player.statusEffects) {
      player.statusEffects.slow = 2;
    }

    this.atkCD = 1.0;
  }

  move(dt, game) {
    // Slow drifting movement
    const dx = Math.cos(this.driftAngle);
    const dy = Math.sin(this.driftAngle);

    this.x += dx * this.speed * 0.5 * dt;
    this.y += dy * this.speed * 0.5 * dt;
  }
}
