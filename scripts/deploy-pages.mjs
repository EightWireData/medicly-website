// Publishes a preview of the site to GitHub Pages (gh-pages branch of the `origin` remote).
// The site normally lives at a domain root, but a project Pages site is served under
// /<repo>/, so this builds into a separate folder and prefixes every root-relative URL.
// Canonical and social URLs are left pointing at the production site (www.medicly.co.nz).
//
// Usage: npm run deploy:pages            (base path defaults to /medicly)
//        node scripts/deploy-pages.mjs /other-base
import { execSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const BASE = (process.argv[2] ?? '/medicly').replace(/\/$/, '');
const root = fileURLToPath(new URL('..', import.meta.url));
const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: 'inherit' });

const prefix = (url) => (url.startsWith('/') && !url.startsWith('//') && !url.startsWith(BASE + '/') ? BASE + url : url);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// 1. Fresh production build, copied to a temp folder so dist/ stays deployable to the real domain.
run('npm run build');
const out = mkdtempSync(join(tmpdir(), 'medicly-pages-'));
cpSync(join(root, 'dist'), out, { recursive: true });

// 2. Rebase URLs.
for (const file of walk(out)) {
  if (file.endsWith('.html')) {
    const $ = cheerio.load(readFileSync(file, 'utf8'));
    for (const attr of ['href', 'src', 'data-lottie']) {
      $(`[${attr}]`).each((_, el) => {
        if (el.tagName === 'link' && $(el).attr('rel') === 'canonical') return;
        $(el).attr(attr, prefix($(el).attr(attr)));
      });
    }
    $('[srcset]').each((_, el) => {
      const v = $(el)
        .attr('srcset')
        .split(',')
        .map((part) => {
          const [url, ...rest] = part.trim().split(/\s+/);
          return [prefix(url), ...rest].join(' ');
        })
        .join(', ');
      $(el).attr('srcset', v);
    });
    // Preview copy shouldn't compete with the real site in search results.
    $('head').append('<meta name="robots" content="noindex">');
    writeFileSync(file, $.html());
  } else if (file.endsWith('.css')) {
    writeFileSync(file, readFileSync(file, 'utf8').replace(/url\(\/(?!\/)/g, `url(${BASE}/`));
  }
}
// GitHub Pages: serve folders that start with "_" (like _astro) as-is; drop Netlify/Cloudflare-only files.
writeFileSync(join(out, '.nojekyll'), '');
for (const f of ['_redirects', '_headers']) rmSync(join(out, f), { force: true });

// 3. Push the folder as the gh-pages branch.
const remote = execSync('git remote get-url origin', { cwd: root }).toString().trim();
run('git init -q -b gh-pages', out);
run('git add -A', out);
run('git -c user.name="Medicly deploy" -c user.email="noreply@eight-wire.com" commit -q -m "Deploy preview to GitHub Pages"', out);
run(`git push -f ${remote} gh-pages`, out);
rmSync(out, { recursive: true, force: true });
console.log(`\nDeployed to the gh-pages branch of ${remote} (base path ${BASE}).`);
