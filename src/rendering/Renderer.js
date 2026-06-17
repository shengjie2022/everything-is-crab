// ============================================================
//  Renderer.js  --  Main rendering orchestrator
// ============================================================
import { BackgroundRenderer } from './BackgroundRenderer.js';
import { EntityRenderer }     from './EntityRenderer.js';
import { EffectRenderer }     from './EffectRenderer.js';
import { LightingRenderer }   from './LightingRenderer.js';

export class Renderer {
    constructor(game) {
        this.game = game;
    }

    render() {
        const g   = this.game;
        const ctx = g.ctx;
        const cam = g.camera;

        // ---- 1. Clear & set up world transform ----
        ctx.clearRect(0, 0, 960, 640);
        ctx.save();
        ctx.translate(-cam.x + cam.sx, -cam.y + cam.sy);

        // ---- 2. Tiles / background ----
        BackgroundRenderer.draw(ctx, cam, g.tileMap);

        // ---- 3. Pickups (bob + glow circles) ----
        this._drawPickups(ctx, cam, g.pickups);

        // ---- 4. Entities (Y-sorted) ----
        EntityRenderer.drawAll(ctx, cam, g.entities);

        // ---- 5. Projectiles (circles + trail) ----
        this._drawProjectiles(ctx, cam, g.projectiles);

        // ---- 6. Particles & floating texts ----
        EffectRenderer.draw(ctx, cam, g.particleSystem);

        // ---- 7. Restore world transform ----
        ctx.restore();

        // ---- 8. Lighting overlay (screen-space) ----
        // Disabled: dayNight is null with new ProgressTimeline system
        // LightingRenderer.draw(ctx, g.dayNight, g.player, cam);

        // ---- 8b. Creature indicators (drawn AFTER lighting for visibility) ----
        this._drawCreatureIndicators(ctx, cam, g.entities);

        // ---- 9. HUD & Minimap (screen-space) ----
        if (g.hud)     g.hud.draw(ctx);
        if (g.minimap) g.minimap.draw(ctx);
    }

    // ----------------------------------------------------------
    //  Pickups  --  small glowing circles that bob up and down
    // ----------------------------------------------------------
    _drawPickups(ctx, cam, pickups) {
        if (!pickups) return;
        const t = performance.now() / 1000;

        for (let i = 0; i < pickups.length; i++) {
            const p = pickups[i];
            if (!p || p.dead) continue;
            if (!cam.visible(p.x, p.y)) continue;

            const bob   = Math.sin(t * 3 + p.x * 0.7) * 4;
            const pulse = 1 + Math.sin(t * 5 + p.y * 0.5) * 0.15;
            const r     = (p.radius || 8) * pulse;
            const sx    = p.x;
            const sy    = p.y + bob;

            // Outer glow
            ctx.globalAlpha = 0.25;
            ctx.beginPath();
            ctx.arc(sx, sy, r * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = p.color || '#ff0';
            ctx.fill();

            // Core
            ctx.globalAlpha = 0.9;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fillStyle = p.color || '#ff0';
            ctx.fill();

            // Bright center
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(sx, sy, r * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();

            ctx.globalAlpha = 1;
        }
    }

    // ----------------------------------------------------------
    //  Projectiles  --  small circles with fading trail
    // ----------------------------------------------------------
    _drawProjectiles(ctx, cam, projectiles) {
        if (!projectiles) return;

        for (let i = 0; i < projectiles.length; i++) {
            const p = projectiles[i];
            if (!p || p.dead) continue;
            if (!cam.visible(p.x, p.y)) continue;

            const r   = p.radius || 5;
            const col = p.color || '#f84';

            // Trail (3 fading copies behind the projectile)
            if (p.vx !== undefined && p.vy !== undefined) {
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
                const nx = p.vx / speed;
                const ny = p.vy / speed;
                for (let t = 1; t <= 3; t++) {
                    ctx.globalAlpha = 0.3 / t;
                    ctx.beginPath();
                    ctx.arc(p.x - nx * t * r * 1.4,
                            p.y - ny * t * r * 1.4,
                            r * (1 - t * 0.15), 0, Math.PI * 2);
                    ctx.fillStyle = col;
                    ctx.fill();
                }
            }

            // Main body
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();

            // Highlight
            ctx.beginPath();
            ctx.arc(p.x - r * 0.25, p.y - r * 0.25, r * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.6;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // ----------------------------------------------------------
    //  Creature indicators  --  drawn after lighting for visibility
    // ----------------------------------------------------------
    _drawCreatureIndicators(ctx, cam, entities) {
        if (!entities) return;
        const TWO_PI = Math.PI * 2;

        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            if (!e || e.dead) continue;
            if (!cam.visible(e.x, e.y)) continue;

            const r  = e.radius || 12;
            const sx = e.x - cam.x + cam.sx;
            const sy = e.y - cam.y + cam.sy;
            const col = e.color || '#fff';

            // Colored ring around the creature (screen-space, unaffected by lighting)
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(sx, sy, r + 3, 0, TWO_PI);
            ctx.strokeStyle = col;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            // Name label above creature (skip player and bosses)
            if (e.name && !e.isBoss && !e.isPlayer) {
                ctx.save();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.globalAlpha = 0.85;
                ctx.fillText(e.name, sx, sy - r - 8);
                ctx.restore();
            }
        }
    }
}
