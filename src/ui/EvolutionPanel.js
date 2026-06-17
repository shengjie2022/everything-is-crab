// ─── EvolutionPanel.js ─── Canvas-drawn evolution tree (800x560) ───

import { BRANCH } from '../constants.js';

const PANEL_W = 800;
const PANEL_H = 560;

const NODE_W  = 120;
const NODE_H  = 44;
const COL_GAP = 140;
const ROW_GAP = 62;
const MARGIN  = 40;

const BRANCH_COLORS = {
  arthropod:  '#f44',
  mollusk:    '#a4f',
  vertebrate: '#4f4',
  special:    '#ff4',
  none:       '#aaa'
};

const BRANCH_ORDER = ['arthropod', 'mollusk', 'vertebrate', 'special'];

export class EvolutionPanel {
  constructor(game) {
    this.game      = game;
    this.canvas    = document.getElementById('evoCanvas');
    this.ctx       = this.canvas.getContext('2d');
    this.hoverNode = null;
    this._layout   = null;     // cached node positions: Map<id, {x,y,node}>
    this._visible  = false;

    // Wire up mouse events on evoCanvas
    this.canvas.addEventListener('click', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.handleClick(e.clientX - r.left, e.clientY - r.top);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.handleMouseMove(e.clientX - r.left, e.clientY - r.top);
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  PUBLIC API
  // ═══════════════════════════════════════════════════════════════════

  open() {
    this._visible = true;
    this._buildLayout();
    this.draw();
  }

  close() {
    this._visible = false;
    this.hoverNode = null;
  }

  draw() {
    if (!this._visible) return;
    if (!this._layout) this._buildLayout();

    const ctx = this.ctx;
    ctx.clearRect(0, 0, PANEL_W, PANEL_H);

    // background
    ctx.fillStyle = '#111c';
    ctx.fillRect(0, 0, PANEL_W, PANEL_H);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, PANEL_W, PANEL_H);

    // title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('\u8FDB\u5316\u6811', PANEL_W / 2, 8);

    // evo points
    const pts = this.game.player.evoPoints;
    ctx.font = '13px monospace';
    ctx.fillStyle = pts > 0 ? '#ff0' : '#888';
    ctx.fillText(`\u8FDB\u5316\u70B9: ${pts}`, PANEL_W / 2, 30);

    ctx.textAlign = 'left';

    // draw connections first (behind nodes)
    this._drawConnections(ctx);

    // draw nodes
    for (const [id, entry] of this._layout) {
      this._drawNode(ctx, entry);
    }

    // draw tooltip for hovered node
    if (this.hoverNode) {
      this._drawTooltip(ctx, this.hoverNode);
    }
  }

  handleClick(mx, my) {
    if (!this._layout) return;

    for (const [id, entry] of this._layout) {
      if (this._hitTest(mx, my, entry)) {
        if (this.game.evolution.canUnlock(id)) {
          this.game.evolution.unlock(id);
          this.draw();           // redraw immediately
        }
        return;
      }
    }
  }

  handleMouseMove(mx, my) {
    if (!this._layout) return;

    let found = null;
    for (const [id, entry] of this._layout) {
      if (this._hitTest(mx, my, entry)) {
        found = entry;
        break;
      }
    }

    if (found !== this.hoverNode) {
      this.hoverNode = found;
      this.draw();
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //  LAYOUT
  // ═══════════════════════════════════════════════════════════════════

  _buildLayout() {
    const nodes = this.game.evolution.getAllNodes();
    this._layout = new Map();

    // Assign each node a depth (column) based on its longest chain from 'base'.
    const depthMap = new Map();
    const getDepth = (id) => {
      if (depthMap.has(id)) return depthMap.get(id);
      const n = nodes.find(nd => nd.id === id);
      if (!n || !n.req || n.req.length === 0) { depthMap.set(id, 0); return 0; }
      let maxD = 0;
      for (const r of n.req) {
        maxD = Math.max(maxD, getDepth(r) + 1);
      }
      depthMap.set(id, maxD);
      return maxD;
    };
    for (const n of nodes) getDepth(n.id);

    // Determine maximum depth for spacing
    let maxDepth = 0;
    for (const d of depthMap.values()) maxDepth = Math.max(maxDepth, d);

    // Group nodes by branch for Y-positioning
    // Band Y ranges: arthropod top, mollusk upper-mid, vertebrate lower-mid, special bottom
    const bandY = {
      none:       PANEL_H * 0.45,
      arthropod:  PANEL_H * 0.18,
      mollusk:    PANEL_H * 0.38,
      vertebrate: PANEL_H * 0.58,
      special:    PANEL_H * 0.78
    };

    // Count nodes per branch + depth to stack them
    const branchDepthCount = {};

    for (const n of nodes) {
      const d = depthMap.get(n.id);
      const b = n.branch || 'none';
      const key = `${b}_${d}`;
      if (!branchDepthCount[key]) branchDepthCount[key] = 0;
      branchDepthCount[key]++;
    }

    // Reset counters for assignment pass
    const branchDepthIdx = {};

    for (const n of nodes) {
      const d = depthMap.get(n.id);
      const b = n.branch || 'none';
      const key = `${b}_${d}`;

      if (!branchDepthIdx[key]) branchDepthIdx[key] = 0;
      const idx   = branchDepthIdx[key]++;
      const total = branchDepthCount[key];

      const colX = MARGIN + NODE_W / 2 + d * COL_GAP;
      const baseY = bandY[b] || bandY.none;
      const stackOffset = (idx - (total - 1) / 2) * ROW_GAP;
      const rowY = baseY + stackOffset;

      this._layout.set(n.id, {
        x:    Math.min(colX, PANEL_W - MARGIN - NODE_W / 2),
        y:    Math.max(MARGIN + 30, Math.min(PANEL_H - MARGIN, rowY)),
        node: n
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DRAWING HELPERS
  // ═══════════════════════════════════════════════════════════════════

  _drawConnections(ctx) {
    ctx.lineWidth = 2;

    for (const [id, entry] of this._layout) {
      const n = entry.node;
      if (!n.req) continue;

      for (const reqId of n.req) {
        const parent = this._layout.get(reqId);
        if (!parent) continue;

        const unlocked = this.game.evolution.isUnlocked(id);
        const available = this.game.evolution.canUnlock(id);
        const hiddenLocked = this.game.evolution.isHiddenAndLocked(id);

        if (unlocked) {
          ctx.strokeStyle = BRANCH_COLORS[n.branch] || '#888';
          ctx.globalAlpha = 0.8;
        } else if (available) {
          ctx.strokeStyle = BRANCH_COLORS[n.branch] || '#888';
          ctx.globalAlpha = 0.5;
        } else if (hiddenLocked) {
          ctx.strokeStyle = '#6644aa';
          ctx.globalAlpha = 0.2;
        } else {
          ctx.strokeStyle = '#444';
          ctx.globalAlpha = 0.3;
        }

        ctx.beginPath();
        ctx.moveTo(parent.x + NODE_W / 2, parent.y);
        ctx.lineTo(entry.x  - NODE_W / 2, entry.y);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
  }

  _drawNode(ctx, entry) {
    const n = entry.node;
    const x = entry.x - NODE_W / 2;
    const y = entry.y - NODE_H / 2;
    const branchColor = BRANCH_COLORS[n.branch] || '#888';

    const unlocked  = this.game.evolution.isUnlocked(n.id);
    const available = this.game.evolution.canUnlock(n.id);
    const hiddenLocked = this.game.evolution.isHiddenAndLocked(n.id);

    // ── Node background ──────────────────────────────────────────
    if (unlocked) {
      // solid filled
      ctx.fillStyle = branchColor + '55';
      ctx.beginPath();
      ctx.roundRect(x, y, NODE_W, NODE_H, 8);
      ctx.fill();

      ctx.strokeStyle = branchColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, NODE_W, NODE_H, 8);
      ctx.stroke();
    } else if (hiddenLocked) {
      // hidden evolution — mysterious appearance
      ctx.fillStyle = '#0a0a15';
      ctx.beginPath();
      ctx.roundRect(x, y, NODE_W, NODE_H, 8);
      ctx.fill();

      const pulse = 0.3 + 0.3 * Math.sin(Date.now() * 0.002);
      ctx.strokeStyle = `rgba(180,130,255,${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y, NODE_W, NODE_H, 8);
      ctx.stroke();
    } else if (available) {
      // glowing border (can unlock)
      ctx.fillStyle = '#222c';
      ctx.beginPath();
      ctx.roundRect(x, y, NODE_W, NODE_H, 8);
      ctx.fill();

      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.004);
      ctx.shadowColor = branchColor;
      ctx.shadowBlur  = 8 + 6 * pulse;
      ctx.strokeStyle = branchColor;
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, NODE_W, NODE_H, 8);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      // locked / greyed out
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.roundRect(x, y, NODE_W, NODE_H, 8);
      ctx.fill();

      ctx.strokeStyle = '#3338';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, NODE_W, NODE_H, 8);
      ctx.stroke();
    }

    // ── Node text ────────────────────────────────────────────────
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';

    if (hiddenLocked) {
      // Show mystery text for hidden locked evolutions
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#b482ff';
      ctx.fillText('???', entry.x, entry.y - 3);
      ctx.font = '9px monospace';
      ctx.fillStyle = '#6644aa';
      ctx.fillText('\u9690\u85CF\u8FDB\u5316', entry.x, entry.y + 13);
    } else {
      // name
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = unlocked ? '#fff' : available ? '#ddd' : '#666';
      ctx.fillText(n.name, entry.x, entry.y - 6);

      // cost
      ctx.font = '10px monospace';
      ctx.fillStyle = unlocked ? '#aaa' : available ? '#ff0' : '#555';
      const costLabel = unlocked ? '\u2713' : `\u2605 ${n.cost}`;
      ctx.fillText(costLabel, entry.x, entry.y + 12);
    }

    ctx.textAlign = 'left';
  }

  _drawTooltip(ctx, entry) {
    const n   = entry.node;
    const pad = 8;
    const maxW = 220;

    const hiddenLocked = this.game.evolution.isHiddenAndLocked(n.id);

    // Build text lines
    const lines = [];
    if (hiddenLocked) {
      lines.push('???');
      lines.push('\u6EE1\u8DB3\u7279\u5B9A\u6761\u4EF6\u540E\u89E3\u9501');
    } else {
      lines.push(n.name);
      if (n.desc) lines.push(n.desc);

      // stat summary
      if (n.stat) {
        const parts = [];
        if (n.stat.hp)  parts.push(`HP+${n.stat.hp}`);
        if (n.stat.atk) parts.push(`ATK+${n.stat.atk}`);
        if (n.stat.def) parts.push(`DEF+${n.stat.def}`);
        if (n.stat.spd) parts.push(`SPD+${n.stat.spd}`);
        if (n.stat.sen) parts.push(`SEN+${n.stat.sen}`);
        if (n.stat.reg) parts.push(`REG+${n.stat.reg}`);
        if (parts.length > 0) lines.push(parts.join('  '));
      }
      if (n.crab) lines.push(`\u87F9\u5316+${n.crab}`);
      if (n.trait) lines.push(`\u7279\u6027: ${n.trait}`);
    }

    ctx.font = '11px monospace';

    // Measure
    let textW = 0;
    for (const l of lines) {
      textW = Math.max(textW, ctx.measureText(l).width);
    }
    const w = Math.min(maxW, textW + pad * 2);
    const lineH = 16;
    const h = lines.length * lineH + pad * 2;

    // Position: try right of node, fallback left
    let tx = entry.x + NODE_W / 2 + 8;
    let ty = entry.y - h / 2;
    if (tx + w > PANEL_W - 4) tx = entry.x - NODE_W / 2 - w - 8;
    if (ty < 4) ty = 4;
    if (ty + h > PANEL_H - 4) ty = PANEL_H - 4 - h;

    // bg
    ctx.fillStyle = '#000d';
    ctx.beginPath();
    ctx.roundRect(tx, ty, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = BRANCH_COLORS[n.branch] || '#888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tx, ty, w, h, 6);
    ctx.stroke();

    // text
    ctx.textBaseline = 'top';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillStyle = i === 0 ? '#fff' : '#ccc';
      ctx.font = i === 0 ? 'bold 12px monospace' : '11px monospace';
      ctx.fillText(lines[i], tx + pad, ty + pad + i * lineH, w - pad * 2);
    }
  }

  _hitTest(mx, my, entry) {
    const hx = entry.x - NODE_W / 2;
    const hy = entry.y - NODE_H / 2;
    return mx >= hx && mx <= hx + NODE_W && my >= hy && my <= hy + NODE_H;
  }
}
