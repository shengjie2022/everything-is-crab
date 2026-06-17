/**
 * Save / load game state to localStorage.
 * Serialises the critical subset of game state into a versioned JSON blob.
 */

const SAVE_KEY = 'crab-evo-2-save';
const META_KEY = 'crab-evo-2-meta';
const SAVE_VERSION = 2;

export class SaveManager {
  constructor(game) {
    this.game = game;
    this.key = SAVE_KEY;
    this.metaKey = META_KEY;
    // Load meta data on construction
    this.loadMeta();
  }

  // ── Persist current game state ──
  save() {
    const g = this.game;
    const p = g.player;

    const data = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      player: {
        x: p.x, y: p.y,
        hp: p.hp, maxHp: p.maxHp,
        xp: p.xp, level: p.level, xpNext: p.xpNext,
        evoPoints: p.evoPoints,
        unlockedEvos: p.unlockedEvos ? [...p.unlockedEvos] : [],
        traits: p.traits ? [...p.traits] : [],
        form: p.form,
        bonusAtk: p.bonusAtk ?? 0,
        bonusDef: p.bonusDef ?? 0,
        bonusHp: p.bonusHp ?? 0,
        bonusSpd: p.bonusSpd ?? 0,
        bonusSen: p.bonusSen ?? 0,
        bonusReg: p.bonusReg ?? 0,
        regenRate: p.regenRate ?? 0
      },
      gameTime: g.gameTime ?? 0,
      crabValue: g.carcinization ? g.carcinization.value : 0,
      crabThresholds: g.carcinization && g.carcinization.reachedThresholds
        ? [...g.carcinization.reachedThresholds] : [],
      unlocked: g.evolution && g.evolution.unlocked
        ? [...g.evolution.unlocked] : [],
      dayTime: g.dayNight ? g.dayNight.time : 0,
      mode: g.mode ?? 'story'
    };

    try {
      localStorage.setItem(this.key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('[SaveManager] Failed to write save:', e);
      return false;
    }
  }

  // ── Save meta-progression (persistent across runs) ──
  saveMeta() {
    const g = this.game;
    const data = {
      version: SAVE_VERSION,
      economy: g.economy ? g.economy.serialize() : null,
      geneBank: g.geneBank ? g.geneBank.serialize() : null,
      challenge: g.challenge ? g.challenge.serialize() : null,
      codex: g.codex ? g.codex.serialize() : null,
      achievements: g.achievements ? g.achievements.serialize() : null
    };

    try {
      localStorage.setItem(this.metaKey, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('[SaveManager] Failed to write meta save:', e);
      return false;
    }
  }

  // ── Load meta-progression ──
  loadMeta() {
    const raw = localStorage.getItem(this.metaKey);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      const g = this.game;
      if (data.economy && g.economy) g.economy.deserialize(data.economy);
      if (data.geneBank && g.geneBank) g.geneBank.deserialize(data.geneBank);
      if (data.challenge && g.challenge) g.challenge.deserialize(data.challenge);
      if (data.codex && g.codex) g.codex.deserialize(data.codex);
      if (data.achievements && g.achievements) g.achievements.deserialize(data.achievements);
    } catch (e) {
      console.warn('[SaveManager] Corrupt meta data:', e);
    }
  }

  // ── Read raw save data (or null) ──
  load() {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[SaveManager] Corrupt save data:', e);
      return null;
    }
  }

  hasSave() {
    return !!localStorage.getItem(this.key);
  }

  deleteSave() {
    localStorage.removeItem(this.key);
  }

  // ── Apply saved data back to the live game objects ──
  restore(data) {
    if (!data || (data.version !== SAVE_VERSION && data.version !== 1)) {
      console.warn('[SaveManager] Incompatible save version, ignoring.');
      return false;
    }

    const g = this.game;
    const p = g.player;
    const saved = data.player;

    if (saved) {
      p.x = saved.x ?? p.x;
      p.y = saved.y ?? p.y;
      p.hp = saved.hp ?? p.hp;
      p.maxHp = saved.maxHp ?? p.maxHp;
      p.xp = saved.xp ?? 0;
      p.level = saved.level ?? 1;
      p.xpNext = saved.xpNext ?? p.xpNext;
      p.evoPoints = saved.evoPoints ?? 0;
      p.form = saved.form ?? p.form;
      p.bonusAtk = saved.bonusAtk ?? 0;
      p.bonusDef = saved.bonusDef ?? 0;
      p.bonusHp = saved.bonusHp ?? 0;
      p.bonusSpd = saved.bonusSpd ?? 0;
      p.bonusSen = saved.bonusSen ?? 0;
      p.bonusReg = saved.bonusReg ?? 0;
      p.regenRate = saved.regenRate ?? 0;

      if (Array.isArray(saved.unlockedEvos)) p.unlockedEvos = [...saved.unlockedEvos];
      if (Array.isArray(saved.traits)) p.traits = [...saved.traits];
    }

    if (typeof data.gameTime === 'number') g.gameTime = data.gameTime;
    if (g.carcinization) {
      if (typeof data.crabValue === 'number') g.carcinization.value = data.crabValue;
      if (Array.isArray(data.crabThresholds)) g.carcinization.reachedThresholds = new Set(data.crabThresholds);
    }
    if (g.evolution && Array.isArray(data.unlocked)) g.evolution.unlocked = new Set(data.unlocked);
    if (g.dayNight && typeof data.dayTime === 'number') g.dayNight.time = data.dayTime;
    if (data.mode) g.mode = data.mode;

    return true;
  }
}
