
import SharedHeader from './SharedHeader';
import './App.css';
import './About.css';
import ServiceDotVisual from './components/ServiceDotVisual';
import DotPageBackdrop from './components/DotPageBackdrop';
import SiteFooter from './components/SiteFooter';
import useRevealOnScroll from './hooks/useRevealOnScroll';
import { Link } from 'react-router-dom';

import chrisImage from './assets/chris.jpeg';
import gloryImage from './assets/glory-grey.png';
import takundaImage from './assets/takunda-grey.png';
import samImage from './assets/sam-grey.png';

const CAPABILITIES = [
  { label: 'Build', detail: 'Digital products and platforms', to: '/services/web-development' },
  { label: 'Grow', detail: 'Marketing that compounds', to: '/services/growth-seo' },
  { label: 'Automate', detail: 'Smarter business operations', to: '/services/content-strategy' },
  { label: 'Brand', detail: 'Identity and experience design', to: '/services/brand-identity' },
];

const ABOUT_VISUAL = {
  category: 'Pixenect',
  title: 'One team',
  tagline: 'Strategy · Design · Engineering · Growth',
};

const TEAM_IMAGE = 'https://necf.church/wp-content/uploads/2025/03/02A0088-Edit-1.jpg';

const TEAM_PROFILES = [
  { name: 'Christopher Bull', role: 'Chief Revenue Officer (CRO)', image: chrisImage },
  { name: 'Glory Letong', role: 'Chief Operating Officer (COO)', image: gloryImage },
  { name: 'Takunda Kapesa', role: 'Chief Technology Officer (CTO)', image: takundaImage },
  { name: 'Fredrick Letong', role: 'Chief Executive Officer (CEO)', image: TEAM_IMAGE },
  { name: 'Samuel Wleh', role: 'Design Director', image: samImage },
];

function About() {
  useRevealOnScroll();

  return (
    <main className="app-root about-page">
      <DotPageBackdrop variant="brand-identity" />
      <SharedHeader mode="internal" activeNav="About" />

      <section className="about-hero" data-reveal>
        <div className="about-hero-layout">
          <div className="about-hero-inner" style={{ '--reveal-delay': '40ms' }}>
            <p className="about-eyebrow">
              <span aria-hidden="true" /> A digital team of experts built around your next move
            </p>
            <h1>
              One team to <span>move your business forward.</span>
            </h1>
            <p className="about-hero-copy">
              Pixenect brings strategy, design, engineering, and growth together under
              one roof. We partner with businesses and institutions to make digital work clearer,
              more connected, and more effective.
            </p>
            
          </div>
          <ServiceDotVisual service={ABOUT_VISUAL} variant="brand-identity" />
        </div>
        <div className="about-hero-mark" aria-hidden="true">PX / 01</div>
      </section>

      <section className="about-values" aria-labelledby="about-values-title">
        <div className="about-section-heading" data-reveal>
          <p className="about-section-label">What we stand for</p>
          <h2 id="about-values-title">
            Our vision, mission, <span>and core values.</span>
          </h2>
        </div>

        <section className="about-grid-section">
          <article className="about-card" data-reveal style={{ '--reveal-delay': '80ms' }}>
            <span className="about-card-number">01 / VISION</span>
            <h3>Our Vision</h3>
            <p>
              To become the trusted digital growth partner that helps businesses launch boldly, grow strategically, and compete globally.
            </p>
          </article>

          <article className="about-card" data-reveal style={{ '--reveal-delay': '150ms' }}>
            <span className="about-card-number">02 / MISSION</span>
            <h3>Our Mission</h3>
            <p>
              To connect businesses with innovative, affordable digital solutions through creative design, technology, and strategic marketing that drive measurable growth.
            </p>
          </article>

          <article className="about-card" data-reveal style={{ '--reveal-delay': '220ms' }}>
            <span className="about-card-number">03 / CORE VALUE</span>
            <h3>Reliability</h3>
            <p>
              We keep our promises by delivering projects within the agreed timeline and meeting our commitments from start to finish.
            </p>
          </article>

          <article className="about-card" data-reveal style={{ '--reveal-delay': '290ms' }}>
            <span className="about-card-number">04 / CORE VALUE</span>
            <h3>Candor</h3>
            <p>
              We communicate honestly with clear pricing, realistic expectations, and no hidden costs or unnecessary jargon.
            </p>
          </article>

          <article className="about-card" data-reveal style={{ '--reveal-delay': '360ms' }}>
            <span className="about-card-number">05 / CORE VALUE</span>
            <h3>Craft</h3>
            <p>
              We deliver high-quality design, technology, and strategy that create real value for our clients.
            </p>
          </article>

          <article className="about-card" data-reveal style={{ '--reveal-delay': '430ms' }}>
            <span className="about-card-number">06 / CORE VALUE</span>
            <h3>Ownership</h3>
            <p>
              We take responsibility for every project, working as a trusted partner who is invested in our clients&apos; success.
            </p>
          </article>
        </section>
      </section>

      <section className="about-team" aria-labelledby="about-team-title">
        <div className="about-team-heading" data-reveal>
          <p className="about-section-label">The people behind the work</p>
          <h2 id="about-team-title">
            Meet our <span>leadership team.</span>
          </h2>
          <p>
            A close-knit team bringing strategy and thoughtful execution to every project.
          </p>
        </div>

        <div className="about-team-grid">
          {TEAM_PROFILES.map((member, index) => (
            <article
              className="about-team-card"
              key={`${member.role}-${index}`}
              data-reveal
              style={{ '--reveal-delay': `${60 + index * 70}ms` }}
            >
              <div className="about-team-photo">
                {member.image ? (
                  <img src={member.image} alt={member.name} loading="lazy" />
                ) : (
                  <div className="about-team-photo-placeholder">
                    <span className="about-team-index">0{index + 1}</span>
                    <i className="ti ti-user-circle" aria-hidden="true" />
                    <span>Add portrait<br />in About.jsx</span>
                  </div>
                )}
              </div>

              <div className="about-team-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-capabilities" aria-labelledby="about-capabilities-title">
        <div className="about-capabilities-heading" data-reveal>
          <p className="about-section-label">One connected team</p>
          <h2 id="about-capabilities-title">From first idea to results-driven strategies and execution. </h2>
        </div>

        <div className="about-capability-list">
          {CAPABILITIES.map((capability, index) => (
            <Link
              className="about-capability"
              to={capability.to}
              key={capability.label}
              data-reveal
              style={{ '--reveal-delay': `${80 + index * 70}ms` }}
            >
              <span className="about-capability-index">0{index + 1}</span>
              <span className="about-capability-copy">
                <strong>{capability.label}</strong>
                <small>{capability.detail}</small>
              </span>
              <i className="ti ti-arrow-up-right" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="about-cta" data-reveal style={{ '--reveal-delay': '60ms' }}>
        <div className="about-cta-inner">
          <div>
            <p className="about-section-label">Start with a conversation</p>
            <h2>Let&apos;s create your next growth chapter.</h2>
          </div>
          <a className="about-cta-btn" href="/#contact">
            Start your project <i className="ti ti-arrow-up-right" aria-hidden="true" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

export default About;
