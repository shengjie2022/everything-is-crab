// ============================================================
//  CreatureSprites.js  --  Procedural creature drawing
//  All drawing is relative to (0,0) center. Uses entity.radius
//  for scale, entity.facing for direction, entity.animTimer
//  for animation phase.
// ============================================================

const PI  = Math.PI;
const TAU = PI * 2;

// Helper: facing sign (-1 left, 1 right)
function fdir(e) { return e.facing >= 0 ? 1 : -1; }
function anim(e) { return e.animTimer || 0; }

export const CreatureSprites = {

    draw(ctx, entity) {
        const form = entity.form || entity.creatureType || 'slime';
        const fn   = this._sprites[form] || this._sprites.slime;
        fn(ctx, entity);
    },

    _sprites: {

        // ============================================================
        //  Base creatures + Bosses
        // ============================================================

slime(ctx, e) {
  const r = e.radius || 12;
  const t = anim(e);
  const d = fdir(e);
  
  const bounce = Math.sin(t * 8) * 0.15;
  const squash = 1 - Math.abs(bounce) * 0.3;
  const stretch = 1 + Math.abs(bounce) * 0.2;
  
  ctx.save();
  ctx.scale(stretch, squash);
  
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fillStyle = 'rgba(80, 220, 120, 0.4)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.85, 0, TAU);
  ctx.fillStyle = 'rgba(100, 240, 140, 0.5)';
  ctx.fill();
  
  for (let i = 0; i < 4; i++) {
    const angle = t * 2 + i * PI / 2;
    const ox = Math.cos(angle) * r * 0.4;
    const oy = Math.sin(angle) * r * 0.4;
    ctx.beginPath();
    ctx.arc(ox, oy, r * 0.15, 0, TAU);
    ctx.fillStyle = 'rgba(60, 200, 100, 0.3)';
    ctx.fill();
  }
  
  ctx.beginPath();
  ctx.arc(-r * 0.3 * d, -r * 0.25, r * 0.22, 0, TAU);
  ctx.fillStyle = 'rgba(40, 50, 60, 0.6)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.3 * d, -r * 0.25, r * 0.22, 0, TAU);
  ctx.fillStyle = 'rgba(40, 50, 60, 0.6)';
  ctx.fill();
  
  const eyeX1 = -r * 0.3 * d + Math.sin(t * 3) * r * 0.08;
  const eyeY1 = -r * 0.25 + Math.cos(t * 2) * r * 0.08;
  ctx.beginPath();
  ctx.arc(eyeX1, eyeY1, r * 0.12, 0, TAU);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eyeX1, eyeY1, r * 0.06, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  const eyeX2 = r * 0.3 * d + Math.sin(t * 3 + 1) * r * 0.08;
  const eyeY2 = -r * 0.25 + Math.cos(t * 2 + 1) * r * 0.08;
  ctx.beginPath();
  ctx.arc(eyeX2, eyeY2, r * 0.12, 0, TAU);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eyeX2, eyeY2, r * 0.06, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.restore();
  
  for (let i = 0; i < 3; i++) {
    const dx = (Math.sin(t * 4 + i) - 0.5) * r * 1.5;
    const dy = r * squash + Math.abs(Math.sin(t * 3 + i)) * r * 0.5;
    ctx.beginPath();
    ctx.arc(dx, dy, r * 0.1, 0, TAU);
    ctx.fillStyle = 'rgba(80, 220, 120, 0.5)';
    ctx.fill();
  }
},

beetle(ctx, e) {
  const r = e.radius || 10;
  const t = anim(e);
  const d = fdir(e);
  
  for (let i = 0; i < 3; i++) {
    const side = i < 1.5 ? 1 : -1;
    const legIndex = i % 2;
    const angle = t * 6 + legIndex * PI;
    const legWalk = Math.sin(angle) * 0.4;
    const baseX = (legIndex - 0.5) * r * 0.6 * d;
    const baseY = 0;
    const x1 = baseX;
    const y1 = baseY;
    const x2 = baseX + side * r * 0.6;
    const y2 = baseY + r * 0.4 + legWalk * r * 0.3;
    const x3 = x2 + side * r * 0.5;
    const y3 = y2 + r * 0.6 - legWalk * r * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#2a1810';
    ctx.lineWidth = r * 0.12;
    ctx.stroke();
  }
  
  for (let i = 0; i < 3; i++) {
    const side = i < 1.5 ? -1 : 1;
    const legIndex = i % 2;
    const angle = t * 6 + legIndex * PI;
    const legWalk = Math.sin(angle) * 0.4;
    const baseX = (legIndex - 0.5) * r * 0.6 * d;
    const baseY = 0;
    const x1 = baseX;
    const y1 = baseY;
    const x2 = baseX + side * r * 0.6;
    const y2 = baseY + r * 0.4 + legWalk * r * 0.3;
    const x3 = x2 + side * r * 0.5;
    const y3 = y2 + r * 0.6 - legWalk * r * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#2a1810';
    ctx.lineWidth = r * 0.12;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9, r * 0.7, 0, 0, TAU);
  ctx.fillStyle = '#1a4d2e';
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.2 * d, 0, r * 0.5, r * 0.65, 0, 0, TAU);
  ctx.fillStyle = '#2d6a3e';
  ctx.fill();
  ctx.strokeStyle = '#1a4d2e';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.2 * d, 0, r * 0.5, r * 0.65, 0, 0, TAU);
  ctx.fillStyle = '#2d6a3e';
  ctx.fill();
  ctx.strokeStyle = '#1a4d2e';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(-r * 0.3 * d, -r * 0.2, r * 0.15, 0, TAU);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.3 * d, -r * 0.2, r * 0.15, 0, TAU);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
  ctx.fill();
  
  const antenna1 = Math.sin(t * 5) * 0.3;
  const antenna2 = Math.sin(t * 5 + PI) * 0.3;
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.4 * d, -r * 0.5);
  ctx.quadraticCurveTo(-r * 0.6 * d, -r * 0.9 + antenna1 * r * 0.2, -r * 0.8 * d, -r * 1.1 + antenna1 * r * 0.3);
  ctx.strokeStyle = '#3d5a4a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.4 * d, -r * 0.5);
  ctx.quadraticCurveTo(r * 0.6 * d, -r * 0.9 + antenna2 * r * 0.2, r * 0.8 * d, -r * 1.1 + antenna2 * r * 0.3);
  ctx.strokeStyle = '#3d5a4a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(-r * 0.2 * d, -r * 0.3, r * 0.08, 0, TAU);
  ctx.fillStyle = '#0d0d0d';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.15 * d, -r * 0.3, r * 0.08, 0, TAU);
  ctx.fillStyle = '#0d0d0d';
  ctx.fill();
},

frog(ctx, e) {
  const r = e.radius || 12;
  const t = anim(e);
  const d = fdir(e);
  
  const throatPulse = Math.sin(t * 4) * 0.2 + 0.8;
  
  ctx.beginPath();
  ctx.ellipse(0, r * 0.1, r * 0.9, r * 0.75, 0, 0, TAU);
  ctx.fillStyle = '#4a7c2e';
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(0, r * 0.4, r * 0.7 * throatPulse, r * 0.5 * throatPulse, 0, 0, TAU);
  ctx.fillStyle = '#d4e89e';
  ctx.fill();
  
  for (let i = 0; i < 8; i++) {
    const wx = Math.sin(i * 2.3 + 0.7) * r * 0.6;
    const wy = Math.cos(i * 1.9 + 0.3) * r * 0.5;
    ctx.beginPath();
    ctx.arc(wx, wy, r * 0.08, 0, TAU);
    ctx.fillStyle = '#3a5c1e';
    ctx.fill();
  }
  
  const legBend = Math.sin(t * 3) * 0.3;
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.7 * d, r * 0.3);
  ctx.quadraticCurveTo(-r * 1.2 * d, r * 0.6 + legBend * r * 0.4, -r * 1.5 * d, r * 0.9);
  ctx.strokeStyle = '#3a5c1e';
  ctx.lineWidth = r * 0.25;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(-r * 1.5 * d, r * 0.9, r * 0.2, 0, TAU);
  ctx.fillStyle = '#3a5c1e';
  ctx.fill();
  
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-r * 1.5 * d, r * 0.9);
    ctx.lineTo(-r * 1.5 * d + (i - 1) * r * 0.15, r * 1.1);
    ctx.strokeStyle = '#3a5c1e';
    ctx.lineWidth = r * 0.1;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.moveTo(r * 0.7 * d, r * 0.3);
  ctx.quadraticCurveTo(r * 1.2 * d, r * 0.6 - legBend * r * 0.4, r * 1.5 * d, r * 0.9);
  ctx.strokeStyle = '#3a5c1e';
  ctx.lineWidth = r * 0.25;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 1.5 * d, r * 0.9, r * 0.2, 0, TAU);
  ctx.fillStyle = '#3a5c1e';
  ctx.fill();
  
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(r * 1.5 * d, r * 0.9);
    ctx.lineTo(r * 1.5 * d + (i - 1) * r * 0.15, r * 1.1);
    ctx.strokeStyle = '#3a5c1e';
    ctx.lineWidth = r * 0.1;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.arc(-r * 0.4 * d, -r * 0.4, r * 0.45, 0, TAU);
  ctx.fillStyle = '#5a8c3e';
  ctx.fill();
  ctx.strokeStyle = '#2a4c1e';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.4 * d, -r * 0.4, r * 0.45, 0, TAU);
  ctx.fillStyle = '#5a8c3e';
  ctx.fill();
  ctx.strokeStyle = '#2a4c1e';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(-r * 0.4 * d, -r * 0.4, r * 0.32, 0, TAU);
  ctx.fillStyle = '#f4d03f';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.4 * d, -r * 0.4, r * 0.32, 0, TAU);
  ctx.fillStyle = '#f4d03f';
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.4 * d, -r * 0.35, r * 0.08, r * 0.18, 0, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.4 * d, -r * 0.35, r * 0.08, r * 0.18, 0, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(0, r * 0.2, r * 0.35, 0, PI);
  ctx.strokeStyle = '#2a4c1e';
  ctx.lineWidth = r * 0.1;
  ctx.stroke();
},

crab(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  
  for (let i = 0; i < 4; i++) {
    const side = 1;
    const legPhase = t * 5 + i * PI / 2;
    const legBend = Math.sin(legPhase) * 0.4;
    const xOffset = (i - 1.5) * r * 0.4 * d;
    const x1 = xOffset;
    const y1 = 0;
    const x2 = x1 + side * r * 0.5;
    const y2 = y1 + r * 0.4 + legBend * r * 0.3;
    const x3 = x2 + side * r * 0.4;
    const y3 = y2 + r * 0.5 - legBend * r * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#c44827';
    ctx.lineWidth = r * 0.13;
    ctx.stroke();
  }
  
  for (let i = 0; i < 4; i++) {
    const side = -1;
    const legPhase = t * 5 + i * PI / 2 + PI / 4;
    const legBend = Math.sin(legPhase) * 0.4;
    const xOffset = (i - 1.5) * r * 0.4 * d;
    const x1 = xOffset;
    const y1 = 0;
    const x2 = x1 + side * r * 0.5;
    const y2 = y1 + r * 0.4 + legBend * r * 0.3;
    const x3 = x2 + side * r * 0.4;
    const y3 = y2 + r * 0.5 - legBend * r * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#c44827';
    ctx.lineWidth = r * 0.13;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.85, r * 0.65, 0, 0, TAU);
  ctx.fillStyle = '#d55533';
  ctx.fill();
  
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * PI - PI / 2;
    const x = Math.cos(angle) * r * 0.6;
    const y = Math.sin(angle) * r * 0.4;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.2, y);
    ctx.lineTo(x + r * 0.2, y);
    ctx.strokeStyle = '#c44827';
    ctx.lineWidth = r * 0.06;
    ctx.stroke();
  }
  
  const eyeStalk1 = Math.sin(t * 3) * 0.2;
  const eyeStalk2 = Math.sin(t * 3 + 1) * 0.2;
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.3 * d, -r * 0.4);
  ctx.lineTo(-r * 0.35 * d + eyeStalk1 * r * 0.3, -r * 0.9);
  ctx.strokeStyle = '#c44827';
  ctx.lineWidth = r * 0.1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(-r * 0.35 * d + eyeStalk1 * r * 0.3, -r * 0.9, r * 0.15, 0, TAU);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  ctx.strokeStyle = '#d55533';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.3 * d, -r * 0.4);
  ctx.lineTo(r * 0.35 * d + eyeStalk2 * r * 0.3, -r * 0.9);
  ctx.strokeStyle = '#c44827';
  ctx.lineWidth = r * 0.1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.35 * d + eyeStalk2 * r * 0.3, -r * 0.9, r * 0.15, 0, TAU);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  ctx.strokeStyle = '#d55533';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  const clawSnap1 = Math.sin(t * 4) * 0.3;
  const clawSnap2 = Math.sin(t * 4 + PI / 2) * 0.25;
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.9 * d, -r * 0.2, r * 0.5, r * 0.35, clawSnap1, 0, TAU);
  ctx.fillStyle = '#e66543';
  ctx.fill();
  ctx.strokeStyle = '#c44827';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 1.2 * d, -r * 0.3);
  ctx.lineTo(-r * 1.4 * d, -r * 0.4 + clawSnap1 * r * 0.2);
  ctx.lineTo(-r * 1.3 * d, -r * 0.1);
  ctx.closePath();
  ctx.fillStyle = '#e66543';
  ctx.fill();
  ctx.strokeStyle = '#c44827';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(r * 1.1 * d, -r * 0.3, r * 0.35, r * 0.25, clawSnap2, 0, TAU);
  ctx.fillStyle = '#e66543';
  ctx.fill();
  ctx.strokeStyle = '#c44827';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 1.3 * d, -r * 0.4);
  ctx.lineTo(r * 1.5 * d, -r * 0.5 + clawSnap2 * r * 0.15);
  ctx.lineTo(r * 1.4 * d, -r * 0.2);
  ctx.closePath();
  ctx.fillStyle = '#e66543';
  ctx.fill();
  ctx.strokeStyle = '#c44827';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  for (let i = 0; i < 3; i++) {
    const bx = Math.sin(i * 2.1 + 1.3) * r * 0.8;
    const by = r * 0.8 + Math.abs(Math.sin(i * 1.7)) * r * 0.4;
    ctx.beginPath();
    ctx.arc(bx, by, r * 0.1, 0, TAU);
    ctx.fillStyle = 'rgba(200, 230, 255, 0.5)';
    ctx.fill();
  }
},

fish(ctx, e) {
  const r = e.radius || 11;
  const t = anim(e);
  const d = fdir(e);
  
  const tailWag = Math.sin(t * 6) * 0.4;
  const finWave = Math.sin(t * 5) * 0.3;
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9, r * 0.55, 0, 0, TAU);
  ctx.fillStyle = '#4a9fd8';
  ctx.fill();
  
  const gradient = ctx.createLinearGradient(0, -r * 0.5, 0, r * 0.5);
  gradient.addColorStop(0, 'rgba(180, 220, 255, 0.4)');
  gradient.addColorStop(0.5, 'rgba(100, 180, 230, 0.2)');
  gradient.addColorStop(1, 'rgba(60, 140, 200, 0.4)');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      const sx = (-r * 0.5 + i * r * 0.25) * d;
      const sy = -r * 0.3 + j * r * 0.3;
      ctx.beginPath();
      ctx.arc(sx, sy, r * 0.12, 0, TAU);
      ctx.strokeStyle = 'rgba(70, 130, 180, 0.4)';
      ctx.lineWidth = r * 0.04;
      ctx.stroke();
    }
  }
  
  ctx.beginPath();
  ctx.moveTo(r * 0.3 * d, -r * 0.3);
  ctx.lineTo(r * 0.7 * d, -r * 0.6 + finWave * r * 0.2);
  ctx.lineTo(r * 0.5 * d, -r * 0.1);
  ctx.closePath();
  ctx.fillStyle = '#5aaae8';
  ctx.fill();
  ctx.strokeStyle = '#3a8ac8';
  ctx.lineWidth = r * 0.05;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.1 * d, r * 0.3);
  ctx.lineTo(r * 0.3 * d, r * 0.7 - finWave * r * 0.15);
  ctx.lineTo(r * 0.2 * d, r * 0.4);
  ctx.closePath();
  ctx.fillStyle = '#5aaae8';
  ctx.fill();
  ctx.strokeStyle = '#3a8ac8';
  ctx.lineWidth = r * 0.05;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.7 * d, 0);
  ctx.lineTo(-r * 1.2 * d, -r * 0.4 + tailWag * r * 0.5);
  ctx.lineTo(-r * 1.0 * d, 0);
  ctx.lineTo(-r * 1.2 * d, r * 0.4 - tailWag * r * 0.5);
  ctx.closePath();
  ctx.fillStyle = '#5aaae8';
  ctx.fill();
  ctx.strokeStyle = '#3a8ac8';
  ctx.lineWidth = r * 0.06;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.3 * d, -r * 0.4);
  ctx.lineTo(-r * 0.2 * d, -r * 0.7 - finWave * r * 0.2);
  ctx.lineTo(0, -r * 0.5);
  ctx.closePath();
  ctx.fillStyle = '#5aaae8';
  ctx.fill();
  ctx.strokeStyle = '#3a8ac8';
  ctx.lineWidth = r * 0.05;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.5 * d, -r * 0.1);
  ctx.lineTo(r * 0.6 * d, r * 0.05);
  ctx.strokeStyle = '#2a6a98';
  ctx.lineWidth = r * 0.06;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.6 * d, 0);
  ctx.lineTo(r * 0.5 * d, 0);
  ctx.strokeStyle = 'rgba(200, 220, 240, 0.5)';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.5 * d, -r * 0.2, r * 0.18, 0, TAU);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#1a4a68';
  ctx.lineWidth = r * 0.05;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.52 * d, -r * 0.2, r * 0.09, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
},

spider(ctx, e) {
  const r = e.radius || 13;
  const t = anim(e);
  const d = fdir(e);
  
  for (let i = 0; i < 4; i++) {
    const legAngle = -PI / 3 + (i / 3) * (2 * PI / 3);
    const legPhase = t * 4 + i * PI / 2;
    const legBend = Math.sin(legPhase) * 0.3;
    
    const x1 = Math.cos(legAngle) * r * 0.4 * d;
    const y1 = Math.sin(legAngle) * r * 0.3;
    const x2 = x1 + Math.cos(legAngle) * r * 0.8 * d;
    const y2 = y1 + Math.sin(legAngle) * r * 0.6 + legBend * r * 0.3;
    const x3 = x2 + Math.cos(legAngle + 0.5) * r * 0.9 * d;
    const y3 = y2 + Math.sin(legAngle + 0.5) * r * 0.7;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = r * 0.1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x2, y2, r * 0.08, 0, TAU);
    ctx.fillStyle = '#2a2a2a';
    ctx.fill();
  }
  
  for (let i = 0; i < 4; i++) {
    const legAngle = -PI / 3 + (i / 3) * (2 * PI / 3);
    const legPhase = t * 4 + i * PI / 2 + PI / 4;
    const legBend = Math.sin(legPhase) * 0.3;
    
    const x1 = Math.cos(legAngle) * r * 0.4 * -d;
    const y1 = Math.sin(legAngle) * r * 0.3;
    const x2 = x1 + Math.cos(legAngle) * r * 0.8 * -d;
    const y2 = y1 + Math.sin(legAngle) * r * 0.6 + legBend * r * 0.3;
    const x3 = x2 + Math.cos(legAngle - 0.5) * r * 0.9 * -d;
    const y3 = y2 + Math.sin(legAngle - 0.5) * r * 0.7;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = r * 0.1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x2, y2, r * 0.08, 0, TAU);
    ctx.fillStyle = '#2a2a2a';
    ctx.fill();
  }
  
  ctx.beginPath();
  ctx.arc(r * 0.15 * d, -r * 0.1, r * 0.45, 0, TAU);
  ctx.fillStyle = '#3a3a3a';
  ctx.fill();
  
  for (let i = 0; i < 12; i++) {
    const hairAngle = (i / 12) * TAU;
    const hx = r * 0.15 * d + Math.cos(hairAngle) * r * 0.45;
    const hy = -r * 0.1 + Math.sin(hairAngle) * r * 0.45;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + Math.cos(hairAngle) * r * 0.15, hy + Math.sin(hairAngle) * r * 0.15);
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = r * 0.03;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.arc(-r * 0.25 * d, r * 0.15, r * 0.55, 0, TAU);
  ctx.fillStyle = '#4a4a4a';
  ctx.fill();
  
  for (let i = 0; i < 16; i++) {
    const hairAngle = (i / 16) * TAU;
    const hx = -r * 0.25 * d + Math.cos(hairAngle) * r * 0.55;
    const hy = r * 0.15 + Math.sin(hairAngle) * r * 0.55;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + Math.cos(hairAngle) * r * 0.2, hy + Math.sin(hairAngle) * r * 0.2);
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = r * 0.04;
    ctx.stroke();
  }
  
  const eyePattern = [
    [-0.25, -0.15], [-0.1, -0.15], [0.05, -0.15], [0.2, -0.15],
    [-0.15, -0.25], [-0.05, -0.28], [0.05, -0.28], [0.15, -0.25]
  ];
  
  eyePattern.forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.arc(ex * r * d, ey * r, r * 0.06, 0, TAU);
    ctx.fillStyle = '#ff3030';
    ctx.fill();
  });
  
  ctx.beginPath();
  ctx.moveTo(r * 0.35 * d, -r * 0.15);
  ctx.lineTo(r * 0.55 * d, -r * 0.25);
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.35 * d, -r * 0.05);
  ctx.lineTo(r * 0.55 * d, -r * 0.1);
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      ctx.beginPath();
      ctx.moveTo((-r * 0.25 + x * r * 0.15) * d, r * 0.15 + y * r * 0.15);
      ctx.lineTo((-r * 0.25 + x * r * 0.15 + r * 0.1) * d, r * 0.15 + y * r * 0.15 + r * 0.1);
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.lineWidth = r * 0.02;
      ctx.stroke();
    }
  }
},

snake(ctx, e) {
  const r = e.radius || 12;
  const t = anim(e);
  const d = fdir(e);
  
  const segments = 10;
  
  for (let i = segments - 1; i >= 0; i--) {
    const wave = Math.sin(t * 5 - i * 0.5) * r * 0.6;
    const segX = (-i * r * 0.25) * d + wave * d;
    const segY = i * r * 0.08;
    const segR = r * (0.8 - i * 0.05);
    
    ctx.beginPath();
    ctx.arc(segX, segY, segR, 0, TAU);
    ctx.fillStyle = i % 2 === 0 ? '#4a7c34' : '#3a5c24';
    ctx.fill();
    
    if (i % 2 === 0 && i < segments - 1) {
      ctx.beginPath();
      ctx.moveTo(segX - segR * 0.5 * d, segY - segR * 0.3);
      ctx.lineTo(segX + segR * 0.5 * d, segY - segR * 0.3);
      ctx.lineTo(segX, segY + segR * 0.2);
      ctx.closePath();
      ctx.fillStyle = '#2a3c14';
      ctx.fill();
    }
    
    ctx.beginPath();
    ctx.moveTo(segX, segY + segR * 0.6);
    ctx.lineTo(segX, segY + segR * 0.9);
    ctx.strokeStyle = '#d4e89e';
    ctx.lineWidth = segR * 0.4;
    ctx.stroke();
  }
  
  const headX = 0;
  const headY = 0;
  
  ctx.beginPath();
  ctx.ellipse(headX, headY, r * 0.6, r * 0.45, 0, 0, TAU);
  ctx.fillStyle = '#5a8c44';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(headX + r * 0.35 * d, headY - r * 0.15, r * 0.15, 0, TAU);
  ctx.fillStyle = '#f4d03f';
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(headX + r * 0.37 * d, headY - r * 0.15, r * 0.05, r * 0.1, 0, 0, TAU);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(headX + r * 0.25 * d, headY - r * 0.25, r * 0.08, 0, TAU);
  ctx.fillStyle = '#2a2a2a';
  ctx.fill();
  
  const tongueFlick = Math.sin(t * 8) * 0.5 + 0.5;
  if (tongueFlick > 0.3) {
    const tongueLen = tongueFlick * r * 0.6;
    ctx.beginPath();
    ctx.moveTo(headX + r * 0.6 * d, headY);
    ctx.lineTo(headX + (r * 0.6 + tongueLen) * d, headY - r * 0.05);
    ctx.moveTo(headX + (r * 0.6 + tongueLen) * d, headY - r * 0.05);
    ctx.lineTo(headX + (r * 0.6 + tongueLen + r * 0.1) * d, headY - r * 0.15);
    ctx.moveTo(headX + (r * 0.6 + tongueLen) * d, headY - r * 0.05);
    ctx.lineTo(headX + (r * 0.6 + tongueLen + r * 0.1) * d, headY + r * 0.05);
    ctx.strokeStyle = '#ff3030';
    ctx.lineWidth = r * 0.04;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.moveTo(headX - r * 0.5 * d, headY - r * 0.3);
  ctx.lineTo(headX - r * 0.3 * d, headY - r * 0.45);
  ctx.lineTo(headX - r * 0.1 * d, headY - r * 0.3);
  ctx.fillStyle = '#3a5c24';
  ctx.fill();
},

octopus(ctx, e) {
  const r = e.radius || 16;
  const t = anim(e);
  const d = fdir(e);
  
  const colorShift = Math.sin(t * 3) * 0.3 + 0.7;
  
  ctx.beginPath();
  ctx.arc(0, -r * 0.2, r * 0.7, 0, TAU);
  ctx.fillStyle = `rgba(${120 * colorShift}, ${80 * colorShift}, ${150}, 0.9)`;
  ctx.fill();
  
  for (let i = 0; i < 12; i++) {
    const spotAngle = (i / 12) * TAU;
    const spotDist = r * 0.4 + Math.sin(t * 4 + i) * r * 0.15;
    const sx = Math.cos(spotAngle) * spotDist;
    const sy = -r * 0.2 + Math.sin(spotAngle) * spotDist;
    const spotSize = r * 0.08 + Math.sin(t * 5 + i * 0.5) * r * 0.04;
    ctx.beginPath();
    ctx.arc(sx, sy, spotSize, 0, TAU);
    ctx.fillStyle = `rgba(${180 * colorShift}, ${120 * colorShift}, ${200}, 0.6)`;
    ctx.fill();
  }
  
  for (let i = 0; i < 8; i++) {
    const tentacleAngle = (i / 8) * TAU - PI / 2;
    const phase = t * 3 + i * 0.7;
    
    const points = [];
    for (let j = 0; j < 8; j++) {
      const dist = j * r * 0.3;
      const wave = Math.sin(phase - j * 0.5) * r * 0.4;
      const tx = Math.cos(tentacleAngle) * dist + Math.cos(tentacleAngle + PI / 2) * wave;
      const ty = r * 0.3 + Math.sin(tentacleAngle) * dist + Math.sin(tentacleAngle + PI / 2) * wave;
      points.push([tx, ty]);
    }
    
    ctx.beginPath();
    ctx.moveTo(0, r * 0.3);
    for (let j = 0; j < points.length; j++) {
      if (j === 0) {
        ctx.lineTo(points[j][0], points[j][1]);
      } else {
        const prev = points[j - 1];
        const curr = points[j];
        const cpx = (prev[0] + curr[0]) / 2;
        const cpy = (prev[1] + curr[1]) / 2;
        ctx.quadraticCurveTo(prev[0], prev[1], cpx, cpy);
      }
    }
    ctx.strokeStyle = `rgba(${100 * colorShift}, ${60 * colorShift}, ${130}, 0.9)`;
    ctx.lineWidth = r * 0.18 - points.length * r * 0.015;
    ctx.stroke();
    
    for (let j = 1; j < points.length; j++) {
      const [tx, ty] = points[j];
      const cupSize = r * 0.08 - j * r * 0.008;
      if (Math.sin(phase + j) > 0) {
        ctx.beginPath();
        ctx.arc(tx, ty, cupSize, 0, TAU);
        ctx.fillStyle = 'rgba(200, 180, 220, 0.5)';
        ctx.fill();
      }
    }
  }
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.3 * d, -r * 0.3, r * 0.25, r * 0.28, 0, 0, TAU);
  ctx.fillStyle = '#f4d03f';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.lineWidth = r * 0.04;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.3 * d, -r * 0.3, r * 0.25, r * 0.28, 0, 0, TAU);
  ctx.fillStyle = '#f4d03f';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.lineWidth = r * 0.04;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.38 * d, -r * 0.36);
  ctx.lineTo(-r * 0.32 * d, -r * 0.26);
  ctx.lineTo(-r * 0.22 * d, -r * 0.36);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = r * 0.06;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.38 * d, -r * 0.36);
  ctx.lineTo(r * 0.32 * d, -r * 0.26);
  ctx.lineTo(r * 0.22 * d, -r * 0.36);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = r * 0.06;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.5 * d, -r * 0.3, r * 0.15, PI, PI * 1.5);
  ctx.strokeStyle = 'rgba(80, 60, 100, 0.7)';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(0, r * 0.1, r * 0.12, PI, TAU);
  ctx.fillStyle = 'rgba(40, 30, 50, 0.8)';
  ctx.fill();
},

