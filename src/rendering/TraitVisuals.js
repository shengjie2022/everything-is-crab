// ============================================================
//  TraitVisuals.js  --  Trait-based visual overlays
//  Draws on top of the base creature sprite for each trait
//  the entity possesses. All drawing relative to (0,0) center.
// ============================================================

const PI  = Math.PI;
const TAU = PI * 2;

function fdir(e) { return e.facing >= 0 ? 1 : -1; }

// Lookup table: trait name → draw function(ctx, radius, animTimer, facingDir)
const traitDrawers = {};

// ----------------------------------------------------------
//  CLAW  --  Two small orange pincers on left/right sides
// ----------------------------------------------------------
traitDrawers.claw = function (ctx, r, t, d) {
    const snap = Math.sin(t * 8) * 0.3;  // pincer snap animation
    for (let s = -1; s <= 1; s += 2) {
        const cx = s * (r + 3);
        const cy = 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(s * 0.2);
        // Upper pincer
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(s * 7, -4 - snap * 2);
        ctx.lineTo(s * 4, -1);
        ctx.closePath();
        ctx.fill();
        // Lower pincer
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(s * 7, 4 + snap * 2);
        ctx.lineTo(s * 4, 1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
};

// ----------------------------------------------------------
//  SHELL  --  Brown dome arc on the back (upper half)
// ----------------------------------------------------------
traitDrawers.shell = function (ctx, r, t, d) {
    ctx.save();
    ctx.strokeStyle = '#8d6e63';
    ctx.fillStyle = 'rgba(141,110,99,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.1, r * 0.85, r * 0.6, 0, PI, TAU);
    ctx.fill();
    ctx.stroke();
    // Shell segment lines
    ctx.strokeStyle = 'rgba(93,64,55,0.5)';
    ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(i * r * 0.3, -r * 0.1);
        ctx.lineTo(i * r * 0.2, -r * 0.55);
        ctx.stroke();
    }
    ctx.restore();
};

// ----------------------------------------------------------
//  COMPOUND_EYE  --  Row of 3 small red dots above head
// ----------------------------------------------------------
traitDrawers.compound_eye = function (ctx, r, t, d) {
    ctx.fillStyle = '#e53935';
    const y = -r * 0.7;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(i * r * 0.25, y, 2.5, 0, TAU);
        ctx.fill();
    }
    // Glint
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(i * r * 0.25 - 0.8, y - 0.8, 1, 0, TAU);
        ctx.fill();
    }
};

// ----------------------------------------------------------
//  SIDESTEP  --  Two thin side-walking legs on each side
// ----------------------------------------------------------
traitDrawers.sidestep = function (ctx, r, t, d) {
    ctx.strokeStyle = '#a1887f';
    ctx.lineWidth = 1.5;
    for (let s = -1; s <= 1; s += 2) {
        for (let i = 0; i < 2; i++) {
            const phase = t * 10 + i * PI;
            const kick = Math.sin(phase) * 3;
            const baseY = (i - 0.5) * r * 0.6;
            ctx.beginPath();
            ctx.moveTo(s * r * 0.6, baseY);
            ctx.lineTo(s * (r + 6), baseY + kick);
            ctx.lineTo(s * (r + 9), baseY + kick + 3);
            ctx.stroke();
        }
    }
};

// ----------------------------------------------------------
//  ARMOR  --  Horizontal armor segment lines across body
// ----------------------------------------------------------
traitDrawers.armor = function (ctx, r, t, d) {
    ctx.strokeStyle = 'rgba(120,144,156,0.7)';
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
        const y = i * r * 0.22;
        const hw = r * 0.7 * (1 - Math.abs(i) * 0.15);
        ctx.beginPath();
        ctx.moveTo(-hw, y);
        ctx.lineTo(hw, y);
        ctx.stroke();
    }
    // Edge rivets
    ctx.fillStyle = 'rgba(180,200,210,0.6)';
    for (let i = -2; i <= 2; i++) {
        const y = i * r * 0.22;
        const hw = r * 0.7 * (1 - Math.abs(i) * 0.15);
        ctx.beginPath(); ctx.arc(-hw, y, 1.5, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(hw, y, 1.5, 0, TAU); ctx.fill();
    }
};

