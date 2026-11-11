'use strict';
const search=document.querySelector('#archive-search');
const sections=[...document.querySelectorAll('[data-category]')];
const tabs=[...document.querySelectorAll('[data-filter]')];
const clear=document.querySelector('#clear-search');
let active='all';
const pageSize=12,expanded=new Set();
function applyFilters(){
 const query=search.value.trim().toLocaleLowerCase();let total=0;
 for(const section of sections){
  const category=section.dataset.category,selected=active==='all'||active===category;
  const entries=[...section.querySelectorAll('[data-entry]')];let matches=0;
  for(const entry of entries){const match=selected&&(!query||(entry.dataset.search+' '+entry.textContent).toLocaleLowerCase().includes(query));entry.hidden=!match;if(match){matches++;if(category!=='sources'&&!expanded.has(category)&&matches>pageSize&&!query)entry.hidden=true}}
  section.hidden=!selected||(!!query&&matches===0);total+=matches;
  let more=section.querySelector('.show-more');
  if(!more&&category!=='sources'){more=document.createElement('button');more.className='show-more';more.addEventListener('click',()=>{expanded.add(category);applyFilters()});section.append(more)}
  if(more){more.hidden=!!query||!selected||matches<=pageSize||expanded.has(category);more.textContent=`Show all ${matches} entries ↓`}
  section.querySelectorAll('.source-details').forEach(d=>{d.open=!!query;d.hidden=!!query&&![...d.querySelectorAll('[data-entry]')].some(e=>!e.hidden)})
 }
 clear.hidden=!query;document.querySelector('#archive-empty').hidden=total>0;
 document.querySelector('#archive-results').textContent=query?`${total} matching records for “${search.value.trim()}”`:'Browse projects, recognition, news, research and source references.';
 tabs.forEach(t=>{if(t.dataset.filter===active)t.setAttribute('aria-current','true');else t.removeAttribute('aria-current')});
}
function selectFromHash(){const key=location.hash.slice(1);active=sections.some(s=>s.dataset.category===key)?key:'all';applyFilters()}
tabs.forEach(t=>t.addEventListener('click',e=>{e.preventDefault();active=t.dataset.filter;history.replaceState(null,'',`#${active}`);applyFilters()}));
search.addEventListener('input',applyFilters);clear.addEventListener('click',()=>{search.value='';applyFilters();search.focus()});window.addEventListener('hashchange',selectFromHash);selectFromHash();
document.querySelectorAll('.load-archive-video').forEach(button=>button.addEventListener('click',()=>{const container=button.nextElementSibling;const frame=document.createElement('iframe');frame.src=button.dataset.embed;frame.title=button.dataset.title;frame.allow='encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';container.replaceChildren(frame);container.hidden=false;button.hidden=true}));
