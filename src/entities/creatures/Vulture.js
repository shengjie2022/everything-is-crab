import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Vulture extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '秃鹫', tier: 2, hp: 35, atk: 12, def: 2, spd: 85,
      xp: 30, size: 13, aggro: 160, range: 35, diet: 'carni',
      color: '#4e342e', water: false, isBoss: false,
      tiles: null, type: 'vulture', ...data
    });
    this.circleAngle = Math.random() * Math.PI * 2;
    this.circleRadius = 120;
    this.isDiving = false;
    this.diveCD = 0;
    this.diveCooldown = 3;
  }

  updateAI(dt, game) {
    this.diveCD = Math.max(0, this.diveCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);
    const playerLowHp = player.getHpPct() < 0.4;

    // Circle from afar, dive when player is low HP
    if (dist < 200 && !this.isDiving) {
      this.circleAngle += dt * 1.5;
      this.aiState = AI.HUNT;
      this.target = player;

      // Position in circle around player
      const targetX = player.x + Math.cos(this.circleAngle) * this.circleRadius;
      const targetY = player.y + Math.sin(this.circleAngle) * this.circleRadius;
      this.facing = Math.atan2(targetY - this.y, targetX - this.x);

      // Dive attack when player is low HP
      if (playerLowHp && this.diveCD <= 0) {
        this.startDive(player);
      }
    } else if (this.isDiving) {
      // Continue diving
      this.aiState = AI.ATTACK;
      this.target = player;
      this.facing = this.angleTo(player);

      if (dist < 30) {
        this.isDiving = false;
        this.speed = 85;
      }
    } else {
      this.aiState = AI.WANDER;
    }
  }

  startDive(player) {
    this.isDiving = true;
    this.diveCD = this.diveCooldown;
    this.speed = 180; // Fast dive

    setTimeout(() => {
      this.isDiving = false;
      this.speed = 85;
    }, 1500);
  }

  move(dt, game) {
    if (this.isDiving) {
      // Dive straight at target
      if (this.target) {
        const angle = this.angleTo(this.target);
        this.x += Math.cos(angle) * this.speed * dt;
        this.y += Math.sin(angle) * this.speed * dt;
      }
    } else if (this.aiState === AI.HUNT && this.target) {
      // Circle movement
      this.circleAngle += dt * 1.5;
      const targetX = this.target.x + Math.cos(this.circleAngle) * this.circleRadius;
      const targetY = this.target.y + Math.sin(this.circleAngle) * this.circleRadius;

      const angle = Math.atan2(targetY - this.y, targetX - this.x);
      this.x += Math.cos(angle) * this.speed * dt;
      this.y += Math.sin(angle) * this.speed * dt;
    } else {
      super.move(dt, game);
    }
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;

    // Dive attack does extra damage
    const damage = this.isDiving ? this.atk * 1.6 : this.atk;
    game.combat.creatureAttack(this, this.target, damage);
    this.atkCD = 1.3;
  }
}
