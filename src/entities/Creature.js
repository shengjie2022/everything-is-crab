// ─── Creature.js ─── AI-driven creature with 5-state machine ───

import { Entity } from './Entity.js';
import { AI } from '../constants.js';
import { CONFIG } from '../config.js';

export class Creature extends Entity {
  /**
   * @param {number} x
   * @param {number} y
   * @param {object} data  Creature template from data table
   *   { name, tier, hp, atk, def, spd, xp, size, aggro, range,
   *     diet, color, water, isBoss, tiles, type }
   */
  constructor(x, y, data) {
    super(x, y);

    // ── Identity ────────────────────────────────────────────────
    this.name   = data.name   || 'creature';
    this.tier   = data.tier   || 1;
    this.type   = data.type   || 'normal';
    this.isBoss = !!data.isBoss;

    // ── Stats from data ─────────────────────────────────────────
    this.hp     = data.hp   || 50;
    this.maxHp  = data.hp   || 50;
    this.atk    = data.atk  || 5;
    this.def    = data.def  || 1;
    this.speed  = data.spd  || 60;
    this.xpVal  = data.xp   || 10;
    this.radius = data.size  || 12;
    this.form   = data.type  || 'slime';
    this.color  = data.color || '#aaa';

    // ── Behaviour params ────────────────────────────────────────
    this.aggro    = data.aggro ?? 150;      // aggro detection range
    this.atkRange = data.range ?? 28;      // melee strike range
    this.diet     = data.diet  || 'passive';
    this.water    = !!data.water;          // can enter water
    this.tiles    = data.tiles || null;    // preferred tile types

    // ── AI state machine ────────────────────────────────────────
    this.aiState      = AI.WANDER;
    this.aiTimer      = 0;
    this.wanderAngle  = Math.random() * Math.PI * 2;
    this.wanderTimer  = 0;
    this.target       = null;
    this.homeX        = x;
    this.homeY        = y;
    this.leash        = 400;

    // ── Cooldowns ───────────────────────────────────────────────
    this.atkCD        = 0;
    this.abilCD       = 0;
    this.recoverTimer = 0;

    // ── Animation ───────────────────────────────────────────────
    this.animTimer    = 0;
  }

  // ═══════════════════════════════════════════════════════════════════
  // UPDATE
  // ═══════════════════════════════════════════════════════════════════

  update(dt, game) {
    super.update(dt, game);
    if (this.dead) return;

    const dtMs = dt * 1000;

    // tick cooldowns
    if (this.atkCD > 0)  this.atkCD  -= dtMs;
    if (this.abilCD > 0) this.abilCD -= dtMs;

    this.updateAI(dt, game);
    this.move(dt, game);

    this.animTimer += dt;
  }

  // ═══════════════════════════════════════════════════════════════════
  // AI STATE MACHINE
  // ═══════════════════════════════════════════════════════════════════

