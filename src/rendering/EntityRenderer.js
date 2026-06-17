// ============================================================
//  EntityRenderer.js  --  Entities: sort, draw, overlays
// ============================================================
import { CreatureSprites } from './CreatureSprites.js';
import { TraitVisuals } from './TraitVisuals.js';

const TWO_PI = Math.PI * 2;

export const EntityRenderer = {

    drawAll(ctx, camera, entities) {
        if (!entities || entities.length === 0) return;

        // Filter visible + alive, then Y-sort
        const visible = [];
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            if (!e || e.dead) continue;
            if (!camera.visible(e.x, e.y)) continue;
            visible.push(e);
        }
        visible.sort((a, b) => a.y - b.y);

        for (let i = 0; i < visible.length; i++) {
            this._drawEntity(ctx, visible[i]);
        }
    },

    // ----------------------------------------------------------
    _drawEntity(ctx, e) {
        const r = e.radius || 12;

        // ---- Jump shadow ----
        if (e.isJumping) {
            const shadowScale = 1 - (e.jumpH || 0) / 60;
            ctx.globalAlpha = 0.25 * shadowScale;
            ctx.beginPath();
            ctx.ellipse(e.x, e.y + r * 0.7, r * 0.9 * shadowScale, r * 0.35 * shadowScale, 0, 0, TWO_PI);
            ctx.fillStyle = '#000';
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // ---- Translate to entity position (lifted by jump) ----
        ctx.save();
        const jumpOff = e.isJumping ? -(e.jumpH || 0) : 0;
        ctx.translate(e.x, e.y + jumpOff);

        // ---- HP-based visual scale (shrink as HP drops) ----
        if (e.hp !== undefined && e.maxHp > 0) {
            const hpPct = Math.max(0, e.hp / e.maxHp);
            const scale = 0.6 + 0.4 * hpPct;
            ctx.scale(scale, scale);
        }

        // ---- Creature sprite ----
        CreatureSprites.draw(ctx, e);

        // ---- Trait overlays (drawn on top of base sprite) ----
        if (e.traits && e.traits.length > 0) {
            TraitVisuals.draw(ctx, e);
        }

        // ---- Flash overlay (white) when hit ----
        if (e.flash && e.flash > 0) {
            ctx.globalCompositeOperation = 'source-atop';
            ctx.globalAlpha = Math.min(e.flash, 1);
            ctx.beginPath();
            ctx.arc(0, 0, r + 4, 0, TWO_PI);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        }

        ctx.restore();

        // ---- Attack arc ----
        if (e.isAttacking && e.attackAngle !== undefined) {
            this._drawAttackArc(ctx, e);
        }

        // ---- Devour indicator ----
        if (e.isDevour) {
            this._drawDevourIndicator(ctx, e);
        }

        // ---- HP bar (only if damaged) ----
        if (e.hp !== undefined && e.maxHp !== undefined && e.hp < e.maxHp) {
            this._drawHPBar(ctx, e);
        }

        // ---- Boss name ----
        if (e.isBoss && e.name) {
            this._drawBossName(ctx, e);
        }
    },

    // ----------------------------------------------------------
    _drawAttackArc(ctx, e) {
        const range = e.attackRange || 40;
        const arc   = e.attackArc   || Math.PI * 0.5;
        const start = e.attackAngle - arc * 0.5;
        const end   = e.attackAngle + arc * 0.5;

        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
        ctx.arc(e.x, e.y, range, start, end);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    },

    // ----------------------------------------------------------
    _drawDevourIndicator(ctx, e) {
        const t  = performance.now() / 1000;
        const r  = (e.radius || 12) + 8 + Math.sin(t * 8) * 3;
        ctx.save();
        ctx.globalAlpha = 0.5 + Math.sin(t * 6) * 0.2;
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, TWO_PI);
        ctx.strokeStyle = '#f44';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    },

    // ----------------------------------------------------------
    _drawHPBar(ctx, e) {
        const r   = e.radius || 12;
        const w   = r * 2.4;
        const h   = 4;
        const bx  = e.x - w * 0.5;
        const by  = e.y - r - 14;
        const pct = Math.max(0, e.hp / e.maxHp);

        // Background
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(bx - 1, by - 1, w + 2, h + 2);

        // Fill (green→yellow→red)
        let col;
        if (pct > 0.5)      col = `rgb(${((1 - pct) * 2 * 255) | 0},255,0)`;
        else                 col = `rgb(255,${(pct * 2 * 255) | 0},0)`;
        ctx.fillStyle = col;
        ctx.fillRect(bx, by, w * pct, h);
    },

    // ----------------------------------------------------------
    _drawBossName(ctx, e) {
        const r = e.radius || 12;
        ctx.save();
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#000';
        ctx.fillText(e.name, e.x + 1, e.y - r - 21);
        ctx.fillStyle = '#ffd700';
        ctx.fillText(e.name, e.x, e.y - r - 22);
        ctx.restore();
    }
};
