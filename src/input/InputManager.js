export class InputManager {
  constructor(canvas) {
    this.keys = {};
    this.mouse = {x:0,y:0,down:false,clicked:false};
    this.actions = {devour:false,evolve:false,jump:false,dash:false,pause:false,attack:false};
    this._c = canvas;
    const kd = e => {
      this.keys[e.code] = true;
      if(e.code==='KeyE') this.actions.devour=true;
      if(e.code==='Tab'){e.preventDefault();this.actions.evolve=true;}
      if(e.code==='Space'){e.preventDefault();this.actions.jump=true;}
      if(e.code==='ShiftLeft'||e.code==='ShiftRight') this.actions.dash=true;
      if(e.code==='Escape') this.actions.pause=true;
    };
    const ku = e => { this.keys[e.code]=false; };
    const mm = e => { const r=canvas.getBoundingClientRect(); this.mouse.x=e.clientX-r.left; this.mouse.y=e.clientY-r.top; };
    const md = e => { if(e.button===0){this.mouse.down=true;this.mouse.clicked=true;this.actions.attack=true;} };
    const mu = e => { if(e.button===0) this.mouse.down=false; };
    window.addEventListener('keydown',kd);
    window.addEventListener('keyup',ku);
    canvas.addEventListener('mousemove',mm);
    canvas.addEventListener('mousedown',md);
    canvas.addEventListener('mouseup',mu);
    canvas.addEventListener('contextmenu',e=>e.preventDefault());
  }
  dir() {
    let dx=0,dy=0;
    if(this.keys['KeyW']||this.keys['ArrowUp']) dy=-1;
    if(this.keys['KeyS']||this.keys['ArrowDown']) dy=1;
    if(this.keys['KeyA']||this.keys['ArrowLeft']) dx=-1;
    if(this.keys['KeyD']||this.keys['ArrowRight']) dx=1;
    if(dx&&dy){dx*=0.7071;dy*=0.7071;}
    return {dx,dy};
  }
  consume(n) { const v=this.actions[n]; this.actions[n]=false; return v; }
  consumeClick() { const v=this.mouse.clicked; this.mouse.clicked=false; return v; }
}
