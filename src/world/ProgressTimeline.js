// ─── ProgressTimeline.js ─── Kill-based progress bar with boss nodes ───

import { CONFIG } from '../config.js';
import { BOSS_NODE } from '../constants.js';
import { BIOME_BOSSES } from '../data/creatures.js';

// Inline boss base stats to avoid circular imports
const BOSS_BASE_STATS = {
  boss:        { hp: 600, atk: 35 },
  sand_worm:   { hp: 550, atk: 25 },
  frost_crab:  { hp: 650, atk: 20 },
  kraken_boss: { hp: 700, atk: 18 }
};

export class ProgressTimeline {
  constructor(game) {
    this.game = game;
    this.killCount = 0;
    this.totalKills = CONFIG.PROGRESS_TOTAL_KILLS;
    this.nodes = [];
    this.paused = false;
    this.activeNode = null;
    this.flashTimer = 0;
    this.flashActive = false;

    this._generateNodes();
  }

  reset() {
    this.killCount = 0;
    this.paused = false;
    this.activeNode = null;
    this.flashTimer = 0;
    this.flashActive = false;
    this._generateNodes();
  }

  _generateNodes() {
    // 4 nodes at 20%, 40%, 60%, 80% of totalKills
    const positions = [0.2, 0.4, 0.6, 0.8];
    this.nodes = positions.map((pct, i) => ({
      index: i,
      threshold: Math.floor(this.totalKills * pct),
      type: Math.random() < 0.5 ? BOSS_NODE.MINI : BOSS_NODE.BIG,
      triggered: false,
      defeated: false,
      bossEntity: null
    }));

    // Ensure at least 1 BIG boss
    const hasBig = this.nodes.some(n => n.type === BOSS_NODE.BIG);
    if (!hasBig) {
      const idx = Math.floor(Math.random() * this.nodes.length);
      this.nodes[idx].type = BOSS_NODE.BIG;
    }
  }

  onKill() {
    if (this.paused) return;
    this.killCount++;

    // Check if any untriggered node's threshold is reached
    for (const node of this.nodes) {
      if (!node.triggered && this.killCount >= node.threshold) {
        this._triggerNode(node);
        break; // Only trigger one at a time
      }
    }
  }

  _triggerNode(node) {
    node.triggered = true;
    this.paused = true;
    this.activeNode = node;

    if (node.type === BOSS_NODE.MINI) {
      this._spawnMiniBoss(node);
    } else {
      // Big boss: flash warning first
      this.flashActive = true;
      this.flashTimer = CONFIG.BOSS_FLASH_MS;
    }

    if (this.game.camera) this.game.camera.shake(8, 500);
    if (this.game.audio) this.game.audio.playSfx('boss');
  }

  _spawnMiniBoss(node) {
    const player = this.game.player;
    if (!player) return;

    const angle = Math.random() * Math.PI * 2;
    const dist = 200;
    const x = Math.max(40, Math.min(CONFIG.WORLD_WIDTH - 40, player.x + Math.cos(angle) * dist));
    const y = Math.max(40, Math.min(CONFIG.WORLD_HEIGHT - 40, player.y + Math.sin(angle) * dist));

    const bossType = this._getBossType();
    const baseStats = BOSS_BASE_STATS[bossType] || BOSS_BASE_STATS.boss;

    const overrideData = {
      hp: Math.floor(baseStats.hp * CONFIG.MINI_BOSS_HP_MULT),
      atk: Math.floor(baseStats.atk * CONFIG.MINI_BOSS_ATK_MULT)
    };

    const entity = this.game.spawn.spawnBossAt(x, y, bossType, overrideData);
    node.bossEntity = entity;

    if (this.game.particleSystem) {
      this.game.particleSystem.addText(
        player.x, player.y - 50,
        '小BOSS出现!', '#ff8800'
      );
    }
  }

  _spawnBigBoss(node) {
    const player = this.game.player;
    if (!player) return;

    const angle = Math.random() * Math.PI * 2;
    const dist = 500;
    const x = Math.max(40, Math.min(CONFIG.WORLD_WIDTH - 40, player.x + Math.cos(angle) * dist));
    const y = Math.max(40, Math.min(CONFIG.WORLD_HEIGHT - 40, player.y + Math.sin(angle) * dist));

    const bossType = this._getBossType();
    const entity = this.game.spawn.spawnBossAt(x, y, bossType);
    node.bossEntity = entity;

    if (this.game.particleSystem) {
      this.game.particleSystem.addText(
        player.x, player.y - 50,
        '大BOSS出现!', '#ff0000'
      );
    }
  }

  _getBossType() {
    const biomeNames = ['rainforest', 'desert', 'tundra', 'deep_sea'];
    let biomeId = 0;
    if (this.game.spawn && this.game.spawn._getPlayerBiomeId) {
      biomeId = this.game.spawn._getPlayerBiomeId();
    }
    const biomeName = biomeNames[biomeId] || 'rainforest';
    return BIOME_BOSSES[biomeName] || 'boss';
  }

  update(dt) {
    // Handle big boss flash countdown
    if (this.flashActive) {
      this.flashTimer -= dt * 1000;
      if (this.flashTimer <= 0) {
        this.flashActive = false;
        this.flashTimer = 0;
        if (this.activeNode) {
          this._spawnBigBoss(this.activeNode);
        }
      }
    }

    // Check if active boss is defeated
    if (this.activeNode && this.activeNode.bossEntity) {
      if (this.activeNode.bossEntity.dead) {
        this.activeNode.defeated = true;
        this.paused = false;
        this.activeNode = null;

        // Check if all nodes are defeated → victory
        const allDefeated = this.nodes.every(n => n.defeated);
        if (allDefeated) {
          this.game.victory();
        }
      }
    }
  }

  getProgress() {
    return Math.max(0, Math.min(1, this.killCount / this.totalKills));
  }
}