scorpion(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  
  for (let i = 0; i < 4; i++) {
    const legPhase = t * 5 + i * PI / 2;
    const legBend = Math.sin(legPhase) * 0.4;
    const xOffset = (i - 1.5) * r * 0.35 * d;
    
    const x1 = xOffset;
    const y1 = 0;
    const x2 = x1 + r * 0.5;
    const y2 = y1 + r * 0.4 + legBend * r * 0.3;
    const x3 = x2 + r * 0.4;
    const y3 = y2 + r * 0.5 - legBend * r * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#6a4a2a';
    ctx.lineWidth = r * 0.12;
    ctx.stroke();
  }
  
  for (let i = 0; i < 4; i++) {
    const legPhase = t * 5 + i * PI / 2 + PI / 4;
    const legBend = Math.sin(legPhase) * 0.4;
    const xOffset = (i - 1.5) * r * 0.35 * d;
    
    const x1 = xOffset;
    const y1 = 0;
    const x2 = x1 - r * 0.5;
    const y2 = y1 + r * 0.4 + legBend * r * 0.3;
    const x3 = x2 - r * 0.4;
    const y3 = y2 + r * 0.5 - legBend * r * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#6a4a2a';
    ctx.lineWidth = r * 0.12;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.ellipse(r * 0.2 * d, 0, r * 0.5, r * 0.4, 0, 0, TAU);
  ctx.fillStyle = '#8a6a3a';
  ctx.fill();
  
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo((r * 0.2 - i * r * 0.15) * d, -r * 0.3);
    ctx.lineTo((r * 0.2 - i * r * 0.15) * d, r * 0.3);
    ctx.strokeStyle = '#6a4a2a';
    ctx.lineWidth = r * 0.05;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.3 * d, 0, r * 0.45, r * 0.35, 0, 0, TAU);
  ctx.fillStyle = '#9a7a4a';
  ctx.fill();
  
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo((-r * 0.3 - i * r * 0.12) * d, -r * 0.25);
    ctx.lineTo((-r * 0.3 - i * r * 0.12) * d, r * 0.25);
    ctx.strokeStyle = '#7a5a3a';
    ctx.lineWidth = r * 0.05;
    ctx.stroke();
  }
  
  const clawSnap = Math.sin(t * 4) * 0.2;
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.95 * d, -r * 0.3, r * 0.35, r * 0.25, clawSnap, 0, TAU);
  ctx.fillStyle = '#aa8a5a';
  ctx.fill();
  ctx.strokeStyle = '#7a5a3a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 1.15 * d, -r * 0.4);
  ctx.lineTo(-r * 1.35 * d, -r * 0.5 + clawSnap * r * 0.3);
  ctx.lineTo(-r * 1.25 * d, -r * 0.25);
  ctx.closePath();
  ctx.fillStyle = '#aa8a5a';
  ctx.fill();
  ctx.strokeStyle = '#7a5a3a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.95 * d, r * 0.3, r * 0.35, r * 0.25, -clawSnap, 0, TAU);
  ctx.fillStyle = '#aa8a5a';
  ctx.fill();
  ctx.strokeStyle = '#7a5a3a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 1.15 * d, r * 0.4);
  ctx.lineTo(-r * 1.35 * d, r * 0.5 - clawSnap * r * 0.3);
  ctx.lineTo(-r * 1.25 * d, r * 0.25);
  ctx.closePath();
  ctx.fillStyle = '#aa8a5a';
  ctx.fill();
  ctx.strokeStyle = '#7a5a3a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  const tailSegments = 5;
  let tailX = r * 0.6 * d;
  let tailY = 0;
  
  for (let i = 0; i < tailSegments; i++) {
    const segLen = r * 0.25;
    const angle = -PI / 3 + Math.sin(t * 4 - i * 0.5) * 0.4;
    const nextX = tailX + Math.cos(angle) * segLen * d;
    const nextY = tailY + Math.sin(angle) * segLen;
    
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(nextX, nextY);
    ctx.strokeStyle = '#8a6a3a';
    ctx.lineWidth = r * 0.2 - i * r * 0.03;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc((tailX + nextX) / 2, (tailY + nextY) / 2, r * 0.12 - i * r * 0.015, 0, TAU);
    ctx.fillStyle = '#7a5a3a';
    ctx.fill();
    
    tailX = nextX;
    tailY = nextY;
  }
  
  const stingerGlow = Math.sin(t * 6) * 0.3 + 0.7;
  ctx.beginPath();
  ctx.arc(tailX, tailY, r * 0.15, 0, TAU);
  ctx.fillStyle = `rgba(255, ${100 * stingerGlow}, 0, ${0.8 * stingerGlow})`;
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(tailX + r * 0.25 * d, tailY - r * 0.3);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.6 * d, r * 0.3);
  ctx.lineTo(-r * 0.5 * d, r * 0.5);
  ctx.lineTo(-r * 0.3 * d, r * 0.5);
  ctx.lineTo(-r * 0.2 * d, r * 0.3);
  ctx.strokeStyle = '#6a4a2a';
  ctx.lineWidth = r * 0.06;
  ctx.stroke();
},

snake_queen(ctx, e) {
  const r = e.radius || 22;
  const t = anim(e);
  const d = fdir(e);
  
  const segments = 12;
  
  for (let i = segments - 1; i >= 0; i--) {
    const wave = Math.sin(t * 4 - i * 0.4) * r * 0.8;
    const segX = (-i * r * 0.35) * d + wave * d;
    const segY = i * r * 0.12;
    const segR = r * (0.9 - i * 0.04);
    
    ctx.beginPath();
    ctx.arc(segX, segY, segR, 0, TAU);
    ctx.fillStyle = '#8a2a2a';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(segX, segY, segR * 0.85, 0, TAU);
    const gradient = ctx.createRadialGradient(segX, segY - segR * 0.3, 0, segX, segY, segR);
    gradient.addColorStop(0, '#aa4a4a');
    gradient.addColorStop(1, '#6a1a1a');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    if (i < segments - 1) {
      const boneAngle = i * 0.5;
      ctx.beginPath();
      ctx.moveTo(segX - segR * 0.6 * Math.cos(boneAngle), segY - segR * 0.3);
      ctx.lineTo(segX + segR * 0.6 * Math.cos(boneAngle), segY - segR * 0.3);
      ctx.moveTo(segX - segR * 0.5 * Math.cos(boneAngle), segY);
      ctx.lineTo(segX + segR * 0.5 * Math.cos(boneAngle), segY);
      ctx.moveTo(segX - segR * 0.4 * Math.cos(boneAngle), segY + segR * 0.3);
      ctx.lineTo(segX + segR * 0.4 * Math.cos(boneAngle), segY + segR * 0.3);
      ctx.strokeStyle = 'rgba(200, 180, 140, 0.5)';
      ctx.lineWidth = r * 0.06;
      ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.moveTo(segX, segY + segR * 0.5);
    ctx.lineTo(segX, segY + segR * 0.8);
    ctx.strokeStyle = '#4a1a1a';
    ctx.lineWidth = segR * 0.3;
    ctx.stroke();
  }
  
  const headX = 0;
  const headY = 0;
  
  ctx.beginPath();
  ctx.ellipse(headX, headY, r * 0.8, r * 0.6, 0, 0, TAU);
  ctx.fillStyle = '#aa3a3a';
  ctx.fill();
  
  const crownPoints = 5;
  for (let i = 0; i < crownPoints; i++) {
    const angle = -PI - (i - 2) * 0.25;
    const baseR = r * 0.7;
    const tipR = r * 1.1;
    const baseX = headX + Math.cos(angle) * baseR;
    const baseY = headY + Math.sin(angle) * baseR * 0.6;
    const tipX = headX + Math.cos(angle) * tipR;
    const tipY = headY + Math.sin(angle) * tipR * 0.6;
    
    ctx.beginPath();
    ctx.moveTo(baseX - r * 0.12, baseY);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(baseX + r * 0.12, baseY);
    ctx.closePath();
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = r * 0.04;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(tipX, tipY, r * 0.1, 0, TAU);
    ctx.fillStyle = '#ff1493';
    ctx.fill();
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = r * 0.03;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.arc(headX + r * 0.45 * d, headY - r * 0.2, r * 0.22, 0, TAU);
  ctx.fillStyle = '#ffff00';
  ctx.fill();
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = r * 0.05;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(headX + r * 0.47 * d, headY - r * 0.2, r * 0.06, r * 0.15, 0, 0, TAU);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  
  const glow = Math.sin(t * 5) * 0.3 + 0.7;
  ctx.beginPath();
  ctx.arc(headX + r * 0.47 * d, headY - r * 0.25, r * 0.08, 0, TAU);
  ctx.fillStyle = `rgba(255, 255, 0, ${glow})`;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(headX + r * 0.35 * d, headY - r * 0.32, r * 0.1, 0, TAU);
  ctx.fillStyle = '#3a1a1a';
  ctx.fill();
  
  const tongueFlick = Math.sin(t * 10) * 0.5 + 0.5;
  if (tongueFlick > 0.2) {
    const tongueLen = tongueFlick * r * 0.8;
    ctx.beginPath();
    ctx.moveTo(headX + r * 0.8 * d, headY);
    ctx.lineTo(headX + (r * 0.8 + tongueLen) * d, headY - r * 0.1);
    ctx.moveTo(headX + (r * 0.8 + tongueLen) * d, headY - r * 0.1);
    ctx.lineTo(headX + (r * 0.8 + tongueLen + r * 0.15) * d, headY - r * 0.25);
    ctx.moveTo(headX + (r * 0.8 + tongueLen) * d, headY - r * 0.1);
    ctx.lineTo(headX + (r * 0.8 + tongueLen + r * 0.15) * d, headY + r * 0.05);
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = r * 0.06;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.moveTo(headX - r * 0.6 * d, headY - r * 0.4);
  ctx.lineTo(headX - r * 0.4 * d, headY - r * 0.6);
  ctx.lineTo(headX - r * 0.2 * d, headY - r * 0.4);
  ctx.fillStyle = '#6a1a1a';
  ctx.fill();
},

boss(ctx, e) {
  CreatureSprites._sprites.snake_queen(ctx, e);
},

sand_worm(ctx, e) {
  const r = e.radius || 30;
  const t = anim(e);
  const d = fdir(e);
  
  const segments = 15;
  
  for (let i = segments - 1; i >= 0; i--) {
    const wave = Math.sin(t * 3 - i * 0.3) * r * 0.5;
    const segX = (-i * r * 0.4) * d + wave * d;
    const segY = i * r * 0.15;
    const segR = r * (0.95 - i * 0.03);
    
    ctx.beginPath();
    ctx.arc(segX, segY, segR, 0, TAU);
    const gradient = ctx.createLinearGradient(segX, segY - segR, segX, segY + segR);
    gradient.addColorStop(0, '#d4a574');
    gradient.addColorStop(0.5, '#c4956a');
    gradient.addColorStop(1, '#a4755a');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    for (let j = 0; j < 6; j++) {
      const lineAngle = (j / 6) * TAU;
      const lx = segX + Math.cos(lineAngle) * segR * 0.8;
      const ly = segY + Math.sin(lineAngle) * segR * 0.8;
      ctx.beginPath();
      ctx.arc(lx, ly, segR * 0.15, 0, TAU);
      ctx.fillStyle = '#b48564';
      ctx.fill();
      ctx.strokeStyle = '#947555';
      ctx.lineWidth = r * 0.04;
      ctx.stroke();
    }
    
    if (i > 0 && i < segments - 1) {
      ctx.beginPath();
      ctx.arc(segX, segY - segR * 0.5, segR * 0.12, 0, TAU);
      ctx.fillStyle = 'rgba(20, 20, 20, 0.4)';
      ctx.fill();
    }
  }
  
  const headX = 0;
  const headY = 0;
  
  const jawOpen = Math.sin(t * 2) * 0.4 + 0.5;
  
  ctx.save();
  ctx.translate(headX, headY);
  
  for (let j = 0; j < 3; j++) {
    const jawAngle = (j / 3) * TAU - PI / 2;
    const openAngle = jawAngle + jawOpen * 0.6;
    
    ctx.save();
    ctx.rotate(openAngle);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.8, -r * 0.3);
    ctx.lineTo(r * 0.9, 0);
    ctx.lineTo(r * 0.8, r * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#c4956a';
    ctx.fill();
    ctx.strokeStyle = '#947555';
    ctx.lineWidth = r * 0.06;
    ctx.stroke();
    
    for (let k = 0; k < 8; k++) {
      const toothY = -r * 0.25 + k * r * 0.06;
      ctx.beginPath();
      ctx.moveTo(r * 0.8, toothY);
      ctx.lineTo(r * 0.65, toothY - r * 0.08);
      ctx.lineTo(r * 0.65, toothY + r * 0.08);
      ctx.closePath();
      ctx.fillStyle = '#e4d5c5';
      ctx.fill();
      ctx.strokeStyle = '#a4755a';
      ctx.lineWidth = r * 0.02;
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.5, 0, TAU);
  ctx.fillStyle = '#1a0a0a';
  ctx.fill();
  
  for (let ring = 1; ring <= 3; ring++) {
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.5 - ring * r * 0.08, 0, TAU);
    ctx.strokeStyle = `rgba(140, 70, 70, ${0.4 / ring})`;
    ctx.lineWidth = r * 0.05;
    ctx.stroke();
  }
  
  ctx.restore();
},

frost_crab(ctx, e) {
  const r = e.radius || 32;
  const t = anim(e);
  const d = fdir(e);
  
  for (let i = 0; i < 3; i++) {
    const side = 1;
    const legPhase = t * 4 + i * PI / 1.5;
    const legBend = Math.sin(legPhase) * 0.3;
    const xOffset = (i - 1) * r * 0.5 * d;
    const x1 = xOffset;
    const y1 = 0;
    const x2 = x1 + side * r * 0.7;
    const y2 = y1 + r * 0.5 + legBend * r * 0.4;
    const x3 = x2 + side * r * 0.6;
    const y3 = y2 + r * 0.7 - legBend * r * 0.3;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#4a8aaa';
    ctx.lineWidth = r * 0.18;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x2, y2, r * 0.12, 0, TAU);
    ctx.fillStyle = '#6aaacc';
    ctx.fill();
  }
  
  for (let i = 0; i < 3; i++) {
    const side = -1;
    const legPhase = t * 4 + i * PI / 1.5 + PI / 3;
    const legBend = Math.sin(legPhase) * 0.3;
    const xOffset = (i - 1) * r * 0.5 * d;
    const x1 = xOffset;
    const y1 = 0;
    const x2 = x1 + side * r * 0.7;
    const y2 = y1 + r * 0.5 + legBend * r * 0.4;
    const x3 = x2 + side * r * 0.6;
    const y3 = y2 + r * 0.7 - legBend * r * 0.3;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = '#4a8aaa';
    ctx.lineWidth = r * 0.18;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x2, y2, r * 0.12, 0, TAU);
    ctx.fillStyle = '#6aaacc';
    ctx.fill();
  }
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.95, r * 0.75, 0, 0, TAU);
  ctx.fillStyle = '#5a9aba';
  ctx.fill();
  
  const gradient = ctx.createRadialGradient(0, -r * 0.3, 0, 0, 0, r);
  gradient.addColorStop(0, 'rgba(200, 230, 255, 0.6)');
  gradient.addColorStop(1, 'rgba(90, 154, 186, 0.3)');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  for (let i = 0; i < 8; i++) {
    const spikeAngle = (i / 8) * TAU;
    const sx = Math.cos(spikeAngle) * r * 0.75;
    const sy = Math.sin(spikeAngle) * r * 0.6;
    const tipX = Math.cos(spikeAngle) * r * 1.1;
    const tipY = Math.sin(spikeAngle) * r * 0.85;
    
    ctx.beginPath();
    ctx.moveTo(sx - Math.cos(spikeAngle + PI / 2) * r * 0.1, sy - Math.sin(spikeAngle + PI / 2) * r * 0.08);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(sx + Math.cos(spikeAngle + PI / 2) * r * 0.1, sy + Math.sin(spikeAngle + PI / 2) * r * 0.08);
    ctx.closePath();
    ctx.fillStyle = '#a0d0f0';
    ctx.fill();
    ctx.strokeStyle = '#80b0d0';
    ctx.lineWidth = r * 0.03;
    ctx.stroke();
  }
  
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      const px = (i - 2.5) * r * 0.3;
      const py = (j - 1.5) * r * 0.3;
      ctx.beginPath();
      ctx.moveTo(px - r * 0.08, py);
      ctx.lineTo(px, py - r * 0.08);
      ctx.lineTo(px + r * 0.08, py);
      ctx.lineTo(px, py + r * 0.08);
      ctx.closePath();
      ctx.fillStyle = 'rgba(180, 220, 255, 0.4)';
      ctx.fill();
    }
  }
  
  const eyeGlow = Math.sin(t * 5) * 0.3 + 0.7;
  ctx.beginPath();
  ctx.arc(-r * 0.35 * d, -r * 0.3, r * 0.2, 0, TAU);
  ctx.fillStyle = `rgba(0, 255, 255, ${eyeGlow})`;
  ctx.fill();
  ctx.strokeStyle = '#00aaaa';
  ctx.lineWidth = r * 0.06;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.35 * d, -r * 0.3, r * 0.2, 0, TAU);
  ctx.fillStyle = `rgba(0, 255, 255, ${eyeGlow})`;
  ctx.fill();
  ctx.strokeStyle = '#00aaaa';
  ctx.lineWidth = r * 0.06;
  ctx.stroke();
  
  const clawSnap = Math.sin(t * 3) * 0.3;
  
  ctx.beginPath();
  ctx.ellipse(-r * 1.2 * d, -r * 0.3, r * 0.7, r * 0.5, clawSnap, 0, TAU);
  ctx.fillStyle = '#6aaacc';
  ctx.fill();
  ctx.strokeStyle = '#4a8aaa';
  ctx.lineWidth = r * 0.1;
  ctx.stroke();
  
  for (let i = 0; i < 3; i++) {
    const iceX = -r * 1.2 * d + (i - 1) * r * 0.25;
    const iceY = -r * 0.5 + Math.sin(clawSnap + i) * r * 0.15;
    ctx.beginPath();
    ctx.moveTo(iceX - r * 0.08, iceY);
    ctx.lineTo(iceX, iceY - r * 0.15);
    ctx.lineTo(iceX + r * 0.08, iceY);
    ctx.lineTo(iceX, iceY + r * 0.05);
    ctx.closePath();
    ctx.fillStyle = '#c0e0ff';
    ctx.fill();
  }
  
  ctx.beginPath();
  ctx.moveTo(-r * 1.5 * d, -r * 0.4);
  ctx.lineTo(-r * 1.8 * d, -r * 0.6 + clawSnap * r * 0.4);
  ctx.lineTo(-r * 1.6 * d, -r * 0.2);
  ctx.closePath();
  ctx.fillStyle = '#a0d0f0';
  ctx.fill();
  ctx.strokeStyle = '#80b0d0';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(r * 1.2 * d, -r * 0.3, r * 0.7, r * 0.5, -clawSnap, 0, TAU);
  ctx.fillStyle = '#6aaacc';
  ctx.fill();
  ctx.strokeStyle = '#4a8aaa';
  ctx.lineWidth = r * 0.1;
  ctx.stroke();
  
  for (let i = 0; i < 3; i++) {
    const iceX = r * 1.2 * d + (i - 1) * r * 0.25;
    const iceY = -r * 0.5 + Math.sin(-clawSnap + i) * r * 0.15;
    ctx.beginPath();
    ctx.moveTo(iceX - r * 0.08, iceY);
    ctx.lineTo(iceX, iceY - r * 0.15);
    ctx.lineTo(iceX + r * 0.08, iceY);
    ctx.lineTo(iceX, iceY + r * 0.05);
    ctx.closePath();
    ctx.fillStyle = '#c0e0ff';
    ctx.fill();
  }
  
  ctx.beginPath();
  ctx.moveTo(r * 1.5 * d, -r * 0.4);
  ctx.lineTo(r * 1.8 * d, -r * 0.6 - clawSnap * r * 0.4);
  ctx.lineTo(r * 1.6 * d, -r * 0.2);
  ctx.closePath();
  ctx.fillStyle = '#a0d0f0';
  ctx.fill();
  ctx.strokeStyle = '#80b0d0';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  for (let i = 0; i < 8; i++) {
    const px = Math.sin(i * 1.7 + 0.5) * r * 1.2;
    const py = Math.cos(i * 2.3 + 1.1) * r * 0.8 + r * 0.5;
    const pSize = (Math.sin(i * 3.1) * 0.5 + 0.5) * r * 0.08 + r * 0.05;
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, TAU);
    ctx.fillStyle = 'rgba(200, 240, 255, 0.6)';
    ctx.fill();
  }
},

kraken_boss(ctx, e) {
  const r = e.radius || 34;
  const t = anim(e);
  const d = fdir(e);
  
  for (let i = 0; i < 8; i++) {
    const tentacleAngle = (i / 8) * TAU - PI / 2;
    const phase = t * 2.5 + i * 0.8;
    
    const points = [];
    for (let j = 0; j < 12; j++) {
      const dist = j * r * 0.4;
      const wave = Math.sin(phase - j * 0.4) * r * 0.6;
      const tx = Math.cos(tentacleAngle) * dist + Math.cos(tentacleAngle + PI / 2) * wave;
      const ty = r * 0.4 + Math.sin(tentacleAngle) * dist + Math.sin(tentacleAngle + PI / 2) * wave;
      points.push([tx, ty]);
    }
    
    ctx.beginPath();
    ctx.moveTo(0, r * 0.4);
    for (let j = 0; j < points.length; j++) {
      if (j === 0) {
        ctx.lineTo(points[j][0], points[j][1]);
      } else {
        const prev = points[j - 1];
        const curr = points[j];
        const cpx = (prev[0] + curr[0]) / 2;
        const cpy = (prev[1] + curr[1]) / 2;
        ctx.quadraticCurveTo(prev[0], prev[1], cpx, cpy);
      }
    }
    ctx.strokeStyle = '#2a1a3a';
    ctx.lineWidth = r * 0.25 - points.length * r * 0.015;
    ctx.stroke();
    
    for (let j = 1; j < points.length; j++) {
      const [tx, ty] = points[j];
      const cupSize = r * 0.15 - j * r * 0.01;
      
      for (let k = 0; k < 2; k++) {
        const cupOffset = (k - 0.5) * r * 0.15;
        const angle = Math.atan2(ty - r * 0.4, tx);
        const perpX = tx + Math.cos(angle + PI / 2) * cupOffset;
        const perpY = ty + Math.sin(angle + PI / 2) * cupOffset;
        
        ctx.beginPath();
        ctx.arc(perpX, perpY, cupSize, 0, TAU);
        ctx.fillStyle = '#5a4a6a';
        ctx.fill();
        ctx.strokeStyle = '#3a2a4a';
        ctx.lineWidth = r * 0.03;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(perpX, perpY, cupSize * 0.5, 0, TAU);
        ctx.fillStyle = '#7a6a8a';
        ctx.fill();
      }
    }
  }
  
  ctx.beginPath();
  ctx.arc(0, -r * 0.3, r * 0.9, 0, TAU);
  ctx.fillStyle = '#3a2a5a';
  ctx.fill();
  
  const gradient = ctx.createRadialGradient(0, -r * 0.5, 0, 0, -r * 0.3, r * 0.9);
  gradient.addColorStop(0, 'rgba(80, 60, 120, 0.8)');
  gradient.addColorStop(1, 'rgba(40, 30, 70, 0.9)');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  for (let i = 0; i < 5; i++) {
    const scarAngle = -PI / 4 + i * 0.3;
    const scarStart = r * 0.3;
    const scarEnd = r * 0.7;
    ctx.beginPath();
    ctx.moveTo(Math.cos(scarAngle) * scarStart, -r * 0.3 + Math.sin(scarAngle) * scarStart);
    ctx.lineTo(Math.cos(scarAngle) * scarEnd, -r * 0.3 + Math.sin(scarAngle) * scarEnd);
    ctx.strokeStyle = 'rgba(80, 60, 100, 0.6)';
    ctx.lineWidth = r * 0.05;
    ctx.stroke();
  }
  
  const bioGlow = Math.sin(t * 4) * 0.4 + 0.6;
  for (let i = 0; i < 20; i++) {
    const spotAngle = (i / 20) * TAU + t * 0.5;
    const spotDist = r * 0.5 + Math.sin(t * 3 + i * 0.3) * r * 0.2;
    const sx = Math.cos(spotAngle) * spotDist;
    const sy = -r * 0.3 + Math.sin(spotAngle) * spotDist * 0.7;
    const spotSize = r * 0.08 + Math.sin(t * 5 + i) * r * 0.03;
    
    ctx.beginPath();
    ctx.arc(sx, sy, spotSize, 0, TAU);
    ctx.fillStyle = `rgba(100, 200, 255, ${0.5 * bioGlow})`;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(sx, sy, spotSize * 1.5, 0, TAU);
    ctx.strokeStyle = `rgba(150, 220, 255, ${0.3 * bioGlow})`;
    ctx.lineWidth = r * 0.02;
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.4 * d, -r * 0.5, r * 0.35, r * 0.4, 0, 0, TAU);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  ctx.strokeStyle = '#5a4a7a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.4 * d, -r * 0.5, r * 0.35, r * 0.4, 0, 0, TAU);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  ctx.strokeStyle = '#5a4a7a';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();
  
  const angerGlow = Math.sin(t * 6) * 0.4 + 0.6;
  ctx.beginPath();
  ctx.arc(-r * 0.4 * d, -r * 0.5, r * 0.18, 0, TAU);
  ctx.fillStyle = `rgba(255, 0, 0, ${angerGlow})`;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.4 * d, -r * 0.5, r * 0.18, 0, TAU);
  ctx.fillStyle = `rgba(255, 0, 0, ${angerGlow})`;
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.42 * d, -r * 0.5, r * 0.08, r * 0.14, -0.3, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.42 * d, -r * 0.5, r * 0.08, r * 0.14, 0.3, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(0, -r * 0.1, r * 0.2, 0, PI);
  ctx.fillStyle = '#2a1a2a';
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.15, -r * 0.15);
  ctx.lineTo(-r * 0.05, -r * 0.2);
  ctx.lineTo(r * 0.05, -r * 0.2);
  ctx.lineTo(r * 0.15, -r * 0.15);
  ctx.fillStyle = '#e4d5c5';
  ctx.fill();
  ctx.strokeStyle = '#2a1a2a';
  ctx.lineWidth = r * 0.04;
  ctx.stroke();
},

        // ============================================================
        //  Evolution forms
        // ============================================================

crab_form(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  
  const legWave = Math.sin(t * 8) * 0.3;
  
  // Walking legs (8 total, 4 per side)
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 4; i++) {
      const legAngle = (i / 3) * 0.6 - 0.3;
      const phase = i * 0.5;
      const bend = Math.sin(t * 8 + phase) * 0.4;
      
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      
      const x1 = Math.cos(legAngle) * r * 0.6;
      const y1 = Math.sin(legAngle) * r * 0.6 * side;
      const x2 = x1 + Math.cos(legAngle + bend) * r * 0.8;
      const y2 = y1 + Math.sin(legAngle + bend) * r * 0.8 * side;
      const x3 = x2 + Math.cos(legAngle + bend + 0.6) * r * 0.6;
      const y3 = y2 + Math.sin(legAngle + bend + 0.6) * r * 0.6 * side;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.stroke();
    }
  }
  
  // Main shell body
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9, r * 0.7, 0, 0, TAU);
  ctx.fillStyle = '#CD5C5C';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Shell segment lines
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * r * 0.25, -r * 0.5);
    ctx.lineTo(i * r * 0.25, r * 0.5);
    ctx.strokeStyle = '#A0522D';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Shell highlights
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.2, r * 0.3, r * 0.2, -0.3, 0, TAU);
  ctx.fillStyle = 'rgba(255, 200, 200, 0.3)';
  ctx.fill();
  
  // Left claw
  ctx.save();
  ctx.translate(-r * 1.2, 0);
  ctx.rotate(Math.sin(t * 3) * 0.2 - 0.3);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.4, r * 0.25, 0, 0, TAU);
  ctx.fillStyle = '#DC143C';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Claw pincers
  ctx.beginPath();
  ctx.moveTo(r * 0.4, -r * 0.1);
  ctx.lineTo(r * 0.7, -r * 0.3);
  ctx.lineTo(r * 0.6, -r * 0.2);
  ctx.closePath();
  ctx.fillStyle = '#B22222';
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.4, r * 0.1);
  ctx.lineTo(r * 0.7, r * 0.3);
  ctx.lineTo(r * 0.6, r * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
  
  // Right claw
  ctx.save();
  ctx.translate(r * 1.2, 0);
  ctx.rotate(-Math.sin(t * 3) * 0.2 + 0.3);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.4, r * 0.25, 0, 0, TAU);
  ctx.fillStyle = '#DC143C';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.4, -r * 0.1);
  ctx.lineTo(-r * 0.7, -r * 0.3);
  ctx.lineTo(-r * 0.6, -r * 0.2);
  ctx.closePath();
  ctx.fillStyle = '#B22222';
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.4, r * 0.1);
  ctx.lineTo(-r * 0.7, r * 0.3);
  ctx.lineTo(-r * 0.6, r * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
  
  // Eye stalks
  const eyeBob = Math.sin(t * 4) * 0.1;
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, -r * 0.4);
  ctx.lineTo(-r * 0.4, -r * 0.8 + eyeBob);
  ctx.strokeStyle = '#CD5C5C';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.3, -r * 0.4);
  ctx.lineTo(r * 0.4, -r * 0.8 + eyeBob);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(-r * 0.4, -r * 0.8 + eyeBob, r * 0.15, 0, TAU);
  ctx.fillStyle = '#FFF';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(-r * 0.4 + d * 0.05 * r, -r * 0.8 + eyeBob, r * 0.08, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.4, -r * 0.8 + eyeBob, r * 0.15, 0, TAU);
  ctx.fillStyle = '#FFF';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.4 + d * 0.05 * r, -r * 0.8 + eyeBob, r * 0.08, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
},

