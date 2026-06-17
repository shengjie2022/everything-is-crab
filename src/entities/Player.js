// ─── Player.js ─── Player entity with input, abilities & progression ───

import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y);

    // base stats from CONFIG
    this.hp        = CONFIG.PLAYER_HP;
    this.maxHp     = CONFIG.PLAYER_HP;
    this.atk       = CONFIG.PLAYER_ATK;
    this.def       = CONFIG.PLAYER_DEF;
    this.speed     = CONFIG.PLAYER_SPD;
    this.radius    = 14;
    this.color     = '#e44';

    // ── Progression ─────────────────────────────────────────────────
    this.xp            = 0;
    this.level         = 1;
    this.xpNext        = 50;
    this.evoPoints     = CONFIG.STARTING_EVO_POINTS;
    this.unlockedEvos  = ['base'];
    this.traits        = [];

    // ── Dash ────────────────────────────────────────────────────────
    this.dashTimer     = 0;
    this.dashCD        = 0;

    // ── Attack ──────────────────────────────────────────────────────
    this.attackCD      = 0;
    this.attackAngle   = 0;
    this.attackArc     = Math.PI / 2;
    this.attackRange   = 40;
    this.isAttacking   = false;
    this.attackTimer   = 0;

    // ── Devour ──────────────────────────────────────────────────────
    this.isDevour      = false;
    this.devourTarget  = null;
    this.devourTimer   = 0;

    // ── Jump ────────────────────────────────────────────────────────
    this.isJumping     = false;
    this.jumpTimer     = 0;
    this.jumpCD        = 0;
    this.jumpH         = 0;           // visual z-height for arc

    // ── Bonus stats (from evolutions / items) ───────────────────────
    this.regenRate     = 0;
    this.bonusAtk      = 0;
    this.bonusDef      = 0;
    this.bonusHp       = 0;
    this.bonusSpd      = 0;
    this.bonusSen      = 0;    // SEN(感知) — affects detection range
    this.bonusReg      = 0;    // REG(恢复) — affects regen rate

    // ── Animation ───────────────────────────────────────────────────
    this.animTimer     = 0;
    this.moveDir       = { x: 0, y: 0 };
  }

  // ═══════════════════════════════════════════════════════════════════
  // INPUT
  // ═══════════════════════════════════════════════════════════════════

  handleInput(input, game, dt) {
    // ── Movement direction ────────────────────────────────────────
    let mx = 0, my = 0;
    if (input.keys['KeyW'] || input.keys['ArrowUp'])    my -= 1;
    if (input.keys['KeyS'] || input.keys['ArrowDown'])  my += 1;
    if (input.keys['KeyA'] || input.keys['ArrowLeft'])  mx -= 1;
    if (input.keys['KeyD'] || input.keys['ArrowRight']) mx += 1;

    // normalise diagonal
    if (mx !== 0 && my !== 0) {
      const inv = 1 / Math.SQRT2;
      mx *= inv;
      my *= inv;
    }
    this.moveDir.x = mx;
    this.moveDir.y = my;

    if (mx !== 0 || my !== 0) {
      this.facing = Math.atan2(my, mx);
    }

    // ── Consume actions ──────────────────────────────────────────
    if (input.actions.attack)  this.tryAttack(input, game);
    if (input.actions.devour)  this.tryDevour(game);

    if (input.actions.dash && this.dashCD <= 0 && (mx !== 0 || my !== 0)) {
      this.dashTimer = CONFIG.DASH_MS;
      this.dashCD    = CONFIG.DASH_CD;
      if (game.audio) game.audio.playSfx('dash');
    }

    if (input.actions.jump && this.jumpCD <= 0 && !this.isJumping) {
      this.isJumping = true;
      this.jumpTimer = CONFIG.JUMP_MS;
      this.jumpCD    = CONFIG.JUMP_CD;
      if (game.audio) game.audio.playSfx('jump');
    }

    // clear consumed actions
    input.actions = {};
  }

  // ═══════════════════════════════════════════════════════════════════
  // ABILITIES
  // ═══════════════════════════════════════════════════════════════════

  tryAttack(input, game) {
    if (this.attackCD > 0) return;

    // aim toward mouse world position
    const worldMouse = game.camera.s2w(input.mouseX, input.mouseY);
    this.attackAngle  = Math.atan2(worldMouse.y - this.y, worldMouse.x - this.x);
    this.facing       = this.attackAngle;
    this.isAttacking  = true;
    this.attackTimer   = 120;          // ms visual duration
    this.attackCD      = CONFIG.ATK_CD;

    game.combat.playerAttack(this, this.attackAngle, this.attackArc, this.attackRange);
    if (game.audio) game.audio.playSfx('attack');
  }

  tryDevour(game) {
    if (this.isDevour) return;

    const creatures = game.getCreatures();
    let closest = null;
    let closestDist = CONFIG.DEVOUR_RANGE;

    for (let i = 0; i < creatures.length; i++) {
      const c = creatures[i];
      if (c.dead) continue;
      if (c.getHpPct() > CONFIG.DEVOUR_HP_PCT) continue;

      const d = this.distTo(c);
      if (d < closestDist) {
        closestDist = d;
        closest = c;
      }
    }

    if (closest) {
      this.isDevour     = true;
      this.devourTarget = closest;
      this.devourTimer  = CONFIG.DEVOUR_MS;
      if (game.audio) game.audio.playSfx('devour');
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // UPDATE
  // ═══════════════════════════════════════════════════════════════════

  update(dt, game) {
    super.update(dt, game);

    const dtMs = dt * 1000;

    // ── Cooldowns ────────────────────────────────────────────────
    if (this.dashCD > 0)   this.dashCD   -= dtMs;
    if (this.dashTimer > 0) this.dashTimer -= dtMs;
    if (this.attackCD > 0)  this.attackCD  -= dtMs;
    if (this.jumpCD > 0)    this.jumpCD    -= dtMs;

    // attack visual timer
    if (this.attackTimer > 0) {
      this.attackTimer -= dtMs;
      if (this.attackTimer <= 0) this.isAttacking = false;
    }

    // ── Jump arc (sinusoidal height) ─────────────────────────────
    if (this.isJumping) {
      this.jumpTimer -= dtMs;
      if (this.jumpTimer <= 0) {
        this.isJumping = false;
        this.jumpTimer = 0;
        this.jumpH = 0;
      } else {
        const t = 1 - (this.jumpTimer / CONFIG.JUMP_MS);
        this.jumpH = Math.sin(t * Math.PI) * 40;   // peak height 40px
      }
    }

    // ── Devour channel ──────────────────────────────────────────
    if (this.isDevour) {
      this.devourTimer -= dtMs;

      // cancel if target died or moved too far
      if (!this.devourTarget || this.devourTarget.dead ||
          this.distTo(this.devourTarget) > CONFIG.DEVOUR_RANGE * 1.5) {
        this.isDevour     = false;
        this.devourTarget = null;
        this.devourTimer  = 0;
      } else if (this.devourTimer <= 0) {
        // devour completes
        game.combat.devour(this, this.devourTarget);
        this.isDevour     = false;
        this.devourTarget = null;
      }
    }

    // ── Movement ────────────────────────────────────────────────
    const mx = this.moveDir.x;
    const my = this.moveDir.y;

    let spd = this.getEffSpd();
    const tileMult = game.tileMap.speedAt(this.x, this.y);
    spd *= tileMult;

    // dash multiplier
    if (this.dashTimer > 0) spd *= CONFIG.DASH_MULT;

    this.vx = mx * spd;
    this.vy = my * spd;

    let nx = this.x + this.vx * dt;
    let ny = this.y + this.vy * dt;

    // tile collision resolve
    const resolved = game.tileMap.resolve(this.x, this.y, nx, ny, this.radius);
    nx = resolved.x;
    ny = resolved.y;

    // world bounds
    nx = Math.max(this.radius, Math.min(CONFIG.WORLD_WIDTH - this.radius, nx));
    ny = Math.max(this.radius, Math.min(CONFIG.WORLD_HEIGHT - this.radius, ny));

    this.x = nx;
    this.y = ny;

    // ── Regen (base regenRate + REG attribute) ──────────────────
    const totalRegen = this.regenRate + this.getEffReg();
    if (totalRegen > 0 && this.hp < this.maxHp) {
      this.heal(totalRegen * dt);
    }

    // ── XP magnet ───────────────────────────────────────────────
    const pickups = game.pickups;
    for (let i = 0; i < pickups.length; i++) {
      const p = pickups[i];
      if (p.dead) continue;
      const d = this.distTo(p);

      if (d < CONFIG.XP_RANGE) {
        p.collect(this, game);
      } else if (d < CONFIG.XP_MAGNET) {
        // pull toward player
        const angle = p.angleTo
          ? Math.atan2(this.y - p.y, this.x - p.x)
          : Math.atan2(this.y - p.y, this.x - p.x);
        const pullSpd = 200;
        p.x += Math.cos(angle) * pullSpd * dt;
        p.y += Math.sin(angle) * pullSpd * dt;
      }
    }

    // ── Animation timer ─────────────────────────────────────────
    if (mx !== 0 || my !== 0) {
      this.animTimer += dt;
    } else {
      this.animTimer = 0;
    }

    // ── Death check ─────────────────────────────────────────────
    if (this.hp <= 0 && !this.dead) {
      this.die();
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // EFFECTIVE STATS
  // ═══════════════════════════════════════════════════════════════════

  getEffAtk() { return this.atk + this.bonusAtk; }
  getEffDef() { return this.def + this.bonusDef; }
  getEffSpd() { return this.speed + this.bonusSpd; }
  getEffSen() { return this.sen + this.bonusSen; }
  getEffReg() { return this.reg + this.bonusReg; }

  // ═══════════════════════════════════════════════════════════════════
  // PROGRESSION
  // ═══════════════════════════════════════════════════════════════════

  addXP(amt) {
    this.xp += amt;
    while (this.xp >= this.xpNext) {
      this.xp -= this.xpNext;
      this.applyLevelUp();
      this._levelUpOccurred = true;
    }
  }

  applyLevelUp() {
    this.level  += 1;
    this.xpNext  = Math.floor(this.xpNext * 1.4);
    this.maxHp += 5;
    this.hp    += 5;
    this.atk   += 1;
    this.def   += 0.5;
    this.speed += 2;
  }

  /**
   * Apply an evolution node from the carcinization tree.
   * @param {object} node  { id, stat:{hp,atk,def,spd,sen,reg}, form, trait }
   */
  applyEvolution(node) {
    if (node.stat) {
      if (node.stat.hp)  { this.bonusHp  += node.stat.hp;  this.maxHp += node.stat.hp; this.hp += node.stat.hp; }
      if (node.stat.atk) { this.bonusAtk += node.stat.atk; }
      if (node.stat.def) { this.bonusDef += node.stat.def; }
      if (node.stat.spd) { this.bonusSpd += node.stat.spd; }
      if (node.stat.sen) { this.bonusSen += node.stat.sen; }
      if (node.stat.reg) { this.bonusReg += node.stat.reg; }
    }
    if (node.form)  this.form = node.form;
    if (node.trait && !this.traits.includes(node.trait)) {
      this.traits.push(node.trait);
    }
    if (node.id) this.unlockedEvos.push(node.id);
  }

  /**
   * Apply a flat stat bonus (e.g. from crab-specific upgrades).
   * @param {object} bonus  { hp, atk, def, spd, regen }
   */
  applyCrabBonus(bonus) {
    if (bonus.hp)    { this.bonusHp  += bonus.hp;  this.maxHp += bonus.hp; this.hp += bonus.hp; }
    if (bonus.atk)   { this.bonusAtk += bonus.atk; }
    if (bonus.def)   { this.bonusDef += bonus.def; }
    if (bonus.spd)   { this.bonusSpd += bonus.spd; }
    if (bonus.sen)   { this.bonusSen += bonus.sen; }
    if (bonus.reg)   { this.bonusReg += bonus.reg; }
    if (bonus.regen) { this.regenRate += bonus.regen; }
  }

  die() {
    super.die();
    // player death is handled by game state machine; we just flag it
  }
}
