const ORIGIN = new URL('https://joelabbasi.github.io/spotlight-society/humanitarian-tracker/');
const CANONICAL = 'humanitariantracker.org';
const PUBLIC_HOSTS = new Set([CANONICAL, `www.${CANONICAL}`]);

export default {
  async fetch(request) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', {status:405, headers:{Allow:'GET, HEAD'}});
    }
    const url = new URL(request.url);
    const forwarded = request.headers.get('x-forwarded-host')?.split(',')[0].trim().toLowerCase();
    const host = PUBLIC_HOSTS.has(url.hostname) ? url.hostname : PUBLIC_HOSTS.has(forwarded) ? forwarded : url.hostname;
    if (host === `www.${CANONICAL}` || (PUBLIC_HOSTS.has(host) && url.protocol === 'http:')) {
      return Response.redirect(`https://${CANONICAL}${url.pathname}${url.search}`, 301);
    }
    const upstream = new URL(url.pathname.replace(/^\/+/, ''), ORIGIN);
    if (upstream.origin !== ORIGIN.origin || !upstream.pathname.startsWith(ORIGIN.pathname)) {
      return new Response('Not found', {status:404});
    }
    upstream.search = url.search;
    const stats = url.pathname === '/data/stats.json';
    if (stats) upstream.searchParams.set('_snapshot', String(Math.floor(Date.now()/60000)));
    try {
      const init = {method:request.method, redirect:'manual', headers:{Accept:request.headers.get('accept') || '*/*'}};
      let response = await fetch(upstream, init);
      if (response.status === 404 && url.pathname !== '/404.html') {
        const fallback = await fetch(new URL('404.html', ORIGIN), init);
        if (fallback.ok) {
          return new Response(request.method === 'HEAD' ? null : fallback.body, {status:404, headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
        }
      }
      const headers = new Headers(response.headers);
      headers.delete('set-cookie');
      headers.delete('content-length');
      const location = headers.get('location');
      if (location) {
        const destination = new URL(location, upstream);
        if (destination.origin !== ORIGIN.origin || !destination.pathname.startsWith(ORIGIN.pathname)) {
          return new Response('Temporarily unavailable. Please try again shortly.', {status:502});
        }
        headers.set('location', `${url.origin}/${destination.pathname.slice(ORIGIN.pathname.length)}${destination.search}`);
      }
      if (stats) headers.set('cache-control', 'no-store');
      if (PUBLIC_HOSTS.has(host) && url.protocol === 'https:') headers.set('strict-transport-security','max-age=31536000');
      return new Response(request.method === 'HEAD' || [204,205,304].includes(response.status) ? null : response.body, {status:response.status, headers});
    } catch {
      return new Response('Temporarily unavailable. Please try again shortly.', {status:503, headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
    }
  }
};
