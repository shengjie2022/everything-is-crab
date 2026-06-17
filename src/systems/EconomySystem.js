// ─── EconomySystem.js ─── EP economy + session rewards ───

export class EconomySystem {
  constructor(game) {
    this.game = game;
    this.ep = 0;              // Evolution Points (persistent currency)
    this.geneFragments = 0;   // From dismantling evolutions
    this.crabCrystals = 0;    // High crab-value rewards
  }

  // Calculate EP earned from a completed session
  calculateSessionEP() {
    const g = this.game;
    const p = g.player;
    if (!p) return 0;

    const level = p.level || 1;
    const crabVal = g.carcinization ? g.carcinization.value : 0;
    const survivalMs = g.gameTime || 0;
    const survivalMinutes = survivalMs / 60000;
    const bossKilled = g.combat ? g.combat.bossKills > 0 : false;

    // Kill count estimation from XP gained
    const killEstimate = Math.floor((p.xp + (p.xpNext - 50)) / 20);

    const ep = Math.floor(
      level * 10 +
      killEstimate * 2 +
      survivalMinutes * 5 +
      (bossKilled ? 100 : 0) +
      crabVal * 3
    );

    return Math.max(ep, 5); // Minimum 5 EP
  }

  // Award EP at end of session
  awardSessionEP() {
    const earned = this.calculateSessionEP();
    this.ep += earned;

    // Crab crystals from high crab value
    const crabVal = this.game.carcinization ? this.game.carcinization.value : 0;
    if (crabVal >= 10) {
      this.crabCrystals += Math.floor(crabVal / 5);
    }

    return {
      ep: earned,
      fragments: 0,
      crystals: crabVal >= 10 ? Math.floor(crabVal / 5) : 0
    };
  }

  spend(amount) {
    if (this.ep < amount) return false;
    this.ep -= amount;
    return true;
  }

  // Serialize
  serialize() {
    return {
      ep: this.ep,
      geneFragments: this.geneFragments,
      crabCrystals: this.crabCrystals
    };
  }

  deserialize(data) {
    if (!data) return;
    this.ep = data.ep || 0;
    this.geneFragments = data.geneFragments || 0;
    this.crabCrystals = data.crabCrystals || 0;
  }
}
