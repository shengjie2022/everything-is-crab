// ─── HUD.js ─── Canvas-drawn heads-up display overlay (screen-space) ───

import { CONFIG } from '../config.js';
import { BOSS_NODE } from '../constants.js';

const BAR_W = 200;
const BAR_H = 18;
const PAD   = 12;

export class HUD {
  constructor(game) {
    this.game = game;
  }

  draw(ctx) {
    const g   = this.game;
    const p   = g.player;
    if (!p) return;

    ctx.save();
    ctx.textBaseline = 'top';

    // ── 1. HP bar (top-left) ─────────────────────────────────────
    this._drawBar(ctx, PAD, PAD, BAR_W, BAR_H,
      p.hp, p.maxHp, '#2d2d2d', '#3a3', '#c33', true);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`HP: ${Math.ceil(p.hp)}/${p.maxHp}`, PAD + 6, PAD + 3);

    // ── 2. XP bar (below HP) ─────────────────────────────────────
    const xpY = PAD + BAR_H + 4;
    this._drawBar(ctx, PAD, xpY, BAR_W, BAR_H - 4,
      p.xp, p.xpNext, '#2d2d2d', '#48f', '#48f', false);
    ctx.fillStyle = '#ddf';
    ctx.font = '11px monospace';
    ctx.fillText(`Lv.${p.level}  ${p.xp}/${p.xpNext}`, PAD + 6, xpY + 1);

