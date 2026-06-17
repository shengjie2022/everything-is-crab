// ============================================================
//  BackgroundRenderer.js  --  Tile map + decorations (multi-biome)
// ============================================================
import { TILE, TILE_PROPS } from '../constants.js';

// Deterministic per-tile noise  (fast integer hash)
function tileNoise(c, r, seed) {
    let h = (c * 374761393 + r * 668265263 + seed) | 0;
    h = (h ^ (h >> 13)) * 1274126177;
    h = h ^ (h >> 16);
    return (h & 0x7fffffff) / 0x7fffffff;           // 0..1
}

function hexToRgb(hex) {
    const v = parseInt(hex.replace('#', ''), 16);
    return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

const TWO_PI = Math.PI * 2;

export const BackgroundRenderer = {

    draw(ctx, camera, tileMap) {
        const ts    = tileMap.ts;
        const bounds = camera.tileBounds(ts);
        const { sc, sr, ec, er } = bounds;
        const t = performance.now() / 1000;

        for (let r = sr; r <= er; r++) {
            for (let c = sc; c <= ec; c++) {
                const tile = tileMap.get(c, r);
                const prop = TILE_PROPS[tile];
                if (!prop) continue;

                const px = c * ts;
                const py = r * ts;

                // --- base colour with noise brightness variation ---
                const n   = tileNoise(c, r, 0);          // 0..1
                const rgb = hexToRgb(prop.color);
                const bri = 0.88 + n * 0.24;             // 0.88..1.12
                const cr  = Math.min(255, (rgb.r * bri) | 0);
                const cg  = Math.min(255, (rgb.g * bri) | 0);
                const cb  = Math.min(255, (rgb.b * bri) | 0);
                ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
                ctx.fillRect(px, py, ts, ts);

                // --- decorations based on tile type name / id ---
                this._decorate(ctx, tile, px, py, ts, c, r, t, n);
            }
        }
    },

    // ----------------------------------------------------------
    //  Decorations per tile type
    // ----------------------------------------------------------
    _decorate(ctx, tile, px, py, ts, c, r, t, n) {
        const cx = px + ts * 0.5;
        const cy = py + ts * 0.5;

        // --- WATER (animated waves) ---
        if (tile === TILE.WATER || tile === TILE.DEEP_WATER) {
            ctx.strokeStyle = tile === TILE.DEEP_WATER
                ? 'rgba(200,220,255,0.2)' : 'rgba(255,255,255,0.25)';
            ctx.lineWidth = 1.2;
            const waveOff = Math.sin(t * 2.4 + c * 0.9) * 3;
            ctx.beginPath();
            ctx.moveTo(px + 4,  cy + waveOff);
            ctx.quadraticCurveTo(px + ts * 0.33, cy + waveOff - 4,
                                 px + ts * 0.5,  cy + waveOff);
            ctx.quadraticCurveTo(px + ts * 0.67, cy + waveOff + 4,
                                 px + ts - 4,    cy + waveOff);
            ctx.stroke();

            const w2 = Math.sin(t * 2.4 + c * 0.9 + 1.8) * 3;
            ctx.beginPath();
            ctx.moveTo(px + 6,  cy + 6 + w2);
            ctx.quadraticCurveTo(px + ts * 0.4, cy + 6 + w2 - 3,
                                 px + ts * 0.6, cy + 6 + w2);
            ctx.quadraticCurveTo(px + ts * 0.8, cy + 6 + w2 + 3,
                                 px + ts - 6,   cy + 6 + w2);
            ctx.stroke();
            return;
        }

        // --- TREE (trunk + canopy) ---
        if (tile === TILE.TREE) {
            const trH = ts * 0.35;
            ctx.fillStyle = '#6b4226';
            ctx.fillRect(cx - 3, cy, 6, trH);
            const canR = ts * (0.35 + n * 0.1);
            ctx.beginPath();
            ctx.arc(cx, cy - canR * 0.1, canR, 0, TWO_PI);
            ctx.fillStyle = n > 0.5 ? '#2d7a2d' : '#388e3c';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx - canR * 0.25, cy - canR * 0.35, canR * 0.35, 0, TWO_PI);
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fill();
            return;
        }

        // --- ROCK (ellipse boulder) ---
        if (tile === TILE.ROCK) {
            const rw = ts * (0.3 + n * 0.15);
            const rh = ts * (0.22 + n * 0.1);
            ctx.beginPath();
            ctx.ellipse(cx, cy + 2, rw, rh, 0, 0, TWO_PI);
            ctx.fillStyle = '#888';
            ctx.fill();
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(cx - rw * 0.2, cy - rh * 0.15, rw * 0.4, rh * 0.35, -0.3, 0, TWO_PI);
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fill();
            return;
        }

        // --- FLOWER (petals) ---
        if (tile === TILE.FLOWER) {
            const hues = ['#e53935', '#ffb300', '#e040fb', '#ff7043', '#7e57c2'];
            const hue  = hues[(c * 7 + r * 3) % hues.length];
            const pr   = ts * 0.1;
            for (let i = 0; i < 5; i++) {
                const a = (i / 5) * TWO_PI + n;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(a) * pr * 1.6,
                        cy + Math.sin(a) * pr * 1.6, pr, 0, TWO_PI);
                ctx.fillStyle = hue;
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(cx, cy, pr * 0.7, 0, TWO_PI);
            ctx.fillStyle = '#fff176';
            ctx.fill();
            return;
        }

        // --- ICE (reflective surface) ---
        if (tile === TILE.ICE) {
            // Shimmer effect
            const shimmer = Math.sin(t * 1.5 + c * 1.2 + r * 0.8) * 0.15 + 0.1;
            ctx.fillStyle = `rgba(220,240,255,${shimmer})`;
            ctx.fillRect(px, py, ts, ts);
            // Scratch marks
            if (n > 0.6) {
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(px + n * ts * 0.3, py + 4);
                ctx.lineTo(px + ts - n * ts * 0.2, py + ts - 6);
                ctx.stroke();
            }
            return;
        }

        // --- SNOW (soft texture) ---
        if (tile === TILE.SNOW) {
            // Snow sparkle
            if (n > 0.7) {
                const sparkle = Math.sin(t * 3 + c * 2.1 + r * 1.7) > 0.6 ? 0.6 : 0;
                if (sparkle > 0) {
                    ctx.fillStyle = `rgba(255,255,255,${sparkle})`;
                    ctx.beginPath();
                    ctx.arc(px + n * ts, py + (1 - n) * ts, 1.5, 0, TWO_PI);
                    ctx.fill();
                }
            }
            // Snow drift
            if (n > 0.8) {
                ctx.fillStyle = 'rgba(200,210,230,0.3)';
                ctx.beginPath();
                ctx.ellipse(cx, cy + ts * 0.2, ts * 0.3, ts * 0.1, 0, 0, TWO_PI);
                ctx.fill();
            }
            return;
        }

        // --- CORAL (reef structure) ---
        if (tile === TILE.CORAL) {
            const coralHues = ['#e87461', '#ff6b9d', '#c2185b', '#e65100', '#ff8a65'];
            const hue = coralHues[(c * 5 + r * 7) % coralHues.length];
            // Main coral body
            const branches = 3 + ((c + r) % 3);
            for (let i = 0; i < branches; i++) {
                const a = (i / branches) * TWO_PI + n * 2;
                const len = ts * (0.15 + n * 0.1);
                const sway = Math.sin(t * 0.8 + c + i) * 2;
                ctx.strokeStyle = hue;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(a) * len + sway, cy + Math.sin(a) * len);
                ctx.stroke();
                // Tip
                ctx.beginPath();
                ctx.arc(cx + Math.cos(a) * len + sway, cy + Math.sin(a) * len, 2, 0, TWO_PI);
                ctx.fillStyle = hue;
                ctx.fill();
            }
            return;
        }

        // --- LAVA_ROCK (dark cracked rock) ---
        if (tile === TILE.LAVA_ROCK) {
            // Crack lines
            ctx.strokeStyle = 'rgba(180,80,20,0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px + 4, py + ts * n);
            ctx.lineTo(px + ts * 0.5, cy);
            ctx.lineTo(px + ts - 6, py + ts * (1 - n));
            ctx.stroke();
            // Heat glow
            const glow = Math.sin(t * 2 + c * 0.7 + r * 1.1) * 0.08 + 0.05;
            ctx.fillStyle = `rgba(255,100,20,${glow})`;
            ctx.fillRect(px, py, ts, ts);
            return;
        }

        // --- CACTUS (spiky plant) ---
        if (tile === TILE.CACTUS) {
            // Main stem
            ctx.fillStyle = '#2d8a4e';
            ctx.fillRect(cx - 4, cy - 8, 8, 20);
            // Arms
            ctx.fillRect(cx - 10, cy - 4, 7, 5);
            ctx.fillRect(cx - 10, cy - 8, 5, 5);
            ctx.fillRect(cx + 3, cy - 2, 8, 5);
            ctx.fillRect(cx + 6, cy - 6, 5, 5);
            // Spines
            ctx.strokeStyle = '#a0d0a0';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 4; i++) {
                const sx = cx + (Math.random() - 0.5) * 14;
                const sy = cy + (Math.random() - 0.5) * 14;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + (Math.random() - 0.5) * 5, sy - 3);
                ctx.stroke();
            }
            return;
        }

        // --- GRASS occasional tufts ---
        if (tile === TILE.GRASS && n > 0.72) {
            ctx.strokeStyle = 'rgba(30,100,30,0.45)';
            ctx.lineWidth = 1;
            const ox = px + n * ts * 0.6 + 4;
            const oy = py + ts - 4;
            for (let i = -1; i <= 1; i++) {
                const sway = Math.sin(t * 1.5 + c + i) * 2;
                ctx.beginPath();
                ctx.moveTo(ox + i * 3, oy);
                ctx.quadraticCurveTo(ox + i * 3 + sway, oy - 8, ox + i * 2 + sway, oy - 13);
                ctx.stroke();
            }
        }

        // --- SAND occasional details ---
        if (tile === TILE.SAND && n > 0.85) {
            ctx.strokeStyle = 'rgba(180,160,60,0.3)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(px + 3, cy + Math.sin(c * 0.5) * 4);
            ctx.quadraticCurveTo(cx, cy + Math.sin(c * 0.5 + 1) * 3, px + ts - 3, cy + Math.sin(c * 0.5 + 2) * 4);
            ctx.stroke();
        }
    }
};