// ----------------------------------------------------------
//  REGEN_CLAW  --  Green-glowing claw on one side
// ----------------------------------------------------------
traitDrawers.regen_claw = function (ctx, r, t, d) {
    const cx = d * (r + 4);
    const glow = 0.4 + Math.sin(t * 4) * 0.2;

    // Glow aura
    ctx.save();
    ctx.globalAlpha = glow;
    ctx.fillStyle = '#66bb6a';
    ctx.beginPath();
    ctx.arc(cx, 2, 8, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Claw shape
    ctx.fillStyle = '#43a047';
    ctx.beginPath();
    ctx.moveTo(cx, -2);
    ctx.lineTo(cx + d * 10, -6);
    ctx.lineTo(cx + d * 8, 0);
    ctx.lineTo(cx + d * 10, 6);
    ctx.lineTo(cx, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};

// ----------------------------------------------------------
//  COCONUT_CLAW  --  Large brown pincer on one side
// ----------------------------------------------------------
traitDrawers.coconut_claw = function (ctx, r, t, d) {
    const cx = d * (r + 2);
    const snap = Math.sin(t * 5) * 0.25;
    ctx.save();
    ctx.translate(cx, 0);

    // Upper jaw
    ctx.fillStyle = '#6d4c41';
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.lineTo(d * 14, -7 - snap * 4);
    ctx.lineTo(d * 12, -2);
    ctx.closePath();
    ctx.fill();

    // Lower jaw
    ctx.beginPath();
    ctx.moveTo(0, 1);
    ctx.lineTo(d * 14, 7 + snap * 4);
    ctx.lineTo(d * 12, 2);
    ctx.closePath();
    ctx.fill();

    // Joint circle
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, TAU);
    ctx.fill();
    ctx.restore();
};

// ----------------------------------------------------------
//  TENTACLE  --  2 small purple tentacles dangling from bottom
// ----------------------------------------------------------
traitDrawers.tentacle = function (ctx, r, t, d) {
    ctx.strokeStyle = '#9c27b0';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 2; i++) {
        const ox = (i - 0.5) * r * 0.6;
        const wave = Math.sin(t * 5 + i * 2) * 4;
        const wave2 = Math.sin(t * 5 + i * 2 + 1.5) * 3;
        ctx.beginPath();
        ctx.moveTo(ox, r * 0.5);
        ctx.quadraticCurveTo(ox + wave, r * 0.5 + 8, ox + wave2, r * 0.5 + 16);
        ctx.stroke();
        // Sucker dots on tentacle
        ctx.fillStyle = 'rgba(206,147,216,0.6)';
        ctx.beginPath();
        ctx.arc(ox + wave * 0.5, r * 0.5 + 8, 1.5, 0, TAU);
        ctx.fill();
    }
    ctx.lineCap = 'butt';
};

// ----------------------------------------------------------
//  INK  --  Dark purple sac/circle on back
// ----------------------------------------------------------
traitDrawers.ink = function (ctx, r, t, d) {
    const pulse = 1 + Math.sin(t * 3) * 0.08;
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#4a148c';
    ctx.beginPath();
    ctx.ellipse(-d * r * 0.2, r * 0.1, r * 0.35 * pulse, r * 0.3 * pulse, 0, 0, TAU);
    ctx.fill();
    // Highlight
    ctx.fillStyle = 'rgba(156,39,176,0.4)';
    ctx.beginPath();
    ctx.ellipse(-d * r * 0.25, r * 0.02, r * 0.15, r * 0.12, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
};

// ----------------------------------------------------------
//  SUCKER  --  Small circular dots along sides
// ----------------------------------------------------------
traitDrawers.sucker = function (ctx, r, t, d) {
    ctx.fillStyle = 'rgba(236,64,122,0.5)';
    for (let s = -1; s <= 1; s += 2) {
        for (let i = 0; i < 3; i++) {
            const y = (i - 1) * r * 0.4;
            const x = s * r * 0.75;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, TAU);
            ctx.fill();
            // Inner ring
            ctx.strokeStyle = 'rgba(236,64,122,0.3)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, TAU);
            ctx.stroke();
        }
    }
};

