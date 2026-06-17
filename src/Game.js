import { CONFIG } from './config.js';
import { GSTATE } from './constants.js';
import { Camera } from './core/Camera.js';
import { InputManager } from './input/InputManager.js';
import { TileMap } from './world/TileMap.js';
import { WorldGenerator } from './world/WorldGenerator.js';
import { ProgressTimeline } from './world/ProgressTimeline.js';
import { Player } from './entities/Player.js';
import { CombatSystem } from './systems/CombatSystem.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { AISystem } from './systems/AISystem.js';
import { SpawnSystem } from './systems/SpawnSystem.js';
import { ParticleSystem } from './systems/ParticleSystem.js';
import { EvolutionSystem } from './systems/EvolutionSystem.js';
import { CarcinizationSystem } from './systems/CarcinizationSystem.js';
import { Renderer } from './rendering/Renderer.js';
import { HUD } from './ui/HUD.js';
import { EvolutionPanel } from './ui/EvolutionPanel.js';
import { ScreenManager } from './ui/ScreenManager.js';
import { MinimapUI } from './ui/MinimapUI.js';
import { AudioManager } from './audio/AudioManager.js';
import { SaveManager } from './save/SaveManager.js';
import { BiomeEffects } from './world/BiomeEffects.js';
import { ChallengeSystem } from './systems/ChallengeSystem.js';
import { EconomySystem } from './systems/EconomySystem.js';
import { GeneBank } from './systems/GeneBank.js';
import { CodexSystem } from './systems/CodexSystem.js';
import { AchievementSystem } from './systems/AchievementSystem.js';
import { HiddenEvolutionTracker } from './systems/HiddenEvolutionTracker.js';
import { EvolutionReplay } from './ui/EvolutionReplay.js';
import { SandboxPanel } from './ui/SandboxPanel.js';
import { EvolutionChoicePopup } from './ui/EvolutionChoicePopup.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = GSTATE.START;
    this.mode = 'story'; // 'story', 'endless', 'sandbox'
    this.gameTime = 0; // ms elapsed
    this.lastTime = 0;

    // Entity arrays
    this.creatures = [];
    this.pickups = [];
    this.projectiles = [];
    this.entities = []; // all entities for rendering (player + creatures)

    // Core
    this.camera = new Camera();
    this.input = new InputManager(canvas);
    this.dayNight = null;
    this.progressTimeline = null;

    // Player (created on game start)
    this.player = null;

    // Map
    this.tileMap = null;

    // Systems
    this.combat = new CombatSystem(this);
    this.collision = new CollisionSystem();
    this.ai = new AISystem(this);
    this.spawn = new SpawnSystem(this);
    this.particleSystem = new ParticleSystem();
    this.evolution = new EvolutionSystem(this);
    this.carcinization = new CarcinizationSystem(this);

    // Rendering
    this.renderer = new Renderer(this);

    // UI
    this.hud = new HUD(this);
    this.evoPanel = new EvolutionPanel(this);
    this.screenManager = new ScreenManager(this);
    this.minimap = new MinimapUI(this);

    // Audio
    this.audio = new AudioManager();

    // Biome effects
    this.biomeEffects = new BiomeEffects(this);

    // Challenge system
    this.challenge = new ChallengeSystem(this);

    // Economy & Gene Bank (persistent)
    this.economy = new EconomySystem(this);
    this.geneBank = new GeneBank(this);

    // Codex & Achievements (persistent)
    this.codex = new CodexSystem(this);
    this.achievements = new AchievementSystem(this);

    // Hidden evolutions & Replay
    this.hiddenEvo = new HiddenEvolutionTracker(this);
    this.evoReplay = new EvolutionReplay(this);
    this.sandboxPanel = new SandboxPanel(this);
    this.evoChoicePopup = new EvolutionChoicePopup(this);

    // Save
    this.save = new SaveManager(this);

    // Show start screen
    this.screenManager.showOnly('start');

    // Start the loop (but only render start screen)
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  // ── Game lifecycle ──────────────────────────────────────

  startGame(mode) {
    this.mode = mode || 'story';

    // Init audio on first user interaction
    if (!this.audio.ctx) this.audio.init();
    this.audio.startBgm('day');

    // Generate world
    const gen = new WorldGenerator();
    const mapData = gen.generate();
    this.tileMap = new TileMap();
    this.tileMap.load(mapData);

    // Create player at world center
    this.player = new Player(CONFIG.WORLD_WIDTH / 2, CONFIG.WORLD_HEIGHT / 2);

    // Reset all state
    this.creatures = [];
    this.pickups = [];
    this.projectiles = [];
    this.gameTime = 0;
    this.progressTimeline = new ProgressTimeline(this);
    this.evolution.reset();
    this.carcinization.reset();
    this.spawn.reset();
    this.particleSystem.clear();

    // Initial creature spawn
    this.spawn.initialSpawn();

    // Ensure starting evo points
    this.player.evoPoints = CONFIG.STARTING_EVO_POINTS;

    // Apply gene bank bonuses
    this.geneBank.applyToPlayer(this.player);

    // Sandbox mode: auto-unlock all evolutions, unlimited evo points
    if (this.mode === 'sandbox') {
      this.player.evoPoints = 999;
      // Unlock all non-hidden evolutions
      const allNodes = this.evolution.getAllNodes();
      for (const node of allNodes) {
        if (!node.hidden && !this.evolution.isUnlocked(node.id)) {
          this.evolution.unlocked.add(node.id);
          this.evolution.unlockedCount++;
          this.player.unlockedEvos.push(node.id);
          this.player.applyEvolution(node);
          if (node.crab !== undefined && node.crab !== 0) {
            this.carcinization.add(node.crab);
          }
        }
      }
    }

    // Apply challenge rules if in challenge mode
    if (this.mode === 'challenge' && this.challenge.isActive()) {
      this.challenge.applyRules(this);
    }

    // Reset hidden evolution tracker
    this.hiddenEvo = new HiddenEvolutionTracker(this);
    this.evoReplay.clear();

    // Build entities array for renderer
    this._rebuildEntities();

    this.state = GSTATE.PLAYING;
    this.screenManager.hideAll();
    this.minimap.invalidate();
  }

  restart() {
    this.startGame(this.mode);
  }

  resume() {
    if (this.state === GSTATE.PAUSED) {
      // Don't resume if evo choice popup is visible
      if (this.evoChoicePopup && this.evoChoicePopup.visible) return;
      this.state = GSTATE.PLAYING;
      this.screenManager.hideAll();
    }
  }

  quit() {
    this.state = GSTATE.START;
    this.screenManager.showOnly('start');
    this.audio.stopBgm();
  }

  victory() {
    this.state = GSTATE.VICTORY;
    const reward = this.economy.awardSessionEP();
    const stats = document.getElementById('victory-stats');
    if (stats) {
      stats.textContent =
        `等级: ${this.player.level} | 蟹化值: ${this.carcinization.value} | 用时: ${this._formatTime(this.gameTime)}`;
    }
    const epEl = document.getElementById('victory-ep');
    if (epEl) epEl.textContent = `获得 EP: +${reward.ep}${reward.crystals > 0 ? ` | 蟹化结晶: +${reward.crystals}` : ''}`;
    // Complete challenge if active
    if (this.challenge.isActive()) this.challenge.complete();
    // Achievement tracking
    if (this.achievements) this.achievements.onVictory();
    this.save.saveMeta();
    this.screenManager.showOnly('victory');
    this.audio.stopBgm();
  }

  defeat() {
    this.state = GSTATE.DEFEAT;
    const reward = this.economy.awardSessionEP();
    const stats = document.getElementById('defeat-stats');
    if (stats) {
      stats.textContent =
        `等级: ${this.player.level} | 蟹化值: ${this.carcinization.value} | 存活: ${this._formatTime(this.gameTime)}`;
    }
    const epEl = document.getElementById('defeat-ep');
    if (epEl) epEl.textContent = `获得 EP: +${reward.ep}`;
    this.save.saveMeta();
    this.screenManager.showOnly('defeat');
    this.audio.stopBgm();
  }

  openEvolution() {
    if (this.state !== GSTATE.PLAYING) return;
    this.state = GSTATE.EVO;
    this.screenManager.show('evo');
    this.evoPanel.open();
  }

  closeEvolution() {
    if (this.state !== GSTATE.EVO) return;
    this.state = GSTATE.PLAYING;
    this.screenManager.hide('evo');
    this.evoPanel.close();
    // Check zero crab bonus after closing evo panel
    this.carcinization.checkZeroBonus();
  }

  // ── Entity management ──────────────────────────────────

  getCreatures() {
    return this.creatures.filter(c => !c.dead);
  }

  addEntity(entity) {
    this.creatures.push(entity);
    this._rebuildEntities();
  }

  addPickup(pickup) {
    this.pickups.push(pickup);
  }

  addProjectile(proj) {
    this.projectiles.push(proj);
  }

  _rebuildEntities() {
    this.entities = [this.player, ...this.creatures].filter(e => e && !e.dead);
  }

  // ── Main loop ──────────────────────────────────────────

  _loop(now) {
    requestAnimationFrame(this._loop);

    if (!this.lastTime) {
      this.lastTime = now;
      return;
    }

    let dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    dt = Math.min(dt, 0.05); // cap at 50ms to prevent spiral of death

    if (this.state === GSTATE.PLAYING) {
      this._update(dt);
    }

    if (this.state === GSTATE.EVO) {
      this.evoPanel.draw();
    }

    if (this.state === GSTATE.PLAYING || this.state === GSTATE.PAUSED) {
      this.renderer.render();
    }
  }

  _update(dt) {
    const input = this.input;

    // Handle pause
    if (input.consume('pause')) {
      this.state = GSTATE.PAUSED;
      this.screenManager.show('pause');
      return;
    }

    // Handle evolution toggle
    if (input.consume('evolve')) {
      this.openEvolution();
      return;
    }

    // BUG FIX: Player.js tryAttack reads input.mouseX / input.mouseY,
    // but InputManager stores them as input.mouse.x / input.mouse.y.
    // Bridge the two here before handing input to the player.
    input.mouseX = input.mouse.x;
    input.mouseY = input.mouse.y;

    // Game time tracking (kept for stats, no defeat condition)
    this.gameTime += dt * 1000;

    // Player input and update
    this.player.handleInput(input, this, dt);
    this.player.update(dt, this);

    // Check level up → show choice popup
    if (this.player._levelUpOccurred) {
      this.player._levelUpOccurred = false;
      this.evoChoicePopup.tryShow();
    }

    // Check player death
    if (this.player.dead) {
      this.defeat();
      return;
    }

    // AI and creature updates
    this.ai.update(dt);
    for (const c of this.creatures) {
      if (!c.dead) c.update(dt, this);
    }

    // Spawning
    this.spawn.update(dt);

    // Projectile updates
    for (const p of this.projectiles) {
      if (!p.dead) p.update(dt, this);
    }

    // Combat (damage ticks, poison, etc.)
    this.combat.update(dt);

    // Progress timeline (boss nodes, kill tracking)
    if (this.progressTimeline) {
      this.progressTimeline.update(dt);
    }

    // Collision resolution
    this.collision.update(this);

    // Biome environmental effects
    this.biomeEffects.update(dt);

    // Challenge system runtime rules
    if (this.challenge.isActive()) {
      this.challenge.update(dt);
    }

    // Achievements check
    this.achievements.update(dt);

    // Hidden evolution condition tracking
    this.hiddenEvo.update(dt);

    // Sandbox panel (god mode etc.)
    this.sandboxPanel.update(dt);

    // Particles
    this.particleSystem.update(dt);

    // Pickup lifetime
    for (const p of this.pickups) {
      if (!p.dead) p.update(dt, this);
    }

    // Cleanup dead entities
    this.creatures = this.creatures.filter(c => !c.dead);
    this.pickups = this.pickups.filter(p => !p.dead);
    this.projectiles = this.projectiles.filter(p => !p.dead);
    this._rebuildEntities();

    // Camera follow player
    this.camera.follow(this.player, dt);
  }

  // ── Helpers ────────────────────────────────────────────

  _formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }
}
