// Screenshots of every built route (plus /styleguide/) into .shots/, using the installed Chrome.
//
//   npm run shots                         # every route at 390 and 1440
//   npm run shots -- --widths=390,768,1280,1440 --only=/
//   npm run shots -- --mockup             # also shoot docs/reference/homepage-mockup.html
//   npm run shots -- --no-build           # reuse the existing dist/
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);
const widths = String(args.widths ?? '390,1440').split(',').map(Number);
const only = args.only ? String(args.only).split(',') : null;
const PORT = 4322;
const OUT = '.shots';

if (!args['no-build']) {
  const r = spawnSync('npx', ['astro', 'build'], {
    stdio: 'inherit',
    env: { ...process.env, BASE_PATH: '', PUBLIC_SHOW_TODOS: 'true' },
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// Routes = every dist/**/index.html that isn't a redirect page.
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (name === 'index.html') yield p;
  }
}
let routes = [...walk('dist')]
  .filter((f) => !/http-equiv="refresh"/i.test(readFileSync(f, 'utf8').slice(0, 600)))
  .map((f) => '/' + f.slice('dist/'.length).replace(/index\.html$/, ''))
  .sort();
if (only) routes = routes.filter((r) => only.includes(r));

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  stdio: 'ignore',
  env: { ...process.env, BASE_PATH: '' },
});
const base = `http://localhost:${PORT}`;
for (let i = 0; i < 60; i++) {
  try {
    await fetch(base + '/');
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 250));
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const slug = (r) => (r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '__'));

async function shoot(target, name, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Settle scroll-driven reveals so every section is visible in the capture.
  await page.addStyleTag({ content: '.reveal{animation:none!important;opacity:1!important;transform:none!important}' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const file = join(OUT, `${name}@${width}.png`);
  await page.screenshot({ path: file, fullPage: true });
  await page.close();
  const notes = [];
  if (overflow > 0) notes.push(`horizontal overflow ${overflow}px`);
  if (errors.length) notes.push(`console errors: ${errors.join(' | ')}`);
  console.log(`${file}${notes.length ? '  ⚠ ' + notes.join('; ') : ''}`);
}

try {
  for (const r of routes) for (const w of widths) await shoot(base + r, slug(r), w);
  if (args.mockup) {
    const mock = pathToFileURL(resolve('docs/reference/homepage-mockup.html')).href;
    await shoot(mock, 'mockup', 1440);
  }
} finally {
  await browser.close();
  server.kill();
  spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'ignore' });
}
if (!existsSync(OUT)) process.exit(1);