// ----------------------------------------------------------
//  BEAK  --  Orange pointed beak at facing direction
// ----------------------------------------------------------
traitDrawers.beak = function (ctx, r, t, d) {
    const bx = d * r * 0.7;
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.moveTo(bx, -3);
    ctx.lineTo(bx + d * 10, 0);
    ctx.lineTo(bx, 3);
    ctx.closePath();
    ctx.fill();
    // Dark line on beak
    ctx.strokeStyle = '#e65100';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx, 0);
    ctx.lineTo(bx + d * 9, 0);
    ctx.stroke();
};

// ----------------------------------------------------------
//  BIG_EYE  --  One oversized eye on top
// ----------------------------------------------------------
traitDrawers.big_eye = function (ctx, r, t, d) {
    const ex = d * r * 0.15;
    const ey = -r * 0.5;
    const er = r * 0.35;

    // Eyeball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ex, ey, er, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Iris
    const look = Math.sin(t * 2) * er * 0.15;
    ctx.fillStyle = '#1565c0';
    ctx.beginPath();
    ctx.arc(ex + d * er * 0.15 + look, ey, er * 0.55, 0, TAU);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(ex + d * er * 0.2 + look, ey, er * 0.25, 0, TAU);
    ctx.fill();

    // Glint
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(ex + d * er * 0.05 - 1, ey - er * 0.2, er * 0.15, 0, TAU);
    ctx.fill();
};

