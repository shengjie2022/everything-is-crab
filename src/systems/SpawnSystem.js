import { CONFIG } from '../config.js';
import { TILE } from '../constants.js';
import { CREATURES, BIOME_CREATURES, BIOME_BOSSES } from '../data/creatures.js';
import { Pickup } from '../entities/Pickup.js';
import { Beetle } from '../entities/creatures/Beetle.js';
import { Frog } from '../entities/creatures/Frog.js';
import { Crab } from '../entities/creatures/Crab.js';
import { Fish } from '../entities/creatures/Fish.js';
import { Spider } from '../entities/creatures/Spider.js';
import { Snake } from '../entities/creatures/Snake.js';
import { Octopus } from '../entities/creatures/Octopus.js';
import { Scorpion } from '../entities/creatures/Scorpion.js';
import { Boss } from '../entities/creatures/Boss.js';
import { SandWorm } from '../entities/creatures/SandWorm.js';
import { FrostCrab } from '../entities/creatures/FrostCrab.js';
import { Kraken } from '../entities/creatures/Kraken.js';
import { Monkey } from '../entities/creatures/Monkey.js';
import { Python } from '../entities/creatures/Python.js';
import { PoisonFrog } from '../entities/creatures/PoisonFrog.js';
import { ArmyAnt } from '../entities/creatures/ArmyAnt.js';
import { CamelSpider } from '../entities/creatures/CamelSpider.js';
import { HornedLizard } from '../entities/creatures/HornedLizard.js';
import { Vulture } from '../entities/creatures/Vulture.js';
import { Rattlesnake } from '../entities/creatures/Rattlesnake.js';
import { PolarBear } from '../entities/creatures/PolarBear.js';
import { ArcticFox } from '../entities/creatures/ArcticFox.js';
import { Seal } from '../entities/creatures/Seal.js';
import { SnowyOwl } from '../entities/creatures/SnowyOwl.js';
import { Shark } from '../entities/creatures/Shark.js';
import { Jellyfish } from '../entities/creatures/Jellyfish.js';
import { Anglerfish } from '../entities/creatures/Anglerfish.js';
import { GiantSquid } from '../entities/creatures/GiantSquid.js';
import { Centipede } from '../entities/creatures/Centipede.js';
import { Mantis } from '../entities/creatures/Mantis.js';
import { Piranha } from '../entities/creatures/Piranha.js';
import { FireAnt } from '../entities/creatures/FireAnt.js';
import { Sidewinder } from '../entities/creatures/Sidewinder.js';
import { DesertTortoise } from '../entities/creatures/DesertTortoise.js';
import { Penguin } from '../entities/creatures/Penguin.js';
import { Walrus } from '../entities/creatures/Walrus.js';
import { SnowLeopard } from '../entities/creatures/SnowLeopard.js';
import { SeaUrchin } from '../entities/creatures/SeaUrchin.js';
import { MorayEel } from '../entities/creatures/MorayEel.js';
import { Pufferfish } from '../entities/creatures/Pufferfish.js';

const CREATURE_CLASSES = {
  beetle: Beetle, frog: Frog, crab: Crab, fish: Fish,
  spider: Spider, snake: Snake, octopus: Octopus, scorpion: Scorpion,
  boss: Boss, sand_worm: SandWorm, frost_crab: FrostCrab, kraken_boss: Kraken,
  monkey: Monkey, python: Python, poison_frog: PoisonFrog, army_ant: ArmyAnt,
  camel_spider: CamelSpider, horned_lizard: HornedLizard, vulture: Vulture, rattlesnake: Rattlesnake,
  polar_bear: PolarBear, arctic_fox: ArcticFox, seal: Seal, snowy_owl: SnowyOwl,
  shark: Shark, jellyfish: Jellyfish, anglerfish: Anglerfish, giant_squid: GiantSquid,
  centipede: Centipede, mantis: Mantis, piranha: Piranha,
  fire_ant: FireAnt, sidewinder: Sidewinder, desert_tortoise: DesertTortoise,
  penguin: Penguin, walrus: Walrus, snow_leopard: SnowLeopard,
  sea_urchin: SeaUrchin, moray_eel: MorayEel, pufferfish: Pufferfish
};

const BIOME_NAMES = ['rainforest', 'desert', 'tundra', 'deep_sea'];