crab_king(ctx, e) {
  const r = e.radius || 18;
  const t = anim(e);
  const d = fdir(e);
  
  const legWave = Math.sin(t * 8) * 0.3;
  const glow = Math.sin(t * 5) * 0.3 + 0.7;
  
  // Thick royal legs (8 total)
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 4; i++) {
      const legAngle = (i / 3) * 0.6 - 0.3;
      const phase = i * 0.5;
      const bend = Math.sin(t * 8 + phase) * 0.4;
      
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      const x1 = Math.cos(legAngle) * r * 0.6;
      const y1 = Math.sin(legAngle) * r * 0.6 * side;
      const x2 = x1 + Math.cos(legAngle + bend) * r * 0.8;
      const y2 = y1 + Math.sin(legAngle + bend) * r * 0.8 * side;
      const x3 = x2 + Math.cos(legAngle + bend + 0.6) * r * 0.6;
      const y3 = y2 + Math.sin(legAngle + bend + 0.6) * r * 0.6 * side;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.stroke();
    }
  }
  
  // Cape-like dorsal shell
  ctx.beginPath();
  ctx.moveTo(-r * 0.9, -r * 0.6);
  ctx.quadraticCurveTo(-r * 1.2, -r * 1.2, -r * 0.7, -r * 1.5);
  ctx.lineTo(r * 0.7, -r * 1.5);
  ctx.quadraticCurveTo(r * 1.2, -r * 1.2, r * 0.9, -r * 0.6);
  ctx.fillStyle = '#8B0000';
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Main royal shell
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.95, r * 0.75, 0, 0, TAU);
  ctx.fillStyle = '#DC143C';
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Gold ornamental patterns
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * r * 0.3, -r * 0.6);
    ctx.lineTo(i * r * 0.3, r * 0.6);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Glowing jewel on shell
  ctx.beginPath();
  ctx.arc(0, -r * 0.2, r * 0.25, 0, TAU);
  ctx.fillStyle = `rgba(0, 255, 255, ${glow})`;
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Jewel inner glow
  ctx.beginPath();
  ctx.arc(0, -r * 0.2, r * 0.15, 0, TAU);
  ctx.fillStyle = `rgba(255, 255, 255, ${glow * 0.8})`;
  ctx.fill();
  
  // Massive left claw with serrations
  ctx.save();
  ctx.translate(-r * 1.3, 0);
  ctx.rotate(Math.sin(t * 3) * 0.2 - 0.2);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.5, r * 0.35, 0, 0, TAU);
  ctx.fillStyle = '#B22222';
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Serrated upper pincer
  ctx.beginPath();
  ctx.moveTo(r * 0.5, -r * 0.15);
  for (let i = 0; i < 5; i++) {
    const x = r * 0.5 + i * r * 0.15;
    const y = -r * 0.3 + (i % 2) * r * 0.1;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(r * 0.7, -r * 0.15);
  ctx.closePath();
  ctx.fillStyle = '#8B0000';
  ctx.fill();
  ctx.stroke();
  
  // Serrated lower pincer
  ctx.beginPath();
  ctx.moveTo(r * 0.5, r * 0.15);
  for (let i = 0; i < 5; i++) {
    const x = r * 0.5 + i * r * 0.15;
    const y = r * 0.3 - (i % 2) * r * 0.1;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(r * 0.7, r * 0.15);
  ctx.closePath();
  ctx.fillStyle = '#8B0000';
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
  
  // Massive right claw with serrations
  ctx.save();
  ctx.translate(r * 1.3, 0);
  ctx.rotate(-Math.sin(t * 3) * 0.2 + 0.2);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.5, r * 0.35, 0, 0, TAU);
  ctx.fillStyle = '#B22222';
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.5, -r * 0.15);
  for (let i = 0; i < 5; i++) {
    const x = -r * 0.5 - i * r * 0.15;
    const y = -r * 0.3 + (i % 2) * r * 0.1;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(-r * 0.7, -r * 0.15);
  ctx.closePath();
  ctx.fillStyle = '#8B0000';
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.5, r * 0.15);
  for (let i = 0; i < 5; i++) {
    const x = -r * 0.5 - i * r * 0.15;
    const y = r * 0.3 - (i % 2) * r * 0.1;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(-r * 0.7, r * 0.15);
  ctx.closePath();
  ctx.fillStyle = '#8B0000';
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
  
  // Crown spines
  for (let i = -2; i <= 2; i++) {
    const height = i === 0 ? r * 1.2 : r * 0.9;
    ctx.beginPath();
    ctx.moveTo(i * r * 0.25, -r * 0.7);
    ctx.lineTo(i * r * 0.25, -height);
    ctx.lineTo(i * r * 0.25 - r * 0.1, -height + r * 0.2);
    ctx.moveTo(i * r * 0.25, -height);
    ctx.lineTo(i * r * 0.25 + r * 0.1, -height + r * 0.2);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  
  // Eye stalks
  const eyeBob = Math.sin(t * 4) * 0.1;
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.4, -r * 0.5);
  ctx.lineTo(-r * 0.5, -r * 0.9 + eyeBob);
  ctx.strokeStyle = '#DC143C';
  ctx.lineWidth = 4;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.4, -r * 0.5);
  ctx.lineTo(r * 0.5, -r * 0.9 + eyeBob);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(-r * 0.5, -r * 0.9 + eyeBob, r * 0.18, 0, TAU);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(-r * 0.5 + d * 0.05 * r, -r * 0.9 + eyeBob, r * 0.1, 0, TAU);
  ctx.fillStyle = '#8B0000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.5, -r * 0.9 + eyeBob, r * 0.18, 0, TAU);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.5 + d * 0.05 * r, -r * 0.9 + eyeBob, r * 0.1, 0, TAU);
  ctx.fillStyle = '#8B0000';
  ctx.fill();
},

lizard_form(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  
  const run = Math.sin(t * 10);
  
  // Tail
  ctx.beginPath();
  const tailSegs = 12;
  ctx.moveTo(-r * 0.6, 0);
  for (let i = 0; i < tailSegs; i++) {
    const prog = i / tailSegs;
    const x = -r * 0.6 - prog * r * 1.5;
    const y = Math.sin(t * 8 + prog * 5) * r * 0.5;
    const width = r * 0.3 * (1 - prog * 0.6);
    if (i === 0) {
      ctx.lineTo(x, y + width);
    } else {
      ctx.lineTo(x, y + width);
    }
  }
  for (let i = tailSegs - 1; i >= 0; i--) {
    const prog = i / tailSegs;
    const x = -r * 0.6 - prog * r * 1.5;
    const y = Math.sin(t * 8 + prog * 5) * r * 0.5;
    const width = r * 0.3 * (1 - prog * 0.6);
    ctx.lineTo(x, y - width);
  }
  ctx.closePath();
  ctx.fillStyle = '#6B8E23';
  ctx.fill();
  ctx.strokeStyle = '#556B2F';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Hind left leg
  ctx.save();
  ctx.translate(-r * 0.4, r * 0.5);
  ctx.rotate(run * 0.4);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, r * 0.5);
  ctx.lineTo(-r * 0.3, r * 0.8);
  ctx.strokeStyle = '#6B8E23';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-r * 0.3, r * 0.8, r * 0.12, 0, TAU);
  ctx.fillStyle = '#556B2F';
  ctx.fill();
  ctx.restore();
  
  // Hind right leg
  ctx.save();
  ctx.translate(-r * 0.4, -r * 0.5);
  ctx.rotate(-run * 0.4);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -r * 0.5);
  ctx.lineTo(-r * 0.3, -r * 0.8);
  ctx.strokeStyle = '#6B8E23';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-r * 0.3, -r * 0.8, r * 0.12, 0, TAU);
  ctx.fillStyle = '#556B2F';
  ctx.fill();
  ctx.restore();
  
  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.8, r * 0.5, 0, 0, TAU);
  ctx.fillStyle = '#8FBC8F';
  ctx.fill();
  ctx.strokeStyle = '#556B2F';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Scale pattern
  for (let y = -r * 0.4; y <= r * 0.4; y += r * 0.2) {
    for (let x = -r * 0.6; x <= r * 0.6; x += r * 0.2) {
      ctx.beginPath();
      ctx.arc(x, y, r * 0.08, 0, TAU);
      ctx.strokeStyle = '#6B8E23';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  
  // Front left leg
  ctx.save();
  ctx.translate(r * 0.4, r * 0.4);
  ctx.rotate(-run * 0.5);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, r * 0.4);
  ctx.lineTo(r * 0.3, r * 0.7);
  ctx.strokeStyle = '#6B8E23';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(r * 0.3, r * 0.7, r * 0.12, 0, TAU);
  ctx.fillStyle = '#556B2F';
  ctx.fill();
  ctx.restore();
  
  // Front right leg
  ctx.save();
  ctx.translate(r * 0.4, -r * 0.4);
  ctx.rotate(run * 0.5);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -r * 0.4);
  ctx.lineTo(r * 0.3, -r * 0.7);
  ctx.strokeStyle = '#6B8E23';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(r * 0.3, -r * 0.7, r * 0.12, 0, TAU);
  ctx.fillStyle = '#556B2F';
  ctx.fill();
  ctx.restore();
  
  // Head
  ctx.beginPath();
  ctx.ellipse(r * 0.7, 0, r * 0.45, r * 0.35, 0, 0, TAU);
  ctx.fillStyle = '#9ACD32';
  ctx.fill();
  ctx.strokeStyle = '#556B2F';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Eyes (yellow slit pupils)
  ctx.beginPath();
  ctx.arc(r * 0.8, -r * 0.2, r * 0.15, 0, TAU);
  ctx.fillStyle = '#FFFF00';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.8 + d * 0.03 * r, -r * 0.2, r * 0.04, r * 0.12, 0, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.8, r * 0.2, r * 0.15, 0, TAU);
  ctx.fillStyle = '#FFFF00';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.8 + d * 0.03 * r, r * 0.2, r * 0.04, r * 0.12, 0, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  // Forked tongue
  const tongueOut = Math.max(0, Math.sin(t * 6));
  if (tongueOut > 0.1) {
    ctx.beginPath();
    ctx.moveTo(r * 1.1, 0);
    ctx.lineTo(r * 1.1 + tongueOut * r * 0.4, -tongueOut * r * 0.1);
    ctx.moveTo(r * 1.1, 0);
    ctx.lineTo(r * 1.1 + tongueOut * r * 0.4, tongueOut * r * 0.1);
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
},

dragon_form(ctx, e) {
  const r = e.radius || 18;
  const t = anim(e);
  const d = fdir(e);
  
  const wingFlap = Math.sin(t * 6) * 0.4;
  const breathe = Math.sin(t * 3) * 0.1;
  
  // Left wing
  ctx.save();
  ctx.translate(-r * 0.5, -r * 0.3);
  ctx.rotate(-0.3 + wingFlap);
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-r * 0.8, -r * 0.6, -r * 1.2, -r * 0.3);
  ctx.quadraticCurveTo(-r * 1.0, -r * 0.1, -r * 0.6, 0);
  ctx.closePath();
  ctx.fillStyle = 'rgba(139, 0, 0, 0.7)';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Wing membrane lines
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-r * 0.3 * i, -r * 0.4);
    ctx.strokeStyle = '#6B0000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  ctx.restore();
  
  // Right wing
  ctx.save();
  ctx.translate(-r * 0.5, r * 0.3);
  ctx.rotate(0.3 - wingFlap);
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-r * 0.8, r * 0.6, -r * 1.2, r * 0.3);
  ctx.quadraticCurveTo(-r * 1.0, r * 0.1, -r * 0.6, 0);
  ctx.closePath();
  ctx.fillStyle = 'rgba(139, 0, 0, 0.7)';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-r * 0.3 * i, r * 0.4);
    ctx.strokeStyle = '#6B0000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  ctx.restore();
  
  // Serpentine tail
  ctx.beginPath();
  const tailSegs = 15;
  ctx.moveTo(-r * 0.6, 0);
  for (let i = 0; i < tailSegs; i++) {
    const prog = i / tailSegs;
    const x = -r * 0.6 - prog * r * 2;
    const y = Math.sin(t * 7 + prog * 6) * r * 0.6;
    const width = r * 0.25 * (1 - prog * 0.7);
    if (i === 0) {
      ctx.lineTo(x, y + width);
    } else {
      ctx.lineTo(x, y + width);
    }
  }
  for (let i = tailSegs - 1; i >= 0; i--) {
    const prog = i / tailSegs;
    const x = -r * 0.6 - prog * r * 2;
    const y = Math.sin(t * 7 + prog * 6) * r * 0.6;
    const width = r * 0.25 * (1 - prog * 0.7);
    ctx.lineTo(x, y - width);
  }
  ctx.closePath();
  ctx.fillStyle = '#DC143C';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Hind legs
  for (let side = -1; side <= 1; side += 2) {
    ctx.save();
    ctx.translate(-r * 0.3, side * r * 0.6);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.2, side * r * 0.5);
    ctx.lineTo(r * 0.4, side * r * 0.7);
    ctx.strokeStyle = '#B22222';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Claws
    for (let c = -1; c <= 1; c++) {
      ctx.beginPath();
      ctx.moveTo(r * 0.4, side * r * 0.7);
      ctx.lineTo(r * 0.5 + c * 0.1 * r, side * r * 0.85);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }
  
  // Main body
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9, r * 0.65, 0, 0, TAU);
  ctx.fillStyle = '#DC143C';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Flame-orange belly
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.7, r * 0.4, 0, 0, TAU);
  ctx.fillStyle = '#FF8C00';
  ctx.fill();
  
  // Spined back ridge
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * r * 0.2, -r * 0.65);
    ctx.lineTo(i * r * 0.2 - r * 0.08, -r * 0.85);
    ctx.lineTo(i * r * 0.2, -r * 0.95);
    ctx.lineTo(i * r * 0.2 + r * 0.08, -r * 0.85);
    ctx.closePath();
    ctx.fillStyle = '#8B0000';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Front legs
  for (let side = -1; side <= 1; side += 2) {
    ctx.save();
    ctx.translate(r * 0.4, side * r * 0.5);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.3, side * r * 0.4);
    ctx.lineTo(r * 0.5, side * r * 0.6);
    ctx.strokeStyle = '#B22222';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    for (let c = -1; c <= 1; c++) {
      ctx.beginPath();
      ctx.moveTo(r * 0.5, side * r * 0.6);
      ctx.lineTo(r * 0.6 + c * 0.1 * r, side * r * 0.75);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }
  
  // Neck and head
  ctx.beginPath();
  ctx.ellipse(r * 0.8, 0, r * 0.5, r * 0.4, 0, 0, TAU);
  ctx.fillStyle = '#B22222';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Horns
  ctx.beginPath();
  ctx.moveTo(r * 0.9, -r * 0.35);
  ctx.lineTo(r * 0.95, -r * 0.7);
  ctx.lineTo(r * 1.0, -r * 0.35);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'miter';
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.9, r * 0.35);
  ctx.lineTo(r * 0.95, r * 0.7);
  ctx.lineTo(r * 1.0, r * 0.35);
  ctx.stroke();
  
  // Glowing eyes
  const glow = Math.sin(t * 5) * 0.3 + 0.7;
  
  ctx.beginPath();
  ctx.arc(r * 1.0, -r * 0.15, r * 0.12, 0, TAU);
  ctx.fillStyle = `rgba(255, 165, 0, ${glow})`;
  ctx.fill();
  ctx.strokeStyle = '#FF4500';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 1.0, r * 0.15, r * 0.12, 0, TAU);
  ctx.fillStyle = `rgba(255, 165, 0, ${glow})`;
  ctx.fill();
  ctx.strokeStyle = '#FF4500';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Nostrils with smoke
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.arc(r * 1.2, side * r * 0.08, r * 0.05, 0, TAU);
    ctx.fillStyle = '#000';
    ctx.fill();
    
    // Smoke particles
    for (let p = 0; p < 3; p++) {
      const smokeT = (t * 8 + p) % 3;
      ctx.beginPath();
      ctx.arc(r * 1.2 + smokeT * r * 0.2, side * r * 0.08 + smokeT * r * 0.1, r * 0.06 * (1 - smokeT / 3), 0, TAU);
      ctx.fillStyle = `rgba(100, 100, 100, ${0.5 * (1 - smokeT / 3)})`;
      ctx.fill();
    }
  }
},

crystal_form(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  
  const rotation = t * 2;
  const shimmer = Math.sin(t * 8) * 0.3 + 0.7;
  
  // Floating crystal shards orbit
  for (let i = 0; i < 6; i++) {
    const angle = rotation + (i / 6) * TAU;
    const orbitR = r * 1.3;
    const sx = Math.cos(angle) * orbitR;
    const sy = Math.sin(angle) * orbitR;
    
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle + t * 3);
    
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.15);
    ctx.lineTo(r * 0.08, 0);
    ctx.lineTo(0, r * 0.15);
    ctx.lineTo(-r * 0.08, 0);
    ctx.closePath();
    ctx.fillStyle = `rgba(${100 + i * 20}, ${150 + i * 15}, 255, 0.7)`;
    ctx.fill();
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
  }
  
  // Main hexagonal crystal body
  ctx.save();
  ctx.rotate(rotation * 0.5);
  
  const sides = 6;
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * TAU;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  gradient.addColorStop(0, `rgba(255, 255, 255, ${shimmer})`);
  gradient.addColorStop(0.5, `rgba(100, 200, 255, ${shimmer * 0.8})`);
  gradient.addColorStop(1, `rgba(150, 100, 255, ${shimmer * 0.6})`);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = '#00FFFF';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Internal facets
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * TAU;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * shimmer})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Rotating facet highlights
  for (let layer = 0; layer < 3; layer++) {
    const layerR = r * (0.3 + layer * 0.25);
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * TAU + rotation * (1 + layer * 0.5);
      const x = Math.cos(angle) * layerR;
      const y = Math.sin(angle) * layerR;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * shimmer})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  ctx.restore();
  
  // Prismatic rainbow reflections
  for (let i = 0; i < 7; i++) {
    const angle = rotation * 3 + (i / 7) * TAU;
    const refR = r * 0.6;
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    
    ctx.save();
    ctx.translate(Math.cos(angle) * refR, Math.sin(angle) * refR);
    ctx.rotate(angle);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.3, -r * 0.05);
    ctx.lineTo(r * 0.3, r * 0.05);
    ctx.closePath();
    ctx.fillStyle = `${colors[i]}80`;
    ctx.fill();
    
    ctx.restore();
  }
  
  // Central glow
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.3, 0, TAU);
  ctx.fillStyle = `rgba(255, 255, 255, ${shimmer * 0.9})`;
  ctx.fill();
  
  // Sparkle particles
  for (let i = 0; i < 8; i++) {
    const sparklePhase = (t * 6 + i) % 4;
    if (sparklePhase < 1) {
      const angle = (i / 8) * TAU;
      const dist = r * 1.5;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;
      const size = r * 0.08 * (1 - sparklePhase);
      
      ctx.beginPath();
      ctx.moveTo(px - size, py);
      ctx.lineTo(px, py - size);
      ctx.lineTo(px + size, py);
      ctx.lineTo(px, py + size);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${1 - sparklePhase})`;
      ctx.fill();
    }
  }
},

fungus_form(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  
  const pulse = Math.sin(t * 4) * 0.1 + 1;
  const glow = Math.sin(t * 5) * 0.3 + 0.7;
  
  // Root/leg tendrils
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * TAU;
    const wiggle = Math.sin(t * 6 + i) * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(0, r * 0.6);
    ctx.quadraticCurveTo(
      Math.cos(angle) * r * 0.3,
      r * 0.8,
      Math.cos(angle + wiggle) * r * 0.5,
      r * 1.1
    );
    ctx.strokeStyle = '#DEB887';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
  
  // Thick stem
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, r * 0.6);
  ctx.lineTo(-r * 0.35, -r * 0.2);
  ctx.quadraticCurveTo(-r * 0.35, -r * 0.5, -r * 0.2, -r * 0.6);
  ctx.lineTo(r * 0.2, -r * 0.6);
  ctx.quadraticCurveTo(r * 0.35, -r * 0.5, r * 0.35, -r * 0.2);
  ctx.lineTo(r * 0.3, r * 0.6);
  ctx.closePath();
  ctx.fillStyle = '#F5DEB3';
  ctx.fill();
  ctx.strokeStyle = '#DEB887';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Stem texture
  for (let y = -r * 0.5; y < r * 0.5; y += r * 0.15) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, y);
    ctx.lineTo(r * 0.3, y);
    ctx.strokeStyle = '#DEB887';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Mushroom cap
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.5, r * 1.2 * pulse, r * 0.8 * pulse, 0, 0, TAU);
  ctx.fillStyle = '#DC143C';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // White spots on cap (varying sizes and positions)
  const spots = [
    {x: 0, y: -r * 0.6, size: 0.25},
    {x: -r * 0.6, y: -r * 0.4, size: 0.18},
    {x: r * 0.5, y: -r * 0.5, size: 0.2},
    {x: -r * 0.3, y: -r * 0.7, size: 0.15},
    {x: r * 0.7, y: -r * 0.3, size: 0.12},
    {x: -r * 0.8, y: -r * 0.6, size: 0.16},
    {x: r * 0.2, y: -r * 0.3, size: 0.14},
    {x: -r * 0.5, y: -r * 0.2, size: 0.11},
  ];
  
  spots.forEach(spot => {
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, r * spot.size, 0, TAU);
    ctx.fillStyle = '#FFF';
    ctx.fill();
  });
  
  // Luminescent spots (glowing)
  spots.forEach((spot, i) => {
    if (i % 2 === 0) {
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, r * spot.size * 1.3, 0, TAU);
      ctx.fillStyle = `rgba(255, 255, 150, ${glow * 0.3})`;
      ctx.fill();
    }
  });
  
  // Gill lines under cap
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.5, r * 1.15, r * 0.75, 0, 0, PI);
  ctx.clip();
  
  for (let i = -15; i <= 15; i++) {
    ctx.beginPath();
    ctx.moveTo(i * r * 0.08, -r * 0.5);
    ctx.lineTo(i * r * 0.1, r * 0.3);
    ctx.strokeStyle = '#F5DEB3';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
  
  // Spore cloud particles
  for (let i = 0; i < 12; i++) {
    const sporePhase = (t * 3 + i * 0.3) % 5;
    const angle = (i / 12) * TAU + t;
    const dist = r * 0.8 + sporePhase * r * 0.3;
    const sx = Math.cos(angle) * dist;
    const sy = -r * 0.5 - sporePhase * r * 0.4;
    const size = r * 0.05 * (1 - sporePhase / 5);
    
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, TAU);
    ctx.fillStyle = `rgba(200, 180, 150, ${0.6 * (1 - sporePhase / 5)})`;
    ctx.fill();
  }
},

chaos_form(ctx, e) {
  const r = e.radius || 16;
  const t = anim(e);
  const d = fdir(e);
  
  const morph = Math.sin(t * 4) * 0.2;
  
  // Reality distortion particles
  for (let i = 0; i < 10; i++) {
    const angle = (t * 3 + i) % TAU;
    const dist = r * (1.5 + Math.sin(t * 5 + i) * 0.5);
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    const size = r * 0.08;
    
    ctx.beginPath();
    ctx.arc(px, py, size, 0, TAU);
    ctx.fillStyle = `rgba(138, 43, 226, ${0.4 + Math.sin(t * 8 + i) * 0.3})`;
    ctx.fill();
  }
  
  // Amorphous shifting body with wobbly outline
  ctx.beginPath();
  const segments = 20;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * TAU;
    const wobble = Math.sin(t * 6 + i * 0.5) * 0.3 + morph;
    const dist = r * (0.9 + wobble);
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  gradient.addColorStop(0, '#4B0082');
  gradient.addColorStop(0.6, '#8B008B');
  gradient.addColorStop(1, '#9400D3');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = '#FF00FF';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 7 writhing tendrils
  for (let i = 0; i < 7; i++) {
    const baseAngle = (i / 7) * TAU + t * 2;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    const segments = 8;
    for (let s = 1; s <= segments; s++) {
      const prog = s / segments;
      const angle = baseAngle + Math.sin(t * 5 + i + prog * 3) * 0.8;
      const dist = r * prog * (1.2 + Math.sin(t * 4 + i) * 0.3);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = `rgba(148, 0, 211, ${0.7 + Math.sin(t * 6 + i) * 0.3})`;
    ctx.lineWidth = r * 0.15 * (1 + Math.sin(t * 7 + i) * 0.3);
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Tendril tip glow
    const tipAngle = baseAngle + Math.sin(t * 5 + i + 1) * 0.8;
    const tipDist = r * 1.2;
    const tx = Math.cos(tipAngle) * tipDist;
    const ty = Math.sin(tipAngle) * tipDist;
    
    ctx.beginPath();
    ctx.arc(tx, ty, r * 0.1, 0, TAU);
    ctx.fillStyle = `rgba(255, 0, 255, ${0.6 + Math.sin(t * 9 + i) * 0.4})`;
    ctx.fill();
  }
  
  // 5 randomly-placed blinking eyes of different colors
  const eyes = [
    {angle: 0.3, dist: 0.4, color: '#FF0000', pupil: 0.05},
    {angle: 1.5, dist: 0.5, color: '#00FF00', pupil: 0.06},
    {angle: 2.8, dist: 0.35, color: '#0000FF', pupil: 0.04},
    {angle: 4.2, dist: 0.55, color: '#FFFF00', pupil: 0.05},
    {angle: 5.5, dist: 0.45, color: '#FF00FF', pupil: 0.06},
  ];
  
  eyes.forEach((eye, i) => {
    const blinkPhase = (t * 3 + i * 1.3) % 4;
    const blink = blinkPhase < 0.2 ? 1 - blinkPhase * 5 : 1;
    
    const ex = Math.cos(eye.angle + t * 0.5) * r * eye.dist;
    const ey = Math.sin(eye.angle + t * 0.5) * r * eye.dist;
    
    // Eye white
    ctx.beginPath();
    ctx.ellipse(ex, ey, r * 0.15, r * 0.15 * blink, 0, 0, TAU);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    if (blink > 0.5) {
      // Colored iris
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.1, 0, TAU);
      ctx.fillStyle = eye.color;
      ctx.fill();
      
      // Pupil looking in facing direction
      ctx.beginPath();
      ctx.arc(ex + d * r * eye.pupil, ey, r * 0.05, 0, TAU);
      ctx.fillStyle = '#000';
      ctx.fill();
    }
  });
  
  // Inner chaos swirl
  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 5; i++) {
    const swirl = t * 4 + i * 0.4;
    ctx.beginPath();
    ctx.arc(
      Math.cos(swirl) * r * 0.3,
      Math.sin(swirl) * r * 0.3,
      r * 0.1,
      0,
      TAU
    );
    ctx.fillStyle = `hsl(${(t * 100 + i * 60) % 360}, 70%, 50%)`;
    ctx.fill();
  }
  ctx.restore();
},

serpent_form(ctx, e) {
  const r = e.radius || 16;
  const t = anim(e);
  const d = fdir(e);
  
  // Long serpentine body with 10 segments
  const segments = 10;
  const bodyPoints = [];
  
  for (let i = 0; i < segments; i++) {
    const prog = i / segments;
    const x = -prog * r * 3;
    const y = Math.sin(t * 7 + prog * 8) * r * 0.7;
    const width = r * (0.9 - prog * 0.3);
    bodyPoints.push({x, y, width});
  }
  
  // Draw body outline
  ctx.beginPath();
  bodyPoints.forEach((p, i) => {
    const perpAngle = Math.atan2(
      i < segments - 1 ? bodyPoints[i + 1].y - p.y : 0,
      i < segments - 1 ? bodyPoints[i + 1].x - p.x : -1
    ) + PI / 2;
    
    const x1 = p.x + Math.cos(perpAngle) * p.width;
    const y1 = p.y + Math.sin(perpAngle) * p.width;
    
    if (i === 0) ctx.moveTo(x1, y1);
    else ctx.lineTo(x1, y1);
  });
  
  for (let i = segments - 1; i >= 0; i--) {
    const p = bodyPoints[i];
    const perpAngle = Math.atan2(
      i < segments - 1 ? bodyPoints[i + 1].y - p.y : 0,
      i < segments - 1 ? bodyPoints[i + 1].x - p.x : -1
    ) + PI / 2;
    
    const x2 = p.x - Math.cos(perpAngle) * p.width;
    const y2 = p.y - Math.sin(perpAngle) * p.width;
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
  
  const gradient = ctx.createLinearGradient(-r * 3, 0, r, 0);
  gradient.addColorStop(0, '#1E90FF');
  gradient.addColorStop(0.5, '#4682B4');
  gradient.addColorStop(1, '#00CED1');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = '#006994';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Scale pattern
  bodyPoints.forEach((p, i) => {
    if (i % 2 === 0) {
      for (let side = -1; side <= 1; side += 2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y + side * p.width * 0.5, p.width * 0.3, 0, TAU);
        ctx.strokeStyle = '#4682B4';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });
  
  // Glowing belly stripe
  const glow = Math.sin(t * 6) * 0.2 + 0.8;
  ctx.beginPath();
  bodyPoints.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.strokeStyle = `rgba(0, 255, 255, ${glow * 0.7})`;
  ctx.lineWidth = r * 0.3;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Dorsal spines
  bodyPoints.forEach((p, i) => {
    if (i % 2 === 1 && i < segments - 2) {
      const spineAngle = Math.atan2(
        i < segments - 1 ? bodyPoints[i + 1].y - p.y : 0,
        i < segments - 1 ? bodyPoints[i + 1].x - p.x : -1
      ) - PI / 2;
      
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.width);
      ctx.lineTo(
        p.x + Math.cos(spineAngle) * p.width * 0.6,
        p.y - p.width + Math.sin(spineAngle) * p.width * 0.6
      );
      ctx.strokeStyle = '#00008B';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  });
  
  // Head
  ctx.beginPath();
  ctx.ellipse(r * 0.6, 0, r * 0.9, r * 0.6, 0, 0, TAU);
  ctx.fillStyle = '#00CED1';
  ctx.fill();
  ctx.strokeStyle = '#006994';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Sharp snout
  ctx.beginPath();
  ctx.moveTo(r * 1.4, 0);
  ctx.lineTo(r * 0.8, -r * 0.3);
  ctx.lineTo(r * 0.8, r * 0.3);
  ctx.closePath();
  ctx.fillStyle = '#1E90FF';
  ctx.fill();
  ctx.stroke();
  
  // Head fins/frills
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.moveTo(r * 0.5, side * r * 0.5);
    ctx.quadraticCurveTo(
      r * 0.3,
      side * r * 0.9,
      r * 0.1,
      side * r * 0.7
    );
    ctx.strokeStyle = '#4682B4';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Frill membrane
    ctx.beginPath();
    ctx.moveTo(r * 0.5, side * r * 0.5);
    ctx.quadraticCurveTo(r * 0.3, side * r * 0.9, r * 0.1, side * r * 0.7);
    ctx.lineTo(r * 0.4, side * r * 0.4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(30, 144, 255, 0.4)';
    ctx.fill();
  }
  
  // Eyes
  ctx.beginPath();
  ctx.arc(r * 0.8, -r * 0.25, r * 0.15, 0, TAU);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.8 + d * 0.05 * r, -r * 0.25, r * 0.08, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.8, r * 0.25, r * 0.15, 0, TAU);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 0.8 + d * 0.05 * r, r * 0.25, r * 0.08, 0, TAU);
  ctx.fillStyle = '#000';
  ctx.fill();
},

octopus_form(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  
  // Color-shifting chromatophore pattern
  const hue = (t * 50) % 360;
  const pulse = Math.sin(t * 4) * 0.1 + 1;
  
  // 8 tentacles with suction cups
  for (let i = 0; i < 8; i++) {
    const baseAngle = (i / 8) * TAU;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    const segments = 10;
    for (let s = 1; s <= segments; s++) {
      const prog = s / segments;
      const angle = baseAngle + Math.sin(t * 6 + i * 0.7 + prog * 4) * 0.6;
      const dist = r * prog * 1.8;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = `hsl(${hue}, 60%, 50%)`;
    ctx.lineWidth = r * 0.25 * (1 - 0.5 * i / 8);
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Suction cups along tentacle
    for (let s = 3; s <= segments; s += 2) {
      const prog = s / segments;
      const angle = baseAngle + Math.sin(t * 6 + i * 0.7 + prog * 4) * 0.6;
      const dist = r * prog * 1.8;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      
      ctx.beginPath();
      ctx.arc(x, y, r * 0.08, 0, TAU);
      ctx.fillStyle = `hsl(${hue}, 50%, 40%)`;
      ctx.fill();
      ctx.strokeStyle = `hsl(${hue}, 50%, 30%)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Suction cup detail
      ctx.beginPath();
      ctx.arc(x, y, r * 0.04, 0, TAU);
      ctx.fillStyle = `hsl(${hue}, 40%, 25%)`;
      ctx.fill();
    }
  }
  
  // Mantle (head/body)
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9 * pulse, r * 0.8 * pulse, 0, 0, TAU);
  ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
  ctx.fill();
  ctx.strokeStyle = `hsl(${hue}, 60%, 35%)`;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Chromatophore texture pattern
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * TAU + t * 2;
    const dist = r * 0.5 * (Math.sin(i * 2.7 + 0.3) * 0.5 + 0.5);
    const cx = Math.cos(angle) * dist;
    const cy = Math.sin(angle) * dist;
    const size = r * 0.05 * (0.5 + Math.sin(i * 1.3) * 0.25 + 0.25);
    const spotHue = (hue + Math.sin(i * 1.9) * 30) % 360;

    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, TAU);
    ctx.fillStyle = `hsl(${spotHue}, 80%, ${40 + Math.sin(t * 5 + i) * 20}%)`;
    ctx.fill();
  }
  
  // Large intelligent eyes
  const eyeOffset = r * 0.4;
  
  for (let side = -1; side <= 1; side += 2) {
    // Eye background
    ctx.beginPath();
    ctx.ellipse(d * 0.2 * r, side * eyeOffset, r * 0.35, r * 0.4, 0, 0, TAU);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Iris
    ctx.beginPath();
    ctx.arc(d * 0.25 * r, side * eyeOffset, r * 0.2, 0, TAU);
    ctx.fillStyle = `hsl(${hue + 30}, 70%, 40%)`;
    ctx.fill();
    
    // Pupil (w-shaped)
    ctx.beginPath();
    ctx.moveTo(d * 0.2 * r, side * (eyeOffset - r * 0.15));
    ctx.lineTo(d * 0.25 * r, side * eyeOffset);
    ctx.lineTo(d * 0.3 * r, side * (eyeOffset - r * 0.15));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Highlight
    ctx.beginPath();
    ctx.arc(d * 0.3 * r, side * (eyeOffset - r * 0.1), r * 0.08, 0, TAU);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
  }
  
  // Mantle texture lines
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TAU;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * r * 0.7, Math.sin(angle) * r * 0.6);
    ctx.strokeStyle = `hsl(${hue}, 50%, 45%)`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
},

