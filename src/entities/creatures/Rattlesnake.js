import { Creature } from '../Creature.js';
import { Projectile } from '../Projectile.js';
import { AI } from '../../constants.js';

export class Rattlesnake extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '响尾蛇', tier: 3, hp: 50, atk: 18, def: 3, spd: 95,
      xp: 50, size: 12, aggro: 100, range: 90, diet: 'carni',
      color: '#8d6e63', water: false, isBoss: false,
      tiles: null, type: 'rattlesnake', ...data
    });
    this.venomCD = 0;
    this.venomCooldown = 3;
    this.rattleCD = 0;
    this.rattleCooldown = 8;
    this.isRattling = false;
  }

  updateAI(dt, game) {
    this.venomCD = Math.max(0, this.venomCD - dt);
    this.rattleCD = Math.max(0, this.rattleCD - dt);
    const player = game.player;
    if (!player || player.dead) { this.aiState = AI.WANDER; return; }

    const dist = this.distTo(player);

    // Rattle warning increases aggro range
    if (dist < 150 && dist > 80 && this.rattleCD <= 0 && !this.isRattling) {
      this.startRattle();
    }

    const effectiveAggro = this.isRattling ? this.aggro * 2 : this.aggro;

    // Ranged venom projectile
    if (dist < this.range && this.venomCD <= 0) {
      this.shootVenom(game, player);
    }

    if (dist < effectiveAggro) {
      this.aiState = AI.HUNT;
      this.target = player;
    } else if (dist < 35) {
      this.aiState = AI.ATTACK;
      this.target = player;
    } else {
      this.aiState = AI.WANDER;
    }
  }

  startRattle() {
    this.isRattling = true;
    this.rattleCD = this.rattleCooldown;

    setTimeout(() => {
      this.isRattling = false;
    }, 2500);
  }

  shootVenom(game, target) {
    const angle = this.angleTo(target);
    const p = new Projectile(this.x, this.y, angle, 200, this.atk * 0.7, this, {
      color: '#7cb342', radius: 5, lifetime: 1.5,
      effect: 'poison', effectDuration: 4
    });
    game.addProjectile(p);
    this.venomCD = this.venomCooldown;
  }

  performAttack(game) {
    if (this.atkCD > 0 || !this.target) return;

    // Melee attack also applies poison
    game.combat.creatureAttack(this, this.target);

    if (this.target.statusEffects) {
      this.target.statusEffects.poison = 3;
    }

    this.atkCD = 1.4;
  }

  move(dt, game) {
    // Move faster when rattling
    if (this.isRattling) {
      this.speed = 120;
    } else {
      this.speed = 95;
    }
    super.move(dt, game);
  }
}
