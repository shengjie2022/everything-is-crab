import { Entity } from './Entity.js';

export class Projectile extends Entity {
  constructor(x, y, angle, speed, damage, owner, opts = {}) {
    super(x, y);
    this.radius = opts.radius || 5;
    this.angle = angle;
    this.speed = speed;
    this.damage = damage;
    this.owner = owner;
    this.color = opts.color || '#ff0';
    this.lifetime = opts.lifetime || 2;
    this.effect = opts.effect || null;
    this.effectDuration = opts.effectDuration || 0;
    this.piercing = opts.piercing || false;
    this.isPlayer = opts.isPlayer || false;
    this.stationary = opts.stationary || false;
    this.aoe = opts.aoe || false;
    this.aoeRadius = opts.aoeRadius || 0;
    this.hitTargets = new Set();
    this.vx = this.stationary ? 0 : Math.cos(angle) * speed;
    this.vy = this.stationary ? 0 : Math.sin(angle) * speed;
  }

  update(dt, game) {
    this.lifetime -= dt;
    if (this.lifetime <= 0) { this.dead = true; return; }

    if (!this.stationary) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      if (game.tileMap && game.tileMap.isWater && game.tileMap.isWater(this.x, this.y) === false) {
        // Check solid tile collision
      }
    }

    if (this.isPlayer) {
      this.checkCreatureHits(game);
    } else {
      this.checkPlayerHit(game);
    }
  }

  checkPlayerHit(game) {
    const p = game.player;
    if (!p || p.dead || p.invincible > 0 || this.hitTargets.has(p)) return;
    const dx = p.x - this.x, dy = p.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.radius + p.radius) {
      this.onHit(p, game);
      if (!this.piercing) this.dead = true;
    }
  }

  checkCreatureHits(game) {
    const creatures = game.getCreatures();
    for (const c of creatures) {
      if (c.dead || this.hitTargets.has(c)) continue;
      const dx = c.x - this.x, dy = c.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.radius + c.radius) {
        this.onHit(c, game);
        if (!this.piercing) { this.dead = true; return; }
      }
    }
  }

  onHit(target, game) {
    this.hitTargets.add(target);

    if (this.aoe) {
      this.applyAoE(target, game);
    } else {
      this.applyDamage(target, game);
    }

    if (game.particleSystem) {
      game.particleSystem.emit(target.x, target.y, this.color, 6);
    }
  }

  applyAoE(center, game) {
    const targets = this.isPlayer ? game.getCreatures() : [game.player];
    for (const t of targets) {
      if (!t || t.dead || this.hitTargets.has(t)) continue;
      const dx = t.x - this.x, dy = t.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.aoeRadius) {
        this.applyDamage(t, game);
        this.hitTargets.add(t);
      }
    }
  }

  applyDamage(target, game) {
    if (game.combat) {
      game.combat.creatureAttack(this.owner, target, this.damage);
    } else {
      const dmg = Math.max(1, this.damage - (target.def || 0));
      target.hp -= dmg;
      if (target.hp <= 0) target.dead = true;
    }

    if (this.effect === 'poison' && this.effectDuration > 0) {
      target.poisoned = true;
      target.poisonTimer = this.effectDuration;
      target.poisonDmg = 3;
    }
    if (this.effect === 'slow' && this.effectDuration > 0) {
      target.slowed = true;
      target.slowTimer = this.effectDuration;
      target.slowFactor = 0.4;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, this.lifetime * 3);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if (this.aoe && this.stationary) {
      ctx.arc(this.x, this.y, this.aoeRadius, 0, Math.PI * 2);
      ctx.globalAlpha = 0.25;
      ctx.fill();
      ctx.globalAlpha = 0.6;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    } else {
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }
}
