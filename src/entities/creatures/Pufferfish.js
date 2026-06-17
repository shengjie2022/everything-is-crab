import { Creature } from '../Creature.js';
import { AI } from '../../constants.js';

export class Pufferfish extends Creature {
  constructor(x, y, data = {}) {
    super(x, y, {
      name: '河豚', tier: 2, hp: 35, atk: 5, def: 3, spd: 45,
      xp: 30, size: 12, aggro: 60, range: 20, diet: 'passive',
      color: '#ffb74d', water: true, isBoss: false,
      tiles: null, type: 'pufferfish', ...data
    });
    this.isPuffed = false;
    this.puffTimer = 0;
    this.baseDef = this.def;
    this.baseRadius = this.radius;
  }

  updateAI(dt, game) {
    const player = game.player;
    if (!player || player.dead) {
      this._deflate();
      this.aiState = AI.WANDER;
      return;
    }

    const dist = this.distTo(player);

    // Puff timer
    if (this.isPuffed) {
      this.puffTimer -= dt;
      if (this.puffTimer <= 0) {
        this._deflate();
      }
    }

    // Puff up when threatened
    if (dist < 50 && !this.isPuffed) {
      this._inflate();
    }

    // Flee while puffed
    if (this.isPuffed) {
      this.aiState = AI.FLEE;
      this.target = player;
      return;
    }

    this.aiState = AI.WANDER;
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.wanderTimer = 3 + Math.random() * 3;
    }
  }

  _inflate() {
    this.isPuffed = true;
    this.puffTimer = 3;
    this.def = this.baseDef * 4;
    this.radius = this.baseRadius * 1.5;
    this.atk = 12; // Spine damage when puffed
  }

  _deflate() {
    this.isPuffed = false;
    this.def = this.baseDef;
    this.radius = this.baseRadius;
    this.atk = 5;
  }

  // Contact spine damage when puffed
  update(dt, game) {
    super.update(dt, game);
    if (this.dead || !this.isPuffed) return;

    const player = game.player;
    if (!player || player.dead) return;

    const dist = this.distTo(player);
    if (dist < this.radius + (player.radius || 12) + 5) {
      if (this.atkCD <= 0) {
        game.combat.creatureAttack(this, player);
        this.atkCD = 1.0;
      }
    }
  }

  performAttack() {
    // Handled by contact
  }
}
