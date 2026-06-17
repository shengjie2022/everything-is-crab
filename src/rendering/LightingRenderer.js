// ============================================================
//  LightingRenderer.js  --  Day/night tint & player light
// ============================================================

export const LightingRenderer = {

    draw(ctx, dayNight, player, camera) {
        if (!dayNight) return;
        const tint = dayNight.tint;
        if (!tint || tint.a <= 0) return;

        const W = 960;
        const H = 640;

        // ---- Colour tint overlay (dusk / dawn / etc.) ----
        ctx.save();
        ctx.globalAlpha = tint.a * 0.45;
        ctx.fillStyle = `rgb(${tint.r},${tint.g},${tint.b})`;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        // ---- Night darkness + player light ----
        const dark = Math.min(dayNight.dark || 0, 0.55);
        if (dark <= 0.05) return;

        // Player screen position
        const ps = camera.w2s(player.x, player.y);
        const lightR = 200 + (player.radius || 12) * 4;

        // Draw dark overlay onto an off-screen-composited layer
        ctx.save();

        // Dark overlay
        ctx.globalAlpha = dark;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);

        // Punch a radial hole around the player (destination-out)
        ctx.globalCompositeOperation = 'destination-out';
        const grad = ctx.createRadialGradient(ps.x, ps.y, 0, ps.x, ps.y, lightR);
        grad.addColorStop(0,   'rgba(0,0,0,1)');
        grad.addColorStop(0.5, 'rgba(0,0,0,0.8)');
        grad.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(ps.x - lightR, ps.y - lightR, lightR * 2, lightR * 2);

        ctx.restore();

        // ---- Warm glow (screen blend) ----
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = dark * 0.35;
        const glow = ctx.createRadialGradient(ps.x, ps.y, 0, ps.x, ps.y, lightR * 0.8);
        glow.addColorStop(0,   'rgba(255,200,100,0.6)');
        glow.addColorStop(0.6, 'rgba(255,160,60,0.15)');
        glow.addColorStop(1,   'rgba(255,120,20,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(ps.x - lightR, ps.y - lightR, lightR * 2, lightR * 2);
        ctx.restore();
    }
};
