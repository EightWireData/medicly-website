// Headline figures used on the homepage and /about-us.
// Medicly runs on Eightwire's platform, so these are Eightwire's published figures
// (eightwire.io, "Trusted to handle high-stakes data", checked October 2026).
// They replace the Webflow-era numbers (80+ / 4000 per second / 3.5b per month / 80%), which
// were unsourced and inconsistent with each other — see migration/owner-review.md.
export const stats = [
  { label: 'TRUSTED BY', value: '100+', text: 'Public and private organisations exchange data on our platform' },
  { label: 'PROVEN', value: '10+', text: 'Years making data sharing between enterprises simple and secure' },
  // From the FAQ: "Eightwire meets both the NZISM security requirements for SENSITIVE data sharing and SOC 2".
  { label: 'SECURE', value: 'SOC 2', text: 'Audited, and meets NZISM requirements for sensitive data sharing' },
  { label: 'FAST', value: '20 min', text: 'As little as it takes to connect and begin exchanging data' },
];
