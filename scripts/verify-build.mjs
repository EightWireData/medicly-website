// Structural checks on the built site (run after `npm run build`):
//  1. every URL from the old Webflow sitemap exists in dist/ and in the new sitemap
//  2. nothing still points at Webflow (CDN, scripts, form endpoints)
//  3. every internal link and asset reference resolves to a built file
//  4. every downloaded Webflow asset is used, or is listed below as intentionally dropped
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import { ORIGIN, PAGES as ARCHIVED_PAGES, REMOVED_PAGES, distFile } from './lib/site.mjs';

// Webflow URLs still served; removed ones must be gone and redirected instead.
const PAGES = ARCHIVED_PAGES.filter((p) => !(p in REMOVED_PAGES));

const root = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(root, 'dist');

// Webflow assets we downloaded but deliberately don't use, and why.
const DROPPED = {
  // Removed with the team pages and the video series (team members have left).
  'src/assets/images/andy-ellis.png': 'team photo; team section removed',
  'src/assets/images/jason-gleason.png': 'team photo; team section removed',
  'src/assets/images/jason-ep1.png': 'video thumbnail; video series removed',
  'src/assets/images/ep2-thumb.png': 'video thumbnail; video series removed',
  'src/assets/images/ep3-thumb.png': 'video thumbnail; video series removed',
  'src/assets/images/video-thumbnail.jpg': 'nav video card; video series removed',
  'public/media/linkedin-icon-fill.svg': 'team LinkedIn icon; team section removed',
  'public/media/lottie/felix-loader.json': 'page-loader animation that was hidden (display:none) on the live site',
  'public/media/values-pattern.svg': 'decorative background behind the home features; replaced by the grid-line/glow backgrounds',
  'public/media/background-shape.svg': 'decorative shape behind the /product image; replaced by a mint radial glow',
  'public/media/chevron-down.svg': 'FAQ chevron; replaced by the rotating "+" accordion icon',
  'public/media/chevron-brand.svg': '"View on Google Maps" chevron; replaced by the → link arrow',
  'public/media/chevron-brand-light.svg': 'email-card chevron; replaced by the → link arrow',
  'public/media/arrow-small-right-svgrepo-com.svg': '"Find out more" arrow; replaced by the → link arrow',
  'public/media/download.svg': 'blog "Back" chevron; replaced by ←',
};

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`FAIL ${msg}`);
};
const ok = (msg) => console.log(`ok   ${msg}`);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const files = await walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

// 1. URL parity
const missingPages = PAGES.filter((p) => !existsSync(join(DIST, distFile(p))));
missingPages.length ? missingPages.forEach((p) => fail(`page missing from build: ${p}`)) : ok(`all ${PAGES.length} kept Webflow URLs built`);
const redirects = await readFile(join(root, 'public', '_redirects'), 'utf8');
for (const [p, to] of Object.entries(REMOVED_PAGES)) {
  if (existsSync(join(DIST, distFile(p)))) fail(`removed page still built: ${p}`);
  const covered = redirects.split('\n').some((line) => {
    const [from, target] = line.trim().split(/\s+/);
    return target === to && (from === p || (from?.endsWith('/*') && p.startsWith(from.slice(0, -1))));
  });
  if (!covered) fail(`no redirect ${p} -> ${to} in public/_redirects`);
}
ok(`${Object.keys(REMOVED_PAGES).length} removed pages absent and redirected`);
if (!existsSync(join(DIST, '404.html'))) fail('404.html missing');

const sitemapXml = (await Promise.all(files.filter((f) => /sitemap-\d+\.xml$/.test(f)).map((f) => readFile(f, 'utf8')))).join('\n');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const expected = PAGES.map((p) => (p === '/' ? `${ORIGIN}/` : ORIGIN + p));
const notInSitemap = expected.filter((u) => !sitemapUrls.includes(u));
const extraInSitemap = sitemapUrls.filter((u) => !expected.includes(u));
notInSitemap.forEach((u) => fail(`sitemap is missing ${u}`));
extraInSitemap.forEach((u) => fail(`sitemap has unexpected ${u}`));
if (!notInSitemap.length && !extraInSitemap.length) ok(`sitemap lists exactly the ${expected.length} kept Webflow URLs`);

