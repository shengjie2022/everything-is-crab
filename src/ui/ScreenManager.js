// ─── ScreenManager.js ─── Manages HTML screen overlays (show/hide) ───
import { CHALLENGES } from '../data/challenges.js';

export class ScreenManager {
  constructor(game) {
    this.game = game;

    this.screens = {
      start:        document.getElementById('start-screen'),
      pause:        document.getElementById('pause-screen'),
      victory:      document.getElementById('victory-screen'),
      defeat:       document.getElementById('defeat-screen'),
      evo:          document.getElementById('evolution-panel'),
      challenge:    document.getElementById('challenge-screen'),
      genebank:     document.getElementById('genebank-screen'),
      codex:        document.getElementById('codex-screen'),
      achievements: document.getElementById('achievements-screen'),
      sandbox:      document.getElementById('sandbox-panel'),
      'evo-choice': document.getElementById('evo-choice-screen')
    };

    this._bindButtons();
    this._buildChallengeList();
  }

  _bindButtons() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    bind('btn-start',            () => this.game.startGame('story'));
    bind('btn-endless',          () => this.game.startGame('endless'));
    bind('btn-sandbox',          () => this.game.startGame('sandbox'));
    bind('btn-challenge',        () => this.showOnly('challenge'));
    bind('btn-genebank',         () => { this._updateGeneBank(); this.showOnly('genebank'); });
    bind('btn-codex',            () => { this._updateCodex(); this.showOnly('codex'); });
    bind('btn-resume',           () => this.game.resume());
    bind('btn-achievements',     () => { this._updateAchievements(); this.showOnly('achievements'); });
    bind('btn-quit',             () => this.game.quit());
    bind('btn-restart-win',      () => this.game.restart());
    bind('btn-restart-lose',     () => this.game.restart());
    bind('btn-close-evo',        () => this.game.closeEvolution());
    bind('btn-back-challenge',   () => this.showOnly('start'));
    bind('btn-back-genebank',    () => this.showOnly('start'));
    bind('btn-back-codex',       () => this.showOnly('start'));
    bind('btn-back-achievements',() => this.showOnly('pause'));
    bind('btn-close-sandbox',    () => { this.hide('sandbox'); });
    bind('btn-skip-evo',         () => { if (this.game.evoChoicePopup) this.game.evoChoicePopup.hide(); });

    // Codex tabs
    document.querySelectorAll('.codex-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.codex-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this._updateCodex(tab.dataset.tab);
      });
    });
  }

  _buildChallengeList() {
    const list = document.getElementById('challenge-list');
    if (!list) return;

    list.innerHTML = '';
    for (const ch of CHALLENGES) {
      const card = document.createElement('div');
      card.className = 'challenge-card';
      card.innerHTML = `
        <div class="ch-name">${ch.name}</div>
        <div class="ch-desc">${ch.desc}</div>
        <div class="ch-reward">奖励: ${ch.reward.name}</div>
      `;
      card.addEventListener('click', () => {
        if (this.game.challenge) {
          this.game.challenge.activate(ch.id);
        }
        this.game.startGame('challenge');
      });
      list.appendChild(card);
    }
  }

  _updateGeneBank() {
    // Will be populated by GeneBankPanel when it exists
    const content = document.getElementById('genebank-content');
    const epDisplay = document.getElementById('ep-display');
    if (!content) return;

    if (this.game.economy) {
      if (epDisplay) epDisplay.textContent = `EP: ${this.game.economy.ep}`;
    }

    if (this.game.geneBank) {
      this.game.geneBank.renderUI(content);
    }
  }

  _updateCodex(tab = 'evolutions') {
    const content = document.getElementById('codex-content');
    if (!content) return;

    if (this.game.codex) {
      this.game.codex.renderUI(content, tab);
    } else {
      content.innerHTML = '<p style="color:#888">图鉴系统加载中...</p>';
    }
  }

  _updateAchievements() {
    const list = document.getElementById('achievement-list');
    if (!list) return;

    if (this.game.achievements) {
      this.game.achievements.renderUI(list);
    } else {
      list.innerHTML = '<p style="color:#888">成就系统加载中...</p>';
    }
  }

  show(name) {
    const el = this.screens[name];
    if (el) el.classList.add('active');
  }

  hide(name) {
    const el = this.screens[name];
    if (el) el.classList.remove('active');
  }

  hideAll() {
    for (const key in this.screens) {
      const el = this.screens[key];
      if (el) el.classList.remove('active');
    }
  }

  showOnly(name) {
    this.hideAll();
    this.show(name);
  }
}
