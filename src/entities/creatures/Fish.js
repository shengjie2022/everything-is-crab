import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Fish extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '鱼', tier: 2, hp: 25, atk: 7, def: 2, spd: 60,
      xp: 10, size: 10, aggro: 0.3, range: 25, diet: 'omnivore',
      color: '#29b6f6', water: true, isBoss: false,
      tiles: null, type: 'fish', ...data
    });
    this.dashCD = 0;
    this.dashCooldown = 3;
    this.dashing = false;
    this.dashTimer = 0;
  }

  updateAI(dt, game) {
    this.dashCD = Math.max(0, this.dashCD - dt);
    if (this.dashing) { this.dashTimer -= dt; if (this.dashTimer <= 0) this.dashing = false; }

    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }
    const dist = this.distTo(player);

    if (dist < 80 && this.dashCD <= 0 && !this.dashing) {
      this.aiState = AI.ATTACK;
      this.target = player;
      this.startDash(player);
    } else if (dist < 120) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  startDash(target) {
    this.dashing = true;
    this.dashTimer = 0.3;
    this.dashCD = this.dashCooldown;
    const angle = this.angleTo(target);
    this.knockbackX = Math.cos(angle) * 200;
    this.knockbackY = Math.sin(angle) * 200;
  }

  move(dt, game) {
    const onWater = game.tileMap && game.tileMap.isWater(this.x, this.y);
    const spdMult = onWater ? 2.0 : 0.4;
    const spd = this.speed * spdMult;

    if (this.dashing) return; // Knockback handles movement

    if (this.aiState === AI.HUNT && this.target) {
      const angle = this.angleTo(this.target);
      this.x += Math.cos(angle) * spd * dt;
      this.y += Math.sin(angle) * spd * dt;
      this.facing = angle;
    } else {
      this.x += Math.cos(this.wanderAngle) * spd * 0.5 * dt;
      this.y += Math.sin(this.wanderAngle) * spd * 0.5 * dt;
      this.facing = this.wanderAngle;
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;
    game.combat.creatureAttack(this, this.target);
    this.atkCD = 0.8;
  }
}
