import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import SharedHeader from './SharedHeader';
import footerLogo from './assets/background-removed.svg';

const SERVICES = [
  { num: '01', title: 'Software & Digital Solutions', summary: 'Websites and applications built to convert, not just load.', problem: 'Your site looks fine but is not turning the right visitors into leads or customers.', outcome: 'A conversion path engineered around how your business actually wins.', to: '/services/web-development' },
  { num: '02', title: 'Creative & Design', summary: 'A brand and interface built to be trusted at first glance.', problem: 'Your identity does not match the credibility of the business behind it.', outcome: 'A visual system that holds together across your site, deck, and product.', to: '/services/brand-identity' },
  { num: '03', title: 'Marketing & Growth', summary: 'Traffic that turns into revenue, not just visits.', problem: 'Traffic or ad spend is not converting because the system underneath it is not built to close.', outcome: 'Marketing tied to an actual result you can point to.', to: '/services/growth-seo' },
  { num: '04', title: 'Production & Content', summary: 'Content built to be used, not just published once.', problem: 'Your content looks good in isolation but does not work across the business.', outcome: 'A library your team can deploy across the site, ads, and social.', to: '/services/content-strategy' },
];

const FAQS = [
  { q: 'What does Pixenect actually do day to day?', a: 'We bring strategy, brand, design, development, marketing, and content together around one business goal. Depending on what you need, we can own one discipline or the connected system.' },
  { q: 'Do you work with early-stage founders or only established businesses?', a: 'Both. We help founders build credibility quickly and help established businesses untangle a digital presence that has stalled. We will be direct about fit, scope, and what is realistic.' },
  { q: 'Why hire one team instead of a freelancer for each piece?', a: 'A freelancer may cost less per hour, but separate vendors create handoffs where context gets lost. One team means the brand, site, and growth plan start from the same brief and one group owns the result.' },
  { q: 'How is this different from hiring a bigger branding studio?', a: 'We are not competing on pedigree or a beautiful handoff. The team that shapes the direction also builds and improves what ships, so you do not need to find another partner to make the work real.' },
  { q: 'How long does a typical project take?', a: 'Timing depends on scope and how quickly decisions can be made. We work in focused delivery cycles with clear milestones, and we will give you a practical timeline before work begins.' },
  { q: 'What do you need from us during the project?', a: 'A clear decision-maker, access to the current site and analytics, and timely feedback. We structure the work so your team can stay involved without having to manage every task.' },
  { q: 'What happens after launch?', a: 'We can hand over a clean, documented system or stay involved to improve conversion, content, and performance. The right model depends on what your team needs next.' },
  { q: 'How much does this cost?', a: 'There is no useful price list without knowing the problem. Book a strategy call and we will clarify the work, the priorities, and the investment before asking you to commit.' },
];

const PROCESS_STEPS = [
  ['01', 'Discovery', 'We align on the business problem, audience, constraints, and the result that matters.'],
  ['02', 'Direction', 'We turn the findings into a clear position, structure, and delivery plan.'],
  ['03', 'Build', 'Design, development, content, and QA move together in focused cycles.'],
  ['04', 'Launch + growth', 'We ship, learn from real behavior, and keep improving what brings in business.'],
];

const SECTION_MAP = { Home: 'home', Services: 'services', 'Our Work': 'process', About: 'about', Contact: 'contact' };

