import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import SharedHeader from './SharedHeader';
import footerLogo from './assets/background-removed.svg';

const SERVICES = [
  { num: '01', tag: 'SOFTWARE-DIGITAL',  title: 'Software',    sub: '& Digital Solutions', desc: 'Custom web applications, mobile apps, e-commerce platforms, and cloud solutions built with cutting-edge technology. From MVP to enterprise scale, we engineer software that performs.',        to: '/services/web-development'  },
  { num: '02', tag: 'CREATIVE-DESIGN',   title: 'Creative',    sub: '& Design',            desc: 'Brand identity, UI/UX design, motion graphics, and visual storytelling that captivates your audience. Every pixel crafted to strengthen your brand and convert visitors.',                   to: '/services/brand-identity'   },
  { num: '03', tag: 'DIGITAL-MARKETING', title: 'Marketing',   sub: '& Growth',            desc: 'Data-driven marketing strategies, SEO, social media management, and performance advertising that delivers measurable results. We turn traffic into revenue.',                              to: '/services/growth-seo'       },
  { num: '04', tag: 'PRODUCTION',        title: 'Production',  sub: '& Content',           desc: 'Professional video production, photography, podcast production, and live event coverage. High-quality content that tells your story and engages your audience.',                          to: '/services/content-strategy' },
];

const WHY_ITEMS = [
  { num: '01', stat: '120+', label: 'PROJECTS DELIVERED', title: 'One Agency, Zero Gaps',    desc: 'Software, design, branding, marketing — all handled in-house. No outsourcing, no missed handoffs, no context lost between vendors. One team that sees your business from every angle.' },
  { num: '02', stat: '7-day', label: 'SPRINT CYCLES',    title: 'Built to Last',             desc: 'Every project is crafted for quality, engineered for scale, and designed to outperform the brief. We reject shortcuts and build things that endure.' },
  { num: '03', stat: '98%',  label: 'CLIENT SATISFACTION', title: 'Transparent Process',    desc: 'Agile sprints with weekly demos, clear milestones, and real-time progress tracking. You are never in the dark about where your project stands.' },
  { num: '04', stat: '3x',   label: 'AVG. CLIENT ROI',  title: 'Measurable Results',        desc: 'We measure everything — conversions, rankings, load times, bounce rates. If it does not move the needle for your business, we rethink the approach.' },
];

const FAQS = [
  { q: 'What services does Pixenect offer?',                         a: 'We offer end-to-end digital services including web design, web development, brand identity, SEO, e-commerce, content strategy, digital marketing, UX auditing, and AI variant testing. Each service is tailored to your specific business needs.' },
  { q: 'How long does a typical project take?',                      a: 'A typical web design and development project lasts 8-12 weeks. We operate on 7-day sprint cycles with weekly demos and clear milestones so you always know exactly where things stand.' },
  { q: 'Do you work with startups or only established businesses?',  a: 'We work with businesses at every stage — from early-stage startups building their first product to established brands undergoing digital transformation. The size of your ambition matters more than the size of your company.' },
  { q: 'How do you handle SEO and performance optimisation?',        a: 'SEO is built into every project from day one. We deliver Lighthouse-audited builds with top marks in performance, accessibility, SEO, and best practices — not an afterthought.' },
  { q: 'What does a typical engagement look like?',                  a: 'We start with a discovery call, scope the project in detail, and kick off with a 50% deposit. From there, 7-day sprints with live demos keep you fully informed and in control at every step.' },
];

const CLIENTS = ['Audi', 'Volvo', 'Samsung', 'Microsoft', 'Shopify', 'AWS', 'Meta', 'Google', 'Adobe', 'Figma', 'HubSpot', 'Stripe', 'GitHub', 'Webflow'];

