import { CONFIG } from '../config.js';
import { TILE, TILE_PROPS } from '../constants.js';

export class TileMap {
  constructor() { this.cols=CONFIG.MAP_COLS; this.rows=CONFIG.MAP_ROWS; this.ts=CONFIG.TILE_SIZE; this.tiles=null; this.decos=null; this.biomeMap=null; }
  load(d) { this.tiles=d.tiles; this.decos=d.decos||null; this.biomeMap=d.biomeMap||null; }
  getBiomeAt(wx,wy) { if(!this.biomeMap) return 0; const c=Math.floor(wx/this.ts),r=Math.floor(wy/this.ts); const i=r*this.cols+c; return (i>=0&&i<this.biomeMap.length)?this.biomeMap[i]:0; }
  get(c,r) { if(c<0||c>=this.cols||r<0||r>=this.rows) return TILE.ROCK; return this.tiles[r*this.cols+c]; }
  getAt(wx,wy) { return this.get(Math.floor(wx/this.ts),Math.floor(wy/this.ts)); }
  walkable(wx,wy) { return TILE_PROPS[this.getAt(wx,wy)]?.walkable ?? false; }
  speedAt(wx,wy) { return TILE_PROPS[this.getAt(wx,wy)]?.spd ?? 1; }
  isWater(wx,wy) { const t=this.getAt(wx,wy); return t===TILE.WATER||t===TILE.DEEP_WATER; }
  resolve(ox,oy,nx,ny,r) {
    const checks = [[-r,0],[r,0],[0,-r],[0,r],[-r,-r],[r,-r],[-r,r],[r,r]];
    for(const [dx,dy] of checks) {
      if(!this.walkable(nx+dx,ny+dy)) {
        const c=Math.floor((nx+dx)/this.ts), rr=Math.floor((ny+dy)/this.ts);
        const tx=c*this.ts, ty=rr*this.ts;
        const ol=(nx+r)-tx, or2=(tx+this.ts)-(nx-r);
        const ot=(ny+r)-ty, ob=(ty+this.ts)-(ny-r);
        if(Math.min(ol,or2)<Math.min(ot,ob)){
          nx = ol<or2 ? tx-r : tx+this.ts+r;
        } else {
          ny = ot<ob ? ty-r : ty+this.ts+r;
        }
      }
    }
    return {x:nx,y:ny};
  }
  findWalkable() {
    for(let i=0;i<1000;i++){
      const c=Math.floor(Math.random()*this.cols), r=Math.floor(Math.random()*this.rows);
      if(TILE_PROPS[this.get(c,r)]?.walkable) return {x:c*this.ts+this.ts/2, y:r*this.ts+this.ts/2};
    }
    return {x:CONFIG.WORLD_WIDTH/2, y:CONFIG.WORLD_HEIGHT/2};
  }
  findOnTiles(allowed) {
    for(let i=0;i<500;i++){
      const c=Math.floor(Math.random()*this.cols), r=Math.floor(Math.random()*this.rows);
      if(allowed.includes(this.get(c,r))) return {x:c*this.ts+this.ts/2, y:r*this.ts+this.ts/2};
    }
    return this.findWalkable();
  }
}
