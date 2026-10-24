import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = `${root}dist/pages`;
await rm(output, { recursive: true, force: true });
await mkdir(`${output}/gallery`, { recursive: true });
await cp(`${root}public`, output, { recursive: true });
const homepage = (await readFile(`${root}site/home.html`, 'utf8')).replaceAll('https://spotlight-studio-preview.sugarybell9.chatgpt.site', 'https://www.spotlightsociety.org');
await writeFile(`${output}/index.html`, homepage);
await cp(`${root}site/gallery.html`, `${output}/gallery/index.html`);
await writeFile(`${output}/404.html`, '<!doctype html><html lang="en"><meta charset="utf-8"><title>Page not found — Spotlight Society</title><body><h1>Page not found</h1><a href="/">Back to Spotlight Society</a></body></html>');
await build({ entryPoints: [`${root}worker/pages.mjs`], outfile: `${output}/_worker.js`, bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
await writeFile(`${output}/_routes.json`, JSON.stringify({ version: 1, include: ['/api/*'], exclude: [] }, null, 2));
console.log('Cloudflare Pages build ready in dist/pages');
