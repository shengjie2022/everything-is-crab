// ─── SandboxPanel.js ─── Sandbox mode controls ───
import { CREATURES } from '../data/creatures.js';

export class SandboxPanel {
  constructor(game) {
    this.game = game;
    this.timescale = 1.0;
    this.godmode = false;
    this._bindControls();
  }

  _bindControls() {
    // Populate creature dropdown
    const select = document.getElementById('sandbox-creature-type');
    if (select) {
      for (const [type, data] of Object.entries(CREATURES)) {
        if (data.isBoss) continue;
        const opt = document.createElement('option');
        opt.value = type;
        opt.textContent = `${data.name} (T${data.tier})`;
        select.appendChild(opt);
      }
    }

    // Spawn button
    const btnSpawn = document.getElementById('btn-sandbox-spawn');
    if (btnSpawn) {
      btnSpawn.addEventListener('click', () => this._spawnCreatures());
    }

    // Timescale slider
    const slider = document.getElementById('sandbox-timescale');
    const valDisplay = document.getElementById('sandbox-timescale-val');
    if (slider) {
      slider.addEventListener('input', () => {
        this.timescale = parseFloat(slider.value);
        if (valDisplay) valDisplay.textContent = `${this.timescale.toFixed(1)}x`;
      });
    }

    // God mode checkbox
    const godCheck = document.getElementById('sandbox-godmode');
    if (godCheck) {
      godCheck.addEventListener('change', () => {
        this.godmode = godCheck.checked;
      });
    }
  }

  _spawnCreatures() {
    const select = document.getElementById('sandbox-creature-type');
    const countEl = document.getElementById('sandbox-creature-count');
    if (!select || !countEl) return;

    const type = select.value;
    const count = parseInt(countEl.value) || 1;

    for (let i = 0; i < Math.min(count, 10); i++) {
      if (this.game.spawn) {
        this.game.spawn._spawnCreature(type);
      }
    }
  }

  update(dt) {
    if (this.game.mode !== 'sandbox') return;

    // Apply godmode
    if (this.godmode && this.game.player) {
      this.game.player.hp = this.game.player.maxHp;
      this.game.player.invincible = 10;
    }
  }

  getTimescale() {
    return this.timescale;
  }
}
