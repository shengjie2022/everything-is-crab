// ─── CodexSystem.js ─── Tracks discovered evolutions, creatures, endings ───
import { EVO_NODES } from '../data/evolution.js';
import { CREATURES } from '../data/creatures.js';

export class CodexSystem {
  constructor(game) {
    this.game = game;
    this.discoveredEvolutions = new Set();
    this.discoveredCreatures = new Set();
    this.discoveredEndings = new Set();
  }

  // Record discovering an evolution
  discoverEvolution(nodeId) {
    this.discoveredEvolutions.add(nodeId);
  }

  // Record encountering a creature type
  discoverCreature(creatureType) {
    this.discoveredCreatures.add(creatureType);
  }

  // Record reaching an ending
  discoverEnding(endingId) {
    this.discoveredEndings.add(endingId);
  }

  // Check completion percentage
  getCompletionPct() {
    const totalEvos = EVO_NODES.length;
    const totalCreatures = Object.keys(CREATURES).length;
    const totalEndings = 8; // boss kills + anti-crab + super-crab + others
    const total = totalEvos + totalCreatures + totalEndings;
    const discovered = this.discoveredEvolutions.size + this.discoveredCreatures.size + this.discoveredEndings.size;
    return total > 0 ? discovered / total : 0;
  }

  isComplete() {
    return this.getCompletionPct() >= 1.0;
  }

  // Render codex UI
  renderUI(container, tab = 'evolutions') {
    container.innerHTML = '';

    switch (tab) {
      case 'evolutions':
        this._renderEvolutions(container);
        break;
      case 'creatures':
        this._renderCreatures(container);
        break;
      case 'endings':
        this._renderEndings(container);
        break;
    }
  }

  _renderEvolutions(container) {
    for (const node of EVO_NODES) {
      const discovered = this.discoveredEvolutions.has(node.id);
      const card = document.createElement('div');
      card.className = `codex-card ${discovered ? 'discovered' : 'undiscovered'}`;
      card.innerHTML = `
        <div class="codex-name">${discovered ? node.name : '???'}</div>
        <div class="codex-desc">${discovered ? node.desc : '未发现'}</div>
      `;
      container.appendChild(card);
    }
  }

  _renderCreatures(container) {
    for (const [type, data] of Object.entries(CREATURES)) {
      const discovered = this.discoveredCreatures.has(type);
      const card = document.createElement('div');
      card.className = `codex-card ${discovered ? 'discovered' : 'undiscovered'}`;
      card.innerHTML = `
        <div class="codex-name">${discovered ? data.name : '???'}</div>
        <div class="codex-desc">${discovered ? `T${data.tier} | HP:${data.hp} ATK:${data.atk}` : '未遭遇'}</div>
      `;
      container.appendChild(card);
    }
  }

  _renderEndings(container) {
    const endings = [
      { id: 'boss_rainforest', name: '雨林之主' },
      { id: 'boss_desert', name: '沙漠之王' },
      { id: 'boss_tundra', name: '冰原霸主' },
      { id: 'boss_deepsea', name: '深海领主' },
      { id: 'anti_crab', name: '反蟹化之路' },
      { id: 'super_crab', name: '超蟹化形态' },
      { id: 'time_out', name: '时间终结' },
      { id: 'all_bosses', name: '万兽归一' }
    ];

    for (const ending of endings) {
      const discovered = this.discoveredEndings.has(ending.id);
      const card = document.createElement('div');
      card.className = `codex-card ${discovered ? 'discovered' : 'undiscovered'}`;
      card.innerHTML = `
        <div class="codex-name">${discovered ? ending.name : '???'}</div>
        <div class="codex-desc">${discovered ? '已达成' : '未达成'}</div>
      `;
      container.appendChild(card);
    }
  }

  serialize() {
    return {
      evolutions: [...this.discoveredEvolutions],
      creatures: [...this.discoveredCreatures],
      endings: [...this.discoveredEndings]
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.evolutions) this.discoveredEvolutions = new Set(data.evolutions);
    if (data.creatures) this.discoveredCreatures = new Set(data.creatures);
    if (data.endings) this.discoveredEndings = new Set(data.endings);
  }
}