kraken_form(ctx, e) {
  const r = e.radius || 22;
  const t = anim(e);
  const d = fdir(e);
  
  const rage = Math.sin(t * 3) * 0.15 + 1;
  
  // 8 massive writhing tentacles
  for (let i = 0; i < 8; i++) {
    const baseAngle = (i / 8) * TAU + t * 0.5;
    const writhe = Math.sin(t * 4 + i * 1.2) * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    const segments = 12;
    for (let s = 1; s <= segments; s++) {
      const prog = s / segments;
      const angle = baseAngle + writhe * prog + Math.sin(t * 5 + i + prog * 5) * 0.7;
      const dist = r * prog * 2.5;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = '#1C2841';
    ctx.lineWidth = r * 0.4 * (1.1 - 0.4 * i / 8);
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Barnacle texture on tentacles
    for (let s = 2; s <= segments; s += 1) {
      const prog = s / segments;
      const angle = baseAngle + writhe * prog + Math.sin(t * 5 + i + prog * 5) * 0.7;
      const dist = r * prog * 2.5;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      if ((i + s) % 3 === 0) {
        ctx.beginPath();
        ctx.arc(x + Math.sin(s * 2.1) * r * 0.1, y + Math.cos(s * 1.7) * r * 0.1, r * 0.06, 0, TAU);
        ctx.fillStyle = '#8B7D6B';
        ctx.fill();
        ctx.strokeStyle = '#6B5D4B';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Suction cups
      if (s % 2 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, r * 0.12, 0, TAU);
        ctx.fillStyle = '#2C3E50';
        ctx.fill();
        ctx.strokeStyle = '#1C2841';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x, y, r * 0.06, 0, TAU);
        ctx.fillStyle = '#000';
        ctx.fill();
      }
    }
  }
  
  // Massive mantle
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.3 * rage, r * 1.1 * rage, 0, 0, TAU);
  ctx.fillStyle = '#2C3E50';
  ctx.fill();
  ctx.strokeStyle = '#1C2841';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Barnacle texture on mantle
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * TAU + t;
    const dist = r * (0.4 + (Math.sin(i * 2.3 + 0.7) * 0.5 + 0.5) * 0.7);
    const bx = Math.cos(angle) * dist;
    const by = Math.sin(angle) * dist;
    const size = r * 0.05 * (0.8 + Math.sin(i * 1.9) * 0.2 + 0.2);
    
    ctx.beginPath();
    ctx.arc(bx, by, size, 0, TAU);
    ctx.fillStyle = '#8B7D6B';
    ctx.fill();
    ctx.strokeStyle = '#6B5D4B';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Dark ridges
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.ellipse(i * r * 0.25, 0, r * 0.15, r * 0.9, 0, 0, TAU);
    ctx.strokeStyle = '#1C2841';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Enormous angry eyes with brow ridge
  const eyeGlow = Math.sin(t * 7) * 0.2 + 0.8;
  const eyeY = r * 0.35;
  
  // Brow ridge (angry expression)
  ctx.beginPath();
  ctx.moveTo(d * 0.2 * r, -eyeY - r * 0.3);
  ctx.quadraticCurveTo(d * 0.4 * r, -eyeY - r * 0.45, d * 0.6 * r, -eyeY - r * 0.35);
  ctx.strokeStyle = '#1C2841';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(d * 0.2 * r, eyeY + r * 0.3);
  ctx.quadraticCurveTo(d * 0.4 * r, eyeY + r * 0.45, d * 0.6 * r, eyeY + r * 0.35);
  ctx.stroke();
  
  for (let side = -1; side <= 1; side += 2) {
    // Eye socket glow
    ctx.beginPath();
    ctx.arc(d * 0.4 * r, side * eyeY, r * 0.5, 0, TAU);
    ctx.fillStyle = `rgba(255, 255, 0, ${eyeGlow * 0.3})`;
    ctx.fill();
    
    // Eye white (yellowish)
    ctx.beginPath();
    ctx.ellipse(d * 0.4 * r, side * eyeY, r * 0.4, r * 0.45, 0, 0, TAU);
    ctx.fillStyle = '#FFFFE0';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Iris (glowing yellow)
    ctx.beginPath();
    ctx.arc(d * 0.45 * r, side * eyeY, r * 0.25, 0, TAU);
    ctx.fillStyle = `rgba(255, 255, 0, ${eyeGlow})`;
    ctx.fill();
    
    // Red slit pupil
    ctx.beginPath();
    ctx.ellipse(d * 0.45 * r, side * eyeY, r * 0.05, r * 0.2, 0, 0, TAU);
    ctx.fillStyle = '#8B0000';
    ctx.fill();
    
    // Highlight
    ctx.beginPath();
    ctx.arc(d * 0.5 * r, side * (eyeY - r * 0.15), r * 0.08, 0, TAU);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
  }
  
  // Menacing beak hint
  ctx.beginPath();
  ctx.moveTo(d * 0.2 * r, -r * 0.15);
  ctx.lineTo(d * 0.4 * r, 0);
  ctx.lineTo(d * 0.2 * r, r * 0.15);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.stroke();
},

pistol_shrimp_form(ctx, e) {
  const r = e.radius || 16;
  const t = anim(e);
  const d = fdir(e);
  
  const pulse = Math.sin(t * 10);
  const rainbowShift = (t * 100) % 360;
  
  // Segmented tail
  const tailSegs = 6;
  for (let i = 0; i < tailSegs; i++) {
    const prog = i / tailSegs;
    const x = -r * 0.5 - prog * r * 1.2;
    const y = Math.sin(t * 8 + prog * 3) * r * 0.3;
    const width = r * 0.4 * (1 - prog * 0.3);
    const segHue = (rainbowShift + i * 60) % 360;
    
    ctx.beginPath();
    ctx.ellipse(x, y, width, width * 0.7, 0, 0, TAU);
    ctx.fillStyle = `hsl(${segHue}, 85%, 60%)`;
    ctx.fill();
    ctx.strokeStyle = `hsl(${segHue}, 75%, 40%)`;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Segment lines
    ctx.beginPath();
    ctx.moveTo(x - width, y - width * 0.5);
    ctx.lineTo(x - width, y + width * 0.5);
    ctx.strokeStyle = `hsl(${segHue}, 70%, 35%)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Main carapace with rainbow colors
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9, r * 0.6, 0, 0, TAU);
  const gradient = ctx.createLinearGradient(-r, -r * 0.6, r, r * 0.6);
  gradient.addColorStop(0, `hsl(${rainbowShift}, 90%, 60%)`);
  gradient.addColorStop(0.33, `hsl(${(rainbowShift + 120) % 360}, 90%, 60%)`);
  gradient.addColorStop(0.66, `hsl(${(rainbowShift + 240) % 360}, 90%, 60%)`);
  gradient.addColorStop(1, `hsl(${rainbowShift}, 90%, 60%)`);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = `hsl(${rainbowShift}, 80%, 40%)`;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Carapace segments
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * r * 0.2, -r * 0.5);
    ctx.lineTo(i * r * 0.2, r * 0.5);
    ctx.strokeStyle = `hsl(${rainbowShift + i * 20}, 75%, 45%)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Many walking legs
  for (let i = 0; i < 5; i++) {
    for (let side = -1; side <= 1; side += 2) {
      const legX = -r * 0.3 + i * r * 0.15;
      const legWave = Math.sin(t * 8 + i * 0.5) * 0.2;
      
      ctx.save();
      ctx.translate(legX, side * r * 0.5);
      ctx.rotate(side * (0.3 + legWave));
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, side * r * 0.4);
      ctx.lineTo(-r * 0.1, side * r * 0.6);
      ctx.strokeStyle = `hsl(${(rainbowShift + i * 30) % 360}, 80%, 50%)`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      ctx.restore();
    }
  }
  
  // Normal right claw
  ctx.save();
  ctx.translate(r * 0.8, r * 0.3);
  ctx.rotate(Math.sin(t * 4) * 0.2);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.3, r * 0.2, 0, 0, TAU);
  ctx.fillStyle = `hsl(${rainbowShift + 180}, 85%, 60%)`;
  ctx.fill();
  ctx.strokeStyle = `hsl(${rainbowShift + 180}, 75%, 40%)`;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.3, -r * 0.08);
  ctx.lineTo(r * 0.45, -r * 0.15);
  ctx.lineTo(r * 0.4, -r * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.3, r * 0.08);
  ctx.lineTo(r * 0.45, r * 0.15);
  ctx.lineTo(r * 0.4, r * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
  
  // OVERSIZED sonic claw (left side) with pulse
  const clawPulse = pulse > 0 ? 1 + pulse * 0.3 : 1;
  
  ctx.save();
  ctx.translate(r * 0.9, -r * 0.4);
  ctx.rotate(-Math.sin(t * 4) * 0.3);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.7 * clawPulse, r * 0.45 * clawPulse, 0, 0, TAU);
  ctx.fillStyle = `hsl(${rainbowShift + 90}, 90%, 65%)`;
  ctx.fill();
  ctx.strokeStyle = `hsl(${rainbowShift + 90}, 80%, 45%)`;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Massive pincers
  ctx.beginPath();
  ctx.moveTo(r * 0.7, -r * 0.2);
  ctx.lineTo(r * 1.1, -r * 0.4);
  ctx.lineTo(r * 0.9, -r * 0.25);
  ctx.closePath();
  ctx.fillStyle = `hsl(${rainbowShift + 70}, 85%, 55%)`;
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.7, r * 0.2);
  ctx.lineTo(r * 1.1, r * 0.4);
  ctx.lineTo(r * 0.9, r * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Claw energy lines
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.3 + i * r * 0.2, -r * 0.3);
    ctx.lineTo(-r * 0.3 + i * r * 0.2, r * 0.3);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * clawPulse})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  ctx.restore();
  
  // Shockwave ring effect when claw pulses
  if (pulse > 0.7) {
    const ringSize = r * 1.5 * (1 - pulse);
    ctx.beginPath();
    ctx.arc(r * 0.9, -r * 0.4, ringSize, 0, TAU);
    ctx.strokeStyle = `rgba(255, 255, 255, ${pulse * 0.8})`;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(r * 0.9, -r * 0.4, ringSize * 1.2, 0, TAU);
    ctx.strokeStyle = `rgba(100, 200, 255, ${pulse * 0.5})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Compound eyes on stalks
  for (let side = -1; side <= 1; side += 2) {
    const eyeBob = Math.sin(t * 5 + side) * 0.1;
    
    ctx.beginPath();
    ctx.moveTo(r * 0.3, side * r * 0.4);
    ctx.lineTo(r * 0.5, side * (r * 0.7 + eyeBob));
    ctx.strokeStyle = `hsl(${rainbowShift + 45}, 75%, 50%)`;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(r * 0.5, side * (r * 0.7 + eyeBob), r * 0.15, 0, TAU);
    ctx.fillStyle = '#000';
    ctx.fill();
    
    // Compound facets
    for (let fx = -1; fx <= 1; fx++) {
      for (let fy = -1; fy <= 1; fy++) {
        ctx.beginPath();
        ctx.arc(
          r * 0.5 + fx * r * 0.04,
          side * (r * 0.7 + eyeBob) + fy * r * 0.04,
          r * 0.02,
          0,
          TAU
        );
        ctx.strokeStyle = `hsl(${rainbowShift}, 60%, 60%)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
},

immortal_jelly_form(ctx, e) {
  const r = e.radius || 16;
  const t = anim(e);
  const d = fdir(e);
  
  const bellPulse = Math.sin(t * 4) * 0.2 + 1;
  const glow = Math.sin(t * 5) * 0.3 + 0.7;
  
  // Long trailing tentacles with bioluminescence
  for (let i = 0; i < 12; i++) {
    const baseAngle = (i / 12) * TAU;
    const flow = Math.sin(t * 3 + i * 0.8);
    
    ctx.beginPath();
    ctx.moveTo(0, r * 0.5);
    
    const segments = 15;
    for (let s = 1; s <= segments; s++) {
      const prog = s / segments;
      const x = Math.cos(baseAngle) * r * 0.3 * prog + Math.sin(t * 5 + i + prog * 4) * r * 0.4;
      const y = r * 0.5 + prog * r * 2.5 + flow * r * 0.3;
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = `rgba(180, 200, 255, ${0.3 + glow * 0.3})`;
    ctx.lineWidth = r * 0.05 * (1 - 0.5 * i / 12);
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Bioluminescent spots along tentacles
    for (let s = 2; s <= segments; s += 2) {
      const prog = s / segments;
      const x = Math.cos(baseAngle) * r * 0.3 * prog + Math.sin(t * 5 + i + prog * 4) * r * 0.4;
      const y = r * 0.5 + prog * r * 2.5 + flow * r * 0.3;
      const spotGlow = Math.sin(t * 8 + i + s) * 0.4 + 0.6;
      
      ctx.beginPath();
      ctx.arc(x, y, r * 0.08, 0, TAU);
      ctx.fillStyle = `rgba(100, 255, 255, ${spotGlow * 0.8})`;
      ctx.fill();
      
      // Glow halo
      ctx.beginPath();
      ctx.arc(x, y, r * 0.15, 0, TAU);
      ctx.fillStyle = `rgba(100, 255, 255, ${spotGlow * 0.3})`;
      ctx.fill();
    }
  }
  
  // Translucent bell
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9 * bellPulse, r * 0.7 * bellPulse, 0, 0, TAU);
  ctx.fillStyle = `rgba(200, 220, 255, ${0.4 + glow * 0.2})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(150, 180, 255, ${0.6 + glow * 0.3})`;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Bell inner glow
  const bellGradient = ctx.createRadialGradient(0, -r * 0.2, 0, 0, 0, r);
  bellGradient.addColorStop(0, `rgba(255, 255, 255, ${glow * 0.7})`);
  bellGradient.addColorStop(0.5, `rgba(150, 200, 255, ${glow * 0.4})`);
  bellGradient.addColorStop(1, `rgba(100, 150, 255, 0.1)`);
  ctx.fillStyle = bellGradient;
  ctx.fill();
  
  // Visible internal organ network
  ctx.globalAlpha = 0.5;
  
  // Radial canals
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TAU;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * r * 0.7, Math.sin(angle) * r * 0.5);
    ctx.strokeStyle = `rgba(255, 200, 150, ${glow})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Circular canal
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.5, 0, TAU);
  ctx.strokeStyle = `rgba(255, 200, 150, ${glow * 0.8})`;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Central stomach
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.2 * bellPulse, 0, TAU);
  ctx.fillStyle = `rgba(255, 180, 120, ${glow * 0.7})`;
  ctx.fill();
  
  ctx.globalAlpha = 1;
  
  // Bell rim detail
  ctx.beginPath();
  const rimSegs = 16;
  for (let i = 0; i < rimSegs; i++) {
    const angle = (i / rimSegs) * TAU;
    const x = Math.cos(angle) * r * 0.9 * bellPulse;
    const y = Math.sin(angle) * r * 0.7 * bellPulse;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    
    // Small lobe
    const lobeX = Math.cos(angle + TAU / rimSegs / 2) * r * 0.95 * bellPulse;
    const lobeY = Math.sin(angle + TAU / rimSegs / 2) * r * 0.75 * bellPulse;
    ctx.lineTo(lobeX, lobeY);
  }
  ctx.closePath();
  ctx.strokeStyle = `rgba(180, 210, 255, ${0.7 + glow * 0.3})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Regeneration sparkles (immortality visual)
  for (let i = 0; i < 10; i++) {
    const sparklePhase = (t * 4 + i * 0.5) % 3;
    if (sparklePhase < 1) {
      const angle = (i / 10) * TAU + t * 2;
      const dist = r * (0.3 + sparklePhase * 0.5);
      const sx = Math.cos(angle) * dist;
      const sy = Math.sin(angle) * dist - r * 0.2;
      const size = r * 0.06 * (1 - sparklePhase);
      
      ctx.beginPath();
      ctx.moveTo(sx - size, sy);
      ctx.lineTo(sx, sy - size);
      ctx.lineTo(sx + size, sy);
      ctx.lineTo(sx, sy + size);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 200, ${0.9 * (1 - sparklePhase)})`;
      ctx.fill();
      
      // Cross sparkle
      ctx.beginPath();
      ctx.moveTo(sx - size * 0.7, sy - size * 0.7);
      ctx.lineTo(sx + size * 0.7, sy + size * 0.7);
      ctx.moveTo(sx + size * 0.7, sy - size * 0.7);
      ctx.lineTo(sx - size * 0.7, sy + size * 0.7);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * (1 - sparklePhase)})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  
  // Pulsing aura (regeneration energy)
  const auraPhase = (t * 3) % 2;
  if (auraPhase < 1) {
    ctx.beginPath();
    ctx.arc(0, 0, r * (1 + auraPhase), 0, TAU);
    ctx.strokeStyle = `rgba(200, 255, 255, ${0.5 * (1 - auraPhase)})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
},

