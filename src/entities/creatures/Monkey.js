import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class Monkey extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '猴子', tier: 2, hp: 45, atk: 10, def: 3, spd: 100,
      xp: 30, size: 12, aggro: 100, range: 40, diet: 'omni',
      color: '#8B6914', water: false, isBoss: false,
      tiles: null, type: 'monkey', ...data
    });
    this.rockCD = 0;
    this.rockCooldown = 2.5;
    this.jumpCD = 0;
    this.jumpCooldown = 2;
  }

  updateAI(dt, game) {
    this.rockCD = Math.max(0, this.rockCD - dt);
    this.jumpCD = Math.max(0, this.jumpCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Jump away when hit (damage taken)
    if (this.lastHitTime && (Date.now() - this.lastHitTime < 100) && this.jumpCD <= 0) {
      this.jumpAway(player);
      return;
    }

    // Throw rocks at range
    if (dist < 150 && dist > 50 && this.rockCD <= 0) {
      this.throwRock(game, player);
    }

    if (dist < 180) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  jumpAway(player) {
    const away = this.angleTo(player) + Math.PI;
    this.x += Math.cos(away) * 60;
    this.y += Math.sin(away) * 60;
    this.jumpCD = this.jumpCooldown;
    this.invincible = true;
    setTimeout(() => { this.invincible = false; }, 150);
  }

  throwRock(game, target) {
    const angle = this.angleTo(target);
    const p = new Projectile(this.x, this.y, angle, 180, this.atk * 0.6, this, {
      color: '#795548', radius: 5, lifetime: 1.2
    });
    game.addProjectile(p);
    this.rockCD = this.rockCooldown;
  }

  takeDamage(amount, attacker, game) {
    this.lastHitTime = Date.now();
    super.takeDamage(amount, attacker, game);
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 1.2;
  }
}
