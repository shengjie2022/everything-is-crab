import { EVO_NODES } from '../data/evolution.js';

export class EvolutionSystem {
  constructor(game) {
    this.game = game;
    this.unlocked = new Set(['base']);
    this.unlockedCount = 1;
  }

  reset() {
    this.unlocked = new Set(['base']);
    this.unlockedCount = 1;
  }

  getNode(id) {
    return EVO_NODES.find(n => n.id === id) || null;
  }

  isUnlocked(id) {
    return this.unlocked.has(id);
  }

  canUnlock(id) {
    if (this.unlocked.has(id)) return false;

    const node = this.getNode(id);
    if (!node) return false;

    // Hidden evolutions require tracker unlock first
    if (node.hidden && this.game.hiddenEvo && !this.game.hiddenEvo.isUnlocked(id)) {
      return false;
    }

    // Check prerequisites are all unlocked
    if (node.req && node.req.length > 0) {
      for (const reqId of node.req) {
        if (!this.unlocked.has(reqId)) return false;
      }
    }

    // Check player has enough evo points
    const player = this.game.player;
    if (player.evoPoints < node.cost) return false;

    return true;
  }

  getAvailable() {
    return EVO_NODES.filter(n => this.canUnlock(n.id));
  }

  unlock(id) {
    if (!this.canUnlock(id)) return false;

    const node = this.getNode(id);
    const player = this.game.player;

    // Spend evo points
    player.evoPoints -= node.cost;

    // Mark as unlocked
    this.unlocked.add(id);
    this.unlockedCount++;
    player.unlockedEvos.push(id);

    // Apply stat bonuses to player
    player.applyEvolution(node);

    // Apply crab value to carcinization system
    if (node.crab !== undefined && node.crab !== 0) {
      this.game.carcinization.add(node.crab);
    }

    // Effects
    this.game.particleSystem.emit(player.x, player.y, '#ff0', 20, { speed: 180, life: 0.8 });
    this.game.particleSystem.addText(player.x, player.y - 30, node.name, '#ff0');
    this.game.audio.playSfx('evolve');
    this.game.camera.shake(3, 200);

    // Codex tracking
    if (this.game.codex) this.game.codex.discoverEvolution(id);

    // Achievement tracking
    if (this.game.achievements) this.game.achievements.onEvolutionUnlocked(id);

    // Evolution replay snapshot
    if (this.game.evoReplay) this.game.evoReplay.captureSnapshot(node.name);

    return true;
  }

  getAllNodes() {
    return EVO_NODES;
  }

  isHiddenAndLocked(id) {
    const node = this.getNode(id);
    if (!node || !node.hidden) return false;
    if (this.game.hiddenEvo && this.game.hiddenEvo.isUnlocked(id)) return false;
    return true;
  }

  getByBranch(branch) {
    return EVO_NODES.filter(n => n.branch === branch);
  }
}
