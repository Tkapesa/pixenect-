import { Link } from 'react-router-dom';
import FollowUs from './FollowUs';

const FOOTER_COLUMNS = [
  {
    title: 'Popular services',
    links: [
      { label: 'Web Development', to: '/services/web-development' },
      { label: 'Web Design', to: '/services/ui-ux-design' },
      { label: 'Brand Identity', to: '/services/brand-identity' },
      { label: 'Growth & SEO', to: '/services/growth-seo' },
      { label: 'Content Strategy', to: '/services/content-strategy', spark: true },
      { label: 'All services', href: '/#services', arrow: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Services', href: '/#services' },
      { label: 'How we work', href: '/#process' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'About', to: '/about' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Quick links',
    links: [
      { label: 'Strategy call', href: 'mailto:info@pixenect.com?subject=Strategy%20Call', spark: true },
      { label: 'Project process', to: '/process' },
      { label: 'WhatsApp', href: 'https://wa.me/905428861113', external: true },
      { label: 'Email us', href: 'mailto:info@pixenect.com' },
      { label: 'Call us', href: 'tel:+905428861113' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

function FooterLink({ link }) {
  const className = 'group inline-flex items-center gap-1.5 text-[13px] outline-none transition-colors duration-200 hover:text-white';
  const content = (
    <>
      <span className="link-sweep">{link.label}</span>
      {link.spark && <span className="text-[10px] text-magenta" aria-hidden="true">✦</span>}
      {link.arrow && (
        <span
          className="text-fg-secondary transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-fg"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </>
  );

  if (link.to) return <Link to={link.to} className={className}>{content}</Link>;
  return (
    <a
      href={link.href}
      className={className}
      {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {content}
    </a>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t-[0.5px] border-hairline-soft bg-ink font-mono text-fg">
      <section
        aria-label="Footer navigation"
        className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-3"
      >
        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="mb-5 text-xs font-normal uppercase tracking-[0.14em] text-fg-muted">{column.title}</h3>
            <ul className="grid list-none grid-cols-2 gap-x-6 gap-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </section>

      <FollowUs />

      <div className="border-t-[0.5px] border-hairline-soft">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-6 text-[11px] uppercase tracking-[0.12em] text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Pixenect. All rights reserved.</span>
          <span>Istanbul · Worldwide</span>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
