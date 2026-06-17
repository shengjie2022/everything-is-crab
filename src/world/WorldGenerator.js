import { CONFIG } from '../config.js';
import { TILE, BIOME } from '../constants.js';
import { Noise } from '../utils.js';
import { BIOME_DATA } from '../data/biomes.js';

export class WorldGenerator {
  constructor(seed) { this.seed = seed || Math.random() * 65536; }

  generate() {
    const { MAP_COLS: C, MAP_ROWS: R } = CONFIG;
    const tiles = new Uint8Array(C * R);
    const decos = new Uint8Array(C * R);
    const biomeMap = new Uint8Array(C * R); // 0=rainforest,1=desert,2=tundra,3=deep_sea

    const elev  = new Noise(this.seed);
    const moist = new Noise(this.seed + 1000);
    const det   = new Noise(this.seed + 2000);
    const blend = new Noise(this.seed + 3000);

    const midC = C / 2;
    const midR = R / 2;

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const nx = c / C, ny = r / R;

        // Determine biome based on quadrant + noise blending for smooth borders
        const biomeId = this._getBiome(c, r, C, R, midC, midR, blend);
        const i = r * C + c;
        biomeMap[i] = biomeId;

        // Per-biome tile generation
        const e = (elev.oct(nx * 5, ny * 5, 4, 0.5) + 1) / 2;
        const m = (moist.oct(nx * 7, ny * 7, 3, 0.5) + 1) / 2;
        const d = (det.oct(nx * 18, ny * 18, 2, 0.4) + 1) / 2;

        // Edge falloff — create ocean border
        const edgeX = Math.min(c, C - 1 - c) / (C * 0.08);
        const edgeY = Math.min(r, R - 1 - r) / (R * 0.08);
        const edgeFactor = Math.min(1, Math.min(edgeX, edgeY));

        const tile = this._biomeToTile(biomeId, e * edgeFactor, m, d, c, r);
        tiles[i] = tile;

        // Decorations
        decos[i] = this._decoration(biomeId, tile, d, c, r);
      }
    }

    // Safe spawn center — guaranteed walkable grass
    const cx = C >> 1, cy = R >> 1;
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const i = (cy + dy) * C + (cx + dx);
        if (i >= 0 && i < tiles.length) {
          tiles[i] = TILE.GRASS;
          decos[i] = 0;
          biomeMap[i] = 0;
        }
      }
    }

    // Biome-specific features
    this._addRainforestPonds(tiles, decos, C, R);
    this._addDesertOasis(tiles, decos, C, R);
    this._addTundraIceLakes(tiles, decos, C, R);
    this._addDeepSeaCoralReefs(tiles, decos, C, R);

    return { tiles, decos, biomeMap, cols: C, rows: R };
  }

  _getBiome(c, r, C, R, midC, midR, blendNoise) {
    // Noise offset for boundary blending
    const blendVal = blendNoise.oct(c / C * 4, r / R * 4, 2, 0.5) * 6;
    const adjustedC = c + blendVal;
    const adjustedR = r + blendVal;

    // Quadrant assignment:
    // top-left: rainforest(0), top-right: desert(1)
    // bottom-left: tundra(2), bottom-right: deep_sea(3)
    if (adjustedC < midC) {
      return adjustedR < midR ? 0 : 2;
    } else {
      return adjustedR < midR ? 1 : 3;
    }
  }

  _biomeToTile(biomeId, e, m, d, c, r) {
    // Edge falloff — deep water border
    if (e < 0.15) return TILE.DEEP_WATER;
    if (e < 0.22) return TILE.WATER;

    switch (biomeId) {
      case 0: return this._rainforestTile(e, m, d);
      case 1: return this._desertTile(e, m, d);
      case 2: return this._tundraTile(e, m, d);
      case 3: return this._deepSeaTile(e, m, d);
      default: return TILE.GRASS;
    }
  }

  _rainforestTile(e, m, d) {
    if (e < 0.30) return TILE.SAND;
    if (e < 0.35) return m > 0.5 ? TILE.MUD : TILE.SAND;
    if (e < 0.75) {
      if (m > 0.65 && d > 0.15) return TILE.MUD;
      if (d > 0.55 && e > 0.55) return TILE.TREE;
      if (d > 0.3 && m > 0.55) return TILE.FLOWER;
      return TILE.GRASS;
    }
    if (e < 0.85) return d > 0.40 ? TILE.TREE : TILE.GRASS;
    return TILE.ROCK;
  }

  _desertTile(e, m, d) {
    if (e < 0.30) return TILE.SAND;
    if (e < 0.40) return TILE.SAND;
    if (e < 0.80) {
      if (d > 0.80) return TILE.CACTUS;
      if (d > 0.65 && e > 0.70) return TILE.ROCK;
      if (m > 0.8) return TILE.LAVA_ROCK;
      return TILE.SAND;
    }
    if (e < 0.90) return TILE.ROCK;
    return TILE.ROCK;
  }

  _tundraTile(e, m, d) {
    if (e < 0.28) return TILE.ICE;
    if (e < 0.35) return TILE.ICE;
    if (e < 0.75) {
      if (d > 0.70 && e > 0.60) return TILE.ROCK;
      if (m > 0.7) return TILE.ICE;
      return TILE.SNOW;
    }
    if (e < 0.85) return d > 0.45 ? TILE.ROCK : TILE.SNOW;
    return TILE.ROCK;
  }

  _deepSeaTile(e, m, d) {
    if (e < 0.35) return TILE.DEEP_WATER;
    if (e < 0.50) return TILE.WATER;
    if (e < 0.70) {
      if (d > 0.60) return TILE.CORAL;
      return TILE.WATER;
    }
    if (e < 0.85) return d > 0.55 ? TILE.CORAL : TILE.WATER;
    return TILE.ROCK;
  }

  _decoration(biomeId, tile, d, c, r) {
    switch (biomeId) {
      case 0: // rainforest
        if (tile === TILE.GRASS && Math.random() < 0.15) return Math.random() < 0.7 ? 1 : 3;
        if (tile === TILE.FLOWER && Math.random() < 0.3) return 3;
        if (tile === TILE.MUD && Math.random() < 0.08) return 4; // vine
        return 0;
      case 1: // desert
        if (tile === TILE.SAND && Math.random() < 0.06) return 5; // desert rock
        if (tile === TILE.SAND && Math.random() < 0.03) return 6; // bones
        return 0;
      case 2: // tundra
        if (tile === TILE.SNOW && Math.random() < 0.05) return 7; // ice crystal
        if (tile === TILE.ICE && Math.random() < 0.03) return 8; // frost pattern
        return 0;
      case 3: // deep_sea
        if (tile === TILE.WATER && Math.random() < 0.08) return 9; // seaweed
        if (tile === TILE.CORAL && Math.random() < 0.15) return 10; // coral detail
        return 0;
    }
    return 0;
  }

  _addRainforestPonds(tiles, decos, C, R) {
    // Add ponds in top-left quadrant
    for (let p = 0; p < 4; p++) {
      const px = 8 + Math.floor(Math.random() * (C / 2 - 16));
      const py = 8 + Math.floor(Math.random() * (R / 2 - 16));
      const sz = 3 + Math.floor(Math.random() * 3);
      for (let dy = -sz; dy <= sz; dy++) {
        for (let dx = -sz; dx <= sz; dx++) {
          if (Math.hypot(dx, dy) <= sz) {
            const cc = px + dx, rr = py + dy;
            if (cc >= 1 && cc < C - 1 && rr >= 1 && rr < R - 1) {
              tiles[rr * C + cc] = Math.hypot(dx, dy) < sz * 0.5 ? TILE.WATER : TILE.MUD;
            }
          }
        }
      }
    }
  }

  _addDesertOasis(tiles, decos, C, R) {
    // Add oases in top-right quadrant
    for (let p = 0; p < 2; p++) {
      const px = C / 2 + 8 + Math.floor(Math.random() * (C / 2 - 16));
      const py = 8 + Math.floor(Math.random() * (R / 2 - 16));
      const sz = 2 + Math.floor(Math.random() * 2);
      for (let dy = -sz - 1; dy <= sz + 1; dy++) {
        for (let dx = -sz - 1; dx <= sz + 1; dx++) {
          const cc = px + dx, rr = py + dy;
          if (cc >= 1 && cc < C - 1 && rr >= 1 && rr < R - 1) {
            const dist = Math.hypot(dx, dy);
            if (dist < sz * 0.6) {
              tiles[rr * C + cc] = TILE.WATER;
            } else if (dist <= sz + 1) {
              tiles[rr * C + cc] = TILE.GRASS;
              if (Math.random() < 0.3) decos[rr * C + cc] = 3;
            }
          }
        }
      }
    }
  }

  _addTundraIceLakes(tiles, decos, C, R) {
    // Add frozen lakes in bottom-left quadrant
    for (let p = 0; p < 3; p++) {
      const px = 8 + Math.floor(Math.random() * (C / 2 - 16));
      const py = R / 2 + 8 + Math.floor(Math.random() * (R / 2 - 16));
      const sz = 3 + Math.floor(Math.random() * 4);
      for (let dy = -sz; dy <= sz; dy++) {
        for (let dx = -sz; dx <= sz; dx++) {
          if (Math.hypot(dx, dy) <= sz) {
            const cc = px + dx, rr = py + dy;
            if (cc >= 1 && cc < C - 1 && rr >= 1 && rr < R - 1) {
              tiles[rr * C + cc] = TILE.ICE;
            }
          }
        }
      }
    }
  }

  _addDeepSeaCoralReefs(tiles, decos, C, R) {
    // Add coral reef clusters in bottom-right quadrant
    for (let p = 0; p < 5; p++) {
      const px = C / 2 + 8 + Math.floor(Math.random() * (C / 2 - 16));
      const py = R / 2 + 8 + Math.floor(Math.random() * (R / 2 - 16));
      const sz = 2 + Math.floor(Math.random() * 3);
      for (let dy = -sz; dy <= sz; dy++) {
        for (let dx = -sz; dx <= sz; dx++) {
          if (Math.hypot(dx, dy) <= sz && Math.random() < 0.6) {
            const cc = px + dx, rr = py + dy;
            if (cc >= 1 && cc < C - 1 && rr >= 1 && rr < R - 1) {
              tiles[rr * C + cc] = TILE.CORAL;
              if (Math.random() < 0.3) decos[rr * C + cc] = 10;
            }
          }
        }
      }
    }
  }
}