function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [openFaq, setOpenFaq] = useState(null);
  const [openService, setOpenService] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.35;
      let closest = Infinity;
      let activeKey = null;
      Object.entries(SECTION_MAP).forEach(([key, id]) => {
        const element = document.getElementById(id);
        if (!element) return;
        const distance = Math.abs(element.getBoundingClientRect().top - threshold);
        if (distance < closest) { closest = distance; activeKey = key; }
      });
      if (activeKey) setActiveNav(activeKey);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.setAttribute('data-revealed', 'true'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (item) => {
    document.getElementById(SECTION_MAP[item])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveNav(item);
  };

  return (
    <main className="app-root">
      <SharedHeader mode="home" activeNav={activeNav} onNavigateSection={scrollToSection} />

      <section className="vhero rewrite-hero" id="home" aria-label="Hero">
        <video className="vhero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="/hero-video-web.mp4" type="video/mp4" />
        </video>
        <div className="hero-grid" aria-hidden="true" />
        <div className="vhero-content" data-reveal>
          <div className="vhero-eyebrow"><span className="vhero-dot" aria-hidden="true" />Digital partner for founders &amp; growing businesses</div>
          <h1 className="vhero-heading"><span className="vhero-thin">One team.</span><span className="vhero-serif"> Every discipline.</span><span className="vhero-thin"> Built to grow your business.</span></h1>
          <p className="vhero-sub">Pixenect designs, builds, and grows your website, brand, and marketing as one connected system. Nothing gets lost between a designer, a developer, and a marketer who have never spoken to each other.</p>
          <div className="vhero-actions"><a className="vhero-btn-solid" href="#contact">Book a Strategy Call <i className="ti ti-arrow-up-right" aria-hidden="true" /></a><button type="button" className="vhero-btn-outline" onClick={() => scrollToSection('Our Work')}>See How We Work <i className="ti ti-arrow-down" aria-hidden="true" /></button></div>
          <p className="hero-note">One point of contact. One connected system. One team accountable for what ships.</p>
        </div>
        <button className="scroll-hint" type="button" aria-label="Scroll to services" onClick={() => scrollToSection('Services')}><span className="scroll-hint-bar" aria-hidden="true" /><span className="scroll-hint-text">SCROLL</span></button>
      </section>

      <section className="svc-section rewrite-services" id="services">
        <div className="svc-intro" data-reveal><div className="eyebrow">What we do</div><h2>One team.<br />Every discipline.</h2><p>Most businesses hire separately for design, development, marketing, and content, then spend more time managing handoffs than getting results. We bring all four in-house and work from the same brief.</p></div>
        <div className="svc-list">{SERVICES.map((service, index) => <article className={`svc-item rewrite-service${openService === index ? ' svc-item--open' : ''}`} key={service.num} data-reveal style={{ '--reveal-delay': `${index * 90}ms` }}><button type="button" className="svc-item-header" onClick={() => setOpenService(openService === index ? null : index)} aria-expanded={openService === index}><span className="svc-item-num">{service.num}</span><span className="svc-item-titles"><span className="svc-item-title">{service.title}</span><span className="svc-item-sub">{service.summary}</span></span><span className="svc-item-toggle" aria-hidden="true"><i className={`ti ${openService === index ? 'ti-minus' : 'ti-plus'}`} /></span></button>{openService === index && <div className="svc-item-body rewrite-service-body"><div><p className="service-problem"><strong>The problem:</strong> {service.problem}</p><p><strong>The outcome:</strong> {service.outcome}</p></div><a href="#contact" className="svc-start-btn">Book a Strategy Call <i className="ti ti-arrow-up-right" aria-hidden="true" /></a></div>}</article>)}</div>
      </section>

      <section className="why-section rewrite-why" id="about"><div className="why-header"><div className="eyebrow" data-reveal>Why one team</div><h2 data-reveal>The cost of hiring separately isn't the invoice. It's the handoffs.</h2><p data-reveal>Every handoff is a place your brief gets reinterpreted or lost. We keep design, build, and growth under one team so what ships is what was meant to convert.</p></div><div className="why-grid rewrite-why-grid">{['One agency, zero gaps', 'Built to last', 'Transparent process', 'Accountable for results'].map((title, index) => <article className="why-card" data-reveal style={{ '--reveal-delay': `${index * 70}ms` }} key={title}><div className="why-card-top"><span className="why-card-n">0{index + 1}</span><i className={`ti ${['ti-arrows-shuffle', 'ti-chart-dots-3', 'ti-eye', 'ti-target-arrow'][index]}`} aria-hidden="true" /></div><h3 className="why-card-title">{title}</h3><p className="why-card-desc">{['Software, design, branding, and marketing handled in-house. No outsourced context or missed handoffs.', 'We make decisions for the long term, not just for launch day.', 'Clear milestones, visible progress, and one point of contact throughout the engagement.', 'The same team owns the direction, the build, and the work that follows launch.'][index]}</p></article>)}</div></section>

      <section className="work-section process-section" id="process"><div className="work-head" data-reveal><div className="eyebrow">How we work</div><h2>Here's exactly what happens.</h2><p className="process-intro">No mystery handoffs. No disappearing act after the proposal. The work moves from a shared problem to a shipped system in four clear stages.</p></div><div className="process-grid rewrite-process-grid">{PROCESS_STEPS.map(([number, title, description], index) => <article className="work-card process-card" data-reveal style={{ '--reveal-delay': `${index * 90}ms` }} key={number}><span className="process-number">{number}</span><h3 className="work-card-title">{title}</h3><p className="work-card-desc">{description}</p></article>)}</div></section>

      <section className="faq-section rewrite-faq" id="faq"><div className="faq-grid"><div className="faq-left" data-reveal><div className="eyebrow">Questions worth asking</div><h2>Before you hire us.</h2><p>Good work starts with clear expectations. Here are the answers we want you to have before the first call.</p></div><div className="faq-right" data-reveal>{FAQS.map((item, index) => <div className={`faq-item${openFaq === index ? ' open' : ''}`} key={item.q}><button type="button" className="faq-q" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{item.q}</span><i className={`ti ${openFaq === index ? 'ti-minus' : 'ti-plus'}`} aria-hidden="true" /></button>{openFaq === index && <div className="faq-a"><p>{item.a}</p></div>}</div>)}</div></div></section>

      <section className="cta-section rewrite-cta" id="contact"><div className="cta-inner" data-reveal><div className="eyebrow cta-ew">Start with clarity</div><h2 className="cta-h">Ready to stop managing four vendors and start with one team?</h2><p className="cta-blurb">Book a 30-minute strategy call. You will leave with a clear view of what your digital presence needs, whether or not you decide to work with us.</p><a href="mailto:hello@pixenect.com?subject=Strategy%20Call" className="cta-contact-btn">Book a Strategy Call <i className="ti ti-arrow-up-right" aria-hidden="true" /></a><div className="cta-details"><a href="mailto:hello@pixenect.com" className="cta-detail">hello@pixenect.com</a><span className="cta-bull" aria-hidden="true">·</span><a href="tel:+905338866227" className="cta-detail">+90 533 886 6227</a></div></div></section>

      <footer className="site-footer"><div className="footer-cta-band" data-reveal><div className="footer-cta-text"><p className="footer-cta-eyebrow">Digital partner</p><h2 className="footer-cta-heading">Design, build, and growth<br />as one system.</h2></div><a href="#contact" className="footer-cta-action">Book a Strategy Call <i className="ti ti-arrow-up-right" aria-hidden="true" /></a></div><div className="footer-shell" data-reveal><section className="footer-brand-col" aria-label="Company details and contact"><div className="footer-brand-name" aria-label="Pixenect logo"><img src={footerLogo} alt="Pixenect logo" width="194" height="45" className="footer-brand-logo" /></div><p className="footer-brand-copy">A single, accountable team for businesses that need their digital presence to bring in business.</p><div className="footer-contact-lines"><a href="mailto:hello@pixenect.com">hello@pixenect.com</a><span className="footer-contact-sep" aria-hidden="true">|</span><a href="tel:+905338866227">+90 533 886 6227</a></div></section><section className="footer-links-grid" aria-label="Footer navigation"><div className="footer-link-col"><h3>Explore</h3><a href="#services">Services</a><a href="#process">How We Work</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></div><div className="footer-link-col"><h3>Services</h3><Link to="/services/ui-ux-design">Web Design</Link><Link to="/services/web-development">Web Development</Link><Link to="/services/brand-identity">Brand Identity</Link><Link to="/services/growth-seo">Growth &amp; SEO</Link></div><div className="footer-link-col"><h3>Company</h3><Link to="/about">About Pixenect</Link><Link to="/process">Project Process</Link><Link to="/privacy">Privacy Policy</Link></div></section></div><div className="footer-bottom"><div className="footer-copy">&copy; 2026 PIXENECT. ALL RIGHTS RESERVED.</div><div className="footer-socials" aria-label="Social links"><a href="#" aria-label="Instagram"><i className="ti ti-brand-instagram" aria-hidden="true" /></a><a href="#" aria-label="LinkedIn"><i className="ti ti-brand-linkedin" aria-hidden="true" /></a></div></div></footer>
    </main>
  );
}

export default App;
