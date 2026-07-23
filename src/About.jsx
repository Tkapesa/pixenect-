import SharedHeader from './SharedHeader';
import './App.css';
import './About.css';
import useRevealOnScroll from './hooks/useRevealOnScroll';

function About() {
  useRevealOnScroll();

  return (
    <main className="app-root about-page">
      <SharedHeader mode="internal" activeNav="About" />

      <section className="about-hero" data-reveal>
        <div className="about-hero-inner" style={{ '--reveal-delay': '40ms' }}>
          <p className="about-eyebrow">About Pixenect</p>
          <h1>We build digital products that move businesses forward.</h1>
          <p className="about-hero-copy">
            Pixenect is a multidisciplinary digital studio combining strategy, design,
            engineering, and growth. We partner with ambitious teams to create work
            that looks exceptional and performs even better.
          </p>
        </div>
      </section>

      <section className="about-grid-section">
        <article className="about-card" data-reveal style={{ '--reveal-delay': '80ms' }}>
          <h2>Our Mission</h2>
          <p>
            Build brands and digital experiences that create measurable impact. Every
            project is designed to improve conversion, increase trust, and scale
            sustainably.
          </p>
        </article>
        <article className="about-card" data-reveal style={{ '--reveal-delay': '150ms' }}>
          <h2>How We Work</h2>
          <p>
            We run in tight sprint cycles with transparent communication, clear
            ownership, and fast decision loops. You always know what is being built,
            why it matters, and what happens next.
          </p>
        </article>
        <article className="about-card" data-reveal style={{ '--reveal-delay': '220ms' }}>
          <h2>What We Value</h2>
          <p>
            Craft, clarity, and momentum. We care deeply about details, we avoid
            unnecessary complexity, and we focus on shipping outcomes that matter.
          </p>
        </article>
      </section>

      <section className="about-cta" data-reveal style={{ '--reveal-delay': '60ms' }}>
        <div className="about-cta-inner">
          <h2>Let&apos;s create your next growth chapter.</h2>
          <a className="about-cta-btn" href="/#contact">Start your project</a>
        </div>
      </section>
    </main>
  );
}

export default About;