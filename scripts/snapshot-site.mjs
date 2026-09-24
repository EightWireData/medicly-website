// Archives the live Webflow site (HTML for every page, the stylesheet and the sitemap)
// into migration/snapshot/. This is the source of truth for verbatim copy.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ORIGIN, CDN, PAGES, snapshotFile } from './lib/site.mjs';

const OUT = fileURLToPath(new URL('../migration/snapshot/', import.meta.url));
const UA = 'Mozilla/5.0 (Medicly migration archiver)';

const targets = [
  ...PAGES.map((p) => ({ url: ORIGIN + p, file: snapshotFile(p) })),
  { url: `${ORIGIN}/this-page-does-not-exist`, file: '404.html', allowStatus: 404 },
  { url: `${ORIGIN}/sitemap.xml`, file: 'sitemap.xml' },
  { url: `${CDN}/63eadf9b14690627c29218ca/css/medicly-nz.webflow.c85f396b4.min.css`, file: 'medicly-nz.webflow.css' },
];

await mkdir(OUT, { recursive: true });
let failed = 0;
for (const t of targets) {
  try {
    const res = await fetch(t.url, { headers: { 'user-agent': UA }, redirect: 'follow' });
    if (!res.ok && res.status !== t.allowStatus) throw new Error(`HTTP ${res.status}`);
    const body = await res.text();
    await writeFile(join(OUT, t.file), body, 'utf8');
    console.log(`ok   ${t.file.padEnd(72)} ${body.length} bytes`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${t.file}: ${err.message}`);
  }
}
console.log(`\n${targets.length - failed}/${targets.length} archived`);
process.exit(failed ? 1 : 0);
