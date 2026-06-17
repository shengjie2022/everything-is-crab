import { CONFIG } from '../config.js';

class Particle {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.color = '#fff';
    this.life = 0;
    this.maxLife = 0;
    this.size = 3;
    this.active = false;
  }

  init(x, y, color, vx, vy, life, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.size = size;
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 80 * dt; // gravity
    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
    }
  }
}

class FloatingText {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.text = '';
    this.color = '#fff';
    this.life = 0;
    this.vy = -40;
    this.active = false;
  }

  init(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = String(text);
    this.color = color || '#fff';
    this.life = 1.0;
    this.vy = -40;
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
    }
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.texts = [];

    // Pre-allocate particle pool
    for (let i = 0; i < CONFIG.PARTICLES_MAX; i++) {
      this.particles.push(new Particle());
    }

    // Pre-allocate text pool
    for (let i = 0; i < 50; i++) {
      this.texts.push(new FloatingText());
    }
  }

  _getFreeParticle() {
    for (const p of this.particles) {
      if (!p.active) return p;
    }
    return null;
  }

  _getFreeText() {
    for (const t of this.texts) {
      if (!t.active) return t;
    }
    return null;
  }

  emit(x, y, color, count, opts = {}) {
    const speed = opts.speed || 120;
    const life = opts.life || 0.5;
    const size = opts.size || 3;
    const spread = opts.spread || Math.PI * 2;
    const baseAngle = opts.angle != null ? opts.angle : 0;

    for (let i = 0; i < count; i++) {
      const p = this._getFreeParticle();
      if (!p) break;

      const angle = baseAngle + (Math.random() - 0.5) * spread;
      const spd = speed * (0.4 + Math.random() * 0.6);
      const vx = Math.cos(angle) * spd;
      const vy = Math.sin(angle) * spd;
      const pLife = life * (0.5 + Math.random() * 0.5);
      const pSize = size * (0.5 + Math.random() * 0.5);

      p.init(
        x + (Math.random() - 0.5) * 6,
        y + (Math.random() - 0.5) * 6,
        color,
        vx, vy,
        pLife,
        pSize
      );
    }
  }

  addText(x, y, text, color) {
    const t = this._getFreeText();
    if (t) t.init(x, y, text, color);
  }

  update(dt) {
    for (const p of this.particles) {
      if (p.active) p.update(dt);
    }
    for (const t of this.texts) {
      if (t.active) t.update(dt);
    }
  }

  getParticles() {
    return this.particles.filter(p => p.active);
  }

  getTexts() {
    return this.texts.filter(t => t.active);
  }

  clear() {
    for (const p of this.particles) p.active = false;
    for (const t of this.texts) t.active = false;
  }
}
