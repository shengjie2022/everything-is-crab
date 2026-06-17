// ─── EvolutionChoicePopup.js ─── Vampire-Survivors-style evo choice popup ───

import { GSTATE } from '../constants.js';
import { CONFIG } from '../config.js';

export class EvolutionChoicePopup {
  constructor(game) {
    this.game = game;
    this.container = document.getElementById('evo-choices');
    this.visible = false;
    this.refreshCount = 0;
  }

  /**
   * Called when a level up occurs. Shows popup if choices are available.
   */
  tryShow() {
    const player = this.game.player;
    if (!player) return;

    const available = this.game.evolution.getAvailable();
    if (available.length === 0) return;

    this.refreshCount = 0;

    // Pause game and show popup
    this.game.state = GSTATE.PAUSED;
    this.game.screenManager.show('evo-choice');
    this.visible = true;

    this._buildUI(available);
  }

  /**
   * Build the full popup UI with cards and action buttons.
   */
  _buildUI(available) {
    // Pick up to 3 random choices
    const shuffled = available.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const picks = shuffled.slice(0, 3);

    // Build cards
    this.container.innerHTML = '';
    for (const node of picks) {
      this.container.appendChild(this._buildCard(node));
    }

    // Build action button row (refresh only)
    const row = document.createElement('div');
    row.className = 'evo-action-row';

    // 刷新 (Refresh) button
    const refreshCost = CONFIG.EVO_REFRESH_BASE_COST + this.refreshCount * CONFIG.EVO_REFRESH_COST_INC;
    const canRefresh = this.game.player.evoPoints >= refreshCost;
    const refreshBtn = document.createElement('div');
    refreshBtn.className = 'evo-action-btn' + (canRefresh ? '' : ' disabled');
    refreshBtn.innerHTML = `<div>刷新</div><span class="evo-btn-cost">费用: ${refreshCost} 进化点</span>`;
    refreshBtn.addEventListener('click', () => {
      const cost = CONFIG.EVO_REFRESH_BASE_COST + this.refreshCount * CONFIG.EVO_REFRESH_COST_INC;
      if (this.game.player.evoPoints < cost) {
        this._showInsufficientPoints(refreshBtn);
        return;
      }
      this.game.player.evoPoints -= cost;
      this.refreshCount++;
      // Re-roll cards
      const freshAvailable = this.game.evolution.getAvailable();
      if (freshAvailable.length > 0) {
        this._buildUI(freshAvailable);
      }
    });
    row.appendChild(refreshBtn);

    this.container.appendChild(row);
  }

  /**
   * Build a DOM card for one evolution choice, with an "升级" button.
   */
  _buildCard(node) {
    const card = document.createElement('div');
    card.className = `evo-choice-card branch-${node.branch || 'none'}`;

    // Name
    const name = document.createElement('div');
    name.className = 'evo-c-name';
    name.textContent = node.name;
    card.appendChild(name);

    // Description
    const desc = document.createElement('div');
    desc.className = 'evo-c-desc';
    desc.textContent = node.desc || '';
    card.appendChild(desc);

    // Stat summary
    if (node.stat && Object.keys(node.stat).length > 0) {
      const stats = document.createElement('div');
      stats.className = 'evo-c-stats';
      const labels = { hp:'HP', atk:'ATK', def:'DEF', spd:'SPD', sen:'SEN', reg:'REG' };
      const parts = [];
      for (const [k, v] of Object.entries(node.stat)) {
        if (v !== 0 && v !== undefined) {
          const sign = v > 0 ? '+' : '';
          parts.push(`${labels[k] || k}${sign}${v}`);
        }
      }
      stats.textContent = parts.join('  ');
      card.appendChild(stats);
    }

    // Crab value
    if (node.crab && node.crab !== 0) {
      const crab = document.createElement('div');
      crab.className = 'evo-c-crab';
      crab.textContent = `蟹化值 +${node.crab}`;
      card.appendChild(crab);
    }

    // 升级 (Upgrade) button — unlocks this evolution direction
    const canAfford = this.game.player.evoPoints >= node.cost;
    const upgradeBtn = document.createElement('div');
    upgradeBtn.className = 'evo-card-upgrade-btn' + (canAfford ? '' : ' disabled');
    upgradeBtn.innerHTML = `升级 <span class="evo-btn-cost">费用: ${node.cost} 进化点</span>`;
    upgradeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.game.player.evoPoints < node.cost) {
        this._showInsufficientPoints(upgradeBtn);
        return;
      }
      const success = this.game.evolution.unlock(node.id);
      if (success) {
        this.hide();
      }
    });
    card.appendChild(upgradeBtn);

    return card;
  }

  /**
   * Show "进化点不足" feedback on a button element.
   */
  _showInsufficientPoints(btnEl) {
    // Show in-game floating text
    if (this.game.particleSystem && this.game.player) {
      this.game.particleSystem.addText(
        this.game.player.x, this.game.player.y - 30,
        '进化点不足', '#f44'
      );
    }
    // Flash the button with warning text
    const origHTML = btnEl.innerHTML;
    btnEl.innerHTML = '<div style="color:#f44">进化点不足</div>';
    setTimeout(() => { btnEl.innerHTML = origHTML; }, 800);
  }

  /**
   * Hide popup and resume game.
   */
  hide() {
    this.game.screenManager.hide('evo-choice');
    this.visible = false;
    this.game.state = GSTATE.PLAYING;
  }
}
