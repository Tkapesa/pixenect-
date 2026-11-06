import SharedHeader from './SharedHeader';
import SiteFooter from './components/SiteFooter';
import DotPageBackdrop from './components/DotPageBackdrop';
import './Terms.css';

const TERMS_SECTIONS = [
  {
    title: '1. Agreement to these terms',
    paragraphs: [
      'These terms describe the general conditions for using the Pixenect website and making enquiries about our services. By using this website, you agree to these terms. If you do not agree, please stop using the website.',
      'A signed proposal, statement of work, or other written agreement between you and Pixenect may set additional terms for a specific project. If it conflicts with this page, the project agreement applies to that project.',
    ],
  },
  {
    title: '2. Our website and services',
    paragraphs: [
      'Website content is provided for general information about Pixenect and our services. Service descriptions, examples, estimates, and timelines are not a binding offer and may change as we learn more about a project.',
      'The deliverables, schedule, responsibilities, fees, and acceptance process for any engagement will be agreed in writing before that work begins.',
    ],
  },
  {
    title: '3. Your responsibilities',
    paragraphs: [
      'When you contact us or work with us, you agree to provide accurate information and to ensure that materials you provide may lawfully be used for the project. You are responsible for reviewing and approving project materials and for meeting agreed feedback and payment dates.',
      'You must not misuse this website, interfere with its operation, attempt to gain unauthorised access, or use it in a way that violates applicable law or another person’s rights.',
    ],
  },
  {
    title: '4. Fees and payment',
    paragraphs: [
      'Fees, payment milestones, taxes, expenses, and any recurring charges will be stated in the applicable written project agreement. If a payment is overdue, any pause in work or other remedy will be handled as set out in that agreement and applicable law.',
    ],
  },
  {
    title: '5. Intellectual property',
    paragraphs: [
      'Pixenect and its licensors retain rights in the website, its design, text, graphics, and other materials, except for content identified as belonging to another party. You may view and use the website for personal or business evaluation, but may not reproduce or commercially exploit its materials without permission.',
      'Ownership and permitted use of project deliverables, working files, third-party assets, and materials supplied by you will be defined in the applicable project agreement.',
    ],
  },
  {
    title: '6. Third-party services and links',
    paragraphs: [
      'The website may link to third-party sites or services. Pixenect does not control those services and is not responsible for their content, availability, or terms. Your use of them is governed by their own policies.',
    ],
  },
  {
    title: '7. Disclaimers and liability',
    paragraphs: [
      'To the extent permitted by law, this website is provided on an “as available” basis. We do not guarantee that it will always be uninterrupted, error-free, or suitable for a particular purpose.',
      'Nothing in these terms limits liability where the law does not allow it to be limited. Any other limits or exclusions of liability for a project must be agreed in the relevant written project agreement.',
    ],
  },
  {
    title: '8. Suspension and termination',
    paragraphs: [
      'We may restrict access to the website where reasonably necessary to protect its security or operation, or to address unlawful or abusive use. Ending or suspending a project engagement is governed by the applicable project agreement.',
    ],
  },
  {
    title: '9. Privacy',
    paragraphs: [
      'These terms are not a complete privacy notice. Before collecting personal information, Pixenect should publish a separate notice explaining what information is collected, why it is used, how long it is kept, and how people can exercise their rights.',
    ],
  },
  {
    title: '10. Changes to these terms',
    paragraphs: [
      'We may update these website terms from time to time. The updated version will be posted on this page with a revised date. Changes to an active project agreement must be made in writing between the parties.',
    ],
  },
  {
    title: '11. Governing law and contact',
    paragraphs: [
      'The governing law, dispute forum, and registered business details must be confirmed in the final, legally reviewed version of these terms.',
      'For questions about these terms, contact Pixenect at info@pixenect.com.',
    ],
  },
];

function Terms() {
  return (
    <main className="app-root terms-page">
      <DotPageBackdrop variant="content-library" />
      <SharedHeader activeNav="" darkBackground />
      <section className="terms-content" aria-labelledby="terms-title">
        <p className="terms-eyebrow">Website information</p>
        <h1 id="terms-title">Terms of Service</h1>
        <p className="terms-updated">Draft for legal review · Updated October 15, 2026</p>
        <div className="terms-notice" role="note">
          This editable draft is for review and is not legal advice. Confirm the business details, governing law, privacy documentation, and project-specific terms with qualified counsel before publication.
        </div>
        <div className="terms-sections">
          {TERMS_SECTIONS.map((section) => (
            <section key={section.title} aria-labelledby={`terms-${section.title.slice(0, 2).replace('.', '')}`}>
              <h2 id={`terms-${section.title.slice(0, 2).replace('.', '')}`}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export default Terms;
