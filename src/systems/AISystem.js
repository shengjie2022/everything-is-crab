import { AI } from '../constants.js';
import { ECOLOGY_MAP, SCAVENGERS, SYMBIOSIS_RANGE, SYMBIOSIS_HEAL_RATE, SYMBIOSIS_SPEED_BONUS } from '../data/ecology.js';

export class AISystem {
  constructor(game) {
    this.game = game;
    this.ecologyTimer = 0;
    this.deathLocations = []; // Track recent death locations for scavengers
  }

  update(dt) {
    const player = this.game.player;
    const creatures = this.game.getCreatures();

    for (const c of creatures) {
      if (c.dead) continue;

      // Run creature's own AI update if it has one
      if (typeof c.aiUpdate === 'function') {
        c.aiUpdate(dt, player, this.game);
      }
    }

    // Ecology interactions (check periodically to save performance)
    this.ecologyTimer += dt;
    if (this.ecologyTimer >= 0.5) {
      this.ecologyTimer = 0;
      this._processEcology(creatures, dt * 10); // compensate for interval
    }

    // Clean old death locations
    this.deathLocations = this.deathLocations.filter(d => d.age < 30);
    for (const d of this.deathLocations) d.age += dt;
  }

  recordDeath(x, y) {
    this.deathLocations.push({ x, y, age: 0 });
  }

  _processEcology(creatures, dt) {
    for (const c of creatures) {
      if (c.dead || c.isBoss) continue;

      const cType = c.type || c.creatureType || '';
      const relations = ECOLOGY_MAP[cType];

      // Inter-creature ecology
      if (relations) {
        for (const other of creatures) {
          if (other === c || other.dead) continue;
          const oType = other.type || other.creatureType || '';
          const rel = relations[oType];
          if (!rel) continue;

          const dist = c.distTo(other);

          switch (rel) {
            case 'predator':
              // Hunt prey if in aggro range and not already targeting player
              if (dist < (c.aggro || 150) && (!c.target || c.target === other || c.target.dead)) {
                c.target = other;
                c.aiState = AI.HUNT;
              }
              break;

            case 'competition':
              // Fight competitors in close range
              if (dist < 60 && Math.random() < 0.05) {
                c.target = other;
                c.aiState = AI.ATTACK;
              }
              break;

            case 'symbiosis':
              // Heal when near symbiotic partner
              if (dist < SYMBIOSIS_RANGE) {
                c.heal(SYMBIOSIS_HEAL_RATE * dt);
                other.heal(SYMBIOSIS_HEAL_RATE * dt);
              }
              break;

            case 'parasite':
              // Drain HP from host
              if (dist < 30) {
                const drain = 1 * dt;
                other.hp -= drain;
                c.heal(drain);
                if (other.hp <= 0) { other.hp = 0; other.die(); }
              }
              break;
          }
        }
      }

      // Scavenger behavior — move toward death locations
      if (SCAVENGERS.includes(cType) && this.deathLocations.length > 0) {
        if (c.aiState === AI.WANDER || !c.target || c.target.dead) {
          let closest = null;
          let closestDist = 300;
          for (const d of this.deathLocations) {
            const dist = Math.hypot(c.x - d.x, c.y - d.y);
            if (dist < closestDist) {
              closestDist = dist;
              closest = d;
            }
          }
          if (closest) {
            c.facing = Math.atan2(closest.y - c.y, closest.x - c.x);
            c.aiState = AI.WANDER; // Move in that direction via facing
          }
        }
      }

      // Random inter-creature hunting for carnivores (legacy behavior)
      if (Math.random() < 0.005) {
        if ((c.diet === 'carni' || c.diet === 'omni') && !relations) {
          this._huntLowerTier(c, creatures);
        }
      }
    }
  }

  _huntLowerTier(predator, creatures) {
    let closest = null;
    let closestDist = predator.aggro || 200;

    for (const prey of creatures) {
      if (prey === predator || prey.dead) continue;
      if (prey.tier >= predator.tier) continue;

      const dist = predator.distTo(prey);
      if (dist < closestDist) {
        closestDist = dist;
        closest = prey;
      }
    }

    if (closest) {
      predator.target = closest;
      predator.aiState = AI.HUNT;
    }
  }
}