  updateAI(dt, game) {
    const player = game.player;
    const dtMs   = dt * 1000;

    // aggro multiplier from day/night cycle (creatures more aggressive at night)
    const aggroMult = (game.dayNight && typeof game.dayNight.aggroMult === 'function') ? game.dayNight.aggroMult() : 1;
    const effectiveAggro = this.aggro * aggroMult;

    switch (this.aiState) {

      // ── WANDER ──────────────────────────────────────────────────
      case AI.WANDER: {
        this.wanderTimer -= dtMs;
        if (this.wanderTimer <= 0) {
          this.wanderAngle = Math.random() * Math.PI * 2;
          this.wanderTimer = 1500 + Math.random() * 2000;
        }

        // check if player in aggro range (only for carnivores/omnivores)
        if (this.diet !== 'passive' && this.diet !== 'herb' && player && !player.dead) {
          const distP = this.distTo(player);
          if (distP < effectiveAggro) {
            this.target  = player;
            this.aiState = AI.HUNT;
            this.aiTimer = 0;
            break;
          }
        }
        break;
      }

      // ── HUNT ────────────────────────────────────────────────────
      case AI.HUNT: {
        if (!this.target || this.target.dead) {
          this.aiState = AI.WANDER;
          this.target  = null;
          break;
        }

        const distTarget = this.distTo(this.target);

        // close enough to attack
        if (distTarget < this.atkRange + this.radius + this.target.radius) {
          this.aiState = AI.ATTACK;
          this.aiTimer = 0;
          break;
        }

        // leash: too far from home, give up
        const distHome = Math.sqrt(
          (this.x - this.homeX) ** 2 + (this.y - this.homeY) ** 2
        );
        if (distHome > this.leash) {
          this.aiState = AI.WANDER;
          this.target  = null;
          break;
        }

        // face target
        this.facing = this.angleTo(this.target);
        break;
      }

      // ── ATTACK ──────────────────────────────────────────────────
      case AI.ATTACK: {
        if (!this.target || this.target.dead) {
          this.aiState = AI.WANDER;
          this.target  = null;
          break;
        }

        const distTarget = this.distTo(this.target);

        // target moved out of range -> chase again
        if (distTarget > (this.atkRange + this.radius + this.target.radius) * 1.3) {
          this.aiState = AI.HUNT;
          break;
        }

        // flee if low hp (below 20%)
        if (this.getHpPct() < 0.2 && this.diet !== 'boss') {
          this.aiState = AI.FLEE;
          break;
        }

        // attempt attack on cooldown
        if (this.atkCD <= 0) {
          this.performAttack(game);
          this.atkCD = CONFIG.ATK_CD + Math.random() * 200;
        }

        this.facing = this.angleTo(this.target);
        break;
      }

      // ── FLEE ────────────────────────────────────────────────────
      case AI.FLEE: {
        if (!player || player.dead) {
          this.aiState = AI.RECOVER;
          break;
        }

        const distP = this.distTo(player);

        // far enough away -> recover
        if (distP > this.aggro * 1.5) {
          this.aiState     = AI.RECOVER;
          this.recoverTimer = 3000;
          break;
        }

        // run away from player
        this.facing = this.angleTo(player) + Math.PI;
        break;
      }

      // ── RECOVER ─────────────────────────────────────────────────
      case AI.RECOVER: {
        this.recoverTimer -= dtMs;

        // heal slowly (10% maxHp per second)
        this.heal(this.maxHp * 0.1 * dt);

        if (this.recoverTimer <= 0 || this.getHpPct() >= 0.8) {
          this.aiState = AI.WANDER;
          this.target  = null;
        }
        break;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // MOVEMENT
  // ═══════════════════════════════════════════════════════════════════

  move(dt, game) {
    let dx = 0, dy = 0;

    switch (this.aiState) {
      case AI.WANDER:
        dx = Math.cos(this.wanderAngle);
        dy = Math.sin(this.wanderAngle);
        break;

      case AI.HUNT:
      case AI.ATTACK:
        if (this.target) {
          const a = this.angleTo(this.target);
          dx = Math.cos(a);
          dy = Math.sin(a);
          // in ATTACK state, creep closer only if not right on top
          if (this.aiState === AI.ATTACK) {
            const dist = this.distTo(this.target);
            if (dist < this.atkRange * 0.6) { dx = 0; dy = 0; }
          }
        }
        break;

      case AI.FLEE:
        dx = Math.cos(this.facing);
        dy = Math.sin(this.facing);
        break;

      case AI.RECOVER:
        // drift back toward home
        const hDist = Math.sqrt((this.homeX - this.x) ** 2 + (this.homeY - this.y) ** 2);
        if (hDist > 20) {
          const ha = Math.atan2(this.homeY - this.y, this.homeX - this.x);
          dx = Math.cos(ha) * 0.5;
          dy = Math.sin(ha) * 0.5;
        }
        break;
    }

    // wander and recover move at half speed
    let speedMult = 1;
    if (this.aiState === AI.WANDER)   speedMult = 0.5;
    if (this.aiState === AI.RECOVER)  speedMult = 0.4;
    if (this.aiState === AI.FLEE)     speedMult = 1.2;

    const tileMult = game.tileMap.speedAt(this.x, this.y);

    // water check: non-water creatures avoid water tiles
    if (!this.water && game.tileMap.isWater(this.x + dx * 16, this.y + dy * 16)) {
      // reverse direction
      dx = -dx;
      dy = -dy;
      this.wanderAngle += Math.PI;
    }

    const spd = this.speed * speedMult * tileMult;
    let nx = this.x + dx * spd * dt;
    let ny = this.y + dy * spd * dt;

    // tile collision resolve
    const resolved = game.tileMap.resolve(this.x, this.y, nx, ny, this.radius);
    nx = resolved.x;
    ny = resolved.y;

    // world bounds
    nx = Math.max(this.radius, Math.min(CONFIG.WORLD_WIDTH  - this.radius, nx));
    ny = Math.max(this.radius, Math.min(CONFIG.WORLD_HEIGHT - this.radius, ny));

    this.x = nx;
    this.y = ny;
  }

  // ═══════════════════════════════════════════════════════════════════
  // COMBAT
  // ═══════════════════════════════════════════════════════════════════

  performAttack(game) {
    // Attack current target (player or another creature)
    const target = this.target || game.player;
    if (!target || target.dead) return;

    const dist = this.distTo(target);
    if (dist <= this.atkRange + this.radius + (target.radius || 12)) {
      if (target === game.player) {
        game.combat.creatureAttack(this, target);
      } else {
        // Creature-vs-creature combat
        const dmg = target.takeDamage(this.atk, this.x, this.y);
        if (dmg > 0 && game.particleSystem) {
          game.particleSystem.emit(target.x, target.y, '#ff0', 3);
        }
        if (target.dead && game.combat) {
          game.combat._onKill(target);
        }
      }
    }
  }

  /**
   * Special ability — override in subclass for unique creature abilities.
   * Called periodically by AI when conditions are met.
   */
  specialAbility(game) {
    // Base implementation does nothing
  }

  // ═══════════════════════════════════════════════════════════════════
  // DEATH
  // ═══════════════════════════════════════════════════════════════════

  die() {
    this.dead = true;
    // drops and effects are handled by the spawn / loot systems
  }
}