tardigrade_form(ctx, e) {
  const r = e.radius || 18;
  const t = anim(e);
  const d = fdir(e);
  
  const waddle = Math.sin(t * 6);
  
  // 8 stubby clawed legs (4 pairs)
  for (let pair = 0; pair < 4; pair++) {
    for (let side = -1; side <= 1; side += 2) {
      const legX = -r * 0.5 + pair * r * 0.35;
      const legPhase = waddle * side * (pair % 2 === 0 ? 1 : -1);
      
      ctx.save();
      ctx.translate(legX, side * r * 0.6);
      ctx.rotate(side * (0.4 + legPhase * 0.3));
      
      // Stubby leg
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, side * r * 0.3);
      ctx.lineTo(r * 0.15, side * r * 0.5);
      ctx.strokeStyle = '#C4A57B';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Claws (4 per leg)
      for (let c = 0; c < 4; c++) {
        const clawAngle = (c / 4) * 0.6 - 0.3;
        ctx.beginPath();
        ctx.moveTo(r * 0.15, side * r * 0.5);
        ctx.lineTo(
          r * 0.15 + Math.cos(clawAngle) * r * 0.15,
          side * r * 0.5 + Math.sin(clawAngle) * side * r * 0.15
        );
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }
  
  // Barrel-shaped segmented body
  const bodySegs = 5;
  for (let i = 0; i < bodySegs; i++) {
    const segX = -r * 0.6 + i * r * 0.35;
    const segWidth = r * 0.5 + Math.sin((i / bodySegs) * PI) * r * 0.2;
    
    ctx.beginPath();
    ctx.ellipse(segX, 0, segWidth, r * 0.7, 0, 0, TAU);
    ctx.fillStyle = '#D2B48C';
    ctx.fill();
    ctx.strokeStyle = '#A0826D';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Segment line
    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(segX - segWidth, -r * 0.7);
      ctx.lineTo(segX - segWidth, r * 0.7);
      ctx.strokeStyle = '#8B7355';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  
  // Protective cuticle texture
  for (let y = -r * 0.5; y <= r * 0.5; y += r * 0.2) {
    for (let x = -r * 0.5; x <= r * 0.5; x += r * 0.2) {
      ctx.beginPath();
      ctx.arc(x, y, r * 0.06, 0, TAU);
      ctx.strokeStyle = '#C4A57B';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  
  // Head segment
  ctx.beginPath();
  ctx.ellipse(r * 0.6, 0, r * 0.55, r * 0.6, 0, 0, TAU);
  ctx.fillStyle = '#DEB887';
  ctx.fill();
  ctx.strokeStyle = '#A0826D';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Cute beady eyes
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.arc(r * 0.7, side * r * 0.25, r * 0.12, 0, TAU);
    ctx.fillStyle = '#000';
    ctx.fill();
    
    // Highlight
    ctx.beginPath();
    ctx.arc(r * 0.72, side * (r * 0.25 - r * 0.04), r * 0.04, 0, TAU);
    ctx.fillStyle = '#FFF';
    ctx.fill();
  }
  
  // Circular mouth with teeth ring
  ctx.beginPath();
  ctx.arc(r * 0.9, 0, r * 0.2, 0, TAU);
  ctx.fillStyle = '#8B4513';
  ctx.fill();
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Teeth ring
  const teeth = 12;
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * TAU;
    const innerR = r * 0.12;
    const outerR = r * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(
      r * 0.9 + Math.cos(angle) * innerR,
      Math.sin(angle) * innerR
    );
    ctx.lineTo(
      r * 0.9 + Math.cos(angle) * outerR,
      Math.sin(angle) * outerR
    );
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Indestructible feel - protective shield effect
  const shieldGlow = Math.sin(t * 5) * 0.2 + 0.3;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.2, r * 0.9, 0, 0, TAU);
  ctx.strokeStyle = `rgba(100, 150, 200, ${shieldGlow})`;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.3, r * 1.0, 0, 0, TAU);
  ctx.strokeStyle = `rgba(150, 200, 255, ${shieldGlow * 0.5})`;
  ctx.lineWidth = 2;
  ctx.stroke();
},

chimera_form(ctx, e) {
  const r = e.radius || 20;
  const t = anim(e);
  const d = fdir(e);
  
  const chaosShift = Math.sin(t * 4) * 0.2;
  
  // Chaos energy aura particles
  for (let i = 0; i < 15; i++) {
    const angle = (t * 2 + i * 0.4) % TAU;
    const dist = r * (1.4 + Math.sin(t * 6 + i) * 0.3);
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    const hue = (t * 100 + i * 25) % 360;
    
    ctx.beginPath();
    ctx.arc(px, py, r * 0.08, 0, TAU);
    ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${0.6 + Math.sin(t * 8 + i) * 0.4})`;
    ctx.fill();
  }
  
  // Serpent tail (from serpent form)
  const tailSegs = 8;
  const tailPoints = [];
  for (let i = 0; i < tailSegs; i++) {
    const prog = i / tailSegs;
    const x = -r * 0.6 - prog * r * 1.8;
    const y = Math.sin(t * 7 + prog * 6) * r * 0.8;
    const width = r * 0.3 * (1 - prog * 0.5);
    tailPoints.push({x, y, width});
  }
  
  ctx.beginPath();
  tailPoints.forEach((p, i) => {
    const perpAngle = Math.atan2(
      i < tailSegs - 1 ? tailPoints[i + 1].y - p.y : 0,
      i < tailSegs - 1 ? tailPoints[i + 1].x - p.x : -1
    ) + PI / 2;
    
    const x1 = p.x + Math.cos(perpAngle) * p.width;
    const y1 = p.y + Math.sin(perpAngle) * p.width;
    if (i === 0) ctx.moveTo(x1, y1);
    else ctx.lineTo(x1, y1);
  });
  for (let i = tailSegs - 1; i >= 0; i--) {
    const p = tailPoints[i];
    const perpAngle = Math.atan2(
      i < tailSegs - 1 ? tailPoints[i + 1].y - p.y : 0,
      i < tailSegs - 1 ? tailPoints[i + 1].x - p.x : -1
    ) + PI / 2;
    const x2 = p.x - Math.cos(perpAngle) * p.width;
    const y2 = p.y - Math.sin(perpAngle) * p.width;
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
  ctx.fillStyle = '#4682B4';
  ctx.fill();
  ctx.strokeStyle = '#2C5C7C';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Stitched body parts of different colors
  // Lower body (crab-like)
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, r * 0.3, r * 0.6, r * 0.5, 0.2, 0, TAU);
  ctx.fillStyle = '#CD5C5C';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Upper body (dragon-like)
  ctx.beginPath();
  ctx.ellipse(r * 0.3, -r * 0.2, r * 0.7, r * 0.5, -0.2, 0, TAU);
  ctx.fillStyle = '#DC143C';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Stitches between body parts
  for (let i = 0; i < 8; i++) {
    const stitchX = -r * 0.3 + i * r * 0.15;
    const stitchY = r * 0.1 + Math.sin(i) * r * 0.2;
    ctx.beginPath();
    ctx.moveTo(stitchX - r * 0.05, stitchY - r * 0.05);
    ctx.lineTo(stitchX + r * 0.05, stitchY + r * 0.05);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Crab claws (mismatched sizes)
  ctx.save();
  ctx.translate(-r * 0.9, r * 0.5);
  ctx.rotate(Math.sin(t * 3) * 0.3);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.4, r * 0.25, 0, 0, TAU);
  ctx.fillStyle = '#DC143C';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.4, -r * 0.1);
  ctx.lineTo(r * 0.6, -r * 0.25);
  ctx.lineTo(r * 0.5, -r * 0.12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.4, r * 0.1);
  ctx.lineTo(r * 0.6, r * 0.25);
  ctx.lineTo(r * 0.5, r * 0.12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
  
  // Smaller right claw
  ctx.save();
  ctx.translate(r * 0.7, r * 0.6);
  ctx.rotate(-Math.sin(t * 3.5) * 0.3);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.25, r * 0.18, 0, 0, TAU);
  ctx.fillStyle = '#B22222';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.restore();
  
  // Dragon wings (asymmetric)
  ctx.save();
  ctx.translate(-r * 0.3, -r * 0.7);
  ctx.rotate(-0.4 + Math.sin(t * 6) * 0.3);
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-r * 0.6, -r * 0.5, -r * 0.9, -r * 0.2);
  ctx.quadraticCurveTo(-r * 0.7, -r * 0.1, -r * 0.4, 0);
  ctx.closePath();
  ctx.fillStyle = 'rgba(139, 0, 0, 0.6)';
  ctx.fill();
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.restore();
  
  // Smaller damaged wing
  ctx.save();
  ctx.translate(r * 0.2, -r * 0.5);
  ctx.rotate(0.3 - Math.sin(t * 6) * 0.25);
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(r * 0.4, -r * 0.3, r * 0.5, -r * 0.1);
  ctx.quadraticCurveTo(r * 0.3, 0, 0, 0);
  ctx.fillStyle = 'rgba(100, 0, 0, 0.5)';
  ctx.fill();
  ctx.strokeStyle = '#6B0000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.restore();
  
  // Multiple mismatched eyes (5 different types/positions)
  const eyes = [
    {x: r * 0.4, y: -r * 0.3, size: 0.18, color: '#FFFF00', pupil: '#000'},
    {x: r * 0.6, y: -r * 0.5, size: 0.12, color: '#FF0000', pupil: '#000'},
    {x: -r * 0.1, y: -r * 0.4, size: 0.15, color: '#00FF00', pupil: '#000'},
    {x: r * 0.2, y: 0, size: 0.2, color: '#FFF', pupil: '#8B0000'},
    {x: r * 0.5, y: r * 0.2, size: 0.1, color: '#00FFFF', pupil: '#000'},
  ];
  
  eyes.forEach((eye, i) => {
    const blink = ((t * 4 + i * 1.7) % 3) < 0.2 ? 0.3 : 1;
    
    ctx.beginPath();
    ctx.ellipse(eye.x, eye.y, eye.size * r, eye.size * r * blink, 0, 0, TAU);
    ctx.fillStyle = eye.color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    if (blink > 0.5) {
      ctx.beginPath();
      ctx.arc(eye.x + d * eye.size * r * 0.3, eye.y, eye.size * r * 0.4, 0, TAU);
      ctx.fillStyle = eye.pupil;
      ctx.fill();
    }
  });
  
  // Multi-headed aspect - second head emerging
  ctx.save();
  ctx.translate(-r * 0.5, -r * 0.8);
  ctx.rotate(chaosShift);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.35, r * 0.3, 0, 0, TAU);
  ctx.fillStyle = '#8FBC8F';
  ctx.fill();
  ctx.strokeStyle = '#556B2F';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Second head eye
  ctx.beginPath();
  ctx.arc(-r * 0.1, 0, r * 0.1, 0, TAU);
  ctx.fillStyle = '#FF00FF';
  ctx.fill();
  
  ctx.restore();
  
  // Chaos energy connecting stitched parts
  for (let i = 0; i < 6; i++) {
    const sparkPhase = (t * 7 + i) % 2;
    if (sparkPhase < 1) {
      const sx = -r * 0.5 + (Math.sin(i * 2.7 + t * 3) * 0.5 + 0.5) * r * 1.5;
      const sy = -r * 0.6 + (Math.cos(i * 1.9 + t * 2) * 0.5 + 0.5) * r * 1.2;
      
      ctx.beginPath();
      ctx.arc(sx, sy, r * 0.06 * (1 - sparkPhase), 0, TAU);
      ctx.fillStyle = `hsla(${(i * 60) % 360}, 100%, 70%, ${0.8 * (1 - sparkPhase)})`;
      ctx.fill();
    }
  }
},

        // ============================================================
        //  Biome creatures
        // ============================================================

monkey(ctx, e) {
            const r = e.radius || 12;
            const t = anim(e);
            const d = fdir(e);
            
            // Belly patch
            ctx.fillStyle = '#d4a574';
            ctx.beginPath();
            ctx.ellipse(0, r*0.25, r*0.5, r*0.6, 0, 0, TAU);
            ctx.fill();
            
            // Body (brown fur)
            ctx.fillStyle = '#6d4c28';
            ctx.beginPath();
            ctx.ellipse(0, 0, r*0.7, r*0.8, 0, 0, TAU);
            ctx.fill();
            
            // Fur texture highlights
            ctx.fillStyle = 'rgba(139,105,20,0.3)';
            ctx.beginPath();
            ctx.ellipse(-r*0.15, -r*0.2, r*0.25, r*0.3, -0.5, 0, TAU);
            ctx.fill();
            
            // Arms with grabbing hands
            const armSwing = Math.sin(t*5)*0.4;
            ctx.strokeStyle = '#6d4c28';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            // Left arm
            ctx.beginPath();
            ctx.moveTo(-r*0.5, -r*0.1);
            ctx.quadraticCurveTo(-r*0.9, r*0.1+armSwing*r, -r*0.85, r*0.5+armSwing*r*1.2);
            ctx.stroke();
            // Hand
            ctx.beginPath();
            ctx.arc(-r*0.85, r*0.5+armSwing*r*1.2, r*0.15, 0, TAU);
            ctx.fill();
            // Right arm
            ctx.beginPath();
            ctx.moveTo(r*0.5, -r*0.1);
            ctx.quadraticCurveTo(r*0.9, r*0.1-armSwing*r, r*0.85, r*0.5-armSwing*r*1.2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(r*0.85, r*0.5-armSwing*r*1.2, r*0.15, 0, TAU);
            ctx.fill();
            ctx.lineCap = 'butt';
            
            // Legs
            const legKick = Math.sin(t*6)*4;
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(-r*0.3, r*0.6);
            ctx.lineTo(-r*0.35, r*1.1+legKick);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(r*0.3, r*0.6);
            ctx.lineTo(r*0.35, r*1.1-legKick);
            ctx.stroke();
            
            // Head (round)
            ctx.fillStyle = '#8b6f47';
            ctx.beginPath();
            ctx.arc(d*r*0.35, -r*0.5, r*0.5, 0, TAU);
            ctx.fill();
            
            // Round ears
            ctx.fillStyle = '#6d4c28';
            ctx.beginPath();
            ctx.arc(d*r*0.15-r*0.25, -r*0.8, r*0.2, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(d*r*0.55+r*0.15, -r*0.8, r*0.2, 0, TAU);
            ctx.fill();
            
            // Flesh-colored face
            ctx.fillStyle = '#e3b78e';
            ctx.beginPath();
            ctx.arc(d*r*0.5, -r*0.4, r*0.3, 0, TAU);
            ctx.fill();
            
            // Expressive eyes (large)
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(d*r*0.4, -r*0.5, r*0.12, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(d*r*0.6, -r*0.45, r*0.12, 0, TAU);
            ctx.fill();
            ctx.fillStyle = '#2a1810';
            ctx.beginPath();
            ctx.arc(d*r*0.42, -r*0.48, r*0.07, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(d*r*0.62, -r*0.43, r*0.07, 0, TAU);
            ctx.fill();
            
            // Nose/mouth
            ctx.fillStyle = '#b58860';
            ctx.beginPath();
            ctx.ellipse(d*r*0.6, -r*0.25, r*0.08, r*0.06, 0, 0, TAU);
            ctx.fill();
            
            // Prehensile tail (long, curling)
            const tailCurl = Math.sin(t*4);
            ctx.strokeStyle = '#6d4c28';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-d*r*0.5, r*0.4);
            ctx.bezierCurveTo(
                -d*r*1.0, r*0.2+tailCurl*8,
                -d*r*1.2, -r*0.3+tailCurl*6,
                -d*r*0.9, -r*0.6+tailCurl*4
            );
            ctx.stroke();
            ctx.lineCap = 'butt';
        },

        python(ctx, e) {
            const r = e.radius || 18;
            const t = anim(e);
            const d = fdir(e);
            
            // Body coils - 6 segments
            ctx.strokeStyle = '#556b2f';
            ctx.lineWidth = r*0.6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-r*0.9, r*0.4);
            for (let i = 0; i < 6; i++) {
                const wave = Math.sin(t*2.5+i*1.1)*7;
                const x = -r*0.9 + i*r*0.35;
                const y = (i % 2 === 0 ? -1 : 1) * r*0.35 + wave;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.lineCap = 'butt';
            
            // Diamond pattern overlay
            ctx.fillStyle = 'rgba(61,53,30,0.7)';
            for (let i = 0; i < 5; i++) {
                const wave = Math.sin(t*2.5+i*1.1)*7;
                const x = -r*0.75 + i*r*0.35;
                const y = (i % 2 === 0 ? -1 : 1) * r*0.35 + wave;
                ctx.beginPath();
                ctx.moveTo(x, y-r*0.15);
                ctx.lineTo(x+r*0.12, y);
                ctx.lineTo(x, y+r*0.15);
                ctx.lineTo(x-r*0.12, y);
                ctx.closePath();
                ctx.fill();
            }
            
            // Body shading
            ctx.strokeStyle = 'rgba(70,90,30,0.5)';
            ctx.lineWidth = r*0.3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-r*0.9, r*0.35);
            for (let i = 0; i < 6; i++) {
                const wave = Math.sin(t*2.5+i*1.1)*7;
                const x = -r*0.9 + i*r*0.35;
                const y = (i % 2 === 0 ? -1 : 1) * r*0.35 + wave - r*0.08;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.lineCap = 'butt';
            
            // Head (thick triangular)
            ctx.fillStyle = '#4a5f2f';
            ctx.beginPath();
            ctx.ellipse(d*r*0.7, -r*0.05, r*0.45, r*0.32, d*0.3, 0, TAU);
            ctx.fill();
            
            // Heat-pit marks
            ctx.fillStyle = '#2a2015';
            ctx.beginPath();
            ctx.arc(d*r*0.55, -r*0.2, r*0.06, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(d*r*0.65, -r*0.25, r*0.05, 0, TAU);
            ctx.fill();
            
            // Amber slit eyes
            ctx.fillStyle = '#d4a017';
            ctx.beginPath();
            ctx.ellipse(d*r*0.8, -r*0.15, r*0.09, r*0.13, 0, 0, TAU);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(d*r*0.81, -r*0.15, r*0.03, r*0.12, 0, 0, TAU);
            ctx.fill();
            
            // Forked tongue flick
            const tongueFlick = Math.max(0, Math.sin(t*8))*0.3;
            if (tongueFlick > 0) {
                ctx.strokeStyle = '#c41e3a';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(d*r*1.0, -r*0.05);
                ctx.lineTo(d*(r*1.0+tongueFlick*r*0.4), -r*0.08);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(d*r*1.0, -r*0.05);
                ctx.lineTo(d*(r*1.0+tongueFlick*r*0.4), -r*0.02);
                ctx.stroke();
            }
        },

        poison_frog(ctx, e) {
            const r = e.radius || 10;
            const t = anim(e);
            const d = fdir(e);
            const hop = Math.abs(Math.sin(t*5.5))*5;
            
            // Rear legs (extended when hopping)
            ctx.strokeStyle = '#ff1493';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            const legExtend = hop*0.6;
            ctx.beginPath();
            ctx.moveTo(-r*0.45, r*0.15-hop*0.3);
            ctx.lineTo(-r*0.7, r*0.45-legExtend);
            ctx.lineTo(-r*0.85, r*0.7-hop);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(r*0.45, r*0.15-hop*0.3);
            ctx.lineTo(r*0.7, r*0.45-legExtend);
            ctx.lineTo(r*0.85, r*0.7-hop);
            ctx.stroke();
            
            // Sticky toe pads
            ctx.fillStyle = '#ff6bb5';
            ctx.beginPath();
            ctx.arc(-r*0.85, r*0.7-hop, r*0.12, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(r*0.85, r*0.7-hop, r*0.12, 0, TAU);
            ctx.fill();
            ctx.lineCap = 'butt';
            
            // Body (bright neon pink)
            ctx.fillStyle = '#ff1493';
            ctx.beginPath();
            ctx.ellipse(0, -hop*0.5, r*0.95, r*0.7, 0, 0, TAU);
            ctx.fill();
            
            // Throat pouch
            const breathe = Math.sin(t*7)*0.15;
            ctx.fillStyle = '#ff69b4';
            ctx.beginPath();
            ctx.ellipse(d*r*0.25, r*0.2-hop*0.4, r*0.25+breathe*r, r*0.2+breathe*r, 0, 0, TAU);
            ctx.fill();
            
            // Electric blue spots/stripes
            ctx.fillStyle = '#00bfff';
            ctx.beginPath();
            ctx.arc(-r*0.3, -hop*0.5-r*0.15, r*0.18, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(r*0.35, -hop*0.5+r*0.15, r*0.15, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-r*0.1, -hop*0.5+r*0.3, r*0.12, 0, TAU);
            ctx.fill();
            
            // Blue stripe on back
            ctx.fillStyle = '#1e90ff';
            ctx.beginPath();
            ctx.ellipse(0, -hop*0.5-r*0.3, r*0.15, r*0.4, 0.3, 0, TAU);
            ctx.fill();
            
            // Huge white eyes
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(d*r*0.35, -hop*0.5-r*0.45, r*0.25, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(d*r*0.15, -hop*0.5-r*0.4, r*0.22, 0, TAU);
            ctx.fill();
            
            // Black horizontal pupils
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(d*r*0.36, -hop*0.5-r*0.45, r*0.12, r*0.05, 0, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(d*r*0.16, -hop*0.5-r*0.4, r*0.11, r*0.05, 0, 0, TAU);
            ctx.fill();
            
            // Front legs (animated with hop)
            const frontBend = hop*0.5;
            ctx.strokeStyle = '#ff1493';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(d*r*0.45, -hop*0.4);
            ctx.lineTo(d*r*0.7, -hop*0.3-frontBend);
            ctx.lineTo(d*r*0.85, r*0.15-hop);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(d*r*0.35, -hop*0.2+r*0.15);
            ctx.lineTo(d*r*0.6, r*0.05-frontBend);
            ctx.lineTo(d*r*0.75, r*0.4-hop);
            ctx.stroke();
            // Front toe pads
            ctx.fillStyle = '#ff6bb5';
            ctx.beginPath();
            ctx.arc(d*r*0.85, r*0.15-hop, r*0.1, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(d*r*0.75, r*0.4-hop, r*0.1, 0, TAU);
            ctx.fill();
            ctx.lineCap = 'butt';
        },

        army_ant(ctx, e) {
            const r = e.radius || 6;
            const t = anim(e);
            const d = fdir(e);
            
            // Legs (6 rapidly cycling)
            ctx.strokeStyle = '#3e2723';
            ctx.lineWidth = 1.2;
            for (let i = -1; i <= 1; i++) {
                for (let s = -1; s <= 1; s += 2) {
                    const legPhase = Math.sin(t*10+i*1.5+s)*3;
                    ctx.beginPath();
                    ctx.moveTo(i*r*0.35, 0);
                    ctx.lineTo(i*r*0.35+s*r*0.45, s*r*0.55+legPhase);
                    ctx.stroke();
                }
            }
            
            // Abdomen (largest segment)
            ctx.fillStyle = '#4e342e';
            ctx.beginPath();
            ctx.ellipse(r*0.55, 0, r*0.45, r*0.38, 0, 0, TAU);
            ctx.fill();
            
            // Thorax (middle segment)
            ctx.fillStyle = '#5d4037';
            ctx.beginPath();
            ctx.ellipse(0, 0, r*0.32, r*0.28, 0, 0, TAU);
            ctx.fill();
            
            // Head (small segment)
            ctx.fillStyle = '#3e2723';
            ctx.beginPath();
            ctx.ellipse(-r*0.45, 0, r*0.38, r*0.32, 0, 0, TAU);
            ctx.fill();
            
            // Compound eye
            ctx.fillStyle = '#1a1410';
            ctx.beginPath();
            ctx.arc(d*r*0.65, -r*0.12, r*0.1, 0, TAU);
            ctx.fill();
            
            // Large curved mandibles that snap
            const mandibleSnap = Math.sin(t*6)*0.3;
            ctx.fillStyle = '#2c1810';
            ctx.beginPath();
            ctx.moveTo(d*r*0.75, -r*0.05);
            ctx.lineTo(d*r*1.05, -r*0.25-mandibleSnap*r*0.5);
            ctx.lineTo(d*r*0.95, -r*0.15);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(d*r*0.75, r*0.05);
            ctx.lineTo(d*r*1.05, r*0.25+mandibleSnap*r*0.5);
            ctx.lineTo(d*r*0.95, r*0.15);
            ctx.closePath();
            ctx.fill();
            
            // Single antenna
            ctx.strokeStyle = '#3e2723';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(d*r*0.6, -r*0.25);
            ctx.quadraticCurveTo(d*r*0.7, -r*0.6, d*r*0.55, -r*0.75+Math.sin(t*5)*2);
            ctx.stroke();
            ctx.lineCap = 'butt';
        },

        camel_spider(ctx, e) {
            const r = e.radius || 14;
            const t = anim(e);
            const d = fdir(e);
            
            // 10 leg-like appendages (8 legs + 2 pedipalps) - fast animation
            ctx.strokeStyle = '#c9a961';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            // 8 main legs
            for (let i = 0; i < 4; i++) {
                for (let s = -1; s <= 1; s += 2) {
                    const legPhase = Math.sin(t*9+i*0.8+s)*4;
                    const xPos = (i-1.5)*r*0.28;
                    ctx.beginPath();
                    ctx.moveTo(xPos, s*r*0.35);
                    ctx.lineTo(xPos+s*r*0.55, s*r*0.75+legPhase);
                    ctx.stroke();
                }
            }
            // 2 pedipalps (front, leg-like)
            for (let s = -1; s <= 1; s += 2) {
                const palp = Math.sin(t*9+s)*3;
                ctx.beginPath();
                ctx.moveTo(d*r*0.4, s*r*0.25);
                ctx.lineTo(d*r*0.75, s*r*0.45+palp);
                ctx.stroke();
            }
            ctx.lineCap = 'butt';
            
            // Abdomen (tan-yellow, 2 segments visible)
            ctx.fillStyle = '#d4a574';
            ctx.beginPath();
            ctx.ellipse(-r*0.2, 0, r*0.45, r*0.38, 0, 0, TAU);
            ctx.fill();
            
            // Thorax
            ctx.fillStyle = '#c9a961';
            ctx.beginPath();
            ctx.ellipse(r*0.2, 0, r*0.38, r*0.35, 0, 0, TAU);
            ctx.fill();
            
            // Body texture
            ctx.strokeStyle = 'rgba(139,90,43,0.3)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(-r*0.2+i*r*0.2, -r*0.1, r*0.15, 0, PI);
                ctx.stroke();
            }
            
            // Head/chelicerae segment
            ctx.fillStyle = '#b8954d';
            ctx.beginPath();
            ctx.ellipse(d*r*0.6, 0, r*0.4, r*0.32, 0, 0, TAU);
            ctx.fill();
            
            // Huge chelicerae (jaws) that open
            const jawOpen = Math.sin(t*7)*0.4+0.5;
            ctx.fillStyle = '#8b6914';
            // Upper jaw
            ctx.beginPath();
            ctx.moveTo(d*r*0.85, -r*0.15);
            ctx.lineTo(d*r*1.15, -r*0.25-jawOpen*r*0.3);
            ctx.lineTo(d*r*1.05, -r*0.1);
            ctx.closePath();
            ctx.fill();
            // Lower jaw
            ctx.beginPath();
            ctx.moveTo(d*r*0.85, r*0.15);
            ctx.lineTo(d*r*1.15, r*0.25+jawOpen*r*0.3);
            ctx.lineTo(d*r*1.05, r*0.1);
            ctx.closePath();
            ctx.fill();
            
            // Teeth on jaws
            ctx.fillStyle = '#5d4a29';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(d*(r*0.95+i*r*0.08), -r*0.15-jawOpen*r*0.15, r*0.04, 0, TAU);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(d*(r*0.95+i*r*0.08), r*0.15+jawOpen*r*0.15, r*0.04, 0, TAU);
                ctx.fill();
            }
            
            // No visible eyes (tiny, realistic)
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(d*r*0.55, -r*0.08, r*0.03, 0, TAU);
            ctx.fill();
        },

        horned_lizard(ctx, e) {
            const r = e.radius || 12;
            const t = anim(e);
            const d = fdir(e);
            
            // Stumpy legs with claws
            ctx.strokeStyle = '#9d7e4f';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            const stepPhase = Math.sin(t*4.5)*3;
            // Front legs
            ctx.beginPath();
            ctx.moveTo(d*r*0.3, -r*0.15);
            ctx.lineTo(d*r*0.6, r*0.15+stepPhase);
            ctx.lineTo(d*r*0.75, r*0.35+stepPhase);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(d*r*0.3, r*0.15);
            ctx.lineTo(d*r*0.6, r*0.4-stepPhase);
            ctx.lineTo(d*r*0.75, r*0.6-stepPhase);
            ctx.stroke();
            // Rear legs
            ctx.beginPath();
            ctx.moveTo(-r*0.45, -r*0.1);
            ctx.lineTo(-r*0.65, r*0.3-stepPhase);
            ctx.lineTo(-r*0.75, r*0.55-stepPhase);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-r*0.45, r*0.2);
            ctx.lineTo(-r*0.65, r*0.45+stepPhase);
            ctx.lineTo(-r*0.75, r*0.7+stepPhase);
            ctx.stroke();
            
            // Claws
            ctx.fillStyle = '#6d5a3e';
            const clawPositions = [
                [d*r*0.75, r*0.35+stepPhase],
                [d*r*0.75, r*0.6-stepPhase],
                [-r*0.75, r*0.55-stepPhase],
                [-r*0.75, r*0.7+stepPhase]
            ];
            clawPositions.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, r*0.08, 0, TAU);
                ctx.fill();
            });
            ctx.lineCap = 'butt';
            
            // Flat round body (mottled brown-tan camouflage)
            ctx.fillStyle = '#a08556';
            ctx.beginPath();
            ctx.ellipse(0, 0, r*0.85, r*0.65, 0, 0, TAU);
            ctx.fill();
            
            // Camouflage spots
            ctx.fillStyle = '#8b7355';
            ctx.beginPath();
            ctx.arc(-r*0.3, -r*0.2, r*0.18, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(r*0.25, r*0.15, r*0.15, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-r*0.15, r*0.3, r*0.12, 0, TAU);
            ctx.fill();
            ctx.fillStyle = '#7a6542';
            ctx.beginPath();
            ctx.arc(r*0.1, -r*0.3, r*0.14, 0, TAU);
            ctx.fill();
            
            // Spiky horns/scales radiating outward
            ctx.fillStyle = '#7a6445';
            for (let i = 0; i < 12; i++) {
                const angle = (i/12)*TAU;
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(cosA*r*0.7, sinA*r*0.52);
                ctx.lineTo(cosA*r*1.05, sinA*r*0.82);
                ctx.lineTo(Math.cos(angle+0.4)*r*0.7, Math.sin(angle+0.4)*r*0.52);
                ctx.closePath();
                ctx.fill();
            }
            
            // Head with horns
            ctx.fillStyle = '#b09466';
            ctx.beginPath();
            ctx.ellipse(d*r*0.55, -r*0.05, r*0.4, r*0.32, d*0.25, 0, TAU);
            ctx.fill();
            
            // Head horns (crown)
            ctx.fillStyle = '#8b7355';
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(d*r*0.5+i*r*0.15, -r*0.3);
                ctx.lineTo(d*r*0.5+i*r*0.18, -r*0.55);
                ctx.lineTo(d*r*0.5+i*r*0.25, -r*0.28);
                ctx.closePath();
                ctx.fill();
            }
            
            // Tiny dark eye
            ctx.fillStyle = '#1a1410';
            ctx.beginPath();
            ctx.arc(d*r*0.65, -r*0.12, r*0.08, 0, TAU);
            ctx.fill();
            
            // Blood-squirt threat display effect (occasional)
            const threatPhase = Math.max(0, Math.sin(t*1.2-1.5));
            if (threatPhase > 0.7) {
                ctx.strokeStyle = `rgba(180,0,0,${threatPhase})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(d*r*0.65, -r*0.12);
                ctx.lineTo(d*r*1.2, -r*0.3);
                ctx.stroke();
            }
        },

        vulture(ctx, e) {
            const r = e.radius || 13;
            const t = anim(e);
            const d = fdir(e);
            const wingFlap = Math.sin(t*4.5)*0.35;
            
            // Wide spreading wings with feather tips
            ctx.fillStyle = '#4a3728';
            for (let s = -1; s <= 1; s += 2) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(s*r*1.35, -r*0.4+s*wingFlap*r);
                ctx.lineTo(s*r*1.1, -r*0.15+s*wingFlap*r*0.6);
                ctx.lineTo(s*r*0.9, r*0.25);
                ctx.closePath();
                ctx.fill();
                
                // Feather tips detail
                ctx.fillStyle = '#3a2a1e';
                for (let i = 0; i < 4; i++) {
                    const fx = s*(r*1.0+i*r*0.12);
                    const fy = -r*0.35+s*wingFlap*r*0.8+i*r*0.08;
                    ctx.beginPath();
                    ctx.moveTo(fx, fy);
                    ctx.lineTo(fx+s*r*0.18, fy-r*0.12);
                    ctx.lineTo(fx+s*r*0.15, fy+r*0.05);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.fillStyle = '#4a3728';
            }
            
            // Hunched dark-brown body
            ctx.fillStyle = '#5d4a37';
            ctx.beginPath();
            ctx.ellipse(0, r*0.05, r*0.5, r*0.4, 0.2, 0, TAU);
            ctx.fill();
            
            // Body shading
            ctx.fillStyle = 'rgba(70,50,35,0.5)';
            ctx.beginPath();
            ctx.ellipse(-r*0.15, r*0.1, r*0.3, r*0.25, 0, 0, TAU);
            ctx.fill();
            
            // Neck ruff collar
            ctx.fillStyle = '#6d5a47';
            ctx.beginPath();
            ctx.arc(d*r*0.15, -r*0.15, r*0.35, 0, TAU);
            ctx.fill();
            
            // Bald red wrinkly head
            ctx.fillStyle = '#c62828';
            ctx.beginPath();
            ctx.arc(d*r*0.45, -r*0.3, r*0.25, 0, TAU);
            ctx.fill();
            
            // Wrinkles on head
            ctx.strokeStyle = '#a52222';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(d*r*0.4, -r*0.35+i*r*0.08, r*0.12, 0, PI);
                ctx.stroke();
            }
            
            // Hooked beak
            ctx.fillStyle = '#8b7355';
            ctx.beginPath();
            ctx.moveTo(d*r*0.6, -r*0.35);
            ctx.quadraticCurveTo(d*r*0.85, -r*0.4, d*r*0.8, -r*0.2);
            ctx.lineTo(d*r*0.65, -r*0.25);
            ctx.closePath();
            ctx.fill();
            
            // Beady black eyes
            ctx.fillStyle = '#1a1410';
            ctx.beginPath();
            ctx.arc(d*r*0.42, -r*0.38, r*0.06, 0, TAU);
            ctx.fill();
            
            // Tail feathers
            ctx.fillStyle = '#3e3028';
            ctx.beginPath();
            ctx.moveTo(-d*r*0.35, r*0.25);
            ctx.lineTo(-d*r*0.65, r*0.45);
            ctx.lineTo(-d*r*0.55, r*0.15);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-d*r*0.3, r*0.3);
            ctx.lineTo(-d*r*0.5, r*0.55);
            ctx.lineTo(-d*r*0.45, r*0.25);
            ctx.closePath();
            ctx.fill();
        },

        rattlesnake(ctx, e) {
            const r = e.radius || 12;
            const t = anim(e);
            const d = fdir(e);
            
            // Coiled thick body
            ctx.strokeStyle = '#8d7560';
            ctx.lineWidth = r*0.55;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-d*r*0.7, r*0.25);
            for (let i = 0; i < 5; i++) {
                const wave = Math.sin(t*3.2+i*1.3)*4;
                const xPos = (i % 2 === 0 ? -1 : 1) * d * r * 0.35;
                const yPos = (i % 2 === 0 ? -1 : 1) * r * 0.25 + wave;
                ctx.lineTo(xPos, yPos);
            }
            ctx.stroke();
            ctx.lineCap = 'butt';
            
            // Diamond pattern scales
            ctx.fillStyle = '#5d4e42';
            for (let i = 0; i < 4; i++) {
                const wave = Math.sin(t*3.2+i*1.3)*4;
                const xPos = (i % 2 === 0 ? -1 : 1) * d * r * 0.35;
                const yPos = (i % 2 === 0 ? -1 : 1) * r * 0.25 + wave;
                ctx.beginPath();
                ctx.moveTo(xPos, yPos-r*0.18);
                ctx.lineTo(xPos+r*0.15, yPos);
                ctx.lineTo(xPos, yPos+r*0.18);
                ctx.lineTo(xPos-r*0.15, yPos);
                ctx.closePath();
                ctx.fill();
                
                // Diamond outline
                ctx.strokeStyle = '#3e342a';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            
            // Darker diamond borders
            ctx.fillStyle = '#3e342a';
            for (let i = 0; i < 4; i++) {
                const wave = Math.sin(t*3.2+i*1.3)*4;
                const xPos = (i % 2 === 0 ? -1 : 1) * d * r * 0.35;
                const yPos = (i % 2 === 0 ? -1 : 1) * r * 0.25 + wave;
                ctx.beginPath();
                ctx.arc(xPos, yPos-r*0.18, r*0.05, 0, TAU);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(xPos, yPos+r*0.18, r*0.05, 0, TAU);
                ctx.fill();
            }
            
            // Triangular pit-viper head
            ctx.fillStyle = '#9d8570';
            ctx.beginPath();
            ctx.moveTo(d*r*0.4, -r*0.25);
            ctx.lineTo(d*r*0.75, -r*0.05);
            ctx.lineTo(d*r*0.4, r*0.15);
            ctx.lineTo(d*r*0.25, 0);
            ctx.closePath();
            ctx.fill();
            
            // Heat pit
            ctx.fillStyle = '#2a2015';
            ctx.beginPath();
            ctx.arc(d*r*0.55, -r*0.12, r*0.06, 0, TAU);
            ctx.fill();
            
            // Slit eyes with yellow iris
            ctx.fillStyle = '#d4af37';
            ctx.beginPath();
            ctx.ellipse(d*r*0.5, -r*0.18, r*0.12, r*0.15, 0, 0, TAU);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(d*r*0.51, -r*0.18, r*0.04, r*0.14, 0, 0, TAU);
            ctx.fill();
            
            // Forked tongue
            const tongueOut = Math.max(0, Math.sin(t*6.5))*0.4;
            if (tongueOut > 0) {
                ctx.strokeStyle = '#8b0000';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(d*r*0.75, -r*0.05);
                ctx.lineTo(d*(r*0.75+tongueOut*r*0.5), -r*0.08);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(d*r*0.75, -r*0.05);
                ctx.lineTo(d*(r*0.75+tongueOut*r*0.5), -r*0.02);
                ctx.stroke();
            }
            
            // Vibrating rattle tail segments
            const rattleVibrate = Math.sin(t*15)*2;
            const rattleX = -d*r*0.8;
            const rattleY = (4 % 2 === 0 ? -1 : 1) * r * 0.25 + Math.sin(t*3.2+4*1.3)*4;
            ctx.fillStyle = '#d4a574';
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.arc(rattleX-d*i*r*0.12, rattleY+rattleVibrate, r*0.08-i*r*0.01, 0, TAU);
                ctx.fill();
                ctx.strokeStyle = '#b8954d';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        },

        polar_bear(ctx, e) {
            const r = e.radius || 20;
            const t = anim(e);
            const d = fdir(e);
            
            // Walking animation - opposite phase for front and rear
            const frontWalk = Math.sin(t*4.2);
            const rearWalk = Math.sin(t*4.2+PI);
            
            // Rear legs (thick padded)
            ctx.fillStyle = '#e8eef2';
            ctx.beginPath();
            ctx.ellipse(-d*r*0.35, r*0.6+rearWalk*5, r*0.18, r*0.25, 0, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(-d*r*0.15, r*0.6-rearWalk*5, r*0.18, r*0.25, 0, 0, TAU);
            ctx.fill();
            
            // Huge paws (rear)
            ctx.fillStyle = '#d0d8dc';
            ctx.beginPath();
            ctx.ellipse(-d*r*0.35, r*0.82+rearWalk*5, r*0.2, r*0.12, 0, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(-d*r*0.15, r*0.82-rearWalk*5, r*0.2, r*0.12, 0, 0, TAU);
            ctx.fill();
            
            // Paw pads
            ctx.fillStyle = '#3a3a3a';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(-d*r*0.4+i*r*0.08, r*0.82+rearWalk*5, r*0.03, 0, TAU);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(-d*r*0.2+i*r*0.08, r*0.82-rearWalk*5, r*0.03, 0, TAU);
                ctx.fill();
            }
            
            // Massive white-furred body
            ctx.fillStyle = '#f0f4f8';
            ctx.beginPath();
            ctx.ellipse(0, r*0.05, r*0.9, r*0.75, 0, 0, TAU);
            ctx.fill();
            
            // Fur texture highlights
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.ellipse(-r*0.2, -r*0.15, r*0.4, r*0.35, -0.4, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(r*0.15, r*0.2, r*0.35, r*0.4, 0.3, 0, TAU);
            ctx.fill();
            
            // Thick neck
            ctx.fillStyle = '#e8eef2';
            ctx.beginPath();
            ctx.ellipse(d*r*0.45, -r*0.15, r*0.35, r*0.3, d*0.3, 0, TAU);
            ctx.fill();
            
            // Front legs (thick padded)
            ctx.fillStyle = '#e8eef2';
            ctx.beginPath();
            ctx.ellipse(d*r*0.35, r*0.6+frontWalk*5, r*0.18, r*0.25, 0, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(d*r*0.55, r*0.6-frontWalk*5, r*0.18, r*0.25, 0, 0, TAU);
            ctx.fill();
            
            // Huge paws (front)
            ctx.fillStyle = '#d0d8dc';
            ctx.beginPath();
            ctx.ellipse(d*r*0.35, r*0.82+frontWalk*5, r*0.2, r*0.12, 0, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(d*r*0.55, r*0.82-frontWalk*5, r*0.2, r*0.12, 0, 0, TAU);
            ctx.fill();
            
            // Paw pads (front)
            ctx.fillStyle = '#3a3a3a';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(d*r*0.3+i*r*0.08, r*0.82+frontWalk*5, r*0.03, 0, TAU);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(d*r*0.5+i*r*0.08, r*0.82-frontWalk*5, r*0.03, 0, TAU);
                ctx.fill();
            }
            
            // Head
            ctx.fillStyle = '#e0e8ec';
            ctx.beginPath();
            ctx.arc(d*r*0.65, -r*0.25, r*0.45, 0, TAU);
            ctx.fill();
            
            // Round ears
            ctx.fillStyle = '#d8e4e8';
            ctx.beginPath();
            ctx.arc(d*r*0.5, -r*0.6, r*0.14, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(d*r*0.8, -r*0.6, r*0.14, 0, TAU);
            ctx.fill();
            
            // Snout
            ctx.fillStyle = '#c8d4d8';
            ctx.beginPath();
            ctx.ellipse(d*r*0.85, -r*0.15, r*0.2, r*0.14, 0, 0, TAU);
            ctx.fill();
            
            // Black nose
            ctx.fillStyle = '#1a1410';
            ctx.beginPath();
            ctx.arc(d*r*0.98, -r*0.17, r*0.08, 0, TAU);
            ctx.fill();
            
            // Small dark eyes
            ctx.fillStyle = '#2a2a2a';
            ctx.beginPath();
            ctx.arc(d*r*0.6, -r*0.35, r*0.06, 0, TAU);
            ctx.fill();
        },

        arctic_fox(ctx, e) {
            const r = e.radius || 11;
            const t = anim(e);
            const d = fdir(e);
            
            // 4 trotting legs
            const trotF = Math.sin(t*7.5)*5;
            const trotR = Math.sin(t*7.5+PI)*5;
            ctx.strokeStyle = '#c8d4dc';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            // Front legs
            ctx.beginPath();
            ctx.moveTo(d*r*0.25, r*0.35);
            ctx.lineTo(d*r*0.25+trotF*0.3, r*0.75+trotF);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(d*r*0.45, r*0.35);
            ctx.lineTo(d*r*0.45-trotF*0.3, r*0.75-trotF);
            ctx.stroke();
            // Rear legs
            ctx.beginPath();
            ctx.moveTo(-d*r*0.25, r*0.35);
            ctx.lineTo(-d*r*0.25+trotR*0.3, r*0.75+trotR);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-d*r*0.45, r*0.35);
            ctx.lineTo(-d*r*0.45-trotR*0.3, r*0.75-trotR);
            ctx.stroke();
            ctx.lineCap = 'butt';
            
            // Paws
            ctx.fillStyle = '#b8c8d0';
            ctx.beginPath();
            ctx.arc(d*r*0.25+trotF*0.3, r*0.75+trotF, r*0.1, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(d*r*0.45-trotF*0.3, r*0.75-trotF, r*0.1, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-d*r*0.25+trotR*0.3, r*0.75+trotR, r*0.1, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-d*r*0.45-trotR*0.3, r*0.75-trotR, r*0.1, 0, TAU);
            ctx.fill();
            
            // Fluffy white body
            ctx.fillStyle = '#d8e4ec';
            ctx.beginPath();
            ctx.ellipse(0, r*0.05, r*0.8, r*0.6, 0, 0, TAU);
            ctx.fill();
            
            // Fur fluff texture
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.beginPath();
            ctx.ellipse(-r*0.2, r*0.1, r*0.35, r*0.3, -0.3, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(r*0.15, -r*0.05, r*0.3, r*0.25, 0.4, 0, TAU);
            ctx.fill();
            
            // Head
            ctx.fillStyle = '#e8f0f4';
            ctx.beginPath();
            ctx.arc(d*r*0.55, -r*0.2, r*0.4, 0, TAU);
            ctx.fill();
            
            // Pointed ears
            ctx.fillStyle = '#d8e4ec';
            ctx.beginPath();
            ctx.moveTo(d*r*0.35, -r*0.55);
            ctx.lineTo(d*r*0.3, -r*0.85);
            ctx.lineTo(d*r*0.5, -r*0.5);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(d*r*0.6, -r*0.55);
            ctx.lineTo(d*r*0.7, -r*0.85);
            ctx.lineTo(d*r*0.75, -r*0.45);
            ctx.closePath();
            ctx.fill();
            
            // Pink inside ears
            ctx.fillStyle = '#ffb3ba';
            ctx.beginPath();
            ctx.moveTo(d*r*0.38, -r*0.6);
            ctx.lineTo(d*r*0.35, -r*0.75);
            ctx.lineTo(d*r*0.45, -r*0.58);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(d*r*0.62, -r*0.6);
            ctx.lineTo(d*r*0.68, -r*0.75);
            ctx.lineTo(d*r*0.7, -r*0.52);
            ctx.closePath();
            ctx.fill();
            
            // Snout
            ctx.fillStyle = '#c8d4dc';
            ctx.beginPath();
            ctx.ellipse(d*r*0.8, -r*0.08, r*0.18, r*0.12, 0, 0, TAU);
            ctx.fill();
            
            // Small black nose
            ctx.fillStyle = '#1a1410';
            ctx.beginPath();
            ctx.arc(d*r*0.92, -r*0.1, r*0.07, 0, TAU);
            ctx.fill();
            
            // Dark bright eyes
            ctx.fillStyle = '#2a2a2a';
            ctx.beginPath();
            ctx.arc(d*r*0.55, -r*0.28, r*0.08, 0, TAU);
            ctx.fill();
            // Eye shine
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.beginPath();
            ctx.arc(d*r*0.53, -r*0.3, r*0.03, 0, TAU);
            ctx.fill();
            
            // Thick bushy tail that sways
            const tailSway = Math.sin(t*5.5)*0.4;
            ctx.fillStyle = '#d8e4ec';
            ctx.beginPath();
            ctx.ellipse(-d*r*0.7, r*0.15, r*0.45, r*0.2, -d*(0.6+tailSway), 0, TAU);
            ctx.fill();
            // Tail fluff
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.ellipse(-d*r*0.85, r*0.05, r*0.25, r*0.15, -d*0.5, 0, TAU);
            ctx.fill();
        },

        seal(ctx, e) {
            const r = e.radius || 14;
            const t = anim(e);
            const d = fdir(e);
            
            // Sleek grey-blue torpedo body
            ctx.fillStyle = '#607d8b';
            ctx.beginPath();
            ctx.ellipse(0, 0, r*0.95, r*0.58, d*0.12, 0, TAU);
            ctx.fill();
            
            // Spotted pattern
            ctx.fillStyle = 'rgba(70,90,100,0.5)';
            const spots = [
                [-r*0.4, -r*0.2],
                [r*0.2, r*0.15],
                [-r*0.1, r*0.3],
                [r*0.5, -r*0.15],
                [-r*0.6, r*0.1],
                [r*0.35, r*0.35]
            ];
            spots.forEach(([x, y], i) => {
                ctx.beginPath();
                ctx.ellipse(x, y, r*0.12, r*0.1, i * 0.8 + 0.3, 0, TAU);
                ctx.fill();
            });
            
            // Side flippers with wave motion
            const flipperWave = Math.sin(t*4.5)*0.5;
            ctx.fillStyle = '#546e7a';
            for (let s = -1; s <= 1; s += 2) {
                ctx.save();
                ctx.translate(d*r*0.15, s*r*0.35);
                ctx.rotate(d*0.4+s*flipperWave);
                ctx.beginPath();
                ctx.ellipse(0, 0, r*0.28, r*0.1, 0, 0, TAU);
                ctx.fill();
                ctx.restore();
            }
            
            // Flipper detail
            ctx.strokeStyle = '#455a64';
            ctx.lineWidth = 1;
            for (let s = -1; s <= 1; s += 2) {
                ctx.save();
                ctx.translate(d*r*0.15, s*r*0.35);
                ctx.rotate(d*0.4+s*flipperWave);
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(-r*0.1, 0);
                    ctx.lineTo(r*0.1+i*r*0.05, s*i*r*0.03);
                    ctx.stroke();
                }
                ctx.restore();
            }
            
            // Rear flipper that waves
            const rearWave = Math.sin(t*3.5)*0.6;
            ctx.fillStyle = '#546e7a';
            ctx.save();
            ctx.translate(-d*r*0.75, 0);
            ctx.rotate(rearWave);
            ctx.beginPath();
            ctx.ellipse(0, 0, r*0.25, r*0.15, 0, 0, TAU);
            ctx.fill();
            ctx.restore();
            
            // Round head
            ctx.fillStyle = '#78909c';
            ctx.beginPath();
            ctx.arc(d*r*0.65, -r*0.12, r*0.4, 0, TAU);
            ctx.fill();
            
            // Large dark eyes
            ctx.fillStyle = '#1a1410';
            ctx.beginPath();
            ctx.arc(d*r*0.65, -r*0.22, r*0.12, 0, TAU);
            ctx.fill();
            // Eye shine
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.beginPath();
            ctx.arc(d*r*0.62, -r*0.26, r*0.04, 0, TAU);
            ctx.fill();
            
            // Whiskers
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.moveTo(d*r*0.8, -r*0.05+i*r*0.08);
                ctx.lineTo(d*r*1.15, -r*0.12+i*r*0.12);
                ctx.stroke();
            }
            
            // Black nose
            ctx.fillStyle = '#0a0a08';
            ctx.beginPath();
            ctx.arc(d*r*0.95, -r*0.02, r*0.08, 0, TAU);
            ctx.fill();
            
            // Nostril detail
            ctx.fillStyle = '#1a1410';
            ctx.beginPath();
            ctx.arc(d*r*0.93, -r*0.04, r*0.02, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(d*r*0.97, -r*0.04, r*0.02, 0, TAU);
            ctx.fill();
        },

        snowy_owl(ctx, e) {
            const r = e.radius || 12;
            const t = anim(e);
            const d = fdir(e);
            const wingFlap = Math.sin(t*5.2)*0.3;
            
            // 2 large wings with feather detail
            ctx.fillStyle = '#f5f5f5';
            for (let s = -1; s <= 1; s += 2) {
                ctx.beginPath();
                ctx.moveTo(0, r*0.1);
                ctx.lineTo(s*r*1.25, -r*0.3+s*wingFlap*r);
                ctx.lineTo(s*r*1.0, -r*0.05+s*wingFlap*r*0.7);
                ctx.lineTo(s*r*0.75, r*0.2);
                ctx.closePath();
                ctx.fill();
                
                // Feather detail lines
                ctx.strokeStyle = '#e0e0e0';
                ctx.lineWidth = 1.5;
                for (let i = 0; i < 5; i++) {
                    const fx = s*r*0.5 + i*s*r*0.15;
                    const fy = -r*0.2+s*wingFlap*r*0.5 + i*r*0.08;
                    ctx.beginPath();
                    ctx.moveTo(0, r*0.1);
                    ctx.lineTo(fx, fy);
                    ctx.stroke();
                }
            }
            
            // Round white body
            ctx.fillStyle = '#fafafa';
            ctx.beginPath();
            ctx.ellipse(0, r*0.05, r*0.55, r*0.65, 0, 0, TAU);
            ctx.fill();
            
            // Grey speckle bars
            ctx.fillStyle = '#b8b8b8';
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * TAU + 0.5;
                const dist = (Math.sin(i * 2.1 + 0.7) * 0.5 + 0.5) * r * 0.4;
                const bx = Math.cos(angle)*dist;
                const by = Math.sin(angle)*dist + r*0.05;
                ctx.beginPath();
                ctx.rect(bx-r*0.08, by, r*0.16, r*0.04);
                ctx.fill();
            }
            
            // Flat disc face
            ctx.fillStyle = '#f0f0f0';
            ctx.beginPath();
            ctx.arc(0, -r*0.5, r*0.42, 0, TAU);
            ctx.fill();
            
            // Facial disc outline
            ctx.strokeStyle = '#d0d0d0';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, -r*0.5, r*0.42, 0, TAU);
            ctx.stroke();
            
            // Huge yellow eyes
            ctx.fillStyle = '#fdd835';
            ctx.beginPath();
            ctx.arc(-r*0.18, -r*0.55, r*0.18, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(r*0.18, -r*0.55, r*0.18, 0, TAU);
            ctx.fill();
            
            // Black pupils
            ctx.fillStyle = '#0a0a08';
            ctx.beginPath();
            ctx.arc(-r*0.18, -r*0.55, r*0.09, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(r*0.18, -r*0.55, r*0.09, 0, TAU);
            ctx.fill();
            
            // Eye shine
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.beginPath();
            ctx.arc(-r*0.21, -r*0.58, r*0.04, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(r*0.15, -r*0.58, r*0.04, 0, TAU);
            ctx.fill();
            
            // Small hooked beak
            ctx.fillStyle = '#4a4a48';
            ctx.beginPath();
            ctx.moveTo(0, -r*0.42);
            ctx.quadraticCurveTo(d*r*0.08, -r*0.38, d*r*0.06, -r*0.3);
            ctx.lineTo(0, -r*0.35);
            ctx.closePath();
            ctx.fill();
            
            // Feathered talons
            ctx.fillStyle = '#e8e8e8';
            ctx.beginPath();
            ctx.ellipse(0, r*0.65, r*0.25, r*0.12, 0, 0, TAU);
            ctx.fill();
            ctx.fillStyle = '#3a3a38';
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(i*r*0.12, r*0.7);
                ctx.lineTo(i*r*0.15, r*0.85);
                ctx.lineTo(i*r*0.08, r*0.72);
                ctx.closePath();
                ctx.fill();
            }
        },

        shark(ctx, e) {
            const r = e.radius || 18;
            const t = anim(e);
            const d = fdir(e);
            const tailSwing = Math.sin(t*4.5)*6;
            
            // Crescent tail that swings
            ctx.fillStyle = '#546e7a';
            ctx.beginPath();
            ctx.moveTo(-d*r*0.65, 0);
            ctx.lineTo(-d*r*1.1, -r*0.5+tailSwing);
            ctx.lineTo(-d*r*0.85, -r*0.05+tailSwing*0.3);
            ctx.lineTo(-d*r*1.05, r*0.35+tailSwing);
            ctx.lineTo(-d*r*0.65, r*0.05);
            ctx.closePath();
            ctx.fill();
            
            // Pectoral fins
            ctx.fillStyle = '#607d8b';
            for (let s = -1; s <= 1; s += 2) {
                ctx.beginPath();
                ctx.moveTo(d*r*0.15, s*r*0.25);
                ctx.lineTo(d*r*0.35, s*r*0.6);
                ctx.lineTo(d*r*0.45, s*r*0.3);
                ctx.closePath();
                ctx.fill();
            }
            
            // Sleek blue-grey torpedo body
            ctx.fillStyle = '#607d8b';
            ctx.beginPath();
            ctx.ellipse(0, 0, r*0.85, r*0.38, d*0.08, 0, TAU);
            ctx.fill();
            
            // Body shading
            ctx.fillStyle = 'rgba(70,90,100,0.3)';
            ctx.beginPath();
            ctx.ellipse(0, -r*0.08, r*0.65, r*0.18, d*0.05, 0, TAU);
            ctx.fill();
            
            // Prominent dorsal fin
            ctx.fillStyle = '#546e7a';
            ctx.beginPath();
            ctx.moveTo(-r*0.15, -r*0.35);
            ctx.lineTo(r*0.05, -r*0.75);
            ctx.lineTo(r*0.35, -r*0.35);
            ctx.closePath();
            ctx.fill();
            
            // White underbelly
            ctx.fillStyle = '#eceff1';
            ctx.beginPath();
            ctx.ellipse(0, r*0.12, r*0.65, r*0.2, 0, 0, PI);
            ctx.fill();
            
            // Gill slits (3 lines)
            ctx.strokeStyle = '#37474f';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(d*r*0.25+i*d*r*0.12, -r*0.18);
                ctx.lineTo(d*r*0.28+i*d*r*0.12, r*0.05);
                ctx.stroke();
            }
            
            // Head definition
            ctx.fillStyle = '#546e7a';
            ctx.beginPath();
            ctx.arc(d*r*0.65, -r*0.05, r*0.28, 0, TAU);
            ctx.fill();
            
            // Small dark eye
            ctx.fillStyle = '#0a0a08';
            ctx.beginPath();
            ctx.arc(d*r*0.6, -r*0.15, r*0.08, 0, TAU);
            ctx.fill();
            
            // Rows of teeth in slightly open mouth
            ctx.strokeStyle = '#37474f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(d*r*0.75, r*0.08);
            ctx.lineTo(d*r*0.95, r*0.05);
            ctx.stroke();
            
            ctx.fillStyle = '#f0f0f0';
            for (let i = 0; i < 5; i++) {
                // Upper teeth
                ctx.beginPath();
                ctx.moveTo(d*(r*0.78+i*r*0.08), r*0.02);
                ctx.lineTo(d*(r*0.76+i*r*0.08), r*0.1);
                ctx.lineTo(d*(r*0.8+i*r*0.08), r*0.05);
                ctx.closePath();
                ctx.fill();
                // Lower teeth
                ctx.beginPath();
                ctx.moveTo(d*(r*0.78+i*r*0.08), r*0.12);
                ctx.lineTo(d*(r*0.76+i*r*0.08), r*0.05);
                ctx.lineTo(d*(r*0.8+i*r*0.08), r*0.1);
                ctx.closePath();
                ctx.fill();
            }
        },

        jellyfish(ctx, e) {
            const r = e.radius || 14;
            const t = anim(e);
            const pulse = Math.sin(t*2.5)*0.2;
            
            // 5 long trailing tentacles with gentle wave
            ctx.strokeStyle = 'rgba(170,120,200,0.6)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            for (let i = -2; i <= 2; i++) {
                const baseX = i*r*0.22;
                const wave1 = Math.sin(t*2.2+i*0.9)*7;
                const wave2 = Math.sin(t*2.2+i*0.9+1.5)*9;
                ctx.beginPath();
                ctx.moveTo(baseX, r*0.15);
                ctx.quadraticCurveTo(
                    baseX+wave1, r*0.55,
                    baseX+wave2*0.6, r*0.95
                );
                ctx.lineTo(baseX+wave2*0.4, r*1.35);
                ctx.stroke();
                
                // Tentacle segments
                ctx.fillStyle = 'rgba(160,100,190,0.4)';
                for (let j = 0; j < 4; j++) {
                    const ty = r*0.15 + j*r*0.35;
                    const tx = baseX + Math.sin(t*2.2+i*0.9+j*0.7)*6;
                    ctx.beginPath();
                    ctx.arc(tx, ty, r*0.05, 0, TAU);
                    ctx.fill();
                }
            }
            ctx.lineCap = 'butt';
            
            // Oral arms
            ctx.strokeStyle = 'rgba(190,130,210,0.7)';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            for (let i = -1; i <= 1; i += 2) {
                const wave = Math.sin(t*2.5+i)*5;
                ctx.beginPath();
                ctx.moveTo(0, r*0.05);
                ctx.quadraticCurveTo(i*r*0.15, r*0.25+wave, i*r*0.2, r*0.5);
                ctx.stroke();
            }
            ctx.lineCap = 'butt';
            
            // Translucent dome bell that pulses open/close
            const bellSize = 0.65 + pulse;
            const bellHeight = 0.5 - pulse*0.3;
            ctx.fillStyle = 'rgba(220,190,235,0.5)';
            ctx.beginPath();
            ctx.ellipse(0, -r*0.2, r*bellSize, r*bellHeight, 0, PI, TAU);
            ctx.fill();
            ctx.fillStyle = 'rgba(200,160,220,0.35)';
            ctx.beginPath();
            ctx.ellipse(0, -r*0.2, r*bellSize, r*bellHeight, 0, 0, PI);
            ctx.fill();
            
            // Internal organ network visible through bell
            ctx.strokeStyle = 'rgba(180,120,200,0.4)';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 4; i++) {
                const angle = (i/4)*TAU;
                ctx.beginPath();
                ctx.moveTo(0, -r*0.25);
                ctx.lineTo(Math.cos(angle)*r*0.35, -r*0.2+Math.sin(angle)*r*0.2);
                ctx.stroke();
            }
            
            // Central organ mass
            ctx.fillStyle = 'rgba(160,100,180,0.5)';
            ctx.beginPath();
            ctx.arc(0, -r*0.25, r*0.15, 0, TAU);
            ctx.fill();
            
            // Radial canals
            ctx.strokeStyle = 'rgba(190,140,210,0.3)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 8; i++) {
                const angle = (i/8)*TAU;
                ctx.beginPath();
                ctx.moveTo(0, -r*0.25);
                ctx.lineTo(Math.cos(angle)*r*0.55, -r*0.2+Math.sin(angle)*r*0.4);
                ctx.stroke();
            }
            
            // Bioluminescent glow
            const glowIntensity = 0.3 + Math.sin(t*3)*0.2;
            ctx.fillStyle = `rgba(200,150,255,${glowIntensity})`;
            ctx.beginPath();
            ctx.ellipse(0, -r*0.3, r*0.35, r*0.25, 0, 0, TAU);
            ctx.fill();
            
            // Bell rim detail
            ctx.strokeStyle = 'rgba(180,130,200,0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, -r*0.2+r*bellHeight, r*bellSize, r*0.08, 0, 0, PI);
            ctx.stroke();
        },

        anglerfish(ctx, e) {
            const r = e.radius || 13;
            const t = anim(e);
            const d = fdir(e);
            
            // Dark bulbous body (deep-sea coloring)
            ctx.fillStyle = '#263238';
            ctx.beginPath();
            ctx.ellipse(0, 0, r*0.75, r*0.7, 0, 0, TAU);
            ctx.fill();
            
            // Body texture/bumps
            ctx.fillStyle = 'rgba(50,60,70,0.6)';
            const bumps = [
                [-r*0.3, -r*0.25],
                [r*0.2, -r*0.35],
                [-r*0.4, r*0.15],
                [r*0.35, r*0.2]
            ];
            bumps.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, r*0.12, 0, TAU);
                ctx.fill();
            });
            
            // Pectoral fins
            ctx.fillStyle = '#37474f';
            for (let s = -1; s <= 1; s += 2) {
                ctx.beginPath();
                ctx.moveTo(-r*0.2, s*r*0.5);
                ctx.lineTo(-r*0.45, s*r*0.75);
                ctx.lineTo(-r*0.15, s*r*0.6);
                ctx.closePath();
                ctx.fill();
            }
            
            // Enormous gaping mouth
            ctx.fillStyle = '#0d1117';
            ctx.beginPath();
            const mouthAngle = d > 0 ? 0 : PI;
            ctx.arc(d*r*0.45, r*0.15, r*0.5, mouthAngle-0.6, mouthAngle+0.6);
            ctx.fill();
            
            // Needle teeth (rows of them)
            ctx.fillStyle = '#d0d0d0';
            for (let row = 0; row < 2; row++) {
                for (let i = 0; i < 6; i++) {
                    const toothAngle = (mouthAngle-0.5) + i*0.18;
                    const toothDist = r*0.4 - row*r*0.1;
                    const tx = d*r*0.45 + Math.cos(toothAngle)*toothDist;
                    const ty = r*0.15 + Math.sin(toothAngle)*toothDist;
                    ctx.beginPath();
                    ctx.moveTo(tx, ty);
                    ctx.lineTo(
                        d*r*0.45 + Math.cos(toothAngle)*(toothDist-r*0.15),
                        r*0.15 + Math.sin(toothAngle)*(toothDist-r*0.15)
                    );
                    ctx.lineWidth = 1.5;
                    ctx.strokeStyle = '#e0e0e0';
                    ctx.stroke();
                }
            }
            
            // Tiny eye
            ctx.fillStyle = '#607d8b';
            ctx.beginPath();
            ctx.arc(d*r*0.2, -r*0.3, r*0.12, 0, TAU);
            ctx.fill();
            ctx.fillStyle = '#0a0a08';
            ctx.beginPath();
            ctx.arc(d*r*0.22, -r*0.3, r*0.06, 0, TAU);
            ctx.fill();
            
            // Bioluminescent lure on stalk that bobs and glows
            const lureBob = Math.sin(t*3.5)*4;
            const lureGlow = 0.6 + Math.sin(t*5)*0.4;
            
            // Stalk
            ctx.strokeStyle = '#455a64';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(d*r*0.15, -r*0.6);
            ctx.quadraticCurveTo(
                d*r*0.45, -r*1.05,
                d*r*0.35, -r*0.95+lureBob
            );
            ctx.stroke();
            ctx.lineCap = 'butt';
            
            // Glowing lure bulb
            ctx.fillStyle = `rgba(100,255,218,${lureGlow*0.3})`;
            ctx.beginPath();
            ctx.arc(d*r*0.35, -r*0.95+lureBob, r*0.22, 0, TAU);
            ctx.fill();
            ctx.fillStyle = `rgba(100,255,218,${lureGlow*0.6})`;
            ctx.beginPath();
            ctx.arc(d*r*0.35, -r*0.95+lureBob, r*0.14, 0, TAU);
            ctx.fill();
            ctx.fillStyle = `rgba(150,255,230,${lureGlow})`;
            ctx.beginPath();
            ctx.arc(d*r*0.35, -r*0.95+lureBob, r*0.08, 0, TAU);
            ctx.fill();
            
            // Glow rays
            ctx.strokeStyle = `rgba(100,255,218,${lureGlow*0.25})`;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 6; i++) {
                const rayAngle = (i/6)*TAU;
                ctx.beginPath();
                ctx.moveTo(d*r*0.35, -r*0.95+lureBob);
                ctx.lineTo(
                    d*r*0.35+Math.cos(rayAngle)*r*0.3,
                    -r*0.95+lureBob+Math.sin(rayAngle)*r*0.3
                );
                ctx.stroke();
            }
        },

        giant_squid(ctx, e) {
            const r = e.radius || 18;
            const t = anim(e);
            const d = fdir(e);
            
            // 8 arms (shorter) + 2 long tentacles with club ends
            ctx.lineCap = 'round';
            
            // 8 arms
            for (let i = 0; i < 8; i++) {
                const armAngle = (i/8)*TAU + PI/2;
                const wave = Math.sin(t*2.8+i*0.7)*8;
                const armLen = r*0.85;
                const armWidth = 3 - i*0.1;
                
                ctx.strokeStyle = i % 2 === 0 ? '#7b1fa2' : '#9c27b0';
                ctx.lineWidth = armWidth;
                
                ctx.beginPath();
                ctx.moveTo(Math.cos(armAngle)*r*0.35, Math.sin(armAngle)*r*0.35);
                ctx.quadraticCurveTo(
                    Math.cos(armAngle)*armLen*0.5+wave, Math.sin(armAngle)*armLen*0.5+wave*0.3,
                    Math.cos(armAngle)*armLen+wave*0.5, Math.sin(armAngle)*armLen+wave*0.6
                );
                ctx.stroke();
                
                // Suckers
                ctx.fillStyle = 'rgba(200,150,210,0.6)';
                for (let j = 0; j < 4; j++) {
                    const suckerT = j/3;
                    const sx = Math.cos(armAngle)*(r*0.35+armLen*suckerT)+wave*suckerT*0.5;
                    const sy = Math.sin(armAngle)*(r*0.35+armLen*suckerT)+wave*suckerT*0.3;
                    ctx.beginPath();
                    ctx.arc(sx, sy, r*0.06, 0, TAU);
                    ctx.fill();
                }
            }
            
            // 2 long tentacles with club ends
            for (let i = 0; i < 2; i++) {
                const tentAngle = PI/4 + i*PI*1.5;
                const wave = Math.sin(t*2.5+i*PI)*10;
                const tentLen = r*1.4;
                
                ctx.strokeStyle = '#6a1b9a';
                ctx.lineWidth = 3.5;
                
                ctx.beginPath();
                ctx.moveTo(Math.cos(tentAngle)*r*0.35, Math.sin(tentAngle)*r*0.35);
                ctx.quadraticCurveTo(
                    Math.cos(tentAngle)*tentLen*0.6+wave, Math.sin(tentAngle)*tentLen*0.6,
                    Math.cos(tentAngle)*tentLen+wave*0.3, Math.sin(tentAngle)*tentLen+wave*0.4
                );
                ctx.stroke();
                
                // Club end (enlarged)
                const clubX = Math.cos(tentAngle)*tentLen+wave*0.3;
                const clubY = Math.sin(tentAngle)*tentLen+wave*0.4;
                ctx.fillStyle = '#7b1fa2';
                ctx.beginPath();
                ctx.ellipse(clubX, clubY, r*0.18, r*0.12, tentAngle, 0, TAU);
                ctx.fill();
                
                // Club suckers
                ctx.fillStyle = 'rgba(200,150,210,0.7)';
                for (let j = 0; j < 6; j++) {
                    const sAngle = (j/6)*TAU;
                    const sx = clubX + Math.cos(sAngle)*r*0.1;
                    const sy = clubY + Math.sin(sAngle)*r*0.07;
                    ctx.beginPath();
                    ctx.arc(sx, sy, r*0.04, 0, TAU);
                    ctx.fill();
                }
            }
            
            ctx.lineCap = 'butt';
            
            // Torpedo-shaped mantle
            ctx.fillStyle = '#8e24aa';
            ctx.beginPath();
            ctx.ellipse(0, -r*0.15, r*0.55, r*0.5, 0, 0, TAU);
            ctx.fill();
            
            // Fin flaps on mantle
            ctx.fillStyle = '#7b1fa2';
            const finFlap = Math.sin(t*4)*0.2;
            for (let s = -1; s <= 1; s += 2) {
                ctx.save();
                ctx.translate(s*r*0.25, -r*0.45);
                ctx.rotate(s*finFlap);
                ctx.beginPath();
                ctx.ellipse(0, 0, r*0.35, r*0.15, s*0.3, 0, TAU);
                ctx.fill();
                ctx.restore();
            }
            
            // Color-shifting chromatophores
            const chromaPhase = Math.sin(t*3);
            ctx.fillStyle = chromaPhase > 0 ? 'rgba(200,100,150,0.3)' : 'rgba(150,80,180,0.3)';
            for (let i = 0; i < 8; i++) {
                const cx = Math.sin(i * 1.7 + 0.9) * r * 0.35;
                const cy = -r*0.15 + Math.cos(i * 2.3 + 0.5) * r * 0.3;
                ctx.beginPath();
                ctx.arc(cx, cy, r*0.08, 0, TAU);
                ctx.fill();
            }
            
            // Large eyes with horizontal pupils
            ctx.fillStyle = '#ffeb3b';
            for (let s = -1; s <= 1; s += 2) {
                ctx.beginPath();
                ctx.ellipse(s*r*0.25, -r*0.2, r*0.15, r*0.18, s*0.2, 0, TAU);
                ctx.fill();
                
                // Horizontal pupil
                ctx.fillStyle = '#0a0a08';
                ctx.beginPath();
                ctx.ellipse(s*r*0.25+d*r*0.03, -r*0.2, r*0.13, r*0.06, 0, 0, TAU);
                ctx.fill();
            }
            
            // Jet siphon
            ctx.fillStyle = '#6a1b9a';
            ctx.beginPath();
            ctx.ellipse(0, r*0.25, r*0.12, r*0.08, 0, 0, TAU);
            ctx.fill();
            ctx.fillStyle = '#4a148c';
            ctx.beginPath();
            ctx.ellipse(0, r*0.25, r*0.06, r*0.04, 0, 0, TAU);
            ctx.fill();
        },

        // ============================================================
        //  New creatures
        // ============================================================

