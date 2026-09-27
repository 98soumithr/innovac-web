// Fails on raw colour values in components, layouts and pages (CLAUDE.md rule 4).
// Colours must come from the @theme tokens in src/styles/global.css.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src/components', 'src/layouts', 'src/pages'];
const CHECKS = [
  // #rgb, #rgba, #rrggbb, #rrggbbaa — but not fragment links like href="#rfq".
  [/(?<![\w&/"'=])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi, 'hex colour'],
  [/\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/gi, 'colour function'],
];

function* walk(dir) {
  let entries = [];
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(astro|ts|tsx|js|css)$/.test(p)) yield p;
  }
}

const problems = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      for (const [re, why] of CHECKS) {
        for (const m of line.matchAll(re)) {
          problems.push(`${relative('.', file)}:${i + 1}: ${why} "${m[0]}"`);
        }
      }
    });
  }
}

if (problems.length) {
  console.error(
    `lint-tokens: ${problems.length} raw colour(s). Use a token class from src/styles/global.css.\n` +
      problems.map((p) => `  ${p}`).join('\n'),
  );
  process.exit(1);
}
console.log('lint-tokens: ok');
