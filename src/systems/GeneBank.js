// ─── GeneBank.js ─── Persistent gene unlock system ───
import { GENE_ITEMS } from '../data/genebank.js';

export class GeneBank {
  constructor(game) {
    this.game = game;
    this.owned = new Set();     // IDs of purchased genes
    this.equipped = new Set();  // IDs of equipped genes (applied at game start)
    this.maxSlots = 1;          // Start with 1 slot
  }

  getAll() {
    return GENE_ITEMS;
  }

  getOwned() {
    return GENE_ITEMS.filter(g => this.owned.has(g.id));
  }

  canBuy(geneId) {
    const gene = GENE_ITEMS.find(g => g.id === geneId);
    if (!gene) return false;
    if (this.owned.has(geneId)) return false;
    if (gene.requires && !this.owned.has(gene.requires)) return false;
    return this.game.economy && this.game.economy.ep >= gene.cost;
  }

  buy(geneId) {
    if (!this.canBuy(geneId)) return false;
    const gene = GENE_ITEMS.find(g => g.id === geneId);
    if (!gene) return false;

    this.game.economy.spend(gene.cost);
    this.owned.add(geneId);

    // Update max slots
    if (gene.effect.extraSlots) {
      this.maxSlots = Math.max(this.maxSlots, gene.effect.extraSlots + 1);
    }

    return true;
  }

  equip(geneId) {
    if (!this.owned.has(geneId)) return false;
    if (this.equipped.size >= this.maxSlots) return false;
    this.equipped.add(geneId);
    return true;
  }

  unequip(geneId) {
    this.equipped.delete(geneId);
  }

  // Apply equipped genes to player at game start
  applyToPlayer(player) {
    for (const geneId of this.equipped) {
      const gene = GENE_ITEMS.find(g => g.id === geneId);
      if (!gene) continue;
      const eff = gene.effect;

      if (eff.bonusHp) { player.bonusHp += eff.bonusHp; player.maxHp += eff.bonusHp; player.hp += eff.bonusHp; }
      if (eff.bonusDef) player.bonusDef += eff.bonusDef;
      if (eff.bonusSpd) player.bonusSpd += eff.bonusSpd;
      if (eff.trait) player.traits.push(eff.trait);
    }

    // Apply all owned passive effects (non-equippable)
    for (const geneId of this.owned) {
      const gene = GENE_ITEMS.find(g => g.id === geneId);
      if (!gene) continue;
      const eff = gene.effect;
      if (eff.trait && !player.traits.includes(eff.trait)) {
        player.traits.push(eff.trait);
      }
    }
  }

  // Render gene bank UI
  renderUI(container) {
    container.innerHTML = '';
    for (const gene of GENE_ITEMS) {
      const card = document.createElement('div');
      const isOwned = this.owned.has(gene.id);
      const canBuy = this.canBuy(gene.id);

      card.className = `gene-card ${isOwned ? 'owned' : ''} ${!canBuy && !isOwned ? 'locked' : ''}`;
      card.innerHTML = `
        <div class="gene-name">${gene.name}</div>
        <div class="gene-desc">${gene.desc}</div>
        <div class="gene-cost">${isOwned ? '已拥有' : gene.cost + ' EP'}</div>
      `;

      if (!isOwned && canBuy) {
        card.addEventListener('click', () => {
          if (this.buy(gene.id)) {
            this.renderUI(container);
            const epDisplay = document.getElementById('ep-display');
            if (epDisplay && this.game.economy) {
              epDisplay.textContent = `EP: ${this.game.economy.ep}`;
            }
          }
        });
      }

      container.appendChild(card);
    }
  }

  serialize() {
    return {
      owned: [...this.owned],
      equipped: [...this.equipped],
      maxSlots: this.maxSlots
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.owned) this.owned = new Set(data.owned);
    if (data.equipped) this.equipped = new Set(data.equipped);
    if (data.maxSlots) this.maxSlots = data.maxSlots;
  }
}
