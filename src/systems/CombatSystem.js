import { CONFIG } from '../config.js';
import { Pickup } from '../entities/Pickup.js';

export class CombatSystem {
  constructor(game) {
    this.game = game;
    this.bossKills = 0;
  }

  update(dt) {
    // Poison ticks on all entities
    for (const e of [this.game.player, ...this.game.getCreatures()]) {
      if (e.poisonTimer > 0) {
        e.poisonTimer -= dt;
        e.hp -= (e.poisonDmg || 2) * dt;
        if (e.hp <= 0) { e.hp = 0; e.die(); if (e !== this.game.player) this._onKill(e); }
      }
      // Slow decay
      if (e.slowTimer > 0) {
        e.slowTimer -= dt;
        if (e.slowTimer <= 0 && e._origSpd) { e.speed = e._origSpd; e._origSpd = null; }
      }
    }
  }

  playerAttack(player) {
    for (const c of this.game.getCreatures()) {
      if (c.dead) continue;
      const d = player.distTo(c);
      if (d > player.attackRange + c.radius) continue;
      let diff = player.angleTo(c) - player.attackAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) <= player.attackArc / 2) {
        const dmg = c.takeDamage(player.getEffAtk(), player.x, player.y);
        if (dmg > 0) {
          this.game.particleSystem.emit(c.x, c.y, '#ff0', 6);
          this.game.particleSystem.addText(c.x, c.y - 10, dmg);
          this.game.audio.playSfx('hit');
          if (c.dead) this._onKill(c);
        }
      }
    }
  }

  creatureAttack(creature, target, customDmg) {
    const rawDmg = customDmg !== undefined ? customDmg : creature.atk;
    const dmg = target.takeDamage(rawDmg, creature.x, creature.y);
    if (dmg > 0) {
      this.game.particleSystem.emit(target.x, target.y, '#f44', 4);
      this.game.particleSystem.addText(target.x, target.y - 10, dmg);
      this.game.camera.shake(3, 100);
      this.game.audio.playSfx('hurt');
      target.invincible = CONFIG.IFRAMES / 60;
    }
  }

  devour(player, target) {
    if (target.dead) return;
    target.dead = true;
    // Heal from devour
    player.heal(target.maxHp * 0.3);
    this.game.particleSystem.emit(target.x, target.y, target.color, 15);
    this.game.camera.shake(4, 150);
    this.game.audio.playSfx('devour');

    // Award evo points based on tier (same as kill)
    const tier = target.tier || 1;
    let evoAward = 0;
    if (tier <= 1) evoAward = 1;
    else if (tier <= 2) evoAward = 1;
    else evoAward = 2;

    if (evoAward > 0) {
      player.evoPoints += evoAward;
      this.game.particleSystem.addText(player.x, player.y - 35, '+' + evoAward + '进化点', '#f5f');
    }

    // Drop meat
    this._dropMeat(target);

    // Notify progress timeline
    if (this.game.progressTimeline) {
      this.game.progressTimeline.onKill();
    }

    // Achievement & codex tracking for devour
    if (this.game.achievements) this.game.achievements.onDevour();
    if (this.game.codex && (target.type || target.creatureType)) {
      this.game.codex.discoverCreature(target.type || target.creatureType);
    }
    // Hidden evolution kill tracking
    if (this.game.hiddenEvo) this.game.hiddenEvo.onKill();
    if (target.isBoss) {
      this.bossKills++;
    }
  }

  _onKill(c) {
    // Drop meat instead of XP
    this._dropMeat(c);

    // 20% chance heal drop
    if (Math.random() < 0.2) {
      this.game.addPickup(new Pickup(
        c.x + (Math.random() - 0.5) * 20,
        c.y + (Math.random() - 0.5) * 20,
        'heal', 15
      ));
    }

    // Award evo points directly for the kill
    const tier = c.tier || 1;
    let evoAward = 0;
    if (tier <= 1) evoAward = 1;
    else if (tier <= 2) evoAward = 1;
    else evoAward = 2;

    if (evoAward > 0 && this.game.player) {
      this.game.player.evoPoints += evoAward;
      this.game.particleSystem.addText(
        this.game.player.x, this.game.player.y - 35,
        '+' + evoAward + '进化点', '#f5f'
      );
    }

    // Notify progress timeline
    if (this.game.progressTimeline) {
      this.game.progressTimeline.onKill();
    }

    this.game.particleSystem.emit(c.x, c.y, c.color, 10);
    // Record death location for scavenger AI
    if (this.game.ai && this.game.ai.recordDeath) {
      this.game.ai.recordDeath(c.x, c.y);
    }
    // Codex: discover creature type
    if (this.game.codex && (c.type || c.creatureType)) {
      this.game.codex.discoverCreature(c.type || c.creatureType);
    }

    // Achievement tracking
    if (this.game.achievements) {
      this.game.achievements.onKill();
      if (c.isBoss) {
        this.game.achievements.onBossKilled(c.type || c.creatureType || 'boss');
      }
    }

    // Hidden evolution kill tracking
    if (this.game.hiddenEvo) this.game.hiddenEvo.onKill();

    if (c.isBoss) {
      this.bossKills++;
    }
  }

  _dropMeat(c) {
    const tier = c.tier || 1;
    let meatCount;
    if (c.isBoss) {
      meatCount = 5;
    } else if (tier >= 3) {
      meatCount = 2 + Math.floor(Math.random() * 2); // 2-3
    } else if (tier >= 2) {
      meatCount = 1 + Math.floor(Math.random() * 2); // 1-2
    } else {
      meatCount = 1;
    }

    for (let i = 0; i < meatCount; i++) {
      this.game.addPickup(new Pickup(
        c.x + (Math.random() - 0.5) * 30,
        c.y + (Math.random() - 0.5) * 30,
        'meat', CONFIG.MEAT_XP, CONFIG.MEAT_EVO_POINTS
      ));
    }
  }

  _checkVictory() {
    // Victory now handled by ProgressTimeline when all 4 boss nodes defeated
    // No-op — kept for compatibility
  }
}
