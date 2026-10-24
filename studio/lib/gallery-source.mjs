import { mediaTitle } from './media-titles.mjs';
export const FOLDER_ID = '1Z80OtvvGuXiz9U2mYhVg8sPtFkGDIwjj';
export const FOLDER_URL = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
const MAX_BYTES = 2_000_000;
const FRESH_MS = 60_000;
let saved = null;
let pending = null;

function decode(value) {
  return value.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => {
    const code = n[0].toLowerCase() === 'x' ? parseInt(n.slice(1),16) : Number(n);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
  }).replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

// Read only Google's public, embeddable folder listing. No account credentials.
export function parseFolder(html) {
  if (!html.includes('flip-entries')) throw new Error('The gallery folder is not publicly available.');
  const items = [];
  const seen = new Set();
  const entries = html.split(/<div\s+class="flip-entry"/).slice(1);
  for (const entry of entries) {
    const id = entry.match(/id="entry-([\w-]+)"/)?.[1];
    const name = entry.match(/class="flip-entry-title">([\s\S]*?)<\/div>/)?.[1];
    const image = entry.match(/class="flip-entry-thumb"><img\s+src="([^"]+)"/)?.[1];
    const kind = /alt="Video"|type\/video\//.test(entry) ? 'video' : /alt="Image"|type\/image\//.test(entry) ? 'image' : null;
    if(!id || !name || !image || !kind || seen.has(id) || !/^[\w-]{10,100}$/.test(id)) continue;
    const thumbnail = new URL(decode(image));
    if (thumbnail.protocol !== 'https:' || !thumbnail.hostname.endsWith('.googleusercontent.com')) continue;
    seen.add(id);
    items.push({ id, name: decode(name.replace(/<[^>]*>/g,'')).trim(), kind, thumbnail: thumbnail.href.replace(/=s\d+(?:-[\w-]+)?$/, '=s900'), url: `https://drive.google.com/file/d/${id}/view` });
    if(items.length >= 1000) break;
  }
  return items;
}

export async function getGallery({ force = false } = {}) {
  if(!force && saved && Date.now()-saved.time < FRESH_MS) return {...saved, stale:false};
  if(pending) return pending;
  pending = (async () => {
    try {
      const response = await fetch(`https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}`, {cache:'no-store',headers:{'Accept':'text/html'}, signal:AbortSignal.timeout(12_000), redirect:'follow'});
      if(!response.ok) throw new Error(`Drive returned ${response.status}.`);
      if(Number(response.headers.get('content-length')) > MAX_BYTES) throw new Error('Folder listing is too large.');
      const html = await response.text();
      if(html.length > MAX_BYTES) throw new Error('Folder listing is too large.');
      const items = parseFolder(html);
      saved = {items, time:Date.now()};
      return {...saved, stale:false};
    } catch(error) {
      if(saved && Date.now()-saved.time < 5*60_000) return {...saved,stale:true};
      throw error;
    } finally { pending = null; }
  })();
  return pending;
}

export async function galleryResponse() {
  try {
    const data = await getGallery();
    return Response.json({items:data.items.map(({thumbnail,...item})=>({...item,title:mediaTitle(item),thumbnail:`/api/gallery/thumbnail?id=${item.id}`})),folderUrl:FOLDER_URL,checkedAt:new Date(data.time).toISOString(),stale:data.stale}, {headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  } catch {
    return Response.json({error:'The gallery is temporarily unavailable. Please try again or open the source folder.',folderUrl:FOLDER_URL}, {status:503,headers:{'Cache-Control':'no-store'}});
  }
}

export async function thumbnailResponse(request) {
  const url = new URL(request.url), id = url.searchParams.get('id');
  if(!id || !/^[\w-]{10,100}$/.test(id)) return new Response('Invalid image.',{status:400});
  try {
    const {items} = await getGallery();
    const item = items.find(item=>item.id===id);
    if(!item) return new Response('Not in this gallery.',{status:404});
    const large = url.searchParams.get('large') === '1';
    const response = await fetch(item.thumbnail.replace(/=s900$/,large?'=s2400':'=s900'),{signal:AbortSignal.timeout(15_000)});
    const type = response.headers.get('content-type') || '';
    if(!response.ok || !type.startsWith('image/')) return new Response('Image unavailable.',{status:502});
    return new Response(response.body,{headers:{'Content-Type':type,'Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff'}});
  } catch { return new Response('Image unavailable.',{status:503}); }
}
