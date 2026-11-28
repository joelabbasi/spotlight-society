import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
test('secure canonical redirect retains the requested page and query',async()=>{
 const r=await worker.fetch(new Request('https://www.humanitariantracker.org/gallery.html?album=damascus'));
 assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://humanitariantracker.org/gallery.html?album=damascus');
});
test('HTTP main address upgrades to HTTPS',async()=>{
 const r=await worker.fetch(new Request('http://humanitariantracker.org/donate.html'));
 assert.equal(r.headers.get('location'),'https://humanitariantracker.org/donate.html');
});
test('does not forward submitted bodies, cookies, or authorization to the public origin',async()=>{
 const post=await worker.fetch(new Request('https://humanitariantracker.org/',{method:'POST',body:'private'}));assert.equal(post.status,405);
 const before=globalThis.fetch;
 globalThis.fetch=async(url,init)=>{
  assert.equal(String(url),'https://joelabbasi.github.io/spotlight-society/humanitarian-tracker/archive.html');
  assert.deepEqual(Object.keys(init.headers),['Accept']);
  return new Response('Archive',{headers:{'Content-Type':'text/html'}});
 };
 try{const r=await worker.fetch(new Request('https://humanitariantracker.org/archive.html',{headers:{Cookie:'private',Authorization:'private'}}));assert.equal(await r.text(),'Archive');}finally{globalThis.fetch=before;}
});
test('directory redirects remain on the client domain',async()=>{
 const before=globalThis.fetch;
 globalThis.fetch=async()=>new Response(null,{status:301,headers:{Location:'https://joelabbasi.github.io/spotlight-society/humanitarian-tracker/syria-tracker/'}});
 try{const r=await worker.fetch(new Request('https://humanitariantracker.org/syria-tracker'));assert.equal(r.headers.get('location'),'https://humanitariantracker.org/syria-tracker/');}finally{globalThis.fetch=before;}
});
test('figures remain fresh from the hourly published snapshot',async()=>{
 const before=globalThis.fetch;
 globalThis.fetch=async(url)=>{assert.match(String(url),/data\/stats.json\?_snapshot=\d+/);return new Response('{"projects":346}',{headers:{'Content-Type':'application/json'}});};
 try{const r=await worker.fetch(new Request('https://humanitariantracker.org/data/stats.json'));assert.equal(r.headers.get('cache-control'),'no-store');assert.equal((await r.json()).projects,346);}finally{globalThis.fetch=before;}
});
