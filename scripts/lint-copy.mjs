// Fails when banned words appear in src/ or public/ (CLAUDE.md rules 1 and 7):
// any description of the forming process, and marketing superlatives.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src', 'public'];
const TEXT = /\.(astro|ts|tsx|js|mjs|md|mdx|ya?ml|json|svg|html|txt|css)$/i;

const BANNED = [
  // Forming process: never mention how products are made.
  [/\bvacuum[\s-]*(formed|forming|form)?\b/i, 'forming process ("vacuum")'],
  [/\bwet[\s-]*(forming|formed|form)\b/i, 'forming process ("wet forming")'],
  [/\bslurr(y|ies)\b/i, 'forming process ("slurry")'],
  [/\b(suction|dewater(ing|ed)?|felting)\b/i, 'forming process'],
  // Superlatives and filler (design-system §8).
  [/\bworld[\s-]class\b/i, 'superlative ("world-class")'],
  // `leading-*` is a Tailwind class (line height), not copy.
  [/(?<![-\w])leading(?![-\w])/i, 'superlative ("leading")'],
  [/\bbest[\s-]in[\s-]class\b/i, 'superlative ("best-in-class")'],
  [/\bcutting[\s-]edge\b/i, 'filler ("cutting-edge")'],
  [/\bstate[\s-]of[\s-]the[\s-]art\b/i, 'filler ("state-of-the-art")'],
  [/\bone[\s-]stop\b/i, 'filler ("one-stop")'],
];

function* walk(dir) {
  let entries = [];
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

const problems = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const rel = relative('.', file);
    for (const [re, why] of BANNED) {
      if (re.test(rel)) problems.push(`${rel}: file name — ${why}`);
    }
    if (!TEXT.test(file)) continue;
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      for (const [re, why] of BANNED) {
        const m = line.match(re);
        if (m) problems.push(`${rel}:${i + 1}: "${m[0]}" — ${why}`);
      }
    });
  }
}

if (problems.length) {
  console.error(`lint-copy: ${problems.length} problem(s)\n` + problems.map((p) => `  ${p}`).join('\n'));
  process.exit(1);
}
console.log('lint-copy: ok');
