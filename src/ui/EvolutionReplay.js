// ─── EvolutionReplay.js ─── Records and replays evolution history ───

export class EvolutionReplay {
  constructor(game) {
    this.game = game;
    this.snapshots = [];
    this.maxSnapshots = 20;
  }

  // Take a snapshot when an evolution is applied
  captureSnapshot(evolutionName) {
    const p = this.game.player;
    if (!p) return;

    this.snapshots.push({
      time: this.game.gameTime,
      form: p.form,
      name: evolutionName,
      level: p.level,
      hp: p.maxHp,
      atk: p.getEffAtk(),
      def: p.getEffDef(),
      spd: p.getEffSpd(),
      crabValue: this.game.carcinization ? this.game.carcinization.value : 0
    });

    // Limit snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
  }

  // Draw evolution history replay on a canvas context
  drawReplay(ctx, width, height) {
    if (this.snapshots.length === 0) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#4ecdc4';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('进化历程回顾', width / 2, 30);

    const colW = width / Math.min(this.snapshots.length, 8);
    const startIdx = Math.max(0, this.snapshots.length - 8);

    for (let i = startIdx; i < this.snapshots.length; i++) {
      const snap = this.snapshots[i];
      const idx = i - startIdx;
      const x = colW * idx + colW / 2;
      const y = 80;

      // Arrow between snapshots
      if (idx > 0) {
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - colW + 20, y + 30);
        ctx.lineTo(x - 20, y + 30);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x - 25, y + 25);
        ctx.lineTo(x - 15, y + 30);
        ctx.lineTo(x - 25, y + 35);
        ctx.fill();
      }

      // Form circle
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(x, y + 30, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Form name
      ctx.fillStyle = '#fff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(snap.form || 'slime', x, y + 34);

      // Evolution name
      ctx.fillStyle = '#ff0';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(snap.name, x, y + 70);

      // Stats
      ctx.fillStyle = '#aaa';
      ctx.font = '9px monospace';
      ctx.fillText(`Lv.${snap.level}`, x, y + 85);
      ctx.fillText(`HP:${snap.hp} ATK:${snap.atk}`, x, y + 97);
      ctx.fillText(`DEF:${snap.def} SPD:${snap.spd}`, x, y + 109);

      // Time
      const mins = Math.floor(snap.time / 60000);
      const secs = Math.floor((snap.time % 60000) / 1000);
      ctx.fillStyle = '#666';
      ctx.fillText(`${mins}:${String(secs).padStart(2, '0')}`, x, y + 125);
    }
  }

  getSnapshots() {
    return this.snapshots;
  }

  clear() {
    this.snapshots = [];
  }
}
