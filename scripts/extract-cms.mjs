// One-off: converts the Webflow CMS items (blog posts, team members, jobs, categories) in the
// archived snapshot into Astro content files under src/content/. Copy is carried over verbatim;
// only Webflow markup is cleaned (empty ZWJ spacer paragraphs, heading levels, CDN image URLs).
// Re-running overwrites the generated files.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { normalize } from './lib/text.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const SNAP = join(root, 'migration', 'snapshot');
const CONTENT = join(root, 'src', 'content');
const manifest = JSON.parse(await readFile(join(root, 'migration', 'asset-manifest.json'), 'utf8'));

const load = async (file) => cheerio.load(await readFile(join(SNAP, file), 'utf8'));
const localAsset = (url) => {
  const hit = manifest.find((m) => m.url === url.replace(/\s/g, '%20'));
  if (!hit) throw new Error(`Asset not in manifest: ${url}`);
  return hit.file;
};
const relFrom = (fromDir, file) => relative(fromDir, join(root, file)).replaceAll('\\', '/');
const yamlStr = (s) => JSON.stringify(s); // JSON strings are valid YAML scalars
const isoDate = (s) => {
  const d = new Date(`${s} 12:00 UTC`);
  if (Number.isNaN(+d)) throw new Error(`Bad date: ${s}`);
  return d.toISOString().slice(0, 10);
};

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' });

/** Clean Webflow rich text and convert it to Markdown. Headings are mapped under the page H1. */
function richTextToMarkdown($, el, fromDir, { headingMap }) {
  const $el = $(el);
  // Webflow spacer paragraphs contain only U+200D.
  $el.find('p').each((_, p) => {
    if (!normalize($(p).text()) && !$(p).find('img').length) $(p).remove();
  });
  // Headings: unwrap <strong>, remap levels.
  $el.find('h1, h2, h3, h4, h5, h6').each((_, h) => {
    const $h = $(h);
    $h.find('strong').each((_, s) => $(s).replaceWith($(s).html()));
    const to = headingMap[h.tagName];
    if (to === 'p') h.tagName = 'p';
    else if (to) h.tagName = to;
  });
  // Figures -> plain images pointing at the local copies.
  $el.find('figure').each((_, f) => {
    const img = $(f).find('img');
    const src = relFrom(fromDir, localAsset(img.attr('src')));
    $(f).replaceWith(`<p><img src="${src}" alt="${img.attr('alt') ?? ''}"></p>`);
  });
  $el.find('[style]').removeAttr('style');
  $el.find('[id]').removeAttr('id');
  let md = turndown.turndown($el.html());
  // A <br><br> gap would become a blank line (a new paragraph) in Markdown; keep it inline.
  md = md.replace(/ {2}\n {2}\n/g, '<br><br>');
  md = md.replace(/‍/g, '').replace(/\n{3,}/g, '\n\n').trim();
  return md + '\n';
}

const write = async (file, text) => {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, text, 'utf8');
  console.log(`wrote ${relative(root, file)}`);
};

// ---------- categories ----------
{
  const $ = await load('blog.html');
  const cats = [];
  $('a[href^="/category/"]').each((_, a) => {
    const slug = $(a).attr('href').split('/').pop();
    const name = normalize($(a).text());
    if (name && !cats.some((c) => c.slug === slug)) cats.push({ slug, name });
  });
  for (const c of cats) await write(join(CONTENT, 'categories', `${c.slug}.json`), JSON.stringify({ name: c.name }, null, 2) + '\n');
}

// ---------- team ----------
{
  const $list = await load('about-us.html');
  for (const item of $list('a[href^="/team/"]').toArray()) {
    const slug = $list(item).attr('href').split('/').pop();
    const card = $list(item).closest('.w-dyn-item');
    const $ = await load(`team__${slug}.html`);
    const block = $('.author-block');
    const dir = join(CONTENT, 'team');
    const fm = [
      '---',
      `name: ${yamlStr(normalize(block.find('h5').text()))}`,
      `role: ${yamlStr(normalize(block.find('.author-job-title').text()))}`,
      `photo: ${yamlStr(relFrom(dir, localAsset(block.find('img').attr('src'))))}`,
      `background: ${yamlStr($list(item).attr('style').replace('background-color:', '').trim())}`,
      `linkedin: ${yamlStr(card.find('a[href*="linkedin"]').attr('href'))}`,
      '---',
      '',
      normalize(block.find('p').text()),
      '',
    ].join('\n');
    await write(join(dir, `${slug}.md`), fm);
  }
}

// ---------- blog posts ----------
{
  const slugs = [
    'sharing-data-securely-fast-tracks-better-health-outcomes',
    'companies-are-using-and-sharing-your-data-but-is-it-safe',
    'how-information-sharing-can-help-heal-the-healthcare-system',
  ];
  for (const slug of slugs) {
    const $ = await load(`blog__${slug}.html`);
    const dir = join(CONTENT, 'blog');
    const section = $('.blog-section');
    const title = normalize(section.find('h3').first().text());
    const header = section.find('.blog-header-wrapper img');
    const author = section.find('.blog-content a[href^="/team/"]');
    const body = richTextToMarkdown($, section.find('.w-richtext').get(0), dir, {
      headingMap: { h2: 'h2', h3: 'h2', h4: 'h2', h5: 'h2', h6: 'h3' },
    });
    const fm = [
      '---',
      `title: ${yamlStr(title)}`,
      `summary: ${yamlStr(normalize(section.find('.blog-content > p').first().text()))}`,
      `date: ${isoDate(normalize(author.find('.blog-detail').text()))}`,
      `author: ${yamlStr(author.attr('href').split('/').pop())}`,
      `category: ${yamlStr(section.find('.blog-content a[href^="/category/"]').attr('href').split('/').pop())}`,
      `image: ${yamlStr(relFrom(dir, localAsset(header.attr('src'))))}`,
      '---',
      '',
      body,
    ].join('\n');
    await write(join(dir, `${slug}.md`), fm);
  }
}

// ---------- jobs ----------
{
  const slug = 'intermediate-engineer';
  const $ = await load(`job__${slug}.html`);
  const dir = join(CONTENT, 'jobs');
  const details = {};
  $('.job-detail-grid > div').each((_, d) => {
    details[normalize($(d).find('.title-grey-400').text())] = normalize($(d).find('h5').text());
  });
  const body = richTextToMarkdown($, $('.job-section .w-richtext').get(0), dir, {
    headingMap: { h4: 'h2', h6: 'p' },
  });
  const fm = [
    '---',
    `title: ${yamlStr(normalize($('.header h1').text()))}`,
    `summary: ${yamlStr(normalize($('.header p').text()))}`,
    `jobTitle: ${yamlStr(details['JOB TITLE'])}`,
    `location: ${yamlStr(details['LOCATION'])}`,
    `basis: ${yamlStr(details['employment basıs'])}`,
    '---',
    '',
    body,
  ].join('\n');
  await write(join(dir, `${slug}.md`), fm);
}
