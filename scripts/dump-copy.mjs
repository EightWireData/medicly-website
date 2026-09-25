// Dev helper: prints the visible copy of an archived page, one text run per line.
// Usage: node scripts/dump-copy.mjs about-us.html
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, textRuns } from './lib/text.mjs';

const file = process.argv[2] ?? 'index.html';
const html = await readFile(fileURLToPath(new URL(join('../migration/snapshot/', file), import.meta.url)), 'utf8');
const $ = load(html);
const sel = process.argv[3] ?? 'body';
for (const r of textRuns($, $(sel))) console.log(r);
