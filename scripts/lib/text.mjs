// Text extraction shared by the verify scripts. Pulls every visible run of copy out of an HTML
// document so the archived Webflow page can be compared, word for word, with the built page.
import * as cheerio from 'cheerio';

const BLOCK = new Set([
  'address', 'article', 'aside', 'blockquote', 'body', 'dd', 'details', 'div', 'dl', 'dt', 'figcaption',
  'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'li', 'main', 'nav', 'ol', 'p',
  'section', 'summary', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul', 'label', 'button',
]);

// Zero-width characters (Webflow spacer paragraphs use U+200D), NBSP and runs of whitespace.
export const normalize = (s) =>
  s
    .replace(/[​-‍﻿]/g, '')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export function load(html) {
  const $ = cheerio.load(html);
  $('script, style, noscript, template').remove();
  $('br').replaceWith(' ');
  return $;
}

// Every contiguous run of inline text inside block elements under `root`.
export function textRuns($, root) {
  const runs = [];
  const walk = (el) => {
    let run = '';
    const flush = () => {
      const t = normalize(run);
      if (t.length > 1) runs.push(t);
      run = '';
    };
    const contents = $(el).contents();
    // A container with no loose text of its own (e.g. a row of links) holds separate items.
    const hasOwnText = contents.toArray().some((n) => n.type === 'text' && normalize(n.data));
    contents.each((_, node) => {
      if (node.type === 'text') run += node.data;
      else if (node.type === 'tag' && BLOCK.has(node.tagName)) {
        flush();
        walk(node);
      } else if (node.type === 'tag') {
        if ($(node).find([...BLOCK].join(',')).length) {
          flush();
          walk(node);
        } else {
          run += $(node).text();
          if (!hasOwnText) flush();
        }
      }
    });
    flush();
  };
  $(root).each((_, el) => walk(el));
  return runs;
}

// Whole visible text of a built page, normalised, for substring checks.
export function pageText($, selector = 'body') {
  const parts = [];
  $(selector).each((_, el) => parts.push(textRuns($, el).join(' | ')));
  return normalize(parts.join(' | '));
}