// ----------------------------------------------------------
//  SPINE  --  Row of small triangular spikes along top
// ----------------------------------------------------------
traitDrawers.spine = function (ctx, r, t, d) {
    ctx.fillStyle = '#bcaaa4';
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 0.8;
    const count = 5;
    for (let i = 0; i < count; i++) {
        const x = (i - (count - 1) / 2) * r * 0.35;
        const h = 5 + (i === Math.floor(count / 2) ? 2 : 0); // middle one taller
        ctx.beginPath();
        ctx.moveTo(x - 3, -r * 0.4);
        ctx.lineTo(x, -r * 0.4 - h);
        ctx.lineTo(x + 3, -r * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
};

// ----------------------------------------------------------
//  JAW  --  Jaw/mandible shape at facing side
// ----------------------------------------------------------
traitDrawers.jaw = function (ctx, r, t, d) {
    const bx = d * r * 0.5;
    const chomp = Math.sin(t * 6) * 2;

    // Upper jaw
    ctx.fillStyle = '#e0e0e0';
    ctx.strokeStyle = '#9e9e9e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx, -4);
    ctx.lineTo(bx + d * 10, -2 - chomp);
    ctx.lineTo(bx + d * 8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lower jaw
    ctx.beginPath();
    ctx.moveTo(bx, 4);
    ctx.lineTo(bx + d * 10, 2 + chomp);
    ctx.lineTo(bx + d * 8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Teeth
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 3; i++) {
        const tx = bx + d * (4 + i * 2.5);
        ctx.beginPath();
        ctx.moveTo(tx, -1 - chomp * 0.3);
        ctx.lineTo(tx + d * 1.2, 0);
        ctx.lineTo(tx, 1 + chomp * 0.3);
        ctx.closePath();
        ctx.fill();
    }
};

// ----------------------------------------------------------
//  SHARP_CLAW  --  Small sharp claw marks at bottom
// ----------------------------------------------------------
traitDrawers.sharp_claw = function (ctx, r, t, d) {
    ctx.strokeStyle = '#616161';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    for (let s = -1; s <= 1; s += 2) {
        for (let i = 0; i < 3; i++) {
            const bx = s * r * 0.3 + (i - 1) * s * 3;
            const by = r * 0.55;
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + s * 3, by + 6);
            ctx.stroke();
        }
    }
    ctx.lineCap = 'butt';
};

// ----------------------------------------------------------
//  VENOM_FANG  --  Two dripping green fangs at front
// ----------------------------------------------------------
traitDrawers.venom_fang = function (ctx, r, t, d) {
    const fx = d * r * 0.5;
    const drip = (t * 3) % 1;  // drip animation cycle

    for (let i = -1; i <= 1; i += 2) {
        const fy = i * 3;
        // Fang
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath();
        ctx.moveTo(fx, fy - 2);
        ctx.lineTo(fx + d * 7, fy + 1);
        ctx.lineTo(fx, fy + 2);
        ctx.closePath();
        ctx.fill();

        // Venom drop
        ctx.fillStyle = 'rgba(76,175,80,0.7)';
        ctx.beginPath();
        ctx.arc(fx + d * 6, fy + 2 + drip * 5, 1.5, 0, TAU);
        ctx.fill();
    }

    // Venom glow at tip
    ctx.save();
    ctx.globalAlpha = 0.3 + Math.sin(t * 5) * 0.15;
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.arc(fx + d * 7, 0, 4, 0, TAU);
    ctx.fill();
    ctx.restore();
};

// ----------------------------------------------------------
//  WINGS  --  Pair of flapping wing shapes on sides
// ----------------------------------------------------------
traitDrawers.wings = function (ctx, r, t, d) {
    const flap = Math.sin(t * 10) * 0.4;  // flapping angle

    for (let s = -1; s <= 1; s += 2) {
        ctx.save();
        ctx.translate(s * r * 0.3, -r * 0.2);
        ctx.rotate(s * (0.3 + flap));

        // Wing membrane
        ctx.fillStyle = 'rgba(144,202,249,0.5)';
        ctx.strokeStyle = 'rgba(66,165,245,0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(s * 8, -10, s * 16, -4);
        ctx.quadraticCurveTo(s * 14, 2, s * 8, 4);
        ctx.lineTo(0, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Wing vein
        ctx.strokeStyle = 'rgba(66,165,245,0.4)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(s * 12, -3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 1);
        ctx.lineTo(s * 10, 2);
        ctx.stroke();

        ctx.restore();
    }
};

// ----------------------------------------------------------
//  ABSORB  --  Pulsing translucent aura circle
// ----------------------------------------------------------
traitDrawers.absorb = function (ctx, r, t, d) {
    const pulse = 1 + Math.sin(t * 4) * 0.15;
    const auraR = (r + 6) * pulse;

    ctx.save();
    // Outer ring
    ctx.globalAlpha = 0.15 + Math.sin(t * 4) * 0.08;
    ctx.fillStyle = '#ce93d8';
    ctx.beginPath();
    ctx.arc(0, 0, auraR, 0, TAU);
    ctx.fill();

    // Inner ring
    ctx.globalAlpha = 0.25 + Math.sin(t * 4 + 1) * 0.1;
    ctx.strokeStyle = '#ab47bc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, auraR - 2, 0, TAU);
    ctx.stroke();
    ctx.restore();
};

// ----------------------------------------------------------
//  PHOTOSYN  --  Small green leaf shapes on top
// ----------------------------------------------------------
traitDrawers.photosyn = function (ctx, r, t, d) {
    const sway = Math.sin(t * 3) * 0.15;

    for (let i = -1; i <= 1; i++) {
        ctx.save();
        ctx.translate(i * r * 0.3, -r * 0.55);
        ctx.rotate(i * 0.4 + sway);

        // Leaf shape
        ctx.fillStyle = 'rgba(102,187,106,0.75)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(3, -7, 0, -12);
        ctx.quadraticCurveTo(-3, -7, 0, 0);
        ctx.fill();

        // Leaf vein
        ctx.strokeStyle = 'rgba(56,142,60,0.5)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, -1);
        ctx.lineTo(0, -10);
        ctx.stroke();

        ctx.restore();
    }
};


// ============================================================
//  Main draw entry point
// ============================================================
export const TraitVisuals = {

    draw(ctx, entity) {
        const traits = entity.traits;
        if (!traits) return;

        const r = entity.radius || 12;
        const t = entity.animTimer || 0;
        const d = fdir(entity);

        for (let i = 0; i < traits.length; i++) {
            const fn = traitDrawers[traits[i]];
            if (fn) {
                ctx.save();
                fn(ctx, r, t, d);
                ctx.restore();
            }
        }
    }
};
