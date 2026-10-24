import homepage from '../site/home.html?raw';
export function GET() { return new Response(homepage,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-cache'}}); }
