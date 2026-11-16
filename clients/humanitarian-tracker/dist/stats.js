'use strict';
(() => {
 const status=document.querySelector('#stats-status');
 if(!status)return;
 let busy=false;
 async function refreshStats(){
  if(busy||document.hidden)return;
  busy=true;
  try{
   const response=await fetch('data/stats.json',{cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('Unavailable');
   const data=await response.json(),date=new Date(data.updated_at);
   if(!Number.isInteger(data.projects)||data.projects<=0||!Number.isInteger(data.countries)||data.countries<=0||!Number.isFinite(date.getTime()))throw new Error('Invalid snapshot');
   for(const key of ['projects','countries']){
    const el=document.querySelector(`[data-stat="${key}"]`);
    el.dataset.count=String(data[key]);el.textContent=data[key].toLocaleString('en-US');
   }
   const stale=Date.now()-date.getTime()>3*60*60*1000;
   status.textContent=`${stale?'Last available dashboard figures':'Dashboard figures'} · Updated ${date.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})}${stale?' · Refresh delayed':''}`;
  }catch{status.textContent='Last available dashboard figures · Live refresh temporarily unavailable';}
  finally{busy=false;}
 }
 refreshStats();setInterval(refreshStats,15*60*1000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshStats()});
})();
