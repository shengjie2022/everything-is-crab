import { CONFIG } from '../config.js';
import { clamp, lerp } from '../utils.js';

export class Camera {
  constructor() {
    this.x = 0; this.y = 0;
    this.w = CONFIG.CANVAS_WIDTH; this.h = CONFIG.CANVAS_HEIGHT;
    this.sx = 0; this.sy = 0; // shake offset
    this.shakeDur = 0; this.shakeAmt = 0;
  }
  follow(t, dt) {
    this.x = lerp(this.x, t.x - this.w/2, CONFIG.CAMERA_LERP);
    this.y = lerp(this.y, t.y - this.h/2, CONFIG.CAMERA_LERP);
    this.x = clamp(this.x, 0, CONFIG.WORLD_WIDTH - this.w);
    this.y = clamp(this.y, 0, CONFIG.WORLD_HEIGHT - this.h);
    if (this.shakeDur > 0) {
      this.shakeDur -= dt*1000;
      this.sx = (Math.random()-.5)*2*this.shakeAmt;
      this.sy = (Math.random()-.5)*2*this.shakeAmt;
    } else { this.sx = 0; this.sy = 0; }
  }
  shake(amt=5,dur=200) { this.shakeAmt=amt; this.shakeDur=dur; }
  w2s(wx,wy) { return {x:wx-this.x+this.sx, y:wy-this.y+this.sy}; }
  s2w(sx,sy) { return {x:sx+this.x, y:sy+this.y}; }
  visible(wx,wy,m=64) {
    return wx>=this.x-m && wx<=this.x+this.w+m && wy>=this.y-m && wy<=this.y+this.h+m;
  }
  tileBounds(ts) {
    return {
      sc: Math.max(0, Math.floor(this.x/ts)),
      sr: Math.max(0, Math.floor(this.y/ts)),
      ec: Math.min(CONFIG.MAP_COLS-1, Math.ceil((this.x+this.w)/ts)),
      er: Math.min(CONFIG.MAP_ROWS-1, Math.ceil((this.y+this.h)/ts))
    };
  }
}
