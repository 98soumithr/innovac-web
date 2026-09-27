// Minimal static server for dist/ that behaves like GitHub Pages: /dir → 301 /dir/, /dir/ → index.html,
// unknown paths → 404.html. Used by the Playwright tests.  node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const ROOT = 'dist';
const PORT = Number(process.argv[2] ?? 4400);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf',
};

createServer((req, res) => {
  const { pathname, search } = new URL(req.url ?? '/', 'http://x');
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, safe);
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!pathname.endsWith('/')) {
      res.writeHead(301, { Location: `${pathname}/${search}` }).end();
      return;
    }
    file = join(file, 'index.html');
  }
  let status = 200;
  if (!existsSync(file)) {
    status = 404;
    file = join(ROOT, '404.html');
  }
  res.writeHead(status, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