centipede(ctx, e) {
  const r = e.radius || 8;
  const t = anim(e);
  const d = fdir(e);
  
  const segCount = 8;
  const segLen = r * 0.6;
  const waveAmp = r * 0.3;
  const waveFreq = 0.3;
  
  // Body segments
  for (let i = 0; i < segCount; i++) {
    const offsetX = -i * segLen;
    const waveOffset = Math.sin(t * 5 + i * waveFreq) * waveAmp;
    const shade = 100 - i * 3;
    
    ctx.beginPath();
    ctx.arc(offsetX, waveOffset, r * 0.5, 0, TAU);
    ctx.fillStyle = `rgb(${shade + 40}, ${shade - 20}, ${shade - 60})`;
    ctx.fill();
    ctx.strokeStyle = `rgb(${shade + 20}, ${shade - 30}, ${shade - 70})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Legs (2 per segment)
    for (let side = -1; side <= 1; side += 2) {
      const legPhase = Math.sin(t * 8 + i * 0.5 + side) * 0.4;
      const legX = offsetX;
      const legY = waveOffset + side * r * 0.4;
      const legEndX = legX + r * 0.8;
      const legEndY = legY + side * (r * 0.6 + legPhase * r * 0.3);
      
      ctx.beginPath();
      ctx.moveTo(legX, legY);
      ctx.lineTo(legEndX, legEndY);
      ctx.strokeStyle = `rgb(${shade}, ${shade - 30}, ${shade - 60})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
  
  // Head
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.6, 0, TAU);
  ctx.fillStyle = 'rgb(120, 60, 20)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(90, 40, 10)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Eyes
  ctx.beginPath();
  ctx.arc(r * 0.2, -r * 0.2, r * 0.1, 0, TAU);
  ctx.arc(r * 0.2, r * 0.2, r * 0.1, 0, TAU);
  ctx.fillStyle = 'black';
  ctx.fill();
  
  // Forcipules (venomous pincers)
  ctx.beginPath();
  ctx.moveTo(r * 0.5, -r * 0.3);
  ctx.quadraticCurveTo(r * 0.9, -r * 0.5, r * 1.1, -r * 0.4);
  ctx.strokeStyle = 'rgb(100, 50, 10)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.5, r * 0.3);
  ctx.quadraticCurveTo(r * 0.9, r * 0.5, r * 1.1, r * 0.4);
  ctx.stroke();
  
  // Antennae
  ctx.beginPath();
  ctx.moveTo(r * 0.3, -r * 0.5);
  ctx.quadraticCurveTo(r * 0.6, -r * 1.2, r * 0.4, -r * 1.5);
  ctx.strokeStyle = 'rgb(80, 40, 10)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.3, r * 0.5);
  ctx.quadraticCurveTo(r * 0.6, r * 1.2, r * 0.4, r * 1.5);
  ctx.stroke();
},

