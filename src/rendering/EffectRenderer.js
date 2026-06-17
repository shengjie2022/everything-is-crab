// ============================================================
//  EffectRenderer.js  --  Particles & floating texts
// ============================================================

const TWO_PI = Math.PI * 2;

export const EffectRenderer = {

    draw(ctx, camera, particleSystem) {
        if (!particleSystem) return;
        this._drawParticles(ctx, camera, particleSystem.getParticles());
        this._drawTexts(ctx, camera, particleSystem.getTexts());
    },

    // ----------------------------------------------------------
    //  Particles  --  fading, shrinking circles
    // ----------------------------------------------------------
    _drawParticles(ctx, camera, particles) {
        if (!particles) return;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (!p || p.life <= 0) continue;
            if (!camera.visible(p.x, p.y)) continue;

            const ratio = p.life / (p.maxLife || 1);
            const size  = (p.size || 4) * ratio;
            if (size < 0.3) continue;

            ctx.globalAlpha = ratio;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, TWO_PI);
            ctx.fillStyle = p.color || '#fff';
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },

    // ----------------------------------------------------------
    //  Floating texts  --  upward drift, scale pop, shadow
    // ----------------------------------------------------------
    _drawTexts(ctx, camera, texts) {
        if (!texts) return;

        for (let i = 0; i < texts.length; i++) {
            const t = texts[i];
            if (!t || t.life <= 0) continue;
            if (!camera.visible(t.x, t.y)) continue;

            const ratio   = t.life / (t.maxLife || 1);
            const drift   = (1 - ratio) * 30;            // pixels upward
            const scale   = ratio < 0.85 ? 1 : 1 + (ratio - 0.85) * 4;  // pop-in
            const alpha   = Math.min(1, ratio * 2);       // fade out last half

            const dx = t.x;
            const dy = t.y - drift;

            ctx.save();
            ctx.translate(dx, dy);
            ctx.scale(scale, scale);
            ctx.globalAlpha = alpha;
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillText(t.text, 1, 1);

            // Main text
            ctx.fillStyle = t.color || '#fff';
            ctx.fillText(t.text, 0, 0);

            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }
};
