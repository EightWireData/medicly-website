// Shared facts about the live Webflow site, used by the snapshot, asset and verify scripts.
export const ORIGIN = 'https://www.medicly.co.nz';
export const CDN = 'https://cdn.prod.website-files.com';

// Every URL in the live sitemap.xml (paths are kept identical in the new site).
export const PAGES = [
  '/',
  '/about-us',
  '/product',
  '/blog',
  '/contact',
  '/get-started',
  '/faq',
  '/privacy-policy',
  '/terms-and-conditions',
  '/partners',
  '/technical-overview',
  '/videos',
  '/team/andy-ellis',
  '/team/jason-gleason',
  '/job/intermediate-engineer',
  '/category/data-sharing',
  '/category/privacy',
  '/blog/companies-are-using-and-sharing-your-data-but-is-it-safe',
  '/blog/how-information-sharing-can-help-heal-the-healthcare-system',
  '/blog/sharing-data-securely-fast-tracks-better-health-outcomes',
];

// Snapshot filename for a page path, e.g. /team/andy-ellis -> team__andy-ellis.html
export const snapshotFile = (path) => (path === '/' ? 'index.html' : `${path.slice(1).replaceAll('/', '__')}.html`);

// Built file in dist/ for a page path (astro build.format: 'file').
export const distFile = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);
