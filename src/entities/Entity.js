// ─── Entity.js ─── Base class for all game entities ───

export class Entity {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 12;

    // stats
    this.hp = 100;
    this.maxHp = 100;
    this.atk = 10;
    this.def = 2;
    this.speed = 100;
    this.sen = 0;        // SEN(感知) — detection / minimap range
    this.reg = 0;        // REG(恢复) — passive HP regen per second

    // state flags
    this.dead = false;
    this.invincible = 0;       // frames remaining
    this.knockbackX = 0;
    this.knockbackY = 0;
    this.facing = 0;           // radians
    this.form = 'default';
    this.color = '#fff';
    this.flash = 0;            // frames remaining for damage flash
  }

  // ── Damage / Healing ──────────────────────────────────────────────

  /**
   * Apply damage (reduced by def), knockback and flash.
   * @param {number} amt  Raw incoming damage
   * @param {number} ax   Attacker x (for knockback direction)
   * @param {number} ay   Attacker y
   * @returns {number}    Actual damage dealt after defense
   */
  takeDamage(amt, ax, ay) {
    if (this.dead || this.invincible > 0) return 0;

    const actual = Math.max(1, Math.floor(amt - this.def));
    this.hp -= actual;
    this.flash = 6;

    // knockback away from attacker
    const dx = this.x - ax;
    const dy = this.y - ay;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const kbStr = 160;
    this.knockbackX = (dx / dist) * kbStr;
    this.knockbackY = (dy / dist) * kbStr;

    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }

    return actual;
  }

  /**
   * Restore hp, clamped to maxHp.
   * @param {number} amt
   */
  heal(amt) {
    if (this.dead) return;
    this.hp = Math.min(this.maxHp, this.hp + amt);
  }

  /**
   * Mark entity as dead. Override in sub-classes for drops / effects.
   */
  die() {
    this.dead = true;
  }

  // ── Per-frame update ──────────────────────────────────────────────

  /**
   * Base update: tick invincibility, flash, apply knockback with decay.
   * @param {number} dt   Delta time in seconds
   * @param {object} game Game reference
   */
  update(dt, game) {
    // invincibility countdown (frame-based)
    if (this.invincible > 0) this.invincible = Math.max(0, this.invincible - 1);

    // damage flash countdown
    if (this.flash > 0) this.flash--;

    // knockback with exponential decay
    const decay = Math.pow(0.0005, dt);   // fast falloff
    this.x += this.knockbackX * dt;
    this.y += this.knockbackY * dt;
    this.knockbackX *= decay;
    this.knockbackY *= decay;

    // zero-out negligible knockback
    if (Math.abs(this.knockbackX) < 0.5) this.knockbackX = 0;
    if (Math.abs(this.knockbackY) < 0.5) this.knockbackY = 0;
  }

  // ── Helpers ───────────────────────────────────────────────────────

  /** @returns {number} 0..1 health percentage */
  getHpPct() {
    return this.maxHp > 0 ? this.hp / this.maxHp : 0;
  }

  /** Euclidean distance to another entity. */
  distTo(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** Angle (radians) toward another entity. */
  angleTo(other) {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }
}
