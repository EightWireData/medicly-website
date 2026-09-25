// Contact details and third-party IDs, exactly as published on the Webflow site.
export const EMAIL = 'hello@medicly.co.nz';
export const PHONE_DISPLAY = '(64) 4-979-8838';
export const PHONE_HREF = 'tel:(64)4-979-8838';
export const ADDRESS = 'Level 3, 2/12 Allen St, Wellington 6011';
export const MAP_URL = 'https://goo.gl/maps/EdjwgsbyQ5zEuNLbA';

export const SOCIAL = {
  twitter: 'https://twitter.com/eightwiredata',
  youtube: 'https://www.youtube.com/@eightwire485',
  linkedin: 'https://www.linkedin.com/company/mediclynz/',
};

export const INTERCOM_APP_ID = 'ymbkb5nq';
export const GOOGLE_SITE_VERIFICATION = 'Jww9dgcgONRXotIanwB0QkScVzYIC-2v0T_Lb8Bdois';

// Webflow forms were replaced with mailto links (see migration/owner-review.md).
// `fields` pre-fills the email body with the old form's field labels.
export const mailto = (subject: string, fields: string[] = []) => {
  const body = fields.length ? `&body=${encodeURIComponent(fields.map((f) => `${f}: `).join('\n'))}` : '';
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}${body}`;
};