const WORK_ITEMS = [
  {
    id: '01',
    category: 'Web Platform',
    title: 'Atlas Commerce Suite',
    desc: 'Rebuilt a fragmented storefront into a unified commerce platform with faster checkout, cleaner information architecture, and stronger conversion paths.',
    result: '+31% Conversion Rate',
    tech: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    id: '02',
    category: 'Brand + UI',
    title: 'Nova Finance Dashboard',
    desc: 'Redesigned a complex fintech dashboard into a calmer, data-first interface with role-based views and a scalable design system.',
    result: '12,000+ Active Users',
    tech: ['Figma', 'Design System', 'TypeScript'],
  },
  {
    id: '03',
    category: 'Growth',
    title: 'Pulse Health',
    desc: 'Launched a full-funnel growth program combining technical SEO, conversion-focused landing pages, and performance campaign iteration.',
    result: '3x Qualified Leads',
    tech: ['GA4', 'SEO', 'A/B Testing'],
  },
  {
    id: '04',
    category: 'E-Commerce',
    title: 'Vanta Lifestyle',
    desc: 'Delivered a mobile-first retail experience with improved product discovery, streamlined checkout flows, and stronger post-purchase retention.',
    result: '+44% Mobile Revenue',
    tech: ['Shopify', 'Klaviyo', 'Stripe'],
  },
];

function useCounter(end, duration) {
  const dur = duration || 2200;
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return undefined;
    const startTime = performance.now();
    let raf;
    const frame = (now) => {
      const progress = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * end));
      if (progress < 1) { raf = requestAnimationFrame(frame); }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [started, end, dur]);

  return { count, ref };
}

