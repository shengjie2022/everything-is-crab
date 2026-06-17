// ─── MinimapUI.js ─── Canvas-drawn minimap in bottom-right corner ───

import { CONFIG } from '../config.js';
import { TILE_PROPS } from '../constants.js';

export class MinimapUI {
  constructor(game) {
    this.game  = game;
    this.size  = CONFIG.MINIMAP_SIZE;         // 140

    // off-screen buffer for terrain (re-rendered only when dirty)
    this._buf  = document.createElement('canvas');
    this._buf.width  = this.size;
    this._buf.height = this.size;
    this._bctx = this._buf.getContext('2d');
    this._dirty = true;

    // scale factors: world -> minimap
    this._sx = this.size / CONFIG.WORLD_WIDTH;
    this._sy = this.size / CONFIG.WORLD_HEIGHT;
  }

  /**
   * Mark the terrain buffer as needing a re-render.
   * Call this when tile data changes (e.g. after world generation).
   */
  invalidate() {
    this._dirty = true;
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DRAW (called every frame on the main canvas)
  // ═══════════════════════════════════════════════════════════════════

  draw(ctx) {
    if (this._dirty) {
      this._renderTerrain();
      this._dirty = false;
    }

    const s  = this.size;
    const ox = CONFIG.CANVAS_WIDTH  - s - 10;
    const oy = CONFIG.CANVAS_HEIGHT - s - 10;

    ctx.save();

    // ── Background + terrain buffer ──────────────────────────────
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#0c0c0c';
    ctx.fillRect(ox - 2, oy - 2, s + 4, s + 4);
    ctx.drawImage(this._buf, ox, oy);
    ctx.globalAlpha = 1;

    // ── Creatures ────────────────────────────────────────────────
    const creatures = this.game.getCreatures();
    for (let i = 0; i < creatures.length; i++) {
      const c = creatures[i];
      if (c.dead) continue;

      const mx = ox + c.x * this._sx;
      const my = oy + c.y * this._sy;

      if (c.isBoss) {
        // boss: large red dot
        ctx.fillStyle = '#f22';
        ctx.beginPath();
        ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // hostile vs passive
        ctx.fillStyle = (c.diet !== 'passive') ? '#f66' : '#6d6';
        ctx.fillRect(mx - 1, my - 1, 2, 2);
      }
    }

    // ── Pickups (optional small dots) ────────────────────────────
    const pickups = this.game.pickups;
    if (pickups) {
      ctx.fillStyle = '#ff08';
      for (let i = 0; i < pickups.length; i++) {
        const p = pickups[i];
        if (p.dead) continue;
        const mx = ox + p.x * this._sx;
        const my = oy + p.y * this._sy;
        ctx.fillRect(mx, my, 1, 1);
      }
    }

    // ── Camera viewport (white rect outline) ─────────────────────
    const cam = this.game.camera;
    const cx  = ox + cam.x * this._sx;
    const cy  = oy + cam.y * this._sy;
    const cw  = cam.w * this._sx;
    const ch  = cam.h * this._sy;

    ctx.strokeStyle = '#fff8';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx, cy, cw, ch);

    // ── Player (white dot, always on top) ────────────────────────
    const p  = this.game.player;
    if (p && !p.dead) {
      const px = ox + p.x * this._sx;
      const py = oy + p.y * this._sy;

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Border ───────────────────────────────────────────────────
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(ox - 2, oy - 2, s + 4, s + 4);

    ctx.restore();
  }

  // ═══════════════════════════════════════════════════════════════════
  //  TERRAIN BUFFER (rendered only when dirty)
  // ═══════════════════════════════════════════════════════════════════

  _renderTerrain() {
    const bctx = this._bctx;
    const s    = this.size;
    const tm   = this.game.tileMap;

    bctx.clearRect(0, 0, s, s);

    if (!tm || !tm.tiles) return;

    const cols = tm.cols;
    const rows = tm.rows;

    // Each minimap pixel covers multiple tiles; we sample at minimap resolution
    // for performance. Compute how many tiles map to one minimap pixel.
    const tPerPxX = cols / s;
    const tPerPxY = rows / s;

    const imgData = bctx.createImageData(s, s);
    const data    = imgData.data;

    for (let py = 0; py < s; py++) {
      const tr = Math.floor(py * tPerPxY);
      for (let px = 0; px < s; px++) {
        const tc = Math.floor(px * tPerPxX);
        const tile = tm.get(tc, tr);
        const colorHex = TILE_PROPS[tile]?.color || '#000';
        const rgb = this._hexToRGB(colorHex);

        const idx = (py * s + px) * 4;
        data[idx]     = rgb.r;
        data[idx + 1] = rgb.g;
        data[idx + 2] = rgb.b;
        data[idx + 3] = 220;
      }
    }

    bctx.putImageData(imgData, 0, 0);
  }

  /**
   * Parse a hex colour string to {r,g,b}.
   * @param {string} hex  e.g. '#2d5a1e' or '#555'
   * @returns {{r:number, g:number, b:number}}
   */
  _hexToRGB(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      // short form #RGB
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return { r, g, b };
  }
}
