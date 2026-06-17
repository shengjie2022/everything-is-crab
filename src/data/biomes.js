// ─── biomes.js ─── Biome definitions for 4-quadrant world ───
import { TILE } from '../constants.js';

export const BIOME_DATA = {
  rainforest: {
    name: '热带雨林',
    tiles: {
      ground: TILE.GRASS,
      wet: TILE.MUD,
      obstacle: TILE.TREE,
      accent: TILE.FLOWER,
      water: TILE.WATER,
      deep: TILE.DEEP_WATER
    },
    colors: {
      ground: '#1e5a1e',
      wet: '#3a2e0b',
      accent: '#2a6e1a'
    },
    noiseScale: { elev: 5, moist: 8, detail: 18 },
    treeDensity: 0.35,
    waterDensity: 0.15,
    hazards: ['swamp'],
    speedMod: { mud: 0.5 }
  },

  desert: {
    name: '干旱沙漠',
    tiles: {
      ground: TILE.SAND,
      wet: TILE.LAVA_ROCK,
      obstacle: TILE.CACTUS,
      accent: TILE.ROCK,
      water: TILE.SAND,
      deep: TILE.LAVA_ROCK
    },
    colors: {
      ground: '#c4a44a',
      wet: '#b89030',
      accent: '#d4b45a'
    },
    noiseScale: { elev: 4, moist: 5, detail: 12 },
    treeDensity: 0.05,
    waterDensity: 0.02,
    hazards: ['heat'],
    speedMod: { sand: 0.85 }
  },

  tundra: {
    name: '冰封苔原',
    tiles: {
      ground: TILE.SNOW,
      wet: TILE.ICE,
      obstacle: TILE.ROCK,
      accent: TILE.SNOW,
      water: TILE.ICE,
      deep: TILE.DEEP_WATER
    },
    colors: {
      ground: '#e8e8f0',
      wet: '#b0d4f1',
      accent: '#d0d8e8'
    },
    noiseScale: { elev: 4, moist: 6, detail: 10 },
    treeDensity: 0.03,
    waterDensity: 0.12,
    hazards: ['blizzard'],
    speedMod: { snow: 0.6, ice: 1.3 }
  },

  deep_sea: {
    name: '海洋深处',
    tiles: {
      ground: TILE.WATER,
      wet: TILE.DEEP_WATER,
      obstacle: TILE.CORAL,
      accent: TILE.CORAL,
      water: TILE.DEEP_WATER,
      deep: TILE.DEEP_WATER
    },
    colors: {
      ground: '#1a5a7a',
      wet: '#0d3f5b',
      accent: '#2a6a8a'
    },
    noiseScale: { elev: 6, moist: 7, detail: 14 },
    treeDensity: 0.08,
    waterDensity: 0.40,
    hazards: ['pressure'],
    speedMod: { water: 0.5 }
  }
};
