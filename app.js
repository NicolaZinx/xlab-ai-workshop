(() => {
'use strict';
const slides=window.SLIDES;
const deck=document.getElementById('deck');
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tag=(s,i,el='p',cls='')=>`<${el}${cls?` class="${cls}"`:''} data-t="${i}">${esc(s.texts[i])}</${el}>`;
const card=(s,h,p,extra='')=>`<article class="card">${extra}${tag(s,h,'h2')}${tag(s,p)}</article>`;
const call=(s,i)=>tag(s,i,'div','callout');
const row=(s,h,p)=>`<article class="row">${tag(s,h,'h2')}${tag(s,p)}</article>`;
const rows=(s,pairs)=>`<div class="rows">${pairs.map(([h,p])=>row(s,h,p)).join('')}</div>`;
const grid=(n,body)=>`<div class="grid cols-${n}">${body}</div>`;
const head=(s,sub=null)=>`<header class="slide-head">${tag(s,0,'h1')}${sub!==null?tag(s,sub,'p','subtitle'):''}</header>`;
const body=v=>`<div class="body">${v}</div>`;
const image=(s,i,alt,cls='')=>`<img src="${s.images[i]}" alt="${esc(alt)}" class="${cls}" decoding="async"${s.id===1?'':' loading="lazy"'}>`;
const pairIndices=(start,count)=>Array.from({length:count},(_,i)=>[start+i*2,start+i*2+1]);
function render(s){
 let html='',cls='';
 const t=s.texts;
 switch(s.id){
 case 1:cls='cover'; html=image(s,0,'浙江大学')+tag(s,0,'p','institution')+tag(s,1,'p','cover-kicker')+`<h1 data-t="2">${esc(t[2]).replace('VibeCoding','<em>VibeCoding</em>')}</h1>`+tag(s,3,'p','workshop')+tag(s,4,'p','presenter')+`<div class="cover-bottom">${tag(s,5,'span')}${tag(s,6,'span')}</div>`;html=html.replace('class=""','class="cover-logo"');break;
 case 2:html=head(s)+body(`<div class="connection">${card(s,1,2)}${tag(s,3,'div','bridge')}${card(s,4,5)}</div><div class="callout">${tag(s,6,'strong')}<span aria-hidden="true">　·　</span>${tag(s,7,'span')}</div>`);break;
 case 3:html=head(s)+body(grid(3,[1,4,7].map(i=>card(s,i+1,i+2,tag(s,i,'span','number'))).join('')));break;
 case 4:cls='statement';html=head(s)+body(tag(s,1,'p','lead')+tag(s,2,'p','big'));break;
 case 5:html=head(s,1)+body(grid(4,[2,5,8,11].map(i=>card(s,i+1,i+2,tag(s,i,'span','number'))).join(''))+call(s,14));break;
 case 6:html=head(s)+body(grid(2,[0,1].map((i)=>`<article class="card app-card">${image(s,i,t[1+i*3])}${tag(s,1+i*3,'h2')}${tag(s,2+i*3)}${tag(s,3+i*3)}</article>`).join('')));break;
 case 7:case 8:cls='video-slide';html=`<video src="${s.video}" poster="${s.poster}" preload="metadata" playsinline aria-label="${esc(s.title)}" tabindex="0"></video><button class="video-toggle" aria-label="播放${esc(s.title)}"><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M6 3v18l15-9z"/></svg></button>`;break;
 case 9:cls='statement';html=head(s)+body(tag(s,1,'p','lead')+tag(s,2,'p','big'));break;
 case 10:html=head(s)+body(grid(3,[1,3,5].map(i=>card(s,i,i+1)).join(''))+call(s,7));break;
 case 11:html=head(s)+body(grid(2,[1,4].map(i=>`<article class="card">${tag(s,i,'h2')}${tag(s,i+1)}<div style="height:24px"></div>${call(s,i+2)}</article>`).join('')));break;
 case 12:cls='topics';html=head(s,1)+body(grid(2,[2,5,8,11].map(i=>`<article class="card">${tag(s,i,'h2')}${tag(s,i+1)}${tag(s,i+2)}</article>`).join('')));break;
 case 13:case 14:case 15:case 16:cls='project';html=`<header class="slide-head">${tag(s,0,'h1')}${tag(s,1,'p','subtitle')}${tag(s,2,'p','motto')}</header>`+body(rows(s,[[3,4],[5,6],[7,8]]));break;
 case 17:cls='game-slide';html=`<header class="slide-head"><p class="eyebrow" data-t="0">示例作品</p>${tag(s,1,'h1')}${tag(s,2,'p','source')}</header>`+body(`<button class="game-preview open-game" aria-label="试玩第1章消消乐">${image(s,0,'教材知识消消乐游戏画面')}<span class="play-badge" aria-hidden="true">▶</span></button><button class="game-link open-game" data-t="3">${esc(t[3])}</button>`);break;
 case 18:case 22:html=head(s)+body(rows(s,pairIndices(1,3))+call(s,7));break;
 case 19:case 24:case 27:case 30:case 31:case 33:cls='compact';html=head(s)+body(rows(s,pairIndices(1,4))+call(s,9));break;
 case 20:cls='prompts';html=head(s)+body(grid(2,[1,3].map(i=>card(s,i,i+1)).join(''))+call(s,5));break;
 case 21:html=head(s)+body(`<div class="pairing">${tag(s,1,'div','persona')}<div class="exchange">${[3,4,5].map(i=>`<div class="card">${tag(s,i)}</div>`).join('')}</div>${tag(s,2,'div','persona')}</div>`+call(s,6));break;
 case 23:case 29:html=head(s)+body(`<div class="round">${tag(s,1,'div','round-label')}<div>${tag(s,2,'p','prose')}${call(s,3)}</div></div>`);break;
 case 25:cls='compact';html=head(s)+body(rows(s,pairIndices(1,3))+`<div class="card">${tag(s,7,'p','quote-label')}${tag(s,8,'blockquote','quote')}</div>`);break;
 case 26:html=head(s,1)+body(`<div class="visual-review">${image(s,0,'应用界面示例')}<div class="stack">${[2,5,8].map(i=>`<article class="card">${tag(s,i,'h2')}${tag(s,i+1)}${tag(s,i+2)}</article>`).join('')}</div></div>`);break;
 case 28:html=head(s,1)+body(grid(3,[2,4,6].map(i=>card(s,i,i+1)).join(''))+call(s,8));break;
 case 32:html=head(s)+body(grid(3,[1,4,7].map(i=>card(s,i+1,i+2,tag(s,i,'span','number'))).join(''))+call(s,10));break;
 case 34:cls='statement';html=head(s)+body(tag(s,1,'p','big')+`<div>${tag(s,2,'p','signature')}${tag(s,3,'p','signature')}</div>`+call(s,4));break;
 }
 const section=document.createElement('section');section.className=`slide ${cls}`;section.id=`slide-${s.id}`;section.dataset.slide=s.id;section.setAttribute('aria-label',`第${s.id}页，共34页`);section.hidden=s.id!==1;section.innerHTML=html;deck.append(section);
}
slides.forEach(render);
const all=[...deck.children];let current=0;
const page=document.getElementById('page'),prev=document.getElementById('previous'),next=document.getElementById('next'),progress=document.getElementById('progress');
const dialog=document.getElementById('game'),frame=document.getElementById('game-frame'),chap=document.getElementById('chapter');
let gameOpener=null;
function go(index,fromHash=false){
 index=Math.max(0,Math.min(slides.length-1,index));
 if(dialog.open||index===current)return;
 all[current].querySelectorAll('video').forEach(v=>v.pause());all[current].hidden=true;all[current].classList.remove('entering');
 current=index;all[current].hidden=false;all[current].scrollTop=0;all[current].classList.add('entering');
 update();if(!fromHash)history.replaceState(null,'',current?`#${current+1}`:location.pathname+location.search);
}
function update(){page.innerHTML=`<b>${String(current+1).padStart(2,'0')}</b><span>/ 34</span>`;prev.disabled=current===0;next.disabled=current===33;progress.style.width=`${(current+1)/34*100}%`;document.body.classList.toggle('is-video',!!slides[current].video);document.title=`${current+1} · ${slides[current].title||slides[current].texts[0]} · X-Lab`;}
function toggleVideo(){const v=all[current].querySelector('video');if(!v)return;if(v.paused){v.play().catch(()=>{});}else v.pause();}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch(e){console.info('Fullscreen unavailable',e.name);}}
async function enter(){if(!document.fullscreenElement){try{await document.documentElement.requestFullscreen();}catch(e){console.info('Fullscreen unavailable',e.name);}}else toggleVideo();}
prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));page.addEventListener('click',fullscreen);
document.addEventListener('fullscreenchange',()=>page.setAttribute('aria-label',document.fullscreenElement?'退出全屏':'进入全屏'));
function onKey(e){if(dialog.open){if(e.key==='Escape'){e.preventDefault();closeGame();}return;}if(e.target.closest('select,input,textarea'))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();go(current+1);}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(current-1);}else if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen();}else if(e.key==='Enter'){e.preventDefault();enter();}else if(e.code==='Space'&&slides[current].video){e.preventDefault();toggleVideo();}else if(e.key==='Home'){e.preventDefault();go(0);}else if(e.key==='End'){e.preventDefault();go(33);}}
document.addEventListener('keydown',onKey);
all.forEach(section=>{const v=section.querySelector('video');if(!v)return;const btn=section.querySelector('.video-toggle');v.addEventListener('click',toggleVideo);btn.addEventListener('click',()=>{toggleVideo();v.focus({preventScroll:true});});v.addEventListener('play',()=>{section.classList.add('playing');btn.setAttribute('aria-label','暂停视频');});v.addEventListener('pause',()=>{section.classList.remove('playing');btn.setAttribute('aria-label','播放视频');});v.addEventListener('ended',()=>section.classList.remove('playing'));});
let touch=null;deck.addEventListener('touchstart',e=>{if(e.touches.length!==1||e.target.closest('button,select,iframe')){touch=null;return;}touch={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});deck.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.6)go(current+(dx<0?1:-1));},{passive:true});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let lightFrame=false;document.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch'||lightFrame)return;lightFrame=true;requestAnimationFrame(()=>{document.documentElement.style.setProperty('--mx',`${e.clientX/innerWidth*100}%`);document.documentElement.style.setProperty('--my',`${e.clientY/innerHeight*100}%`);document.documentElement.style.setProperty('--shadow-x',`${(0.5-e.clientX/innerWidth)*9}px`);document.documentElement.style.setProperty('--shadow-y',`${10+(0.5-e.clientY/innerHeight)*7}px`);lightFrame=false;});},{passive:true});
const dust=document.getElementById('dust');for(let i=0;i<28;i++){const dot=document.createElement('i');dot.className='speck';dot.style.cssText=`left:${(i*37.37)%100}%;top:${(i*17.21+13)%100}%;animation-delay:${-i*.81}s;animation-duration:${10+i%9}s`;dust.append(dot);}
for(let n=1;n<=12;n++){const opt=document.createElement('option');opt.value=n;opt.textContent=`第${n}章消消乐`;chap.append(opt);}
function chapterPath(n){return `games/${String(n).padStart(2,'0')}_第${n}章消消乐.html`;}
function openGame(e){gameOpener=e.currentTarget;all[current].querySelectorAll('video').forEach(v=>v.pause());if(!frame.getAttribute('src')){frame.src=chapterPath(1);chap.value='1';}dialog.showModal();document.getElementById('close-game').focus();}
function closeGame(){dialog.close();if(gameOpener)gameOpener.focus({preventScroll:true});}
all[16].querySelectorAll('.open-game').forEach(b=>b.addEventListener('click',openGame));document.getElementById('close-game').addEventListener('click',closeGame);chap.addEventListener('change',()=>{frame.src=chapterPath(Number(chap.value));});dialog.addEventListener('cancel',e=>{e.preventDefault();closeGame();});const boundGameDocs=new WeakSet();
function bindGameKeys(target){try{const doc=target.contentDocument;if(!doc||boundGameDocs.has(doc))return;boundGameDocs.add(doc);doc.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeGame();}else if(e.key.toLowerCase()==='f'&&!e.target.closest('input,textarea,select')){e.preventDefault();fullscreen();}});doc.querySelectorAll('iframe').forEach(child=>{child.addEventListener('load',()=>bindGameKeys(child));bindGameKeys(child);});}catch(e){}}
frame.addEventListener('load',()=>bindGameKeys(frame));
window.addEventListener('hashchange',()=>{const n=Number(location.hash.slice(1));if(Number.isInteger(n)&&n>=1&&n<=34)go(n-1,true);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)all[current].querySelectorAll('video').forEach(v=>v.pause());});
update();const requested=Number(location.hash.slice(1));if(Number.isInteger(requested)&&requested>=1&&requested<=34)go(requested-1,true);
window.deckApp={go:n=>go(n-1),get current(){return current+1;},openGame:()=>openGame({currentTarget:all[16].querySelector('.open-game')})};
})();
