// ─── AchievementSystem.js ─── Tracks and awards achievements ───
import { ACHIEVEMENTS } from '../data/achievements.js';

export class AchievementSystem {
  constructor(game) {
    this.game = game;
    this.unlocked = new Set();
    this.stats = {
      devourCount: 0,
      replayViews: 0,
      killCount: 0
    };
    this.notificationQueue = [];
  }

  check(achievementId) {
    if (this.unlocked.has(achievementId)) return;
    this.unlocked.add(achievementId);
    const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (ach) {
      this.notificationQueue.push(ach);
    }
  }

  // Called every frame to check trigger conditions
  update(dt) {
    const g = this.game;
    const p = g.player;
    if (!p) return;

    // Level-based achievements
    if (p.level >= 10) this.check('level_10');
    if (p.level >= 20) this.check('level_20');

    // Crab value
    if (g.carcinization && g.carcinization.value >= 15) this.check('crab_gate');

    // Endless mode survival
    if (g.mode === 'endless' && g.gameTime >= 60 * 60 * 1000) this.check('eternal_hunter');

    // Gene collector
    if (g.geneBank && g.geneBank.owned.size >= 5) this.check('gene_collector');

    // Challenge master
    if (g.challenge && g.challenge.completed.size >= 5) this.check('challenge_master');

    // Biologist (codex 100%)
    if (g.codex && g.codex.isComplete()) this.check('biologist');

    // All bosses
    if (g.combat && g.combat.bossKills >= 4) this.check('all_bosses');
  }

  // Triggered externally by game events
  onEvolutionUnlocked(nodeId) {
    if (this.unlocked.size === 0 || !this.unlocked.has('first_evo')) {
      this.check('first_evo');
    }

    // Check all evolutions
    const g = this.game;
    if (g.evolution && g.evolution.unlocked && g.evolution.unlocked.size >= 35) {
      this.check('all_evolutions');
    }
  }

  onBossKilled(bossType) {
    this.check('apex_predator');
    switch (bossType) {
      case 'boss': this.check('rainforest_clear'); break;
      case 'sand_worm': this.check('desert_clear'); break;
      case 'frost_crab': this.check('tundra_clear'); break;
      case 'kraken_boss': this.check('deepsea_clear'); break;
    }
  }

  onDevour() {
    this.stats.devourCount++;
    if (this.stats.devourCount >= 50) this.check('devour_50');
  }

  onVictory() {
    const g = this.game;
    // Speedrun check
    if (g.gameTime <= 10 * 60 * 1000) this.check('speedrunner');
    // Zero crab check
    if (g.carcinization && g.carcinization.value === 0) this.check('chaos_walker');
    // Pacifist check
    if (this.stats.killCount === 0) this.check('pacifist');
  }

  onKill() {
    this.stats.killCount++;
  }

  // Draw notification pop-up on HUD
  drawNotifications(ctx) {
    if (this.notificationQueue.length === 0) return;

    const ach = this.notificationQueue[0];
    if (!ach._showTimer) ach._showTimer = 3000; // 3 seconds

    ach._showTimer -= 16; // approximate frame time
    if (ach._showTimer <= 0) {
      this.notificationQueue.shift();
      return;
    }

    const alpha = ach._showTimer > 500 ? 1 : ach._showTimer / 500;
    const y = 40 + (1 - Math.min(1, (3000 - ach._showTimer) / 300)) * -40;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    const w = 280, h = 50;
    const x = (960 - w) / 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.stroke();

    // Icon
    ctx.font = '22px serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';
    ctx.fillText(ach.icon || '⭐', x + 12, y + h / 2);

    // Text
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(ach.name, x + 44, y + 18);
    ctx.font = '11px monospace';
    ctx.fillStyle = '#ccc';
    ctx.fillText(ach.desc, x + 44, y + 35);

    ctx.restore();
  }

  // Render achievements list UI
  renderUI(container) {
    container.innerHTML = '';
    for (const ach of ACHIEVEMENTS) {
      const isUnlocked = this.unlocked.has(ach.id);
      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="achievement-icon">${isUnlocked ? ach.icon : '?'}</div>
        <div class="achievement-info">
          <div class="ach-name">${isUnlocked ? ach.name : '???'}</div>
          <div class="ach-desc">${ach.desc}</div>
        </div>
      `;
      container.appendChild(card);
    }
  }

  serialize() {
    return {
      unlocked: [...this.unlocked],
      stats: { ...this.stats }
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.unlocked) this.unlocked = new Set(data.unlocked);
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
  }
}
