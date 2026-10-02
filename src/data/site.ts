// Contact details and third-party IDs, exactly as published on the Webflow site.
// Medicly is run by the Eightwire team; enquiries go to Eightwire support.
export const EMAIL = 'support@eight-wire.com';
export const AUTHOR = 'Eightwire team';
export const PHONE_DISPLAY = '(64) 4-979-8838';
export const PHONE_HREF = 'tel:(64)4-979-8838';

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
