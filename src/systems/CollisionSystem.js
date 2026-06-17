import { CONFIG } from '../config.js';

export class CollisionSystem {
  constructor() {
    this.cellSize = CONFIG.COLLISION_CELL;
    this.grid = new Map();
  }

  _key(cx, cy) {
    return cx + ',' + cy;
  }

  _cellCoords(x, y) {
    return {
      cx: Math.floor(x / this.cellSize),
      cy: Math.floor(y / this.cellSize)
    };
  }

  clear() {
    this.grid.clear();
  }

  insert(entity) {
    const { cx, cy } = this._cellCoords(entity.x, entity.y);
    const key = this._key(cx, cy);
    if (!this.grid.has(key)) this.grid.set(key, []);
    this.grid.get(key).push(entity);
  }

  _getNearby(entity) {
    const { cx, cy } = this._cellCoords(entity.x, entity.y);
    const nearby = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = this._key(cx + dx, cy + dy);
        const cell = this.grid.get(key);
        if (cell) {
          for (const other of cell) {
            if (other !== entity) nearby.push(other);
          }
        }
      }
    }
    return nearby;
  }

  queryRadius(x, y, r) {
    const results = [];
    const minCx = Math.floor((x - r) / this.cellSize);
    const maxCx = Math.floor((x + r) / this.cellSize);
    const minCy = Math.floor((y - r) / this.cellSize);
    const maxCy = Math.floor((y + r) / this.cellSize);
    const r2 = r * r;

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const cell = this.grid.get(this._key(cx, cy));
        if (!cell) continue;
        for (const e of cell) {
          if (e.dead) continue;
          const dx = e.x - x;
          const dy = e.y - y;
          if (dx * dx + dy * dy <= (r + (e.radius || 0)) * (r + (e.radius || 0))) {
            results.push(e);
          }
        }
      }
    }
    return results;
  }

  update(game) {
    this.clear();

    const player = game.player;
    const creatures = game.getCreatures();
    const allEntities = [player, ...creatures];

    // Insert all living entities into the grid
    for (const e of allEntities) {
      if (!e.dead) this.insert(e);
    }

    // Resolve overlaps between entities by pushing them apart
    for (const e of allEntities) {
      if (e.dead) continue;
      const nearby = this._getNearby(e);
      for (const other of nearby) {
        if (other.dead) continue;
        const dx = other.x - e.x;
        const dy = other.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const minDist = (e.radius || 10) + (other.radius || 10);

        if (dist < minDist) {
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          e.x -= nx * overlap;
          e.y -= ny * overlap;
          other.x += nx * overlap;
          other.y += ny * overlap;
        }
      }
    }

    // Clamp all entities to world bounds
    for (const e of allEntities) {
      if (e.dead) continue;
      const r = e.radius || 10;
      e.x = Math.max(r, Math.min(CONFIG.WORLD_WIDTH - r, e.x));
      e.y = Math.max(r, Math.min(CONFIG.WORLD_HEIGHT - r, e.y));
    }
  }
}
