// Proves the copy survived the migration: every visible run of text in each archived Webflow
// page (migration/snapshot) must appear in the matching built page (dist). Run after `npm run build`.
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, snapshotFile, distFile } from './lib/site.mjs';
import { load, textRuns, pageText } from './lib/text.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const SNAPSHOT = join(root, 'migration', 'snapshot');
const DIST = join(root, 'dist');

// Webflow-only UI that is intentionally not carried over (forms became mailto links, hidden elements).
const HIDDEN = [
  '.w-form', // form fields, labels, success + error messages (forms replaced by mailto)
  '.w-condition-invisible',
  '.w-dyn-empty',
  '[style*="display:none"]',
  '.loader',
].join(', ');

// Strings that are deliberately different in the new site. Each needs a reason.
const ALLOW = {
  chrome: new Set([
    'Log in', // hidden at every width on the live site
    '© Eightwire 2023', // copyright year now follows the build year
    '© Eightwire 2024',
    '© Eightwire 2025',
  ]),
};

const readHtml = async (dir, file) => load(await readFile(join(dir, file), 'utf8'));

function snapshotMain($) {
  return $('body > *').not(':has(.navbar)').not('.navbar').not('.footer-section-template').not(HIDDEN);
}

// Non-overlapping occurrences of `needle` in `hay`.
const count = (hay, needle) => {
  let n = 0;
  for (let i = hay.indexOf(needle); i !== -1; i = hay.indexOf(needle, i + needle.length)) n++;
  return n;
};

// Runs from the archive that are missing — or appear fewer times — in the build. Counting matters:
// a phrase used twice on a Webflow page must still appear twice, or a dropped block goes unnoticed.
function missingRuns(snapshotRuns, haystack, allow) {
  const snapshotText = snapshotRuns.join(' | ');
  const out = [];
  for (const r of new Set(snapshotRuns)) {
    if (allow.has(r)) continue;
    const need = count(snapshotText, r);
    const have = count(haystack, r);
    if (have < need) out.push(have ? `${r}  [${have} of ${need} occurrences]` : r);
  }
  return out;
}

let problems = 0;
const report = (label, missing) => {
  if (!missing.length) return console.log(`ok   ${label}`);
  problems += missing.length;
  console.log(`MISS ${label} — ${missing.length} run(s) not found:`);
  for (const m of missing) console.log(`       · ${m.length > 140 ? m.slice(0, 140) + '…' : m}`);
};

async function checkPage(path, snapFile, builtFile, allow = new Set()) {
  const built = join(DIST, builtFile);
  if (!existsSync(built)) return report(path, [`(built page ${builtFile} does not exist)`]);
  const $s = await readHtml(SNAPSHOT, snapFile);
  $s(HIDDEN).remove();
  const runs = textRuns($s, snapshotMain($s));
  const $d = await readHtml(DIST, builtFile);
  report(path, missingRuns(runs, pageText($d, 'main'), allow));
}

async function checkChrome() {
  const $s = await readHtml(SNAPSHOT, 'index.html');
  $s(HIDDEN).remove();
  const $d = await readHtml(DIST, 'index.html');
  for (const [label, sSel, dSel] of [
    ['nav', '.navbar', 'header.site-nav'],
    ['footer', '.footer-section-template', 'footer.site-footer'],
  ]) {
    report(`(${label})`, missingRuns(textRuns($s, $s(sSel)), pageText($d, dSel), ALLOW.chrome));
  }
}

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}
for (const p of PAGES) await checkPage(p, snapshotFile(p), distFile(p));
await checkPage('/404', '404.html', '404.html');
await checkChrome();
console.log(problems ? `\n${problems} missing run(s)` : '\nAll archived copy is present in the build.');
process.exit(problems ? 1 : 0);