const INITIAL_COUNTS = {
  beetle: 6, frog: 3, crab: 2, fish: 3,
  spider: 2, snake: 2, octopus: 2, scorpion: 2,
  monkey: 2, poison_frog: 2, army_ant: 3,
  camel_spider: 1, horned_lizard: 2, vulture: 2,
  arctic_fox: 2, snowy_owl: 2, seal: 2,
  shark: 2, jellyfish: 3, anglerfish: 2,
  centipede: 2, mantis: 1, piranha: 2,
  fire_ant: 3, sidewinder: 1, desert_tortoise: 1,
  penguin: 3, walrus: 1, snow_leopard: 1,
  sea_urchin: 3, moray_eel: 1, pufferfish: 2
};

export class SpawnSystem {
  constructor(game) {
    this.game = game;
    this.timer = 0;
    this.fruitTimer = 0;
    this.bossesSpawned = {};
  }

  reset() {
    this.timer = 0;
    this.fruitTimer = 0;
    this.bossesSpawned = {};
  }

  initialSpawn() {
    for (const [type, count] of Object.entries(INITIAL_COUNTS)) {
      for (let i = 0; i < count; i++) {
        this._spawnCreature(type);
      }
    }
  }

  update(dt) {
    this.timer += dt * 1000;

    // Fruit spawning
    this.fruitTimer += dt * 1000;
    if (this.fruitTimer >= CONFIG.FRUIT_SPAWN_INTERVAL) {
      this.fruitTimer = 0;
      this._trySpawnFruit();
    }

    // Periodic creature spawning
    if (this.timer < CONFIG.SPAWN_INTERVAL) return;
    this.timer = 0;

    if (this.game.getCreatures().length >= CONFIG.MAX_CREATURES) return;

    // Biome-weighted spawn based on player location
    const type = this._biomeWeightedRandom();
    if (type) this._spawnCreature(type);
  }

  _trySpawnBiomeBoss() {
    const playerBiome = this._getPlayerBiomeId();
    const biomeName = BIOME_NAMES[playerBiome] || 'rainforest';
    const bossType = BIOME_BOSSES[biomeName];

    if (!bossType || this.bossesSpawned[bossType]) return;

    this._spawnCreature(bossType);
    this.bossesSpawned[bossType] = true;

    if (this.game.particleSystem) {
      this.game.particleSystem.addText(
        this.game.player.x,
        this.game.player.y - 50,
        'BOSS已出现!',
        '#f00'
      );
    }
    if (this.game.camera) this.game.camera.shake(8, 500);
    if (this.game.audio) this.game.audio.playSfx('boss');
  }

  _getPlayerBiomeId() {
    const g = this.game;
    if (!g.player || !g.tileMap || !g.tileMap.biomeMap) return 0;
    const p = g.player;
    const c = Math.floor(p.x / CONFIG.TILE_SIZE);
    const r = Math.floor(p.y / CONFIG.TILE_SIZE);
    const i = r * CONFIG.MAP_COLS + c;
    if (i < 0 || i >= g.tileMap.biomeMap.length) return 0;
    return g.tileMap.biomeMap[i];
  }

  _biomeWeightedRandom() {
    const biomeId = this._getPlayerBiomeId();
    const biomeName = BIOME_NAMES[biomeId] || 'rainforest';
    const biomeTypes = BIOME_CREATURES[biomeName] || BIOME_CREATURES.rainforest;
    const progress = this.game.progressTimeline
      ? this.game.progressTimeline.getProgress()
      : Math.min(1, this.game.gameTime / 600000);

    let candidates = {};
    for (const type of biomeTypes) {
      const data = CREATURES[type];
      if (!data || data.isBoss) continue;
      let w = data.weight || 1;
      // Adjust weight by progress (higher-tier creatures more common later)
      if (data.tier >= 3 && progress < 0.3) w *= 0.3;
      if (data.tier <= 1 && progress > 0.5) w *= 0.5;
      candidates[type] = w;
    }

    let total = 0;
    for (const w of Object.values(candidates)) total += w;
    if (total <= 0) return 'beetle';

    let roll = Math.random() * total;
    for (const [type, w] of Object.entries(candidates)) {
      roll -= w;
      if (roll <= 0) return type;
    }
    return 'beetle';
  }