    // ── 3. Evo points counter ────────────────────────────────────
    const evoY = xpY + BAR_H;
    ctx.font = 'bold 13px monospace';
    if (p.evoPoints > 0) {
      // glow effect
      const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.005);
      ctx.shadowColor = '#ff0';
      ctx.shadowBlur  = 10 * pulse;
      ctx.fillStyle   = '#ff0';
    } else {
      ctx.shadowBlur = 0;
      ctx.fillStyle  = '#aaa';
    }
    ctx.fillText(`\u8FDB\u5316\u70B9: ${p.evoPoints}`, PAD, evoY + 4);
    ctx.shadowBlur = 0;

    // ── 4. Crab value bar ────────────────────────────────────────
    const crabY = evoY + 22;
    const crab  = g.carcinization;
    const maxCrab = 15;
    this._drawBar(ctx, PAD, crabY, BAR_W, BAR_H - 4,
      Math.min(crab.value, maxCrab), maxCrab, '#2d2d2d', '#f80', '#f80', false);

    // threshold markers at 5, 10, 15
    const thresholds = [5, 10, 15];
    for (const t of thresholds) {
      const tx = PAD + (t / maxCrab) * BAR_W;
      ctx.strokeStyle = '#fff8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx, crabY);
      ctx.lineTo(tx, crabY + BAR_H - 4);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffe0b0';
    ctx.font = '11px monospace';
    ctx.fillText(`\u87F9\u5316: ${crab.value}`, PAD + 6, crabY + 1);

    // ── 5. Progress bar (top-center) ─────────────────────────────
    this._drawProgressBar(ctx);

    // ── 6. Stats (top-right) ─────────────────────────────────────
    const statsY = PAD;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f88';
    ctx.fillText(`ATK ${p.getEffAtk()}`, CONFIG.CANVAS_WIDTH - PAD, statsY);
    ctx.fillStyle = '#8cf';
    ctx.fillText(`DEF ${p.getEffDef()}`, CONFIG.CANVAS_WIDTH - PAD, statsY + 14);
    ctx.fillStyle = '#8f8';
    ctx.fillText(`SPD ${p.getEffSpd()}`, CONFIG.CANVAS_WIDTH - PAD, statsY + 28);
    ctx.fillStyle = '#fd8';
    ctx.fillText(`SEN ${p.getEffSen()}`, CONFIG.CANVAS_WIDTH - PAD, statsY + 42);
    ctx.fillStyle = '#f8d';
    ctx.fillText(`REG ${p.getEffReg()}`, CONFIG.CANVAS_WIDTH - PAD, statsY + 56);

    ctx.textAlign = 'left';

    // ── 7. Ability cooldowns (bottom-center) ─────────────────────
    this._drawCooldowns(ctx, p);

    // ── 8. Devour indicator ──────────────────────────────────────
    if (p.isDevour) {
      this._drawDevourBar(ctx, p);
    }

    // ── 9. Achievement notifications ─────────────────────────────
    if (g.achievements) {
      g.achievements.drawNotifications(ctx);
    }

    // ── 10. Biome indicator (bottom-left) ────────────────────────
    if (g.biomeEffects) {
      const biomeNames = ['热带雨林', '干旱沙漠', '冰封苔原', '海洋深处'];
      const biomeColors = ['#4caf50', '#ff9800', '#90caf9', '#1565c0'];
      const biomeId = g.biomeEffects.getPlayerBiome();
      ctx.font = '11px monospace';
      ctx.fillStyle = biomeColors[biomeId] || '#888';
      ctx.textAlign = 'left';
      ctx.fillText(biomeNames[biomeId] || '未知', PAD, CONFIG.CANVAS_HEIGHT - PAD - 60);

      if (g.biomeEffects.isBlizzardActive()) {
        ctx.fillStyle = '#aaf';
        ctx.fillText('暴风雪中!', PAD, CONFIG.CANVAS_HEIGHT - PAD - 45);
      }
    }

    // ── 11. Red edge flash for big boss warning ──────────────────
    if (g.progressTimeline && g.progressTimeline.flashActive) {
      this._drawRedEdgeFlash(ctx);
    }

    ctx.restore();
  }

  // ── Progress bar at top-center ────────────────────────────────
  _drawProgressBar(ctx) {
    const g = this.game;
    const timeline = g.progressTimeline;
    if (!timeline) return;

    const barW = 500;
    const barH = 16;
    const barX = (CONFIG.CANVAS_WIDTH - barW) / 2;
    const barY = PAD;

    const progress = timeline.getProgress();

    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 4);
    ctx.fill();

    // Fill
    if (progress > 0) {
      ctx.fillStyle = '#4ecdc4';
      ctx.beginPath();
      ctx.roundRect(barX, barY, Math.max(4, barW * progress), barH, 4);
      ctx.fill();
    }

    // Border
    ctx.strokeStyle = '#fff3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 4);
    ctx.stroke();

    // Draw 4 boss nodes on the bar
    const nodeR = 10;
    for (const node of timeline.nodes) {
      const nx = barX + (node.threshold / timeline.totalKills) * barW;
      const ny = barY + barH / 2;

      ctx.beginPath();
      ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);

      if (node.defeated) {
        ctx.fillStyle = '#4caf50'; // Green when defeated
      } else if (node === timeline.activeNode) {
        // Pulsing red when active
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.008);
        ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + pulse * 0.5})`;
      } else if (node.type === BOSS_NODE.BIG) {
        ctx.fillStyle = '#e53935'; // Red for BIG
      } else {
        ctx.fillStyle = '#ff9800'; // Orange for MINI
      }
      ctx.fill();

      // Border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label inside node
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.type === BOSS_NODE.BIG ? '大' : '小', nx, ny);
    }

    // Kill count text below
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.font = '11px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText(`${timeline.killCount}/${timeline.totalKills}`, CONFIG.CANVAS_WIDTH / 2, barY + barH + 4);

    // Boss message when paused
    if (timeline.paused && timeline.activeNode) {
      const msg = timeline.activeNode.type === BOSS_NODE.BIG ? '击败大怪兽!' : '击败小怪兽!';
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#ff4444';
      const msgPulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.006);
      ctx.globalAlpha = msgPulse;
      ctx.fillText(msg, CONFIG.CANVAS_WIDTH / 2, barY + barH + 20);
      ctx.globalAlpha = 1;
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  // ── Red edge flash for big boss warning ───────────────────────
  _drawRedEdgeFlash(ctx) {
    const flash = Math.sin(Date.now() * 0.01) > 0;
    if (!flash) return;

    const w = CONFIG.CANVAS_WIDTH;
    const h = CONFIG.CANVAS_HEIGHT;
    const thickness = 8;

    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#ff0000';

    // Top
    ctx.fillRect(0, 0, w, thickness);
    // Bottom
    ctx.fillRect(0, h - thickness, w, thickness);
    // Left
    ctx.fillRect(0, 0, thickness, h);
    // Right
    ctx.fillRect(w - thickness, 0, thickness, h);

    ctx.restore();
  }

  // ── Cooldown icons at bottom-center ────────────────────────────
  _drawCooldowns(ctx, p) {
    const iconSize = 40;
    const gap      = 10;
    const count    = 2;
    const totalW   = count * iconSize + (count - 1) * gap;
    const startX   = (CONFIG.CANVAS_WIDTH - totalW) / 2;
    const y        = CONFIG.CANVAS_HEIGHT - iconSize - PAD;

    // Dash
    const dashPct = p.dashCD > 0 ? p.dashCD / CONFIG.DASH_CD : 0;
    this._drawCDIcon(ctx, startX, y, iconSize, 'Dash', dashPct,
      p.dashTimer > 0 ? '#4ff' : '#888');

    // Jump
    const jumpPct = p.jumpCD > 0 ? p.jumpCD / CONFIG.JUMP_CD : 0;
    this._drawCDIcon(ctx, startX + iconSize + gap, y, iconSize, 'Jump', jumpPct,
      p.isJumping ? '#ff4' : '#888');
  }

  _drawCDIcon(ctx, x, y, size, label, cdPct, activeColor) {
    // background
    ctx.fillStyle = '#0008';
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 6);
    ctx.fill();

    // border
    ctx.strokeStyle = cdPct <= 0 ? '#fff8' : '#555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 6);
    ctx.stroke();

    // cooldown overlay (sweep from top)
    if (cdPct > 0) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 6);
      ctx.clip();
      ctx.fillRect(x, y, size, size * cdPct);
      ctx.restore();
    }

    // label
    ctx.fillStyle = cdPct <= 0 ? '#fff' : '#888';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + size / 2, y + size / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // ready flash
    if (cdPct <= 0) {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, size - 2, size - 2, 5);
      ctx.stroke();
    }
  }

  // ── Devour progress bar (center of screen) ─────────────────────
  _drawDevourBar(ctx, p) {
    const bw = 160;
    const bh = 14;
    const bx = (CONFIG.CANVAS_WIDTH - bw) / 2;
    const by = CONFIG.CANVAS_HEIGHT / 2 + 50;
    const pct = 1 - (p.devourTimer / CONFIG.DEVOUR_MS);

    ctx.fillStyle = '#0008';
    ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);

    ctx.fillStyle = '#222';
    ctx.fillRect(bx, by, bw, bh);

    ctx.fillStyle = '#f0a';
    ctx.fillRect(bx, by, bw * Math.max(0, Math.min(1, pct)), bh);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('\u541E\u566C\u4E2D...', CONFIG.CANVAS_WIDTH / 2, by + 1);
    ctx.textAlign = 'left';
  }

  // ── Generic bar renderer ───────────────────────────────────────
  _drawBar(ctx, x, y, w, h, val, max, bgColor, fgColor, lowColor, showLow) {
    const pct = max > 0 ? Math.max(0, Math.min(1, val / max)) : 0;

    // background
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 4);
    ctx.fill();

    // fill
    if (pct > 0) {
      ctx.fillStyle = (showLow && pct < 0.3) ? lowColor : fgColor;
      ctx.beginPath();
      ctx.roundRect(x, y, Math.max(4, w * pct), h, 4);
      ctx.fill();
    }

    // border
    ctx.strokeStyle = '#fff3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 4);
    ctx.stroke();
  }
}