// 2. No Webflow leftovers
const textFiles = files.filter((f) => /\.(html|css|js|xml|txt)$/.test(f));
let leftovers = 0;
for (const f of textFiles) {
  const s = await readFile(f, 'utf8');
  for (const needle of ['website-files.com', 'webflow.com', 'data-wf-', 'googletagmanager']) {
    if (s.includes(needle)) {
      leftovers++;
      fail(`${relative(DIST, f)} still references ${needle}`);
    }
  }
}
if (!leftovers) ok('no Webflow / dead GTM references in dist');

// 3. Internal links + assets resolve
const resolveLocal = (url) => {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  if (clean === '/' || clean === '') return join(DIST, 'index.html');
  const direct = join(DIST, clean);
  if (existsSync(direct) && !clean.endsWith('/')) return direct;
  if (existsSync(direct + '.html')) return direct + '.html';
  if (existsSync(join(direct, 'index.html'))) return join(direct, 'index.html');
  return null;
};
const used = new Set();
let broken = 0;
for (const f of htmlFiles) {
  const $ = cheerio.load(await readFile(f, 'utf8'));
  const refs = new Set();
  $('[href], [src], [srcset], [data-lottie]').each((_, el) => {
    for (const attr of ['href', 'src', 'data-lottie']) {
      const v = $(el).attr(attr);
      if (v) refs.add(v);
    }
    const srcset = $(el).attr('srcset');
    if (srcset) srcset.split(',').forEach((part) => refs.add(part.trim().split(/\s+/)[0]));
  });
  // Social images and canonicals are absolute URLs on the production origin.
  $('meta[property="og:image"], meta[name="twitter:image"], link[rel="canonical"], meta[property="og:url"]').each((_, el) => {
    const v = $(el).attr('content') ?? $(el).attr('href');
    if (v?.startsWith(ORIGIN)) refs.add(v.slice(ORIGIN.length) || '/');
    else if (v) fail(`${relative(DIST, f)} has a non-production absolute URL: ${v}`);
  });
  for (const ref of refs) {
    if (!ref.startsWith('/') || ref.startsWith('//')) continue;
    const target = resolveLocal(ref);
    if (!target) {
      broken++;
      fail(`${relative(DIST, f)} → ${ref} does not resolve`);
    } else used.add(relative(DIST, target).replaceAll('\\', '/'));
  }
}
if (!broken) ok(`all internal links and assets resolve across ${htmlFiles.length} pages`);

// 4. Every downloaded asset is used (or intentionally dropped)
const manifest = JSON.parse(await readFile(join(root, 'migration', 'asset-manifest.json'), 'utf8'));
const cssAndJs = (await Promise.all(textFiles.filter((f) => /\.(css|js)$/.test(f)).map((f) => readFile(f, 'utf8')))).join('\n');
const srcRefs = (await Promise.all((await walk(join(root, 'src'))).map((f) => readFile(f, 'utf8')))).join('\n');
let unused = 0;
for (const { file } of manifest) {
  if (DROPPED[file]) continue;
  const name = file.split('/').pop();
  const isPublic = file.startsWith('public/');
  const inUse = isPublic
    ? used.has(file.replace(/^public\//, '')) || cssAndJs.includes(file.replace(/^public/, ''))
    : srcRefs.includes(name); // src/assets images are hashed by Astro; check they're imported
  if (!inUse) {
    unused++;
    fail(`asset not used and not listed as dropped: ${file}`);
  }
}
if (!unused) ok(`all ${manifest.length} Webflow assets used (${Object.keys(DROPPED).length} intentionally dropped, see DROPPED)`);

console.log(failures ? `\n${failures} problem(s)` : '\nBuild checks passed.');
process.exit(failures ? 1 : 0);
