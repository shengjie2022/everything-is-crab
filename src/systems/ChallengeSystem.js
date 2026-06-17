// ─── ChallengeSystem.js ─── Challenge mode rule enforcement ───
import { CHALLENGES } from '../data/challenges.js';
import { CONFIG } from '../config.js';

export class ChallengeSystem {
  constructor(game) {
    this.game = game;
    this.activeChallenge = null;
    this.rules = {};
    this.completed = new Set(); // IDs of completed challenges
    this.rewards = [];
  }

  getChallenge(id) {
    return CHALLENGES.find(c => c.id === id);
  }

  getAllChallenges() {
    return CHALLENGES;
  }

  activate(challengeId) {
    const challenge = this.getChallenge(challengeId);
    if (!challenge) return false;

    this.activeChallenge = challenge;
    this.rules = { ...challenge.rules };
    return true;
  }

  deactivate() {
    this.activeChallenge = null;
    this.rules = {};
  }

  isActive() {
    return !!this.activeChallenge;
  }

  // Apply rules at game start
  applyRules(game) {
    if (!this.activeChallenge) return;
    const r = this.rules;

    // Size multiplier
    if (r.sizeMultiplier) {
      if (game.player) game.player.radius *= r.sizeMultiplier;
    }

    // Speed reduction
    if (r.speedReduction && game.player) {
      game.player.speed *= r.speedReduction;
    }

    // Force night
    if (r.forceNight && game.dayNight) {
      game.dayNight.forceNight = true;
    }

    // Time limit override
    if (r.timeLimit) {
      // Will be checked in update
    }

    // Spawn hunter
    if (r.spawnHunter && game.spawn) {
      // Spawn a powerful hunter near the player at game start
      setTimeout(() => {
        const p = game.player;
        if (p && game.spawn._spawnCreature) {
          game.spawn._spawnCreature('python');
          game.spawn._spawnCreature('shark');
        }
      }, 2000);
    }

    // Global tile override (ice age)
    if (r.globalTileOverride !== undefined && game.tileMap) {
      const tiles = game.tileMap.tiles;
      const tileId = r.globalTileOverride;
      for (let i = 0; i < tiles.length; i++) {
        // Only override walkable tiles
        if (tiles[i] !== 4 && tiles[i] !== 5 && tiles[i] !== 3) { // not tree, rock, deep_water
          tiles[i] = tileId;
        }
      }
    }

    // Prey buff (food chain reversed)
    if (r.preyBuffMultiplier) {
      for (const c of game.creatures) {
        if (c.tier <= 2) {
          c.hp *= r.preyBuffMultiplier;
          c.maxHp *= r.preyBuffMultiplier;
          c.atk *= r.preyBuffMultiplier;
          c.def *= r.preyBuffMultiplier;
        }
      }
    }
  }

  // Called every frame to enforce runtime rules
  update(dt) {
    if (!this.activeChallenge) return;
    const r = this.rules;
    const g = this.game;

    // Global poison
    if (r.globalPoison && g.player && !g.player.dead) {
      g.player.hp -= r.globalPoison * dt;
      if (g.player.hp <= 0) {
        g.player.hp = 0;
        g.player.die();
      }
    }

    // Time limit
    if (r.timeLimit && g.gameTime >= r.timeLimit) {
      g.defeat();
    }

    // Force night
    if (r.forceNight && g.dayNight) {
      g.dayNight.forceNight = true;
    }
  }

  // Check if evolution is allowed by challenge rules
  canEvolve(nodeId, branch) {
    if (!this.activeChallenge) return true;
    const r = this.rules;

    if (r.branchLimit) {
      return r.branchLimit.includes(branch) || branch === 'none';
    }
    return true;
  }

  // Check if attack is allowed
  canAttack() {
    if (!this.activeChallenge) return true;
    return !this.rules.noAttack;
  }

  // Check if devour is allowed
  canDevour() {
    if (!this.activeChallenge) return true;
    return !this.rules.noDevour;
  }

  // Mark challenge as completed
  complete() {
    if (!this.activeChallenge) return;
    this.completed.add(this.activeChallenge.id);
    this.rewards.push(this.activeChallenge.reward);
  }

  isCompleted(id) {
    return this.completed.has(id);
  }

  // Serialize for save
  serialize() {
    return {
      completed: [...this.completed],
      rewards: this.rewards
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.completed) this.completed = new Set(data.completed);
    if (data.rewards) this.rewards = data.rewards;
  }
}