mantis(ctx, e) {
  const r = e.radius || 12;
  const t = anim(e);
  const d = fdir(e);
  
  const strikePhase = Math.abs(Math.sin(t * 2));
  
  // Abdomen
  ctx.beginPath();
  ctx.ellipse(-r * 0.5, 0, r * 0.8, r * 0.4, 0, 0, TAU);
  ctx.fillStyle = 'rgb(100, 180, 60)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(80, 150, 50)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Wing cases
  ctx.beginPath();
  ctx.moveTo(-r * 0.9, -r * 0.3);
  ctx.lineTo(-r * 0.1, -r * 0.5);
  ctx.lineTo(r * 0.1, -r * 0.4);
  ctx.lineTo(-r * 0.5, -r * 0.2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(120, 200, 80, 0.7)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(-r * 0.9, r * 0.3);
  ctx.lineTo(-r * 0.1, r * 0.5);
  ctx.lineTo(r * 0.1, r * 0.4);
  ctx.lineTo(-r * 0.5, r * 0.2);
  ctx.closePath();
  ctx.fill();
  
  // Thorax
  ctx.beginPath();
  ctx.ellipse(r * 0.2, 0, r * 0.5, r * 0.35, 0, 0, TAU);
  ctx.fillStyle = 'rgb(90, 170, 50)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(70, 140, 40)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Walking legs (4 legs, 2 on each side)
  const legPhase = Math.sin(t * 4);
  for (let i = 0; i < 2; i++) {
    for (let side = -1; side <= 1; side += 2) {
      const legX = -r * 0.2 - i * r * 0.3;
      const legY = side * r * 0.3;
      const kneeX = legX - r * 0.5;
      const kneeY = legY + side * (r * 0.8 + legPhase * 0.2 * (i % 2 ? 1 : -1));
      const footX = kneeX + r * 0.3;
      const footY = kneeY + side * r * 0.6;
      
      ctx.beginPath();
      ctx.moveTo(legX, legY);
      ctx.lineTo(kneeX, kneeY);
      ctx.lineTo(footX, footY);
      ctx.strokeStyle = 'rgb(80, 160, 45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
  
  // Head (triangular)
  ctx.save();
  ctx.rotate(Math.sin(t * 1.5) * 0.15);
  
  ctx.beginPath();
  ctx.moveTo(r * 0.8, 0);
  ctx.lineTo(r * 0.4, -r * 0.5);
  ctx.lineTo(r * 0.3, r * 0.5);
  ctx.closePath();
  ctx.fillStyle = 'rgb(95, 185, 55)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(75, 155, 45)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Compound eyes
  ctx.beginPath();
  ctx.arc(r * 0.6, -r * 0.3, r * 0.25, 0, TAU);
  ctx.fillStyle = 'rgb(40, 40, 40)';
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 150, 0.3)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.6, r * 0.3, r * 0.25, 0, TAU);
  ctx.fillStyle = 'rgb(40, 40, 40)';
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 150, 0.3)';
  ctx.fill();
  
  ctx.restore();
  
  // Raptorial forelegs (striking pose)
  const strikeAngle = -0.3 + strikePhase * 0.8;
  for (let side = -1; side <= 1; side += 2) {
    const baseX = r * 0.4;
    const baseY = side * r * 0.25;
    const elbowX = baseX + r * 0.6 * Math.cos(strikeAngle);
    const elbowY = baseY + side * r * 0.6 * Math.sin(Math.abs(strikeAngle));
    const clawX = elbowX + r * 0.7 * Math.cos(strikeAngle - 0.5);
    const clawY = elbowY + side * r * 0.5;
    
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(elbowX, elbowY);
    ctx.lineTo(clawX, clawY);
    ctx.strokeStyle = 'rgb(70, 150, 40)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Spines on foreleg
    for (let s = 0; s < 3; s++) {
      ctx.beginPath();
      ctx.moveTo(elbowX - s * r * 0.15, elbowY + side * s * r * 0.08);
      ctx.lineTo(elbowX - s * r * 0.15 + r * 0.2, elbowY + side * (s * r * 0.08 + r * 0.15));
      ctx.strokeStyle = 'rgb(60, 140, 35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
},

piranha(ctx, e) {
  const r = e.radius || 9;
  const t = anim(e);
  const d = fdir(e);
  
  const tailWag = Math.sin(t * 12) * 0.4;
  
  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9, r * 0.7, 0, 0, TAU);
  ctx.fillStyle = 'rgb(180, 180, 190)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(150, 150, 160)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Red belly/throat
  ctx.beginPath();
  ctx.ellipse(r * 0.2, r * 0.1, r * 0.6, r * 0.5, 0, 0, PI);
  ctx.fillStyle = 'rgb(220, 40, 40)';
  ctx.fill();
  
  // Scale pattern
  for (let i = -2; i <= 2; i++) {
    for (let j = -1; j <= 1; j++) {
      ctx.beginPath();
      ctx.arc(-r * 0.3 + i * r * 0.25, j * r * 0.3, r * 0.12, 0, TAU);
      ctx.strokeStyle = 'rgba(140, 140, 150, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
  
  // Dorsal fin
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, -r * 0.7);
  ctx.lineTo(-r * 0.1, -r * 1.1);
  ctx.lineTo(r * 0.1, -r * 1.0);
  ctx.lineTo(r * 0.2, -r * 0.7);
  ctx.closePath();
  ctx.fillStyle = 'rgb(160, 160, 170)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(130, 130, 140)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Spine lines in dorsal fin
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.2 + i * r * 0.12, -r * 0.7);
    ctx.lineTo(-r * 0.15 + i * r * 0.12, -r * 0.95);
    ctx.strokeStyle = 'rgba(100, 100, 110, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  
  // Pectoral fins
  ctx.beginPath();
  ctx.ellipse(r * 0.1, -r * 0.6, r * 0.4, r * 0.2, -0.3, 0, TAU);
  ctx.fillStyle = 'rgba(150, 150, 160, 0.7)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.1, r * 0.6, r * 0.4, r * 0.2, 0.3, 0, TAU);
  ctx.fill();
  
  // Head
  ctx.beginPath();
  ctx.arc(r * 0.6, 0, r * 0.5, 0, TAU);
  ctx.fillStyle = 'rgb(190, 190, 200)';
  ctx.fill();
  
  // Eye
  ctx.beginPath();
  ctx.arc(r * 0.7, -r * 0.2, r * 0.2, 0, TAU);
  ctx.fillStyle = 'rgb(255, 220, 100)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.75, -r * 0.25, r * 0.08, 0, TAU);
  ctx.fillStyle = 'rgb(180, 0, 0)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.77, -r * 0.27, r * 0.04, 0, TAU);
  ctx.fillStyle = 'black';
  ctx.fill();
  
  // Mouth with underbite
  ctx.beginPath();
  ctx.arc(r * 0.85, r * 0.15, r * 0.25, 0.3, PI - 0.3);
  ctx.strokeStyle = 'rgb(80, 10, 10)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Triangular teeth
  for (let i = 0; i < 6; i++) {
    const angle = 0.3 + i * 0.2;
    const tx = r * 0.85 + r * 0.25 * Math.cos(angle);
    const ty = r * 0.15 + r * 0.25 * Math.sin(angle);
    
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + r * 0.15, ty - r * 0.1);
    ctx.lineTo(tx + r * 0.15, ty + r * 0.1);
    ctx.closePath();
    ctx.fillStyle = 'rgb(240, 240, 230)';
    ctx.fill();
  }
  
  // Tail with rapid wag
  ctx.save();
  ctx.translate(-r * 0.8, 0);
  ctx.rotate(tailWag);
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-r * 0.6, -r * 0.5);
  ctx.lineTo(-r * 0.5, 0);
  ctx.lineTo(-r * 0.6, r * 0.5);
  ctx.closePath();
  ctx.fillStyle = 'rgb(170, 170, 180)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(140, 140, 150)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
},

