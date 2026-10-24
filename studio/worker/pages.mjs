import { galleryResponse, thumbnailResponse } from '../lib/gallery-source.mjs';
import { submitDemo } from '../lib/demo-request.mjs';

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    const method = path === '/api/demo' ? 'POST' : 'GET';
    if (['/api/demo', '/api/gallery', '/api/gallery/thumbnail'].includes(path)) {
      if (request.method !== method) return new Response('Method not allowed', { status: 405, headers: { Allow: method } });
      if (path === '/api/demo') return submitDemo(request);
      if (path === '/api/gallery/thumbnail') return thumbnailResponse(request);
      return galleryResponse();
    }
    if (path.startsWith('/api/')) return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  },
};
