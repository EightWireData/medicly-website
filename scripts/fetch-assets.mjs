// Downloads every original asset the live site references (images, SVGs, Lottie JSON) from the
// Webflow CDN into the repo, and writes migration/asset-manifest.json (CDN URL -> local file).
// Responsive "-p-500" style variants, fonts, Webflow CSS/JS are skipped: Astro regenerates sizes.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CDN } from './lib/site.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const SNAPSHOT = join(root, 'migration', 'snapshot');
const SITE = `${CDN}/63eadf9b14690627c29218ca`;

// Background images referenced only from the Webflow CSS on classes that are actually used.
const CSS_BACKGROUNDS = [
  `${SITE}/63eadf9b146906595a92197a_Values%20Pattern.svg`,
  `${SITE}/63eadf9b146906ca79921974_Background%20Shape.svg`,
];

// Files that must keep a stable public URL (favicons, social cards).
const PUBLIC_RASTER = new Set(['favicon-32x32.png', 'medicly-icon-web-clip.png', 'medicly-open-graph.png', 'medicly-opengraph-01.png']);

function trimUnbalanced(url) {
  let u = url.replace(/[,;]+$/, '');
  while (u.endsWith(')') && (u.match(/\(/g) || []).length < (u.match(/\)/g) || []).length) u = u.slice(0, -1);
  return u;
}

// Webflow upload names that say nothing about the image.
const RENAMES = {
  '1677650738635.jpeg': 'geoffrey-sayer.jpeg',
  'untitled-design-9.png': 'jason-gleason.png',
  'andy-e-1.png': 'andy-ellis.png',
  'national-cancer-institute-nfvdkihxylu-unsplash-2.jpg': 'national-cancer-institute-nfvdkihxylu-unsplash.jpg',
};

function cleanName(url) {
  const base = decodeURIComponent(url.split('/').pop());
  const name = base
    .replace(/^([0-9a-f]{24}_)+/, '')
    .toLowerCase()
    .replace(/[\s_()]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-\./g, '.')
    .replace(/^-/, '');
  return RENAMES[name] ?? name;
}

function destFor(name) {
  const ext = name.split('.').pop();
  const raster = ['png', 'jpg', 'jpeg', 'webp'].includes(ext);
  if (raster && !PUBLIC_RASTER.has(name)) return join('src', 'assets', 'images', name);
  if (ext === 'json') return join('public', 'media', 'lottie', name);
  return join('public', 'media', name);
}

const urls = new Set(CSS_BACKGROUNDS);
for (const file of await readdir(SNAPSHOT)) {
  if (!file.endsWith('.html')) continue;
  const html = (await readFile(join(SNAPSHOT, file), 'utf8')).replaceAll('&amp;', '&');
  for (const m of html.matchAll(/https:\/\/cdn\.prod\.website-files\.com\/[^"'\s<>]+/g)) {
    const u = trimUnbalanced(m[0]);
    if (/-p-\d+|\/css\/|\/js\/|\.woff2?$|\.ttf$|webflow\./.test(u)) continue;
    urls.add(u);
  }
}

const manifest = [];
const seen = new Map();
let failed = 0;
for (const url of [...urls].sort()) {
  const name = cleanName(url);
  const file = destFor(name).replaceAll('\\', '/');
  if (seen.has(file)) throw new Error(`Name collision: ${url} and ${seen.get(file)} -> ${file}`);
  seen.set(file, url);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length) throw new Error('empty file');
    await mkdir(join(root, file, '..'), { recursive: true });
    await writeFile(join(root, file), buf);
    manifest.push({ url, file, bytes: buf.length });
    console.log(`ok   ${file.padEnd(78)} ${buf.length}`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${url}: ${err.message}`);
  }
}

await writeFile(join(root, 'migration', 'asset-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${manifest.length}/${urls.size} assets downloaded`);
process.exit(failed ? 1 : 0);