  spawnSnakeNear(bx, by) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 60;
    const x = bx + Math.cos(angle) * dist;
    const y = by + Math.sin(angle) * dist;
    const data = CREATURES.snake;
    const Cls = CREATURE_CLASSES.snake;
    const creature = new Cls(x, y, data);
    this.game.addEntity(creature);
    return creature;
  }

  _trySpawnFruit() {
    // Count existing fruits
    let fruitCount = 0;
    for (const p of this.game.pickups) {
      if (!p.dead && p.type === 'fruit') fruitCount++;
    }
    if (fruitCount >= CONFIG.FRUIT_MAX) return;

    // Find a random walkable tile
    for (let attempt = 0; attempt < 20; attempt++) {
      const x = Math.random() * CONFIG.WORLD_WIDTH;
      const y = Math.random() * CONFIG.WORLD_HEIGHT;
      if (this.game.tileMap && !this.game.tileMap.walkable(x, y)) continue;

      const fruit = new Pickup(x, y, 'fruit', CONFIG.FRUIT_XP, CONFIG.FRUIT_EVO_POINTS);
      fruit.lifetime = CONFIG.FRUIT_LIFETIME;
      this.game.addPickup(fruit);
      return;
    }
  }

  spawnBossAt(x, y, bossType, overrideData) {
    const baseData = CREATURES[bossType];
    if (!baseData) return null;

    const Cls = CREATURE_CLASSES[bossType];
    if (!Cls) return null;

    const data = overrideData ? { ...baseData, ...overrideData } : baseData;
    const creature = new Cls(x, y, data);
    // Apply overrides directly to the creature instance
    if (overrideData) {
      if (overrideData.hp !== undefined) { creature.hp = overrideData.hp; creature.maxHp = overrideData.hp; }
      if (overrideData.atk !== undefined) creature.atk = overrideData.atk;
    }
    this.game.addEntity(creature);
    return creature;
  }

  _spawnCreature(type) {
    const data = CREATURES[type];
    if (!data) return null;

    const Cls = CREATURE_CLASSES[type];
    if (!Cls) return null;

    // Determine spawn region based on biome preference
    const biomeRegion = this._getBiomeRegion(data.biome);

    for (let attempt = 0; attempt < 20; attempt++) {
      let x, y;

      if (biomeRegion) {
        // Spawn within biome quadrant
        x = biomeRegion.x + Math.random() * biomeRegion.w;
        y = biomeRegion.y + Math.random() * biomeRegion.h;
      } else {
        x = Math.random() * CONFIG.WORLD_WIDTH;
        y = Math.random() * CONFIG.WORLD_HEIGHT;
      }

      // Tile checks
      if (this.game.tileMap) {
        if (data.water) {
          const tile = this.game.tileMap.getAt(x, y);
          if (tile !== TILE.WATER && tile !== TILE.DEEP_WATER) continue;
        } else if (data.tiles && data.tiles.length > 0) {
          const tile = this.game.tileMap.getAt(x, y);
          if (!data.tiles.includes(tile)) continue;
        } else {
          if (!this.game.tileMap.walkable(x, y)) continue;
        }
      }

      // Skip if too close to player
      const player = this.game.player;
      if (player) {
        const dx = x - player.x;
        const dy = y - player.y;
        if (dx * dx + dy * dy < 150 * 150) continue;
      }

      // Clamp to world bounds
      const r = data.size || 10;
      x = Math.max(r, Math.min(CONFIG.WORLD_WIDTH - r, x));
      y = Math.max(r, Math.min(CONFIG.WORLD_HEIGHT - r, y));

      const creature = new Cls(x, y, data);
      this.game.addEntity(creature);
      return creature;
    }

    return null;
  }

  _getBiomeRegion(biome) {
    const W = CONFIG.WORLD_WIDTH;
    const H = CONFIG.WORLD_HEIGHT;
    const hw = W / 2, hh = H / 2;

    switch (biome) {
      case 'rainforest': return { x: 0, y: 0, w: hw, h: hh };
      case 'desert':     return { x: hw, y: 0, w: hw, h: hh };
      case 'tundra':     return { x: 0, y: hh, w: hw, h: hh };
      case 'deep_sea':   return { x: hw, y: hh, w: hw, h: hh };
      default: return null; // 'any' — spawn anywhere
    }
  }
}
