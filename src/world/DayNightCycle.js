import { CONFIG } from '../config.js';
import { PHASE } from '../constants.js';

export class DayNightCycle {
  constructor() { this.dur=CONFIG.DAY_CYCLE_MS; this.time=this.dur*0.2; this.phase=PHASE.DAY; this.prog=0.2; this.dark=0; this.tint={r:0,g:0,b:0,a:0}; }
  reset() { this.time=this.dur*0.2; this.phase=PHASE.DAY; this.prog=0.2; this.dark=0; }
  update(dt) {
    this.time+=dt*1000;
    if(this.time>=this.dur) this.time-=this.dur;
    this.prog=this.time/this.dur;
    // dawn 0-0.125, day 0.125-0.5, dusk 0.5-0.625, night 0.625-1
    if(this.prog<0.125){
      this.phase=PHASE.DAWN;
      const t=this.prog/0.125;
      this.dark=0.5*(1-t);
      this.tint={r:40,g:20,b:60,a:this.dark*0.6};
    } else if(this.prog<0.5){
      this.phase=PHASE.DAY;
      this.dark=0; this.tint={r:0,g:0,b:0,a:0};
    } else if(this.prog<0.625){
      this.phase=PHASE.DUSK;
      const t=(this.prog-0.5)/0.125;
      this.dark=0.5*t;
      this.tint={r:60,g:20,b:10,a:this.dark*0.5};
    } else {
      this.phase=PHASE.NIGHT;
      const t=(this.prog-0.625)/0.375;
      this.dark=0.5+0.3*Math.sin(t*Math.PI);
      this.tint={r:10,g:10,b:40,a:this.dark*0.7};
    }
  }
  isNight() { return this.phase===PHASE.NIGHT; }
  spawnMult() { return this.isNight()?1.5:1; }
  aggroMult() { return this.isNight()?0.7:1; }
  light() { return 1-this.dark; }
}