fire_ant(ctx, e) {
  const r = e.radius || 6;
  const t = anim(e);
  const d = fdir(e);
  
  const legCycle = t * 15;
  
  // Abdomen (gaster)
  ctx.beginPath();
  ctx.ellipse(-r * 0.8, 0, r * 0.7, r * 0.5, 0, 0, TAU);
  const grd1 = ctx.createRadialGradient(-r * 0.8, 0, 0, -r * 0.8, 0, r * 0.7);
  grd1.addColorStop(0, 'rgb(255, 120, 40)');
  grd1.addColorStop(0.6, 'rgb(220, 60, 20)');
  grd1.addColorStop(1, 'rgb(180, 40, 10)');
  ctx.fillStyle = grd1;
  ctx.fill();
  
  // Fiery glow
  ctx.shadowColor = 'rgba(255, 100, 0, 0.6)';
  ctx.shadowBlur = r * 0.5;
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Petiole (waist segment)
  ctx.beginPath();
  ctx.arc(-r * 0.2, 0, r * 0.2, 0, TAU);
  ctx.fillStyle = 'rgb(200, 70, 25)';
  ctx.fill();
  
  // Thorax
  ctx.beginPath();
  ctx.ellipse(r * 0.3, 0, r * 0.5, r * 0.4, 0, 0, TAU);
  const grd2 = ctx.createRadialGradient(r * 0.3, 0, 0, r * 0.3, 0, r * 0.5);
  grd2.addColorStop(0, 'rgb(240, 100, 35)');
  grd2.addColorStop(1, 'rgb(200, 70, 25)');
  ctx.fillStyle = grd2;
  ctx.fill();
  
  // Legs (6 legs, rapidly cycling)
  for (let i = 0; i < 3; i++) {
    for (let side = -1; side <= 1; side += 2) {
      const phase = Math.sin(legCycle + i * 1.0 + side * 0.5);
      const legX = r * 0.1 + i * r * 0.2;
      const legY = side * r * 0.35;
      const kneeX = legX + r * 0.4;
      const kneeY = legY + side * (r * 0.5 + phase * r * 0.2);
      const footX = kneeX + r * 0.3;
      const footY = kneeY + side * r * 0.3;
      
      ctx.beginPath();
      ctx.moveTo(legX, legY);
      ctx.lineTo(kneeX, kneeY);
      ctx.lineTo(footX, footY);
      ctx.strokeStyle = 'rgb(180, 60, 20)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  
  // Head
  ctx.beginPath();
  ctx.arc(r * 0.75, 0, r * 0.35, 0, TAU);
  ctx.fillStyle = 'rgb(220, 80, 30)';
  ctx.fill();
  
  // Eyes
  ctx.beginPath();
  ctx.arc(r * 0.85, -r * 0.15, r * 0.08, 0, TAU);
  ctx.arc(r * 0.85, r * 0.15, r * 0.08, 0, TAU);
  ctx.fillStyle = 'black';
  ctx.fill();
  
  // Mandibles
  ctx.beginPath();
  ctx.moveTo(r * 0.95, -r * 0.1);
  ctx.quadraticCurveTo(r * 1.2, -r * 0.3, r * 1.1, -r * 0.05);
  ctx.strokeStyle = 'rgb(160, 50, 15)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 0.95, r * 0.1);
  ctx.quadraticCurveTo(r * 1.2, r * 0.3, r * 1.1, r * 0.05);
  ctx.stroke();
  
  // Antenna
  ctx.beginPath();
  ctx.moveTo(r * 0.8, -r * 0.3);
  ctx.quadraticCurveTo(r * 0.9, -r * 0.7, r * 0.7, -r * 0.9);
  ctx.strokeStyle = 'rgb(190, 65, 25)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Wings (folded, translucent amber)
  ctx.beginPath();
  ctx.ellipse(-r * 0.5, -r * 0.3, r * 0.6, r * 0.2, -0.3, 0, TAU);
  ctx.fillStyle = 'rgba(255, 200, 100, 0.4)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(220, 150, 60, 0.6)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.5, r * 0.3, r * 0.6, r * 0.2, 0.3, 0, TAU);
  ctx.fill();
  ctx.stroke();
},

sidewinder(ctx, e) {
  const r = e.radius || 12;
  const t = anim(e);
  const d = fdir(e);
  
  const segCount = 12;
  const sideAmp = r * 0.8;
  const waveSpeed = t * 3;
  
  // Body segments with sidewinding S-curve
  for (let i = 0; i < segCount; i++) {
    const progress = i / segCount;
    const x = -r * 1.5 + i * (r * 3 / segCount);
    const y = Math.sin(waveSpeed + i * 0.5) * sideAmp;
    const lateralOffset = Math.cos(waveSpeed + i * 0.5) * r * 0.3;
    
    const baseColor = 210 - i * 3;
    const bandPattern = Math.sin(i * 0.8) > 0.3;
    
    ctx.beginPath();
    ctx.arc(x, y, r * 0.4, 0, TAU);
    if (bandPattern) {
      ctx.fillStyle = `rgb(${baseColor - 40}, ${baseColor - 50}, ${baseColor - 80})`;
    } else {
      ctx.fillStyle = `rgb(${baseColor}, ${baseColor - 10}, ${baseColor - 40})`;
    }
    ctx.fill();
    
    // Belly scales
    ctx.beginPath();
    ctx.arc(x, y, r * 0.25, 0, PI);
    ctx.fillStyle = `rgb(${baseColor + 20}, ${baseColor + 10}, ${baseColor - 20})`;
    ctx.fill();
  }
  
  // Head
  const headX = r * 1.5;
  const headY = Math.sin(waveSpeed) * sideAmp;
  
  ctx.beginPath();
  ctx.arc(headX, headY, r * 0.5, 0, TAU);
  ctx.fillStyle = 'rgb(200, 180, 140)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(170, 150, 110)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Horn-like raised scales over eyes
  ctx.beginPath();
  ctx.arc(headX + r * 0.2, headY - r * 0.3, r * 0.15, 0, TAU);
  ctx.fillStyle = 'rgb(180, 160, 120)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(headX + r * 0.2, headY + r * 0.3, r * 0.15, 0, TAU);
  ctx.fill();
  
  // Eyes
  ctx.beginPath();
  ctx.arc(headX + r * 0.25, headY - r * 0.3, r * 0.08, 0, TAU);
  ctx.fillStyle = 'rgb(100, 80, 40)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headX + r * 0.27, headY - r * 0.32, r * 0.03, 0, TAU);
  ctx.fillStyle = 'black';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(headX + r * 0.25, headY + r * 0.3, r * 0.08, 0, TAU);
  ctx.fillStyle = 'rgb(100, 80, 40)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headX + r * 0.27, headY + r * 0.32, r * 0.03, 0, TAU);
  ctx.fillStyle = 'black';
  ctx.fill();
  
  // Heat-sensing pits
  ctx.beginPath();
  ctx.arc(headX + r * 0.4, headY - r * 0.15, r * 0.06, 0, TAU);
  ctx.arc(headX + r * 0.4, headY + r * 0.15, r * 0.06, 0, TAU);
  ctx.fillStyle = 'rgb(120, 100, 60)';
  ctx.fill();
  
  // Forked tongue
  const tongueFlick = Math.abs(Math.sin(t * 6));
  ctx.beginPath();
  ctx.moveTo(headX + r * 0.5, headY);
  ctx.lineTo(headX + r * 0.5 + tongueFlick * r * 0.4, headY - tongueFlick * r * 0.1);
  ctx.moveTo(headX + r * 0.5 + tongueFlick * r * 0.4, headY - tongueFlick * r * 0.1);
  ctx.lineTo(headX + r * 0.5 + tongueFlick * r * 0.5, headY - tongueFlick * r * 0.15);
  ctx.moveTo(headX + r * 0.5 + tongueFlick * r * 0.4, headY - tongueFlick * r * 0.1);
  ctx.lineTo(headX + r * 0.5 + tongueFlick * r * 0.5, headY - tongueFlick * r * 0.05);
  ctx.strokeStyle = 'rgb(180, 40, 40)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Rattle tip at tail end
  const tailX = -r * 1.5;
  const tailY = Math.sin(waveSpeed + segCount * 0.5) * sideAmp;
  
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(tailX - i * r * 0.15, tailY, r * 0.2 - i * 0.03, 0, TAU);
    ctx.fillStyle = `rgb(${180 - i * 15}, ${160 - i * 15}, ${120 - i * 15})`;
    ctx.fill();
    ctx.strokeStyle = 'rgb(140, 120, 80)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
},

desert_tortoise(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  const inShell = e.inShell || false;
  
  // Shell (high-domed with hexagonal pattern)
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.2, r * 0.9, r * 0.7, 0, 0, TAU);
  const grd = ctx.createRadialGradient(0, -r * 0.4, 0, 0, -r * 0.2, r * 0.9);
  grd.addColorStop(0, 'rgb(160, 140, 100)');
  grd.addColorStop(0.5, 'rgb(130, 110, 70)');
  grd.addColorStop(1, 'rgb(100, 80, 50)');
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.strokeStyle = 'rgb(80, 60, 40)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Hexagonal scutes pattern
  const hexSize = r * 0.25;
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const hx = col * hexSize * 1.5;
      const hy = -r * 0.2 + row * hexSize * 1.3 + (col % 2) * hexSize * 0.65;
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * TAU;
        const px = hx + hexSize * 0.4 * Math.cos(angle);
        const py = hy + hexSize * 0.4 * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(70, 50, 30, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  
  // Growth rings on central scutes
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(0, -r * 0.2, hexSize * 0.3 * i, 0, TAU);
    ctx.strokeStyle = `rgba(90, 70, 40, ${0.4 - i * 0.1})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  
  if (!inShell) {
    // Head and neck
    const neckBob = Math.sin(t * 2) * 0.1;
    ctx.beginPath();
    ctx.moveTo(r * 0.6, r * 0.2);
    ctx.quadraticCurveTo(r * 0.8, r * 0.3 + neckBob, r * 1.0, r * 0.4 + neckBob);
    ctx.strokeStyle = 'rgb(120, 110, 80)';
    ctx.lineWidth = r * 0.3;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Wrinkly neck texture
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(r * 0.65 + i * r * 0.1, r * 0.25 + neckBob, r * 0.08, 0, PI);
      ctx.strokeStyle = 'rgba(90, 80, 60, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Head
    ctx.beginPath();
    ctx.arc(r * 1.0, r * 0.4 + neckBob, r * 0.25, 0, TAU);
    ctx.fillStyle = 'rgb(110, 100, 70)';
    ctx.fill();
    
    // Beady eye
    ctx.beginPath();
    ctx.arc(r * 1.1, r * 0.35 + neckBob, r * 0.08, 0, TAU);
    ctx.fillStyle = 'rgb(40, 35, 25)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 1.12, r * 0.33 + neckBob, r * 0.03, 0, TAU);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Beak
    ctx.beginPath();
    ctx.moveTo(r * 1.15, r * 0.4 + neckBob);
    ctx.lineTo(r * 1.25, r * 0.45 + neckBob);
    ctx.lineTo(r * 1.15, r * 0.5 + neckBob);
    ctx.closePath();
    ctx.fillStyle = 'rgb(90, 80, 55)';
    ctx.fill();
    
    // Front legs (stubby and scaled)
    const legWalk = Math.sin(t * 3);
    for (let side = -1; side <= 1; side += 2) {
      const legPhase = side > 0 ? legWalk : -legWalk;
      ctx.beginPath();
      ctx.arc(r * 0.4, side * r * 0.6 + legPhase * 0.1, r * 0.2, 0, TAU);
      ctx.fillStyle = 'rgb(100, 90, 60)';
      ctx.fill();
      
      // Scales on leg
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(r * 0.4 + i * r * 0.08, side * r * 0.6 + legPhase * 0.1, r * 0.05, 0, TAU);
        ctx.strokeStyle = 'rgba(70, 60, 40, 0.6)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    
    // Back legs
    for (let side = -1; side <= 1; side += 2) {
      const legPhase = side > 0 ? -legWalk : legWalk;
      ctx.beginPath();
      ctx.arc(-r * 0.5, side * r * 0.6 + legPhase * 0.1, r * 0.2, 0, TAU);
      ctx.fillStyle = 'rgb(100, 90, 60)';
      ctx.fill();
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(-r * 0.5 + i * r * 0.08, side * r * 0.6 + legPhase * 0.1, r * 0.05, 0, TAU);
        ctx.strokeStyle = 'rgba(70, 60, 40, 0.6)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    
    // Tail
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, 0);
    ctx.lineTo(-r * 1.0, r * 0.1);
    ctx.strokeStyle = 'rgb(110, 100, 70)';
    ctx.lineWidth = r * 0.15;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
},

penguin(ctx, e) {
  const r = e.radius || 10;
  const t = anim(e);
  const d = fdir(e);
  
  const waddle = Math.sin(t * 4) * 0.15;
  
  // Body (upright oval)
  ctx.beginPath();
  ctx.ellipse(0, r * 0.3, r * 0.7, r * 0.9, 0, 0, TAU);
  ctx.fillStyle = 'rgb(20, 20, 25)';
  ctx.fill();
  
  // White belly
  ctx.beginPath();
  ctx.ellipse(r * 0.15, r * 0.4, r * 0.5, r * 0.7, 0, 0, TAU);
  ctx.fillStyle = 'rgb(250, 250, 255)';
  ctx.fill();
  
  // Head
  ctx.beginPath();
  ctx.arc(0, -r * 0.5, r * 0.5, 0, TAU);
  ctx.fillStyle = 'rgb(20, 20, 25)';
  ctx.fill();
  
  // White face patches
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.55, r * 0.2, 0, TAU);
  ctx.arc(r * 0.15, -r * 0.55, r * 0.2, 0, TAU);
  ctx.fillStyle = 'rgb(250, 250, 255)';
  ctx.fill();
  
  // Eyes
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.55, r * 0.08, 0, TAU);
  ctx.arc(r * 0.15, -r * 0.55, r * 0.08, 0, TAU);
  ctx.fillStyle = 'rgb(10, 10, 15)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(-r * 0.12, -r * 0.58, r * 0.03, 0, TAU);
  ctx.arc(r * 0.18, -r * 0.58, r * 0.03, 0, TAU);
  ctx.fillStyle = 'white';
  ctx.fill();
  
  // Orange-yellow beak
  ctx.beginPath();
  ctx.moveTo(r * 0.1, -r * 0.4);
  ctx.lineTo(r * 0.5, -r * 0.45);
  ctx.lineTo(r * 0.1, -r * 0.3);
  ctx.closePath();
  ctx.fillStyle = 'rgb(255, 160, 40)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(220, 130, 20)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Flippers (waving at sides)
  const flapPhase = Math.sin(t * 3) * 0.3;
  
  ctx.save();
  ctx.translate(-r * 0.6, r * 0.2);
  ctx.rotate(-0.5 + flapPhase);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.3, r * 0.7, 0, 0, TAU);
  ctx.fillStyle = 'rgb(25, 25, 30)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(15, 15, 20)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  
  ctx.save();
  ctx.translate(r * 0.6, r * 0.2);
  ctx.rotate(0.5 - flapPhase);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.3, r * 0.7, 0, 0, TAU);
  ctx.fillStyle = 'rgb(25, 25, 30)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(15, 15, 20)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  
  // Orange feet (waddling)
  ctx.beginPath();
  ctx.ellipse(-r * 0.3 + waddle * r * 0.5, r * 1.15, r * 0.35, r * 0.2, -0.3, 0, TAU);
  ctx.fillStyle = 'rgb(255, 150, 30)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(220, 120, 20)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.3 - waddle * r * 0.5, r * 1.15, r * 0.35, r * 0.2, 0.3, 0, TAU);
  ctx.fill();
  ctx.stroke();
  
  // Webbed toes
  for (let side = -1; side <= 1; side += 2) {
    const footX = side * 0.3 * r - waddle * r * 0.5 * side;
    for (let toe = -1; toe <= 1; toe++) {
      ctx.beginPath();
      ctx.moveTo(footX, r * 1.15);
      ctx.lineTo(footX + toe * r * 0.15, r * 1.3);
      ctx.strokeStyle = 'rgb(220, 120, 20)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  
  // Small tail
  ctx.beginPath();
  ctx.moveTo(-r * 0.6, r * 0.9);
  ctx.lineTo(-r * 0.9, r * 1.0);
  ctx.lineTo(-r * 0.7, r * 0.7);
  ctx.closePath();
  ctx.fillStyle = 'rgb(20, 20, 25)';
  ctx.fill();
},

walrus(ctx, e) {
  const r = e.radius || 20;
  const t = anim(e);
  const d = fdir(e);
  
  const rowPhase = Math.sin(t * 2) * 0.2;
  
  // Massive body
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.0, r * 0.7, 0, 0, TAU);
  ctx.fillStyle = 'rgb(140, 110, 90)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(110, 85, 70)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Wrinkly texture on body
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(-r * 0.5 + i * r * 0.3, r * 0.3, r * 0.4, 0, PI);
    ctx.strokeStyle = 'rgba(100, 75, 60, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Thick wrinkly neck
  ctx.beginPath();
  ctx.ellipse(r * 0.6, -r * 0.1, r * 0.4, r * 0.5, 0, 0, TAU);
  ctx.fillStyle = 'rgb(130, 105, 85)';
  ctx.fill();
  
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(r * 0.5, -r * 0.2 + i * r * 0.15, r * 0.35, 0, PI);
    ctx.strokeStyle = 'rgba(100, 75, 60, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Head/muzzle
  ctx.beginPath();
  ctx.ellipse(r * 1.0, 0, r * 0.4, r * 0.45, 0, 0, TAU);
  ctx.fillStyle = 'rgb(125, 100, 80)';
  ctx.fill();
  
  // Prominent long tusks
  ctx.beginPath();
  ctx.moveTo(r * 1.1, -r * 0.15);
  ctx.quadraticCurveTo(r * 1.4, -r * 0.2, r * 1.5, r * 0.3);
  ctx.strokeStyle = 'rgb(240, 235, 220)';
  ctx.lineWidth = r * 0.12;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(r * 1.1, r * 0.15);
  ctx.quadraticCurveTo(r * 1.4, r * 0.2, r * 1.5, r * 0.3);
  ctx.stroke();
  
  // Tusk shading
  ctx.strokeStyle = 'rgba(200, 195, 180, 0.5)';
  ctx.lineWidth = r * 0.06;
  ctx.stroke();
  
  // Whisker dots on muzzle
  const whiskerPositions = [
    [r * 0.9, -r * 0.3], [r * 1.0, -r * 0.25], [r * 1.1, -r * 0.3],
    [r * 0.9, r * 0.3], [r * 1.0, r * 0.25], [r * 1.1, r * 0.3],
    [r * 0.85, -r * 0.15], [r * 0.85, r * 0.15]
  ];
  
  whiskerPositions.forEach(([wx, wy]) => {
    ctx.beginPath();
    ctx.arc(wx, wy, r * 0.04, 0, TAU);
    ctx.fillStyle = 'rgb(80, 60, 50)';
    ctx.fill();
  });
  
  // Small eyes
  ctx.beginPath();
  ctx.arc(r * 0.85, -r * 0.2, r * 0.08, 0, TAU);
  ctx.arc(r * 0.85, r * 0.2, r * 0.08, 0, TAU);
  ctx.fillStyle = 'rgb(40, 30, 25)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 0.87, -r * 0.22, r * 0.03, 0, TAU);
  ctx.arc(r * 0.87, r * 0.18, r * 0.03, 0, TAU);
  ctx.fillStyle = 'white';
  ctx.fill();
  
  // Front flippers (rowing motion)
  ctx.save();
  ctx.translate(r * 0.4, -r * 0.6);
  ctx.rotate(-0.4 + rowPhase);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.6, r * 0.3, 0, 0, TAU);
  ctx.fillStyle = 'rgb(120, 95, 75)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(90, 70, 55)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  
  ctx.save();
  ctx.translate(r * 0.4, r * 0.6);
  ctx.rotate(0.4 - rowPhase);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.6, r * 0.3, 0, 0, TAU);
  ctx.fillStyle = 'rgb(120, 95, 75)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(90, 70, 55)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  
  // Rear flippers
  ctx.beginPath();
  ctx.ellipse(-r * 0.8, -r * 0.5, r * 0.4, r * 0.25, 0.5, 0, TAU);
  ctx.fillStyle = 'rgb(115, 90, 70)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(-r * 0.8, r * 0.5, r * 0.4, r * 0.25, -0.5, 0, TAU);
  ctx.fill();
},

snow_leopard(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  
  const runPhase = Math.sin(t * 6);
  
  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9, r * 0.6, 0, 0, TAU);
  ctx.fillStyle = 'rgb(220, 220, 230)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(180, 180, 190)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Rosette spots on body
  const rosettes = [
    [r * 0.3, -r * 0.3], [r * 0.1, r * 0.2], [-r * 0.2, -r * 0.4],
    [-r * 0.5, r * 0.1], [r * 0.5, r * 0.3], [-r * 0.3, r * 0.4]
  ];
  
  rosettes.forEach(([rx, ry]) => {
    ctx.beginPath();
    ctx.arc(rx, ry, r * 0.15, 0, TAU);
    ctx.strokeStyle = 'rgb(60, 60, 70)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Inner spots in rosette
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * TAU;
      const sx = rx + r * 0.08 * Math.cos(angle);
      const sy = ry + r * 0.08 * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(sx, sy, r * 0.03, 0, TAU);
      ctx.fillStyle = 'rgb(70, 70, 80)';
      ctx.fill();
    }
  });
  
  // Running legs (4 legs with gait animation)
  const legs = [
    { x: r * 0.4, phase: runPhase },
    { x: r * 0.1, phase: -runPhase },
    { x: -r * 0.2, phase: runPhase },
    { x: -r * 0.5, phase: -runPhase }
  ];
  
  legs.forEach((leg, i) => {
    const legY = r * 0.5;
    const kneeY = legY + r * 0.5 + leg.phase * r * 0.3;
    const footY = legY + r * 0.9 + Math.abs(leg.phase) * r * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(leg.x, legY);
    ctx.lineTo(leg.x, kneeY);
    ctx.lineTo(leg.x + leg.phase * r * 0.2, footY);
    ctx.strokeStyle = 'rgb(200, 200, 210)';
    ctx.lineWidth = r * 0.15;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Paw
    ctx.beginPath();
    ctx.arc(leg.x + leg.phase * r * 0.2, footY, r * 0.12, 0, TAU);
    ctx.fillStyle = 'rgb(190, 190, 200)';
    ctx.fill();
  });
  
  // Head
  ctx.beginPath();
  ctx.arc(r * 0.75, -r * 0.2, r * 0.45, 0, TAU);
  ctx.fillStyle = 'rgb(225, 225, 235)';
  ctx.fill();
  
  // Face spots
  ctx.beginPath();
  ctx.arc(r * 0.6, -r * 0.1, r * 0.08, 0, TAU);
  ctx.arc(r * 0.65, -r * 0.4, r * 0.06, 0, TAU);
  ctx.fillStyle = 'rgb(80, 80, 90)';
  ctx.fill();
  
  // Small rounded ears
  ctx.beginPath();
  ctx.arc(r * 0.65, -r * 0.6, r * 0.15, 0, TAU);
  ctx.arc(r * 0.85, -r * 0.55, r * 0.15, 0, TAU);
  ctx.fillStyle = 'rgb(210, 210, 220)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(170, 170, 180)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Ear tufts
  ctx.beginPath();
  ctx.arc(r * 0.65, -r * 0.7, r * 0.08, 0, TAU);
  ctx.arc(r * 0.85, -r * 0.65, r * 0.08, 0, TAU);
  ctx.fillStyle = 'rgb(190, 190, 200)';
  ctx.fill();
  
  // Piercing yellow-green eyes
  ctx.beginPath();
  ctx.ellipse(r * 0.75, -r * 0.3, r * 0.12, r * 0.15, 0, 0, TAU);
  ctx.ellipse(r * 0.95, -r * 0.25, r * 0.12, r * 0.15, 0, 0, TAU);
  ctx.fillStyle = 'rgb(200, 230, 120)';
  ctx.fill();
  
  // Pupils
  ctx.beginPath();
  ctx.ellipse(r * 0.77, -r * 0.3, r * 0.05, r * 0.08, 0, 0, TAU);
  ctx.ellipse(r * 0.97, -r * 0.25, r * 0.05, r * 0.08, 0, 0, TAU);
  ctx.fillStyle = 'black';
  ctx.fill();
  
  // Nose
  ctx.beginPath();
  ctx.moveTo(r * 1.05, -r * 0.1);
  ctx.lineTo(r * 1.1, -r * 0.15);
  ctx.lineTo(r * 1.1, -r * 0.05);
  ctx.closePath();
  ctx.fillStyle = 'rgb(100, 100, 110)';
  ctx.fill();
  
  // VERY long thick tail (waving)
  const tailSegments = 10;
  for (let i = 0; i < tailSegments; i++) {
    const progress = i / tailSegments;
    const tailX = -r * 0.8 - progress * r * 1.5;
    const tailY = Math.sin(t * 3 + i * 0.4) * r * 0.6;
    const tailThick = r * 0.25 * (1 - progress * 0.4);
    
    ctx.beginPath();
    ctx.arc(tailX, tailY, tailThick, 0, TAU);
    ctx.fillStyle = progress < 0.7 ? 'rgb(215, 215, 225)' : 'rgb(200, 200, 210)';
    ctx.fill();
    
    // Spots on tail
    if (i % 2 === 0) {
      ctx.beginPath();
      ctx.arc(tailX, tailY, r * 0.1, 0, TAU);
      ctx.fillStyle = 'rgb(70, 70, 80)';
      ctx.fill();
    }
  }
},

sea_urchin(ctx, e) {
  const r = e.radius || 10;
  const t = anim(e);
  const d = fdir(e);
  
  // Spherical body
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.5, 0, TAU);
  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
  grd.addColorStop(0, 'rgb(80, 40, 100)');
  grd.addColorStop(0.7, 'rgb(60, 30, 80)');
  grd.addColorStop(1, 'rgb(40, 20, 60)');
  ctx.fillStyle = grd;
  ctx.fill();
  
  // Spines (16+ radiating outward with pulse/sway)
  const spineCount = 20;
  for (let i = 0; i < spineCount; i++) {
    const angle = (i / spineCount) * TAU;
    const pulsePhase = Math.sin(t * 2 + i * 0.3) * 0.2;
    const swayPhase = Math.cos(t * 1.5 + i * 0.5) * 0.15;
    const actualAngle = angle + swayPhase;
    
    const baseX = r * 0.5 * Math.cos(angle);
    const baseY = r * 0.5 * Math.sin(angle);
    const spineLength = r * 1.2 + pulsePhase * r * 0.3;
    const tipX = (r * 0.5 + spineLength) * Math.cos(actualAngle);
    const tipY = (r * 0.5 + spineLength) * Math.sin(actualAngle);
    
    const grdSpine = ctx.createLinearGradient(baseX, baseY, tipX, tipY);
    grdSpine.addColorStop(0, 'rgb(70, 35, 90)');
    grdSpine.addColorStop(1, 'rgb(50, 25, 70)');
    
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = grdSpine;
    ctx.lineWidth = r * 0.08;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Bioluminescent tips
    ctx.beginPath();
    ctx.arc(tipX, tipY, r * 0.08, 0, TAU);
    ctx.fillStyle = 'rgb(150, 200, 255)';
    ctx.fill();
    ctx.shadowColor = 'rgba(100, 180, 255, 0.8)';
    ctx.shadowBlur = r * 0.3;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  // Tube feet dots between spines
  const tubeFeetCount = 12;
  for (let i = 0; i < tubeFeetCount; i++) {
    const angle = (i / tubeFeetCount) * TAU + 0.15;
    const dist = r * 0.6 + Math.sin(t * 4 + i) * r * 0.1;
    const tfX = dist * Math.cos(angle);
    const tfY = dist * Math.sin(angle);
    
    ctx.beginPath();
    ctx.arc(tfX, tfY, r * 0.04, 0, TAU);
    ctx.fillStyle = 'rgb(100, 70, 120)';
    ctx.fill();
  }
  
  // Mouth underneath (Aristotle's lantern hint)
  ctx.beginPath();
  ctx.arc(0, r * 0.3, r * 0.15, 0, TAU);
  ctx.fillStyle = 'rgb(30, 15, 40)';
  ctx.fill();
  
  for (let i = 0; i < 5; i++) {
    const mAngle = (i / 5) * TAU;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.3);
    ctx.lineTo(r * 0.15 * Math.cos(mAngle), r * 0.3 + r * 0.15 * Math.sin(mAngle));
    ctx.strokeStyle = 'rgba(50, 30, 60, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
},

moray_eel(ctx, e) {
  const r = e.radius || 14;
  const t = anim(e);
  const d = fdir(e);
  
  const segCount = 10;
  const waveAmp = r * 0.5;
  const waveSpeed = t * 4;
  
  // Sinuous body segments
  for (let i = 0; i < segCount; i++) {
    const progress = i / segCount;
    const x = r * 0.8 - i * (r * 2 / segCount);
    const y = Math.sin(waveSpeed + i * 0.6) * waveAmp;
    const segRadius = r * 0.5 * (1 - progress * 0.3);
    
    const mottlePattern = Math.sin(i * 1.3) > 0.2;
    
    ctx.beginPath();
    ctx.arc(x, y, segRadius, 0, TAU);
    if (mottlePattern) {
      ctx.fillStyle = `rgb(${80 - i * 2}, ${100 - i * 2}, ${60 - i})`;
    } else {
      ctx.fillStyle = `rgb(${50 - i * 2}, ${70 - i * 2}, ${40 - i})`;
    }
    ctx.fill();
    ctx.strokeStyle = `rgb(${40 - i * 2}, ${60 - i * 2}, ${30 - i})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Ribbon dorsal fin along body
    if (i > 1) {
      const finHeight = segRadius * 0.6 + Math.sin(t * 5 + i) * segRadius * 0.2;
      ctx.beginPath();
      ctx.moveTo(x, y - segRadius);
      ctx.lineTo(x - r * 0.1, y - segRadius - finHeight);
      ctx.lineTo(x + r * 0.1, y - segRadius - finHeight);
      ctx.closePath();
      ctx.fillStyle = `rgba(${60 - i * 2}, ${80 - i * 2}, ${50 - i}, 0.7)`;
      ctx.fill();
    }
  }
  
  // Head
  const headY = Math.sin(waveSpeed) * waveAmp;
  
  ctx.beginPath();
  ctx.ellipse(r * 1.0, headY, r * 0.6, r * 0.5, 0, 0, TAU);
  ctx.fillStyle = 'rgb(85, 105, 65)';
  ctx.fill();
  ctx.strokeStyle = 'rgb(65, 85, 45)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Mottled spots on head
  ctx.beginPath();
  ctx.arc(r * 0.9, headY - r * 0.2, r * 0.1, 0, TAU);
  ctx.arc(r * 1.1, headY + r * 0.15, r * 0.08, 0, TAU);
  ctx.fillStyle = 'rgb(50, 65, 40)';
  ctx.fill();
  
  // Wide gaping mouth
  const jawOpen = 0.5 + Math.sin(t * 3) * 0.3;
  
  ctx.beginPath();
  ctx.arc(r * 1.3, headY, r * 0.35, 0.2, PI - 0.2);
  ctx.strokeStyle = 'rgb(40, 30, 25)';
  ctx.lineWidth = r * 0.15;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(r * 1.3, headY, r * 0.35, PI + 0.2, TAU - 0.2);
  ctx.stroke();
  
  // Teeth
  for (let i = 0; i < 8; i++) {
    const tAngle = 0.2 + i * 0.2;
    const tx = r * 1.3 + r * 0.35 * Math.cos(tAngle);
    const ty = headY + r * 0.35 * Math.sin(tAngle);
    
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + r * 0.12, ty + r * 0.08);
    ctx.strokeStyle = 'rgb(220, 220, 210)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Pharyngeal jaw hint (inner jaw)
  ctx.beginPath();
  ctx.arc(r * 1.15, headY, r * 0.15, 0, TAU);
  ctx.fillStyle = 'rgba(60, 40, 35, 0.7)';
  ctx.fill();
  
  // Small beady eye
  ctx.beginPath();
  ctx.arc(r * 1.0, headY - r * 0.3, r * 0.12, 0, TAU);
  ctx.fillStyle = 'rgb(200, 180, 100)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 1.02, headY - r * 0.32, r * 0.06, 0, TAU);
  ctx.fillStyle = 'black';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(r * 1.04, headY - r * 0.34, r * 0.02, 0, TAU);
  ctx.fillStyle = 'white';
  ctx.fill();
  
  // Pectoral fin nubs
  ctx.beginPath();
  ctx.ellipse(r * 0.8, headY - r * 0.4, r * 0.2, r * 0.1, -0.5, 0, TAU);
  ctx.fillStyle = 'rgba(75, 95, 55, 0.8)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(r * 0.8, headY + r * 0.4, r * 0.2, r * 0.1, 0.5, 0, TAU);
  ctx.fill();
},

pufferfish(ctx, e) {
  const r = e.radius || 12;
  const t = anim(e);
  const d = fdir(e);
  const isPuffed = e.isPuffed || false;
  
  if (!isPuffed) {
    // Normal: small cute fish
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.7, r * 0.5, 0, 0, TAU);
    ctx.fillStyle = 'rgb(255, 220, 80)';
    ctx.fill();
    ctx.strokeStyle = 'rgb(220, 180, 50)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Cute pattern
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.3, r * 0.15, 0, TAU);
    ctx.arc(r * 0.1, r * 0.2, r * 0.12, 0, TAU);
    ctx.fillStyle = 'rgb(255, 200, 60)';
    ctx.fill();
    
    // Big cute eyes
    ctx.beginPath();
    ctx.arc(r * 0.4, -r * 0.25, r * 0.2, 0, TAU);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'rgb(100, 100, 100)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(r * 0.45, -r * 0.25, r * 0.1, 0, TAU);
    ctx.fillStyle = 'black';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(r * 0.48, -r * 0.28, r * 0.04, 0, TAU);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Small mouth
    ctx.beginPath();
    ctx.arc(r * 0.65, 0, r * 0.1, 0.3, PI - 0.3);
    ctx.strokeStyle = 'rgb(180, 140, 40)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Dorsal fin
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.5);
    ctx.lineTo(-r * 0.1, -r * 0.8);
    ctx.lineTo(r * 0.1, -r * 0.5);
    ctx.closePath();
    ctx.fillStyle = 'rgb(240, 200, 70)';
    ctx.fill();
    
    // Pectoral fins
    const finFlap = Math.sin(t * 5) * 0.2;
    ctx.save();
    ctx.translate(r * 0.1, -r * 0.4);
    ctx.rotate(-0.3 + finFlap);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.3, r * 0.15, 0, 0, TAU);
    ctx.fillStyle = 'rgba(240, 210, 80, 0.7)';
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.translate(r * 0.1, r * 0.4);
    ctx.rotate(0.3 - finFlap);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.3, r * 0.15, 0, 0, TAU);
    ctx.fillStyle = 'rgba(240, 210, 80, 0.7)';
    ctx.fill();
    ctx.restore();
    
    // Tail fin
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, 0);
    ctx.lineTo(-r * 1.0, -r * 0.3);
    ctx.lineTo(-r * 0.9, 0);
    ctx.lineTo(-r * 1.0, r * 0.3);
    ctx.closePath();
    ctx.fillStyle = 'rgb(245, 210, 75)';
    ctx.fill();
    
  } else {
    // Puffed: inflated sphere with spikes
    const puffRadius = r * 1.2;
    
    // Inflated body
    ctx.beginPath();
    ctx.arc(0, 0, puffRadius, 0, TAU);
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, puffRadius);
    grd.addColorStop(0, 'rgb(255, 230, 90)');
    grd.addColorStop(0.7, 'rgb(240, 200, 70)');
    grd.addColorStop(1, 'rgb(220, 180, 60)');
    ctx.fillStyle = grd;
    ctx.fill();
    
    // Warning spots appear
    const spotCount = 8;
    for (let i = 0; i < spotCount; i++) {
      const angle = (i / spotCount) * TAU;
      const spotX = puffRadius * 0.6 * Math.cos(angle);
      const spotY = puffRadius * 0.6 * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(spotX, spotY, r * 0.15, 0, TAU);
      ctx.fillStyle = 'rgb(180, 100, 40)';
      ctx.fill();
    }
    
    // Extendable spikes radiating outward
    const spikeCount = 24;
    const spikeExtend = 0.6 + Math.sin(t * 4) * 0.2;
    
    for (let i = 0; i < spikeCount; i++) {
      const angle = (i / spikeCount) * TAU;
      const baseX = puffRadius * Math.cos(angle);
      const baseY = puffRadius * Math.sin(angle);
      const spikeLen = r * 0.7 * spikeExtend;
      const tipX = (puffRadius + spikeLen) * Math.cos(angle);
      const tipY = (puffRadius + spikeLen) * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = 'rgb(200, 170, 50)';
      ctx.lineWidth = r * 0.08;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Spike tip
      ctx.beginPath();
      ctx.arc(tipX, tipY, r * 0.05, 0, TAU);
      ctx.fillStyle = 'rgb(180, 150, 40)';
      ctx.fill();
    }
    
    // Wide eyes (alarmed)
    ctx.beginPath();
    ctx.arc(r * 0.4, -r * 0.4, r * 0.25, 0, TAU);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'rgb(80, 80, 80)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(r * 0.42, -r * 0.4, r * 0.15, 0, TAU);
    ctx.fillStyle = 'black';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(r * 0.45, -r * 0.44, r * 0.06, 0, TAU);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Small beak mouth
    ctx.beginPath();
    ctx.moveTo(r * 0.7, -r * 0.05);
    ctx.lineTo(r * 0.85, 0);
    ctx.lineTo(r * 0.7, r * 0.05);
    ctx.closePath();
    ctx.fillStyle = 'rgb(200, 160, 50)';
    ctx.fill();
  }
},

    }
};
