// ─── HiddenEvolutionTracker.js ─── Tracks conditions for hidden evolutions ───

export class HiddenEvolutionTracker {
  constructor(game) {
    this.game = game;
    this.unlocked = new Set();
    this.biomeSurvivalTime = { 0: 0, 1: 0, 2: 0, 3: 0 }; // time spent in each biome
    this.killCount = 0;
    this.lastBiome = -1;
    this.biomeTimer = 0;
  }

  update(dt) {
    const g = this.game;
    const p = g.player;
    if (!p || p.dead) return;

    // Track biome survival time
    const biomeId = g.biomeEffects ? g.biomeEffects.getPlayerBiome() : 0;
    if (biomeId === this.lastBiome) {
      this.biomeTimer += dt;
    } else {
      this.lastBiome = biomeId;
      this.biomeTimer = 0;
    }
    this.biomeSurvivalTime[biomeId] = (this.biomeSurvivalTime[biomeId] || 0) + dt;

    // Check hidden evolution conditions
    this._checkConditions();
  }

  onKill() {
    this.killCount++;
  }

  _checkConditions() {
    const g = this.game;
    const p = g.player;
    const crab = g.carcinization ? g.carcinization.value : 0;

    // 1. 手枪虾螯: crab >= 5 AND kill >= 100
    if (crab >= 5 && this.killCount >= 100) {
      this._unlock('h_pistol_shrimp');
    }

    // 2. 灯塔水母: zero crab AND survived deep_sea biome
    if (crab === 0 && this.biomeSurvivalTime[3] >= 300) { // 5 minutes in deep sea
      this._unlock('h_jellyfish_immortal');
    }

    // 3. 水熊虫: survived 5 minutes in each extreme biome (1=desert, 2=tundra, 3=deep_sea)
    if (this.biomeSurvivalTime[1] >= 300 &&
        this.biomeSurvivalTime[2] >= 300 &&
        this.biomeSurvivalTime[3] >= 300 &&
        this.biomeSurvivalTime[0] >= 300) {
      this._unlock('h_tardigrade');
    }

    // 4. 奇美拉: 3+ evolution branches unlocked
    if (g.evolution) {
      const branches = new Set();
      for (const id of g.evolution.unlocked) {
        const node = g.evolution.getNode(id);
        if (node && node.branch !== 'none') branches.add(node.branch);
      }
      if (branches.size >= 3 && g.evolution.unlocked.size >= 15) {
        this._unlock('h_chimera');
      }
    }

    // 5. 原初之泥: Available after beating the game (checked from victory)
    // This is triggered externally
  }

  _unlock(id) {
    if (this.unlocked.has(id)) return;
    this.unlocked.add(id);

    // Notify player
    if (this.game.particleSystem) {
      this.game.particleSystem.addText(
        '隐藏进化解锁!',
        this.game.player.x,
        this.game.player.y - 60,
        '#ff0'
      );
    }
  }

  isUnlocked(id) {
    return this.unlocked.has(id);
  }

  serialize() {
    return {
      unlocked: [...this.unlocked],
      killCount: this.killCount,
      biomeSurvivalTime: { ...this.biomeSurvivalTime }
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.unlocked) this.unlocked = new Set(data.unlocked);
    if (data.killCount) this.killCount = data.killCount;
    if (data.biomeSurvivalTime) this.biomeSurvivalTime = { ...data.biomeSurvivalTime };
  }
}
