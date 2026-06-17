import { Entity } from './Entity.js';

const TYPE_COLORS = {
  xp: '#00e5ff',
  heal: '#4caf50',
  evo: '#ff9800',
  fruit: '#76ff03',
  meat: '#e53935'
};

export class Pickup extends Entity {
  constructor(x, y, type, value = 1, evoPointValue = 0) {
    super(x, y);
    this.radius = 8;
    this.type = type;
    this.value = value;
    this.evoPointValue = evoPointValue;
    this.lifetime = 15;
    this.bobTimer = 0;
    this.bobOffset = 0;
    this.collected = false;
    this.color = TYPE_COLORS[type] || '#fff';
  }

  update(dt) {
    this.lifetime -= dt;
    if (this.lifetime <= 0) { this.dead = true; return; }

    this.bobTimer += dt * 3;
    this.bobOffset = Math.sin(this.bobTimer) * 3;
  }

  collect(player, game) {
    if (this.collected || this.dead) return;
    this.collected = true;
    this.dead = true;

    switch (this.type) {
      case 'xp':
        if (player.addXP) player.addXP(this.value);
        break;
      case 'heal':
        player.hp = Math.min(player.maxHp, player.hp + this.value);
        break;
      case 'evo':
        if (player.evoPoints !== undefined) player.evoPoints++;
        break;
      case 'fruit':
      case 'meat':
        if (player.addXP) player.addXP(this.value);
        if (player.evoPoints !== undefined) player.evoPoints += this.evoPointValue;
        break;
    }

    // Floating text feedback
    if (game.particleSystem) {
      game.particleSystem.emit(this.x, this.y, this.color, 8);
      if (this.type === 'xp') {
        game.particleSystem.addText(this.x, this.y, '+' + this.value, '#ff0');
      } else if (this.type === 'heal') {
        game.particleSystem.addText(this.x, this.y, '+' + this.value, '#0f0');
      } else if (this.type === 'fruit') {
        game.particleSystem.addText(this.x, this.y, '+' + this.value + 'XP', '#76ff03');
      } else if (this.type === 'meat') {
        game.particleSystem.addText(this.x, this.y, '+' + this.value + 'XP', '#e53935');
      }
    }
    if (game.audio) {
      game.audio.playSfx('pickup');
    }
  }

  draw(ctx) {
    const alpha = this.lifetime < 3 ? 0.3 + 0.7 * (this.lifetime / 3) : 1;
    ctx.save();
    ctx.globalAlpha = alpha;

    const drawY = this.y + this.bobOffset;

    // Glow
    ctx.fillStyle = this.color;
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(this.x, drawY, this.radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if (this.type === 'xp') {
      // Diamond shape
      ctx.moveTo(this.x, drawY - this.radius);
      ctx.lineTo(this.x + this.radius, drawY);
      ctx.lineTo(this.x, drawY + this.radius);
      ctx.lineTo(this.x - this.radius, drawY);
    } else if (this.type === 'heal') {
      // Cross shape
      const s = this.radius * 0.4;
      ctx.rect(this.x - s, drawY - this.radius, s * 2, this.radius * 2);
      ctx.rect(this.x - this.radius, drawY - s, this.radius * 2, s * 2);
    } else if (this.type === 'fruit') {
      // Circle shape
      ctx.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
    } else if (this.type === 'meat') {
      // Triangle shape
      ctx.moveTo(this.x, drawY - this.radius);
      ctx.lineTo(this.x + this.radius, drawY + this.radius * 0.7);
      ctx.lineTo(this.x - this.radius, drawY + this.radius * 0.7);
    } else {
      // Star shape
      ctx.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
