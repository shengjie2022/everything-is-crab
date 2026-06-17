export const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
export const lerp = (a,b,t) => a+(b-a)*t;
export const dist = (x1,y1,x2,y2) => Math.hypot(x2-x1,y2-y1);
export const distSq = (x1,y1,x2,y2) => (x2-x1)**2+(y2-y1)**2;
export const angle = (x1,y1,x2,y2) => Math.atan2(y2-y1,x2-x1);
export const randF = (a,b) => a+Math.random()*(b-a);
export const randI = (a,b) => Math.floor(randF(a,b+1));
export const choose = a => a[Math.floor(Math.random()*a.length)];

export class Noise {
  constructor(seed=Math.random()*65536){
    this.p=new Uint8Array(512);
    const q=new Uint8Array(256);
    let s=seed|0;
    for(let i=0;i<256;i++){s=(s*1103515245+12345)&0x7fffffff;q[i]=s&255;}
    for(let i=0;i<512;i++)this.p[i]=q[i&255];
  }
  _f(t){return t*t*t*(t*(t*6-15)+10)}
  _g(h,x,y){const u=(h&1)?-x:x,v=(h&2)?-y:y;return u+v}
  n2(x,y){
    const X=Math.floor(x)&255,Y=Math.floor(y)&255;
    const xf=x-Math.floor(x),yf=y-Math.floor(y);
    const u=this._f(xf),v=this._f(yf),p=this.p;
    const a=p[X]+Y,b=p[X+1]+Y;
    return lerp(lerp(this._g(p[a],xf,yf),this._g(p[b],xf-1,yf),u),
                lerp(this._g(p[a+1],xf,yf-1),this._g(p[b+1],xf-1,yf-1),u),v);
  }
  oct(x,y,o=4,per=0.5){
    let t=0,f=1,a=1,m=0;
    for(let i=0;i<o;i++){t+=this.n2(x*f,y*f)*a;m+=a;a*=per;f*=2;}
    return t/m;
  }
}
