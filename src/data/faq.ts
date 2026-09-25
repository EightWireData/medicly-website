// FAQ copy, verbatim from the Webflow /faq page. Answers are HTML (the source used <br><br> breaks).
export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: 'What is Medicly?',
    a: 'Medicly is a data sharing application that allows the healthcare sector to access primary care data faster and more securely than before.<br><br>To improve access to primary care data, Medicly automates the steps required to pull data from Practice Management Systems and meet security and governance requirements out of the box. This allows analysts in the health system to access the data needed to improve health analytics. <br><br>Medicly connects to all major Practice management Systems in New Zealand and is built on Eightwire’s data sharing platform to meet government and sector security and privacy requirements.',
  },
  {
    q: 'Who are Eightwire?',
    a: 'Eightwire is an innovative data sharing platform built in New Zealand. Eightwire’s focus is to make data sharing between enterprises as simple and secure as possible. Starting in 2015, Eightwire began rolling out the Social Sector Data Exchange (DX) as a platform that allows NGOs and government agencies to share operational data securely. Currently Eightwire is powering data sharing between over 80 enterprises in the public and private sectors, with a focus on healthcare, social services and law enforcement. <br><br>Eightwire’s innovation comes from a processing engine that learns from data structures and can translate data between data systems. This allows it to connect to and move data between databases, files and clouds in a fraction of the time normally required. At the same time, Eightwire is optimised for cross-enterprise data sharing with built in security and governance controls.',
  },
  {
    q: 'What is the difference between Eightwire and Medicly?',
    a: 'Medicly is a software application that uses Eightwire’s platform to operate. This allows Medicly to use Eightwire’s proven technologies to improve the delivery of healthcare in Aotearoa.',
  },
  {
    q: 'What is a data exchange?',
    a: 'A data exchange is a platform or system that allows organizations to share, exchange, or transfer data with one another. This can be done through various means such as file transfer, APIs, or a web-based interface. Data exchanges are used in a variety of industries and applications, such as health care, finance, and transportation, to improve efficiency, reduce costs, and facilitate collaboration. Data exchanges can also be used for data sharing among different organizations, governments and citizens. These enable the sharing of data with a common standard and security protocols to ensure the privacy and security of the data.',
  },
  {
    q: 'How is the data exchange secure?',
    a: 'All data that passes through Medicly is encrypted at rest and in transit. This means that not even the staff at Medicly or Eightwire can see the data moving through the system. Eightwire meets both the NZISM security requirements for SENSITIVE data sharing and SOC 2 so it is as secure as you can get.',
  },
  {
    q: 'Is a high standard of technical capability required to use it?',
    a: 'Only modest technical capability is needed to operate it, making it suitable for use by large and small organisations.',
  },
];

// The Webflow /terms-and-conditions page is a copy of the FAQ accordion where only the first answer
// was replaced with T&C clauses (including a stray sentence fragment at the end). Carried over as-is;
// flagged in migration/owner-review.md.
export const termsFirstAnswer =
  '1.1 These Terms apply to your use of the Website. By accessing and using the Website: a you agree to these Terms; and b where your access and use is on behalf of another person (e.g. a company), you confirm that you are authorised to, and do in fact, agree to these Terms on that person’s behalf and that, by agreeing to these Terms on that person’s behalf, that person is bound by these Terms.<br><br>1.2 If you do not agree to these Terms, you are not authorised to access and use the Website, and you must immediately stop doing so. healthcare networks to perform flexible and frequent Population Health assessments, GP/Doctor Practice Performance assessments and extract dashboard insights through their reporting and analytics tools.';
