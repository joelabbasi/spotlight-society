const RECIPIENT = 'joe@spotlightsociety.org';
const ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT}`;
const SITE = 'https://spotlight-studio-preview.sugarybell9.chatgpt.site/';
const attempts = new Map();
const WINDOW = 10 * 60_000;

export function validateDemo(input) {
  const email = typeof input?.email === 'string' ? input.email.trim() : '';
  const phone = typeof input?.phone === 'string' ? input.phone.trim() : '';
  const details = typeof input?.details === 'string' ? input.details.trim() : '';
  const errors = {};
  if(!email || email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || /[\r\n]/.test(email)) errors.email = 'Enter a valid email address.';
  const digits = phone.replace(/\D/g,'');
  if(phone.length > 40 || !/^[+()\d .-]+$/.test(phone) || digits.length < 7 || digits.length > 15) errors.phone = 'Enter a phone number with 7–15 digits.';
  if(details.length < 10 || details.length > 3000) errors.details = 'Tell us about your request in 10–3,000 characters.';
  if(input?.website) errors.form = 'Please reload the page and try again.';
  return {value:{email,phone,details},errors};
}

function json(body,status=200,extra={}) {
  return Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
}

async function readBody(request) {
  if(Number(request.headers.get('content-length')) > 16_384) throw new Error('too_large');
  if(!request.body) return {};
  const reader=request.body.getReader(),chunks=[];
  let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>16_384){await reader.cancel();throw new Error('too_large');}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;
  for(const part of chunks){bytes.set(part,offset);offset+=part.byteLength;}
  const text=new TextDecoder().decode(bytes);
  return request.headers.get('content-type')?.includes('application/json') ? JSON.parse(text) : Object.fromEntries(new URLSearchParams(text));
}

export async function submitDemo(request,fetcher=fetch) {
  const origin=request.headers.get('origin');
  if(!origin || origin !== new URL(request.url).origin) return json({ok:false,message:'Please submit your request from this website.'},403);
  const contentType=request.headers.get('content-type')||'';
  if(!contentType.includes('application/json') && !contentType.includes('application/x-www-form-urlencoded'))return json({ok:false,message:'Unsupported request format.'},415);
  let input;
  try{input=await readBody(request);}catch(error){return json({ok:false,message:error.message==='too_large'?'Your request is too long.':'Please check your request and try again.'},error.message==='too_large'?413:400);}
  const {value,errors}=validateDemo(input);
  if(Object.keys(errors).length)return json({ok:false,errors,message:'Please check the highlighted fields.'},422);
  const now=Date.now(),ip=request.headers.get('cf-connecting-ip')||'local';
  // Short-lived abuse protection. Store no submitted contact details.
  for(const [key,entry] of attempts)if(now-entry.since>WINDOW)attempts.delete(key);
  const entry=attempts.get(ip)||{since:now,count:0};
  if(entry.count>=4)return json({ok:false,message:'Please wait a few minutes before sending another request.'},429,{'Retry-After':'600'});
  if(attempts.size>=2000&&!attempts.has(ip))attempts.delete(attempts.keys().next().value);
  entry.count++;attempts.set(ip,entry);
  try {
    const response=await fetcher(ENDPOINT,{
      method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','Referer':SITE},
      body:JSON.stringify({email:value.email,phone:value.phone,'Request details':value.details,_replyto:value.email,_subject:'Demo request — Spotlight Society',_template:'table',_url:SITE}),
      signal:AbortSignal.timeout(15_000),
    });
    let result;try{result=await response.json();}catch{return json({ok:false,message:'Your request could not be confirmed. Please email joe@spotlightsociety.org directly.'},502);}
    const activation=/activat|confirm.*email|verify.*email/i.test(String(result.message||''));
    if(!response.ok || activation || !(result.success===true || result.success==='true'))return json({ok:false,message:'Your request could not be sent right now. Please email joe@spotlightsociety.org directly.'},503);
    return json({ok:true,message:'Request sent. We’ll get in touch to arrange your demo.'});
  } catch {
    return json({ok:false,message:'We couldn’t confirm delivery. Please email joe@spotlightsociety.org before trying again.'},502);
  }
}