function StatItem({ end, suffix, label, desc }) {
  const { count, ref } = useCounter(end);
  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-item-num">{count}{suffix}</div>
      <div className="stat-item-label">{label}</div>
      <p className="stat-item-desc">{desc}</p>
    </div>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [openFaq, setOpenFaq] = useState(null);
  const [openService, setOpenService] = useState(null);
  const videoRef = useRef(null);

  const sectionMap = { Home: 'home', Services: 'services', 'Our Work': 'our-work', About: 'about', Contact: 'contact' };

  useEffect(() => {
    const onNavScroll = () => {
      const threshold = window.innerHeight * 0.35;
      let activeKey = null;
      let closest = Infinity;
      Object.entries(sectionMap).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const dist = Math.abs(el.getBoundingClientRect().top - threshold);
        if (dist < closest) { closest = dist; activeKey = key; }
      });
      if (activeKey) setActiveNav(activeKey);
    };
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
    return () => window.removeEventListener('scroll', onNavScroll);
  }, []);

  useEffect(() => {
    const animated = document.querySelectorAll('[data-reveal]');
    if (!animated.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    animated.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (item) => {
    const el = document.getElementById(sectionMap[item]);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveNav(item);
  };

  return (
    <main className="app-root">

      <SharedHeader mode="home" activeNav={activeNav} onNavigateSection={scrollToSection} />

      {/* VIDEO HERO */}
      <section className="vhero" id="home" aria-label="Hero">
        <video ref={videoRef} className="vhero-video" autoPlay muted loop playsInline preload="auto">
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-night-highway-with-car-lights-29-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-bokeh-city-lights-at-night-4130-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-city-4028-large.mp4" type="video/mp4" />
        </video>
        <div className="vhero-overlay" aria-hidden="true" />

        <div className="vhero-content" data-reveal>
          <div className="vhero-eyebrow">
            <span className="vhero-dot" aria-hidden="true" />
            Award-winning digital studio
          </div>
          <h1 className="vhero-heading">
            <span className="vhero-thin">We craft</span>
            <span className="vhero-serif"> digital experiences</span>
            <span className="vhero-thin"> that move people.</span>
          </h1>
          <p className="vhero-sub">
            Pixenect is a full-service digital agency building high-performance
            websites, brand identities, and growth strategies for ambitious
            businesses worldwide.
          </p>
          <div className="vhero-actions">
            <button type="button" className="vhero-btn-solid" onClick={() => scrollToSection('Services')}>
              Explore Services
            </button>
            <button type="button" className="vhero-btn-outline" onClick={() => scrollToSection('Our Work')}>
              View Our Work
            </button>
          </div>
          <div className="vhero-reviews">
            <span className="vhero-stars">★★★★★</span>
            <span>4.9 from 107+ reviews</span>
          </div>
        </div>

        <button className="scroll-hint" type="button" aria-label="Scroll down" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="scroll-hint-bar" aria-hidden="true" />
          <span className="scroll-hint-text">SCROLL</span>
        </button>
      </section>

      {/* SERVICES */}
      <section className="svc-section" id="services">
        <div className="svc-intro" data-reveal>
          <div className="eyebrow">What we do</div>
          <h2>One Partner.<br />Every Discipline.</h2>
          <p>From complex software integrations to brand identities, creative productions to growth campaigns — we bring every discipline in-house so your vision never gets lost in translation.</p>
        </div>
        <div className="svc-list">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.num}
              className={`svc-item${openService === i ? ' svc-item--open' : ''}`}
              data-reveal
              style={{ '--reveal-delay': `${i * 90}ms` }}
            >
              <button type="button" className="svc-item-header" onClick={() => setOpenService(openService === i ? null : i)} aria-expanded={openService === i}>
                <span className="svc-item-num">{svc.num}</span>
                <span className="svc-item-tag">// {svc.tag}</span>
                <span className="svc-item-titles">
                  <span className="svc-item-title">{svc.title}</span>
                  <span className="svc-item-sub">{svc.sub}</span>
                </span>
                <span className="svc-item-toggle" aria-hidden="true">
                  <i className={`ti ${openService === i ? 'ti-minus' : 'ti-plus'}`} />
                </span>
              </button>
              {openService === i && (
                <div className="svc-item-body">
                  <p>{svc.desc}</p>
                  <Link to={svc.to} className="svc-start-btn">
                    Start a Project <i className="ti ti-arrow-up-right" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-band" data-reveal>
        <StatItem end={120} suffix="+" label="PROJECTS DELIVERED"       desc="From startups to established brands, we have shipped products that drive real business results." />
        <div className="stats-sep" aria-hidden="true" />
        <StatItem end={3}   suffix="x" label="AVERAGE CLIENT ROI"       desc="Our clients see measurable returns through higher conversions, better rankings, and lower acquisition costs." />
        <div className="stats-sep" aria-hidden="true" />
        <StatItem end={98}  suffix=""  label="AVG. PERFORMANCE SCORE"   desc="Lighthouse-audited builds with top marks in performance, accessibility, SEO, and best practices." />
      </section>

      {/* CLIENTS */}
      <div className="clients-strip">
        <div className="clients-strip-label">TRUSTED BY INDUSTRY LEADERS</div>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[0, 1].map((ri) => (
              <div className="marquee-set" key={ri} aria-hidden={ri > 0}>
                {CLIENTS.map((name) => (
                  <span className="client-name" key={name}>{name}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY */}
      <section className="why-section" id="about">
        <div className="why-header" data-reveal>
          <div className="eyebrow">Why Pixenect</div>
          <h2>One Partner.<br />Every Discipline.</h2>
          <p>From complex software integrations to brand identities — we bring every discipline in-house so your vision never gets lost in translation between agencies.</p>
        </div>
        <div className="why-grid">
          {WHY_ITEMS.map((item) => (
            <div
              key={item.num}
              className="why-card"
              data-reveal
              style={{ '--reveal-delay': `${Number(item.num) * 70}ms` }}
            >
              <div className="why-card-top">
                <span className="why-card-n">{item.num}</span>
                <div>
                  <div className="why-card-stat">{item.stat}</div>
                  <div className="why-card-lbl">{item.label}</div>
                </div>
              </div>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section className="work-section" id="our-work">
        <div className="work-head" data-reveal>
          <div className="eyebrow">Selected Work</div>
          <h2>Projects that<br />speak for themselves.</h2>
        </div>
        <div className="work-grid">
          {WORK_ITEMS.map((item) => (
            <article
              key={item.id}
              className="work-card"
              data-reveal
              style={{ '--reveal-delay': `${Number(item.id) * 80}ms` }}
            >
              <div className="work-card-head">
                <span className="work-card-category">{item.category}</span>
                <a
                  href="#contact"
                  className="work-card-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('Contact');
                  }}
                >
                  View Case Study <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="work-card-info">
                <h3 className="work-card-title">{item.title}</h3>
                <p className="work-card-desc">{item.desc}</p>
                <div className="work-card-meta">
                  <span className="work-card-result">
                    <i className="ti ti-trending-up" aria-hidden="true" /> {item.result}
                  </span>
                  <div className="work-card-tech" aria-label="Project technologies">
                    {item.tech.map((techItem) => (
                      <span key={`${item.id}-${techItem}`} className="work-tech-tag">{techItem}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-grid" data-reveal>
          <div className="faq-left">
            <div className="eyebrow">Questions?</div>
            <h2>Frequently asked<br />questions</h2>
            <button type="button" className="faq-ask" onClick={() => scrollToSection('Contact')}>
              Ask us anything <i className="ti ti-arrow-up-right" aria-hidden="true" />
            </button>
          </div>
          <div className="faq-right">
            {FAQS.map((item, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <button type="button" className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  <span>{item.q}</span>
                  <i className={`ti ${openFaq === i ? 'ti-minus' : 'ti-plus'}`} aria-hidden="true" />
                </button>
                {openFaq === i && <div className="faq-a"><p>{item.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <div className="cta-inner" data-reveal>
          <div className="eyebrow cta-ew">Let&apos;s talk</div>
          <h2 className="cta-h">Let&apos;s build something<br />great.</h2>
          <a href="mailto:hello@pixenect.com" className="cta-contact-btn">
            CONTACT <i className="ti ti-arrow-up-right" aria-hidden="true" />
          </a>
          <div className="cta-details">
            <a href="tel:+905338866227" className="cta-detail">+90 533 886 6227</a>
            <span className="cta-bull" aria-hidden="true">·</span>
            <a href="mailto:hello@pixenect.com" className="cta-detail">hello@pixenect.com</a>
          </div>
          <p className="cta-blurb">
            Pixenect is a digital agency that designs, builds, and grows high-performance
            websites and digital products for ambitious businesses worldwide.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-shell" data-reveal>
          <section className="footer-brand-col" aria-label="Company details and contact">
            <div className="footer-brand-name" aria-label="Pixenect logo">
              <img src={footerLogo} alt="Pixenect logo" width="194" height="45" className="footer-brand-logo" />
            </div>
            <p className="footer-brand-copy">
              We design, build, and grow high-performance digital products for
              ambitious brands that want clarity, speed, and measurable results.
            </p>

            <form className="footer-subscribe" onSubmit={(e) => e.preventDefault()}>
              <input
                className="footer-email-input"
                type="email"
                placeholder="Enter your email"
                aria-label="Enter your email"
              />
              <button type="submit" className="footer-subscribe-btn">
                Subscribe <i className="ti ti-arrow-up-right" aria-hidden="true" />
              </button>
            </form>

            <div className="footer-contact-lines">
              <a href="mailto:hello@pixenect.com">hello@pixenect.com</a>
              <span className="footer-contact-sep" aria-hidden="true">|</span>
              <a href="tel:+905338866227">+90 533 886 6227</a>
            </div>
          </section>

          <section className="footer-links-grid" aria-label="Footer navigation">
            <div className="footer-link-col">
              <h3>Services</h3>
              <Link to="/services/ui-ux-design">Web Design</Link>
              <Link to="/services/web-development">Web Development</Link>
              <Link to="/services/brand-identity">Brand Identity</Link>
              <Link to="/services/growth-seo">Growth &amp; SEO</Link>
              <Link to="/services/ecommerce-solutions">E-Commerce</Link>
              <Link to="/services/content-strategy">Content Strategy</Link>
            </div>

            <div className="footer-link-col">
              <h3>Company</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('About'); }}>About</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('Services'); }}>Services</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('Our Work'); }}>Our Work</a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('.faq-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                FAQ
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('Contact'); }}>Contact</a>
            </div>

            <div className="footer-link-col">
              <h3>Get Started</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('Contact'); }}>Start a Project</a>
              <a href="mailto:hello@pixenect.com">Email Us</a>
              <a href="tel:+905338866227">Call Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('Home'); }}>Back to Top</a>
            </div>

            <div className="footer-link-col footer-link-col--legal">
              <h3>Legal</h3>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">&copy; 2026 PIXENECT. ALL RIGHTS RESERVED.</div>
          <div className="footer-socials" aria-label="Social links">
            <a href="#" aria-label="Facebook"><i className="ti ti-brand-facebook" aria-hidden="true" /></a>
            <a href="#" aria-label="Instagram"><i className="ti ti-brand-instagram" aria-hidden="true" /></a>
            <a href="#" aria-label="LinkedIn"><i className="ti ti-brand-linkedin" aria-hidden="true" /></a>
            <a href="#" aria-label="X"><i className="ti ti-brand-x" aria-hidden="true" /></a>
          </div>
        </div>
      </footer>

    </main>
  );
}

export default App;
