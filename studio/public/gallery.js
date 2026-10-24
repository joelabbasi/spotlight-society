const $=s=>document.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const canvas=$('#gallery-canvas'), viewport=$('#gallery-viewport'), notice=$('#gallery-notice');
const modal=$('#gallery-dialog'), stage=$('#media-stage');
let items=[], selected=0, activeTrigger=null, isGrid=reduced.matches, paused=reduced.matches, busy=false;
let pan={x:0,y:0}, drag=null, draggedUntil=0, initialized=false;
const title=name=>name.replace(/^Copy of\s+/i,'').replace(/\.(mp4|mov|m4v|webm|jpe?g|png|webp|heic)$/i,'').trim()||name;
function tell(message,error=false){notice.replaceChildren(document.createTextNode(message));notice.hidden=false;if(error){const a=document.createElement('a');a.href='https://drive.google.com/drive/folders/1Z80OtvvGuXiz9U2mYhVg8sPtFkGDIwjj';a.target='_blank';a.rel='noopener noreferrer';a.textContent=' Open the collection in Drive ↗';notice.append(a);}}
function updatePan(){canvas.style.setProperty('--pan-x',`${pan.x}px`);canvas.style.setProperty('--pan-y',`${pan.y}px`);}
function resetView(){pan={x:viewport.clientWidth/2-1050,y:viewport.clientHeight/2-470};updatePan();}
function setMode(grid){isGrid=grid;document.body.classList.toggle('grid-view',grid);$('#grid-mode').setAttribute('aria-pressed',String(grid));$('#floating-mode').setAttribute('aria-pressed',String(!grid));$('#gallery-hint').textContent=grid?'Click a frame to open it.':'Drag to explore. Click to watch.';if(!grid)resetView();}
$('#grid-mode').addEventListener('click',()=>setMode(true));$('#floating-mode').addEventListener('click',()=>setMode(false));$('#reset-gallery').addEventListener('click',resetView);
function pauseMotion(value){paused=value;document.body.classList.toggle('motion-paused',paused);$('#pause-gallery').setAttribute('aria-pressed',String(paused));$('#pause-gallery').textContent=paused?'Resume motion ▷':'Pause motion Ⅱ';}
$('#pause-gallery').addEventListener('click',()=>pauseMotion(!paused));reduced.addEventListener('change',()=>{pauseMotion(reduced.matches);if(reduced.matches)setMode(true);});
function render(){
  const fragment=document.createDocumentFragment();
  items.forEach((item,index)=>{
    const col=index%4,row=Math.floor(index/4),card=document.createElement('figure');card.className='gallery-card';
    // Spread the collection across a navigable field, with consistent spacing.
    const width=[300,250,310,265][index%4];
    card.style.setProperty('--card-x',`${250+col*390+(row%2?85:0)}px`);card.style.setProperty('--card-y',`${220+row*350+[25,-40,50,-20][index%4]}px`);card.style.setProperty('--card-width',`${width}px`);card.style.setProperty('--card-angle',`${[-3,2,-2,3][index%4]}deg`);card.style.setProperty('--float-delay',`${-(index%7)}s`);card.style.setProperty('--float-time',`${7+index%5}s`);
    const link=document.createElement('a');link.href=item.url;link.setAttribute('aria-label',`Open ${item.kind==='video'?'film':'photograph'}: ${title(item.name)}`);
    const img=document.createElement('img');img.src=item.thumbnail;img.alt=title(item.name);img.width=900;img.height=600;img.loading=index<12?'eager':'lazy';img.draggable=false;img.addEventListener('error',()=>card.classList.add('poster-error'));link.append(img);
    const icon=document.createElement('span');icon.className='gallery-play';icon.textContent=item.kind==='video'?'▶':'↗';icon.setAttribute('aria-hidden','true');link.append(icon);
    link.addEventListener('click',e=>{if(Date.now()<draggedUntil){e.preventDefault();return;}if(!modal.showModal)return;e.preventDefault();openMedia(index,link);});
    const caption=document.createElement('figcaption');caption.className='gallery-caption';const name=document.createElement('span');name.textContent=title(item.name);const number=document.createElement('span');number.textContent=`${item.kind==='video'?'FILM':'PHOTO'} / ${String(index+1).padStart(2,'0')}`;caption.append(name,number);card.append(link,caption);fragment.append(card);
  });
  canvas.replaceChildren(fragment);
  const rows=Math.ceil(items.length/4);canvas.style.height=`${Math.max(1300,rows*350+500)}px`;
  if(!initialized){resetView();initialized=true;}
}
async function refresh(){
  if(busy)return;busy=true;$('#refresh-gallery').disabled=true;
  try{
    const res=await fetch('/api/gallery',{cache:'no-store'});const data=await res.json();if(!res.ok||!Array.isArray(data.items))throw new Error(data.error||'Gallery unavailable.');
    const changed=JSON.stringify(items)!==JSON.stringify(data.items);items=data.items;if(changed)render();
    if(!items.length)tell('New work is on its way. This collection is empty for now.',true);else if(data.stale)tell('Showing the last available collection. Reconnecting to Drive…');else notice.hidden=true;
    const films=items.filter(i=>i.kind==='video').length,photos=items.length-films;
    $('#gallery-status').textContent=`${films?`${films} film${films===1?'':'s'}`:''}${films&&photos?' · ':''}${photos?`${photos} photo${photos===1?'':'s'}`:''}${data.stale?' · Offline copy':' · Updated from Drive'}`;
  }catch{
    tell(items.length?'The latest update is unavailable. Showing the last loaded collection.':'The collection could not load right now. Please retry.',true);
    $('#gallery-status').textContent=items.length?'Last loaded collection':'Connection unavailable';
  }finally{busy=false;$('#refresh-gallery').disabled=false;}
}
$('#refresh-gallery').addEventListener('click',refresh);
// Live reads on entry and while the page remains in use. No fixed media snapshot.
setInterval(()=>{if(!document.hidden&&!modal.open)refresh();},60_000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
viewport.addEventListener('pointerdown',e=>{
  if(isGrid||e.button!==0)return;drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:pan.x,y:pan.y,moved:false};
});
viewport.addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
  if(!drag.moved&&Math.hypot(dx,dy)>7){drag.moved=true;viewport.setPointerCapture(e.pointerId);document.body.classList.add('dragging');}
  if(drag.moved){pan.x=Math.max(-1950,Math.min(viewport.clientWidth-100,drag.x+dx));pan.y=Math.max(-parseInt(canvas.style.height||'1300')+100,Math.min(viewport.clientHeight-100,drag.y+dy));updatePan();}
});
function endDrag(){if(drag?.moved)draggedUntil=Date.now()+350;drag=null;document.body.classList.remove('dragging');}
viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);
viewport.addEventListener('wheel',e=>{if(isGrid)return;e.preventDefault();pan.x=Math.max(-1950,Math.min(viewport.clientWidth-100,pan.x-e.deltaX));pan.y=Math.max(-parseInt(canvas.style.height||'1300')+100,Math.min(viewport.clientHeight-100,pan.y-e.deltaY));updatePan();},{passive:false});
function resetZoom(){stage.classList.remove('zoomed');$('#zoom-media').textContent='Zoom +';$('#zoom-media').setAttribute('aria-pressed','false');}
function showMedia(index){
  if(!items.length)return;selected=(index+items.length)%items.length;const item=items[selected];resetZoom();stage.replaceChildren();$('#media-title').textContent=title(item.name);$('#drive-original').href=item.url;$('#media-count').textContent=`${selected+1} / ${items.length}`;$('#zoom-media').hidden=item.kind==='video';
  if(item.kind==='video'){
    const iframe=document.createElement('iframe');iframe.src=`https://drive.google.com/file/d/${encodeURIComponent(item.id)}/preview`;iframe.title=title(item.name);iframe.allow='autoplay; fullscreen';iframe.allowFullscreen=true;stage.append(iframe);
  }else{
    const img=document.createElement('img');img.src=`${item.thumbnail}&large=1`;img.alt=title(item.name);img.addEventListener('click',toggleZoom);img.addEventListener('error',()=>{const p=document.createElement('p');p.className='media-placeholder';p.textContent='This photograph could not be loaded.';const a=document.createElement('a');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open the original in Drive ↗';p.append(a);stage.replaceChildren(p);});stage.append(img);
  }
}
function toggleZoom(){const zoomed=stage.classList.toggle('zoomed');$('#zoom-media').textContent=zoomed?'Fit −':'Zoom +';$('#zoom-media').setAttribute('aria-pressed',String(zoomed));}
function openMedia(index,trigger){activeTrigger=trigger;showMedia(index);modal.showModal();document.body.classList.add('locked');$('#close-media').focus();}
$('#zoom-media').addEventListener('click',toggleZoom);$('#close-media').addEventListener('click',()=>modal.close());$('#previous-media').addEventListener('click',()=>showMedia(selected-1));$('#next-media').addEventListener('click',()=>showMedia(selected+1));
modal.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showMedia(selected+1);}if(e.key==='ArrowLeft'){e.preventDefault();showMedia(selected-1);}});
modal.addEventListener('close',()=>{stage.replaceChildren();document.body.classList.remove('locked');activeTrigger?.focus();});
addEventListener('resize',()=>{if(!isGrid)resetView();});
setMode(isGrid);pauseMotion(paused);refresh();
