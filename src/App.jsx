import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import logo from './assets/pixenect black logo.jpeg';
import heroSlideThreeBg from './assets/hero-slide-three.jpg';
import heroSlideFourBg from './assets/hero-slide-four.jpg';

function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroAutoplayDirection, setHeroAutoplayDirection] = useState(1);
  const navItems = ['Home', 'Services', 'Our Work', 'About', 'Teams'];
  const heroTrackRef = useRef(null);
  const heroScrollAnimationRef = useRef(null);
  const heroSlideCount = 2;
  const sectionMap = {
    Home: 'home',
    Services: 'services',
    'Our Work': 'our-work',
    About: 'about',
    Teams: 'teams',
  };

  const animateHeroScrollTo = (track, targetLeft, duration = 1400) => {
    if (heroScrollAnimationRef.current) {
      window.cancelAnimationFrame(heroScrollAnimationRef.current);
    }

    const startLeft = track.scrollLeft;
    const distance = targetLeft - startLeft;
    const startTime = performance.now();

    const easeInOutCubic = (t) => (t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      track.scrollLeft = startLeft + distance * eased;

      if (progress < 1) {
        heroScrollAnimationRef.current = window.requestAnimationFrame(step);
      }
    };

    heroScrollAnimationRef.current = window.requestAnimationFrame(step);
  };

  const goToHeroSlide = (index) => {
    const track = heroTrackRef.current;
    if (!track) return;

    const safeIndex = Math.max(0, Math.min(heroSlideCount - 1, index));
    const width = track.clientWidth;
    if (!width) return;

    animateHeroScrollTo(track, width * safeIndex);
  };

  const scrollHeroSlides = (direction) => {
    const track = heroTrackRef.current;
    if (!track) return;

    const width = track.clientWidth;
    if (!width) return;

    const currentIndex = Math.round(track.scrollLeft / width);
    let nextIndex = currentIndex + direction;

    if (nextIndex >= heroSlideCount) {
      nextIndex = Math.max(0, heroSlideCount - 2);
    }

    if (nextIndex < 0) {
      nextIndex = Math.min(heroSlideCount - 1, 1);
    }

    goToHeroSlide(nextIndex);
  };

  const getHeroSlideClass = (index, variantClass) => {
    const isActive = heroSlideIndex === index;
    return `hero hero-slide ${variantClass} ${isActive ? 'is-active' : ''}`;
  };

  useEffect(() => {
    const track = heroTrackRef.current;
    if (!track) return undefined;

    const handleScroll = () => {
      const width = track.clientWidth;
      if (!width) return;
      const currentIndex = Math.round(track.scrollLeft / width);
      setHeroSlideIndex(Math.max(0, Math.min(heroSlideCount - 1, currentIndex)));
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      track.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const track = heroTrackRef.current;
    if (!track) return undefined;

    const intervalId = window.setInterval(() => {
      const width = track.clientWidth;
      if (!width) return;

      let nextDirection = heroAutoplayDirection;
      let nextIndex = heroSlideIndex + nextDirection;

      if (nextIndex >= heroSlideCount) {
        nextDirection = -1;
        nextIndex = heroSlideIndex - 1;
      }

      if (nextIndex < 0) {
        nextDirection = 1;
        nextIndex = heroSlideIndex + 1;
      }

      setHeroAutoplayDirection(nextDirection);
      goToHeroSlide(nextIndex);
    }, 7000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [heroSlideIndex, heroAutoplayDirection]);

  useEffect(() => () => {
    if (heroScrollAnimationRef.current) {
      window.cancelAnimationFrame(heroScrollAnimationRef.current);
    }
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll(
      '.hero-slide .hero-eyebrow, .hero-slide h1, .hero-slide p, .hero-slide .hero-badge-title, .hero-slide .hero-badge-desc, .hero-slide .hero-btn-w, .hero-slide .hero-btn-o',
    );

    targets.forEach((element) => {
      if (element.dataset.cinematicPrepared === 'true') return;

      const rawText = element.textContent ?? '';
      const normalizedText = rawText.replace(/\s+/g, ' ').trim();
      if (!normalizedText) return;

      element.classList.add('hero-cinematic-target');
      element.setAttribute('aria-label', normalizedText);
      element.textContent = '';

      const heroWords = normalizedText.split(' ');
      let charIndex = 0;

      heroWords.forEach((word, wordIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'hero-word';

        Array.from(word).forEach((character) => {
          const span = document.createElement('span');
          span.className = 'hero-char';
          span.style.setProperty('--char-index', String(charIndex));
          span.setAttribute('aria-hidden', 'true');
          span.textContent = character;
          wordSpan.appendChild(span);
          charIndex++;
        });

        element.appendChild(wordSpan);

        if (wordIdx < heroWords.length - 1) {
          element.appendChild(document.createTextNode(' '));
          charIndex++;
        }
      });

      element.dataset.cinematicPrepared = 'true';
    });
  }, []);

  useEffect(() => {
    const handleNavScroll = () => {
      const threshold = window.innerHeight * 0.35;

      let activeKey = null;
      let closestDist = Infinity;

      Object.entries(sectionMap).forEach(([navKey, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        const dist = Math.abs(top - threshold);
        if (dist < closestDist) {
          closestDist = dist;
          activeKey = navKey;
        }
      });

      if (activeKey) setActiveNav(activeKey);
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
    return () => window.removeEventListener('scroll', handleNavScroll);
  }, []);

  const scrollToSection = (item) => {
    const targetId = sectionMap[item];
    const section = document.getElementById(targetId);
    if (!section) return;

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveNav(item);
    setIsMobileMenuOpen(false);
  };

  return (
    <main className="app-root">
      <div className="topbar">
        <div className="topbar-social" aria-label="Social media links">
          <a href="#" className="topbar-social-link" aria-label="Facebook"><i className="ti ti-brand-facebook" aria-hidden="true" /></a>
          <a href="#" className="topbar-social-link" aria-label="X"><i className="ti ti-brand-x" aria-hidden="true" /></a>
          <a href="#" className="topbar-social-link" aria-label="Instagram"><i className="ti ti-brand-instagram" aria-hidden="true" /></a>
          <a href="#" className="topbar-social-link" aria-label="LinkedIn"><i className="ti ti-brand-linkedin" aria-hidden="true" /></a>
          <a href="#" className="topbar-social-link" aria-label="YouTube"><i className="ti ti-brand-youtube" aria-hidden="true" /></a>
        </div>
        <div className="topbar-right">
          <a href="tel:+442012345678" className="topbar-contact-link">
            <i className="ti ti-phone" aria-hidden="true" /> +90 533 8866227
          </a>
          <span className="topbar-contact-divider" aria-hidden="true" />
          <a href="mailto:hello@pixenect.com" className="topbar-contact-link">
            <i className="ti ti-mail" aria-hidden="true" /> hello@pixenect.com
          </a>
        </div>
      </div>

      <nav>
        <a
          href="#home"
          className="nav-logo"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection('Home');
          }}
        >
          <img src={logo} alt="Pixenect logo" width="64" height="64" className="nav-logo-image" />
        </a>

        <button
          type="button"
          className="nav-menu-toggle"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <i className={`ti ${isMobileMenuOpen ? 'ti-x' : 'ti-menu-2'}`} aria-hidden="true" />
        </button>

        <div className={`nav-actions ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className={activeNav === item ? 'active' : ''}
                aria-current={activeNav === item ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item);
                }}
              >
                {item}
              </a>
            ))}
          </div>
          <button
            type="button"
            className="nav-cta nav-cta-main"
            onClick={() => scrollToSection('Contact')}
          >
            Get in Touch
          </button>
        </div>
      </nav>

      <section className="hero-carousel" id="home" aria-label="Hero slider">
        <button
          type="button"
          className="hero-slide-control hero-slide-control-left"
          aria-label="Previous slide"
          onClick={() => scrollHeroSlides(-1)}
        >
          <i className="ti ti-chevron-left" aria-hidden="true" />
        </button>

        <div className="hero-track" ref={heroTrackRef}>
          <section
            className={getHeroSlideClass(0, 'hero-slide-three')}
            id="hero-slide-1"
            style={{
              backgroundImage: `url(${heroSlideThreeBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div>
              <div className="hero-eyebrow hero-animate hero-animate-1">Digital marketing growth engine</div>
              <h1 className="hero-animate hero-animate-2">Drive Reach, Leads, and Revenue With Precision.</h1>
              <p className="hero-animate hero-animate-3">
                We run integrated SEO, paid media, content, and conversion programs designed to
                attract qualified traffic and turn campaigns into predictable business growth.
              </p>
              <div className="hero-btns hero-animate hero-animate-4">
                <button type="button" className="hero-btn-w">Start Marketing Plan</button>
                <button type="button" className="hero-btn-o">View Growth Services</button>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-badge hero-animate hero-animate-5">
                <div className="hero-badge-icon"><i className="ti ti-search" aria-hidden="true" /></div>
                <div>
                  <div className="hero-badge-title">SEO Visibility Lift</div>
                  <div className="hero-badge-desc">
                    Keyword clusters, technical SEO, and authority content that expand organic reach.
                  </div>
                </div>
              </div>
              <div className="hero-badge hero-animate hero-animate-6">
                <div className="hero-badge-icon"><i className="ti ti-bullseye" aria-hidden="true" /></div>
                <div>
                  <div className="hero-badge-title">Paid Campaign Control</div>
                  <div className="hero-badge-desc">
                    Data-led ad funnels across Google and Meta focused on CAC and ROAS targets.
                  </div>
                </div>
              </div>
              <div className="hero-badge hero-animate hero-animate-7">
                <div className="hero-badge-icon"><i className="ti ti-chart-arcs" aria-hidden="true" /></div>
                <div>
                  <div className="hero-badge-title">Conversion Optimization</div>
                  <div className="hero-badge-desc">
                    Landing page tests and analytics feedback loops that continually increase outcomes.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className={getHeroSlideClass(1, 'hero-slide-four')}
            id="hero-slide-2"
            style={{
              backgroundImage: `url(${heroSlideFourBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div>
              <div className="hero-eyebrow hero-animate hero-animate-1">Engineering excellence at scale</div>
              <h1 className="hero-animate hero-animate-2">Modern Web Development Built for Performance.</h1>
              <p className="hero-animate hero-animate-3">
                From front-end architecture to robust APIs, we deliver fast, secure, and maintainable
                web products engineered to support long-term growth.
              </p>
              <div className="hero-btns hero-animate hero-animate-4">
                <button type="button" className="hero-btn-w">Build My Platform</button>
                <button type="button" className="hero-btn-o">See Dev Capabilities</button>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-badge hero-animate hero-animate-5">
                <div className="hero-badge-icon"><i className="ti ti-code" aria-hidden="true" /></div>
                <div>
                  <div className="hero-badge-title">Scalable Architecture</div>
                  <div className="hero-badge-desc">
                    Component-driven front ends and modular back-end services built for scale.
                  </div>
                </div>
              </div>
              <div className="hero-badge hero-animate hero-animate-6">
                <div className="hero-badge-icon"><i className="ti ti-device-laptop" aria-hidden="true" /></div>
                <div>
                  <div className="hero-badge-title">Responsive by Default</div>
                  <div className="hero-badge-desc">
                    Optimized experiences across desktop, tablet, and mobile with pixel-level precision.
                  </div>
                </div>
              </div>
              <div className="hero-badge hero-animate hero-animate-7">
                <div className="hero-badge-icon"><i className="ti ti-rocket" aria-hidden="true" /></div>
                <div>
                  <div className="hero-badge-title">Speed and Reliability</div>
                  <div className="hero-badge-desc">
                    Lighthouse-focused builds, efficient delivery pipelines, and production-grade QA.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <button
          type="button"
          className="hero-slide-control hero-slide-control-right"
          aria-label="Next slide"
          onClick={() => scrollHeroSlides(1)}
        >
          <i className="ti ti-chevron-right" aria-hidden="true" />
        </button>

        <div className="hero-slider-nav" aria-label="Hero slide navigation">
          <button type="button" aria-label="Go to first hero slide" onClick={() => goToHeroSlide(0)} />
          <button type="button" aria-label="Go to second hero slide" onClick={() => goToHeroSlide(1)} />
          <button type="button" aria-label="Go to third hero slide" onClick={() => goToHeroSlide(2)} />
        </div>
      </section>

      <div className="accred-bar">
        <span className="accred-label">Recognised by</span>
        <div className="accred-divider" />
        <div className="accred-items">
          <span className="accred-item"><i className="ti ti-check" aria-hidden="true" /> ISO 9001 Certified</span>
          <span className="accred-item"><i className="ti ti-check" aria-hidden="true" /> Google Partner</span>
          <span className="accred-item"><i className="ti ti-check" aria-hidden="true" /> Meta Business Partner</span>
          <span className="accred-item"><i className="ti ti-check" aria-hidden="true" /> AWS Select Tier</span>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-num">120+</div>
          <div className="stat-label">Projects Delivered</div>
        </div>
        <div className="stat">
          <div className="stat-num">98%</div>
          <div className="stat-label">Client Satisfaction</div>
        </div>
        <div className="stat">
          <div className="stat-num">7+</div>
          <div className="stat-label">Years of Excellence</div>
        </div>
        <div className="stat">
          <div className="stat-num">40+</div>
          <div className="stat-label">Global Clients</div>
        </div>
      </div>

      <section className="manifesto-section">
        <div className="section-eyebrow">Our philosophy</div>
        <p className="manifesto-text">
          We design digital products that drive measurable growth — for brands built to lead their markets.
        </p>
      </section>

      <section className="services-section" id="services">
        <div className="services-header">
          <div className="services-header-left">
            <div className="section-eyebrow">What we do</div>
            <h2 className="services-heading">End-to-end digital services<br />built for impact</h2>
          </div>
          <div className="services-header-right">
            <p className="services-intro-text">
              We cover every layer of the digital stack — from strategy and design through to
              engineering, marketing, and growth. Everything you need, delivered as one cohesive team.
            </p>
            <button
              type="button"
              className="services-cta-btn"
              onClick={() => scrollToSection('Contact')}
            >
              Discuss your project <i className="ti ti-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="svc-grid">
          <div className="svc-card">
            <div className="svc-icon-wrap">
              <i className="ti ti-layout-2" aria-hidden="true" />
            </div>
            <div className="svc-cat">Design</div>
            <h3 className="svc-title">UI/UX Design</h3>
            <p className="svc-desc">
              Research-driven interfaces that guide users from first click to conversion with
              clarity and intent.
            </p>
            <ul className="svc-features">
              <li>User research &amp; journey mapping</li>
              <li>Wireframing &amp; high-fidelity prototypes</li>
              <li>Design systems &amp; component libraries</li>
              <li>Usability testing &amp; iteration</li>
            </ul>
            <Link to="/services/ui-ux-design" className="svc-link">
              Explore service <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          <div className="svc-card">
            <div className="svc-icon-wrap">
              <i className="ti ti-code" aria-hidden="true" />
            </div>
            <div className="svc-cat">Engineering</div>
            <h3 className="svc-title">Web Development</h3>
            <p className="svc-desc">
              Scalable, performant, and maintainable web products built with modern stacks and
              production-grade quality.
            </p>
            <ul className="svc-features">
              <li>Front-end &amp; full-stack architecture</li>
              <li>API design &amp; back-end integration</li>
              <li>Performance optimisation &amp; Lighthouse QA</li>
              <li>Post-launch maintenance &amp; support</li>
            </ul>
            <Link to="/services/web-development" className="svc-link">
              Explore service <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          <div className="svc-card">
            <div className="svc-icon-wrap">
              <i className="ti ti-palette" aria-hidden="true" />
            </div>
            <div className="svc-cat">Branding</div>
            <h3 className="svc-title">Brand Identity</h3>
            <p className="svc-desc">
              Visual systems built to last — from naming and logomark through to full brand
              guidelines and creative direction.
            </p>
            <ul className="svc-features">
              <li>Logo design &amp; visual identity</li>
              <li>Brand guidelines &amp; tone of voice</li>
              <li>Marketing collateral &amp; templates</li>
              <li>Brand audit &amp; repositioning</li>
            </ul>
            <Link to="/services/brand-identity" className="svc-link">
              Explore service <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          <div className="svc-card">
            <div className="svc-icon-wrap">
              <i className="ti ti-trending-up" aria-hidden="true" />
            </div>
            <div className="svc-cat">Marketing</div>
            <h3 className="svc-title">Growth &amp; SEO</h3>
            <p className="svc-desc">
              Data-led marketing programs across search, paid media, and content designed to
              generate measurable, sustained ROI.
            </p>
            <ul className="svc-features">
              <li>Technical SEO &amp; content strategy</li>
              <li>Google &amp; Meta paid campaigns</li>
              <li>Conversion rate optimisation</li>
              <li>Analytics dashboards &amp; reporting</li>
            </ul>
            <Link to="/services/growth-seo" className="svc-link">
              Explore service <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          <div className="svc-card">
            <div className="svc-icon-wrap">
              <i className="ti ti-shopping-cart" aria-hidden="true" />
            </div>
            <div className="svc-cat">Commerce</div>
            <h3 className="svc-title">E-commerce Solutions</h3>
            <p className="svc-desc">
              End-to-end retail platforms designed to convert — from storefront experience to
              seamless, optimised checkout.
            </p>
            <ul className="svc-features">
              <li>Shopify &amp; custom storefront builds</li>
              <li>Checkout &amp; cart optimisation</li>
              <li>Product catalogue &amp; CMS integration</li>
              <li>Mobile-first buying experiences</li>
            </ul>
            <Link to="/services/ecommerce-solutions" className="svc-link">
              Explore service <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          <div className="svc-card">
            <div className="svc-icon-wrap">
              <i className="ti ti-writing" aria-hidden="true" />
            </div>
            <div className="svc-cat">Content</div>
            <h3 className="svc-title">Content Strategy</h3>
            <p className="svc-desc">
              Strategic content programs that build authority, support SEO, and move audiences
              through the buying journey with purpose.
            </p>
            <ul className="svc-features">
              <li>Content audits &amp; gap analysis</li>
              <li>Editorial calendar &amp; production</li>
              <li>Copywriting &amp; thought leadership</li>
              <li>Content performance tracking</li>
            </ul>
            <Link to="/services/content-strategy" className="svc-link">
              Explore service <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </section>

      <section className="process">
        <div className="process-header">
          <div className="section-eyebrow">Our process</div>
          <h2>How we deliver exceptional results</h2>
        </div>
        <div className="process-steps">
          <div className="process-step">
            <span className="process-step-num">01</span>
            <div className="process-step-icon"><i className="ti ti-telescope" aria-hidden="true" /></div>
            <div className="process-step-body">
              <div className="process-step-title">Discovery &amp; Strategy</div>
              <div className="process-step-desc">
                We begin with deep research into your business, audience, and competitive landscape to
                craft a clear strategic foundation.
              </div>
            </div>
          </div>
          <div className="process-step">
            <span className="process-step-num">02</span>
            <div className="process-step-icon"><i className="ti ti-vector-triangle" aria-hidden="true" /></div>
            <div className="process-step-body">
              <div className="process-step-title">Design &amp; Prototyping</div>
              <div className="process-step-desc">
                Our designers craft wireframes and high-fidelity prototypes with your team before a
                single line of code is written.
              </div>
            </div>
          </div>
          <div className="process-step">
            <span className="process-step-num">03</span>
            <div className="process-step-icon"><i className="ti ti-rocket" aria-hidden="true" /></div>
            <div className="process-step-body">
              <div className="process-step-title">Build &amp; Launch</div>
              <div className="process-step-desc">
                Clean, tested, and performant code delivered on time with full QA, documentation, and
                post-launch support.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell" id="our-work">
          <div className="page-hero">
            <div className="section-eyebrow">Portfolio</div>
            <h1>Our Work</h1>
            <p>
              Selected projects across web platforms, brand systems, and growth campaigns.
              Every build is shaped for measurable outcomes and long-term scale.
            </p>
          </div>

          <div className="work-list">
            <article className="work-item">
              <div className="work-visual">
                <span className="work-index">01</span>
              </div>
              <div className="work-body">
                <span className="work-tag">Web Platform</span>
                <h3>Atlas Commerce Suite</h3>
                <p>Rebuilt checkout flow and storefront architecture for a global retail client.</p>
                <div className="work-result"><i className="ti ti-trending-up" aria-hidden="true" /> +31% conversion rate</div>
              </div>
            </article>
            <article className="work-item">
              <div className="work-visual">
                <span className="work-index">02</span>
              </div>
              <div className="work-body">
                <span className="work-tag">Brand + UI</span>
                <h3>Nova Finance Dashboard</h3>
                <p>Designed a complete visual system and product interface for enterprise users.</p>
                <div className="work-result"><i className="ti ti-users" aria-hidden="true" /> Adopted by 12,000+ users</div>
              </div>
            </article>
            <article className="work-item">
              <div className="work-visual">
                <span className="work-index">03</span>
              </div>
              <div className="work-body">
                <span className="work-tag">Growth</span>
                <h3>Pulse Health Acquisition</h3>
                <p>Executed a multi-channel digital strategy and optimized landing funnels at scale.</p>
                <div className="work-result"><i className="ti ti-chart-bar" aria-hidden="true" /> 3× qualified lead volume</div>
              </div>
            </article>
            <article className="work-item">
              <div className="work-visual">
                <span className="work-index">04</span>
              </div>
              <div className="work-body">
                <span className="work-tag">E-commerce</span>
                <h3>Vanta Lifestyle Storefront</h3>
                <p>Delivered a fast, mobile-first buying experience with rich product storytelling.</p>
                <div className="work-result"><i className="ti ti-device-mobile" aria-hidden="true" /> +44% mobile revenue</div>
              </div>
            </article>
          </div>
      </section>

      <section className="testimonial">
        <div className="testimonial-inner">
          <div className="testimonial-quote">
            "Pixenect transformed our digital presence completely. The team&apos;s attention to detail
            and strategic thinking set them apart from every agency we had worked with before."
          </div>
          <div className="testimonial-author"><strong>Sarah Mensah</strong> &mdash; CEO, Horizon Ventures</div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-split">
          <div className="about-dark-panel">
            <div className="section-eyebrow about-eyebrow">Our Story</div>
            <h2 className="about-heading">A studio built on strategy, craft, and delivery.</h2>
            <p className="about-mission">
              Pixenect is a multidisciplinary studio partnering with ambitious teams to design
              and launch digital experiences that perform and endure.
            </p>
            <div className="about-dark-stats">
              <div className="about-dark-stat">
                <strong>120+</strong>
                <span>Projects Delivered</span>
              </div>
              <div className="about-dark-stat">
                <strong>98%</strong>
                <span>Client Satisfaction</span>
              </div>
              <div className="about-dark-stat">
                <strong>40+</strong>
                <span>Global Clients</span>
              </div>
            </div>
          </div>
          <div className="about-light-panel">
            <div className="about-pillar">
              <h3>What We Believe</h3>
              <p>
                Great digital products are equal parts insight, design clarity, and engineering rigor.
                We challenge assumptions, simplify complexity, and build with intent.
              </p>
            </div>
            <div className="about-pillar">
              <h3>How We Work</h3>
              <p>
                Our process is collaborative and transparent from discovery to post-launch support.
                You get a senior team, regular updates, and outcomes tied to business goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="teams-section" id="teams">
        <div className="teams-header">
          <div className="section-eyebrow">People</div>
          <h2>Our Teams</h2>
          <p>
            A cross-functional team of strategists, designers, developers, and growth specialists
            aligned around one goal: delivering meaningful outcomes for every client.
          </p>
        </div>
        <div className="team-grid">
          <article className="team-card">
            <div className="team-photo-area">
              <div className="team-photo-placeholder">
                <i className="ti ti-chart-dots" />
              </div>
              <div className="team-card-overlay">
                <span className="team-card-role">Strategy</span>
                <h3>Strategy Team</h3>
                <span className="team-meta">Lead: Product Strategist</span>
              </div>
            </div>
          </article>
          <article className="team-card">
            <div className="team-photo-area">
              <div className="team-photo-placeholder">
                <i className="ti ti-vector-bezier" />
              </div>
              <div className="team-card-overlay">
                <span className="team-card-role">Design</span>
                <h3>Design Team</h3>
                <span className="team-meta">Lead: Design Director</span>
              </div>
            </div>
          </article>
          <article className="team-card">
            <div className="team-photo-area">
              <div className="team-photo-placeholder">
                <i className="ti ti-code" />
              </div>
              <div className="team-card-overlay">
                <span className="team-card-role">Engineering</span>
                <h3>Engineering Team</h3>
                <span className="team-meta">Lead: Technical Architect</span>
              </div>
            </div>
          </article>
          <article className="team-card">
            <div className="team-photo-area">
              <div className="team-photo-placeholder">
                <i className="ti ti-trending-up" />
              </div>
              <div className="team-card-overlay">
                <span className="team-card-role">Growth</span>
                <h3>Growth Team</h3>
                <span className="team-meta">Lead: Growth Manager</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div className="cta-band">
        <p>
          <strong>Ready to work with us?</strong> Speak with our team about your project requirements
          and get a tailored proposal within 48 hours.
        </p>
        <button type="button" className="cta-btn">Start a Project</button>
      </div>

      <section className="page-shell" id="contact">
          <div className="page-hero">
            <div className="section-eyebrow">Let&apos;s Talk</div>
            <h1>Contact Us</h1>
            <p>
              Tell us about your project and timeline. Our team will get back with a tailored plan.
            </p>
          </div>

          <div className="contact-layout">
            <div className="contact-card">
              <h3>Reach our team</h3>
              <div className="contact-info-row">
                <i className="ti ti-mail" aria-hidden="true" />
                <span>hello@pixenect.com</span>
              </div>
              <div className="contact-info-row">
                <i className="ti ti-phone" aria-hidden="true" />
                <span>+90 533 8866227</span>
              </div>
              <div className="contact-info-row">
                <i className="ti ti-map-pin" aria-hidden="true" />
                <span>24 King Street, London, UK</span>
              </div>
            </div>

            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                Full Name
                <input type="text" placeholder="Your full name" />
              </label>
              <label>
                Email
                <input type="email" placeholder="you@example.com" />
              </label>
              <label>
                Project Type
                <input type="text" placeholder="Website, branding, strategy..." />
              </label>
              <label>
                Message
                <textarea rows="5" placeholder="Share your goals and timeline" />
              </label>
              <button type="submit">Send Inquiry</button>
            </form>
          </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-title">Services</h3>
            <div className="footer-stack">
              <a href="#">UI/UX Design</a>
              <a href="#">Web Development</a>
              <a href="#">Brand Identity</a>
              <a href="#">Growth &amp; SEO</a>
              <a href="#">E-commerce</a>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Company</h3>
            <div className="footer-stack">
              <a href="#">About Us</a>
              <a href="#">Our Work</a>
              <a href="#">Process</a>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>

          <div className="footer-col footer-connect">
            <h3 className="footer-title">Connect with us</h3>
            <h4 className="footer-follow-title">Follow Us</h4>
            <div className="footer-socials" aria-label="Footer social links">
              <a href="#" aria-label="Facebook"><i className="ti ti-brand-facebook" aria-hidden="true" /></a>
              <a href="#" aria-label="X"><i className="ti ti-brand-x" aria-hidden="true" /></a>
              <a href="#" aria-label="Instagram"><i className="ti ti-brand-instagram" aria-hidden="true" /></a>
              <a href="#" aria-label="LinkedIn"><i className="ti ti-brand-linkedin" aria-hidden="true" /></a>
              <a href="#" aria-label="YouTube"><i className="ti ti-brand-youtube" aria-hidden="true" /></a>
            </div>
            <button type="button" className="footer-contact-btn">Contact Us</button>
          </div>

          <div className="footer-col footer-brand-col">
            <div className="footer-brand-logo-wrap">
              <img src={logo} alt="Pixenect" width="64" height="64" className="footer-brand-logo" />
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">&copy; 2026 Pixenect Digital Services. All rights reserved.</div>
          <div className="footer-reg">Company No. 11221211 &mdash; Registered in England &amp; Wales</div>
        </div>
      </footer>
    </main>
  )
}

export default App
