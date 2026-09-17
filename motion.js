/* Local light and depth: decorative only; never intercepts presentation input. */
(() => {
'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const fine=matchMedia('(hover: hover) and (pointer: fine)');
const root=document.documentElement;
const surfaces=[...document.querySelectorAll('.card,.row,.callout,.game-preview')];
surfaces.forEach(el=>{el.classList.add('surface');if(el.classList.contains('callout')){[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()).forEach(n=>{const span=document.createElement('span');n.replaceWith(span);span.append(n);});}});
const aura=document.createElement('div');aura.id='cursor-aura';aura.setAttribute('aria-hidden','true');document.body.insertBefore(aura,document.getElementById('deck'));
const canvas=document.createElement('canvas');canvas.id='pointer-gold';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
const ctx=canvas.getContext('2d');let dpr=1,points=[],raf=0,lastParticle=0,previous=null,hovered=null,lastPointer=null,pointerFrame=0;
function resize(){dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);}
resize();addEventListener('resize',resize,{passive:true});
function enabled(){return !reduced.matches&&fine.matches&&!document.body.classList.contains('is-video')&&!document.querySelector('#game').open;}
function resetSurface(){if(hovered){hovered.classList.remove('lit');hovered.style.removeProperty('--tilt-x');hovered.style.removeProperty('--tilt-y');hovered.style.removeProperty('--cast-x');hovered.style.removeProperty('--cast-y');hovered=null;}}
function clear(){resetSurface();root.classList.remove('pointer-active');points=[];previous=null;lastPointer=null;if(raf)cancelAnimationFrame(raf);raf=0;ctx.clearRect(0,0,innerWidth,innerHeight);root.style.setProperty('--cover-x','0px');root.style.setProperty('--cover-y','0px');}
function draw(now){
 raf=0;ctx.clearRect(0,0,innerWidth,innerHeight);points=points.filter(p=>now-p.born<p.ttl);
 for(const p of points){const elapsed=now-p.born,t=elapsed/1000,life=1-elapsed/p.ttl;
 const x=p.x+p.vx*t,y=p.y+p.vy*t+34*t*t;
 const flicker=.70+.30*Math.sin(elapsed*.024+p.phase),alpha=Math.min(1,life*1.6)*flicker;
 const radius=p.radius*(.5+life*.5);
 // A soft warm glow, a bright core, and occasional four-point glints.
 const glow=ctx.createRadialGradient(x,y,0,x,y,radius*3.7);
 glow.addColorStop(0,`rgba(255,237,166,${alpha*.7})`);glow.addColorStop(.35,`rgba(232,174,49,${alpha*.38})`);glow.addColorStop(1,'rgba(232,174,49,0)');
 ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,radius*3.7,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle=`rgba(210,153,35,${alpha*.44})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-p.vx*.045,y-(p.vy+68*t)*.045);ctx.lineTo(x,y);ctx.stroke();
 ctx.fillStyle=`rgba(213,150,27,${alpha})`;ctx.beginPath();ctx.arc(x,y,radius*.62,0,Math.PI*2);ctx.fill();
 if(p.star){const r=radius*(1.5+flicker*.65);ctx.save();ctx.translate(x,y);ctx.rotate(p.phase+t*.5);ctx.fillStyle=`rgba(247,201,80,${alpha*.93})`;ctx.beginPath();ctx.moveTo(0,-r);ctx.quadraticCurveTo(r*.15,-r*.15,r,0);ctx.quadraticCurveTo(r*.15,r*.15,0,r);ctx.quadraticCurveTo(-r*.15,r*.15,-r,0);ctx.quadraticCurveTo(-r*.15,-r*.15,0,-r);ctx.fill();ctx.restore();}
 ctx.fillStyle=`rgba(255,255,234,${alpha})`;ctx.beginPath();ctx.arc(x,y,radius*.28,0,Math.PI*2);ctx.fill();
 }
 if(points.length)raf=requestAnimationFrame(draw);
}
function trail(x,y,now){
 if(now-lastParticle<18)return;lastParticle=now;
 if(previous){const dx=x-previous.x,dy=y-previous.y,dist=Math.hypot(dx,dy);
 if(dist>3){const count=Math.min(4,Math.max(2,Math.ceil(dist/12)));
 for(let i=1;i<=count;i++){points.push({x:previous.x+dx*i/count+(Math.random()-.5)*7,y:previous.y+dy*i/count+(Math.random()-.5)*7,born:now,ttl:720+Math.random()*420,vx:(Math.random()-.5)*35-dx/(dist||1)*7,vy:-12+Math.random()*15,radius:1.7+Math.random()*1.3,star:Math.random()<.24,phase:Math.random()*Math.PI*2});}}}
 previous={x,y};if(points.length>96)points.splice(0,points.length-96);if(!raf&&points.length)raf=requestAnimationFrame(draw);
}
function illuminate(){pointerFrame=0;if(!lastPointer||!enabled()){clear();return;}const {x,y,target}=lastPointer;
root.classList.add('pointer-active');root.style.setProperty('--mx',x/innerWidth*100+'%');root.style.setProperty('--my',y/innerHeight*100+'%');root.style.setProperty('--cursor-x',x+'px');root.style.setProperty('--cursor-y',y+'px');root.style.setProperty('--cover-x',(x/innerWidth-.5)*24+'px');root.style.setProperty('--cover-y',(y/innerHeight-.5)*18+'px');
const el=target.closest('.surface');if(el!==hovered){resetSurface();hovered=el;}
if(el){const r=el.getBoundingClientRect();const px=Math.max(0,Math.min(1,(x-r.left)/r.width)),py=Math.max(0,Math.min(1,(y-r.top)/r.height));el.style.setProperty('--local-x',px*100+'%');el.style.setProperty('--local-y',py*100+'%');el.style.setProperty('--tilt-x',(0.5-py)*4+'deg');el.style.setProperty('--tilt-y',(px-.5)*4+'deg');el.style.setProperty('--cast-x',(0.5-px)*20+'px');el.style.setProperty('--cast-y',16+(0.5-py)*14+'px');el.classList.add('lit');}
trail(x,y,performance.now());}
document.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||!enabled())return;lastPointer={x:e.clientX,y:e.clientY,target:e.target};if(!pointerFrame)pointerFrame=requestAnimationFrame(illuminate);},{passive:true});
document.addEventListener('pointerout',e=>{if(!e.relatedTarget)clear();},{passive:true});
let pressed=null;document.addEventListener('pointerdown',e=>{if(reduced.matches||e.pointerType!=='touch')return;pressed=e.target.closest('.surface');if(pressed)pressed.classList.add('pressed');},{passive:true});
function release(){if(pressed)pressed.classList.remove('pressed');pressed=null;}
document.addEventListener('pointerup',release,{passive:true});document.addEventListener('pointercancel',release,{passive:true});
addEventListener('deckslidechange',()=>{clear();release();});addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});reduced.addEventListener('change',()=>{clear();release();});fine.addEventListener('change',clear);
document.querySelectorAll('.open-game').forEach(el=>el.addEventListener('click',clear));
})();
