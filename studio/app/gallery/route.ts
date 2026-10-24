import gallery from '../../site/gallery.html?raw';
export function GET() { return new Response(gallery,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-cache'}}); }
