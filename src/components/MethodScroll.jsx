import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScatterField from './ScatterField';

gsap.registerPlugin(ScrollTrigger);

const LIGHT_THEME = {
  '--method-bg': 'rgba(255, 255, 255, 1)',
  '--method-fg': 'rgba(23, 23, 23, 1)',
  '--method-muted': 'rgba(82, 82, 82, 1)',
  '--method-line': 'rgba(23, 23, 23, 0.14)',
};

const DARK_THEME = {
  '--method-bg': 'rgba(0, 0, 0, 1)',
  '--method-fg': 'rgba(245, 245, 245, 1)',
  '--method-muted': 'rgba(163, 163, 163, 1)',
  '--method-line': 'rgba(255, 255, 255, 0.12)',
};

const METHOD_VARS = { ...LIGHT_THEME, '--method-accent': '#10B981' };

function MethodPhase({ phase, total }) {
  return (
    <article
      data-phase
      className="relative flex h-svh w-[86vw] shrink-0 items-center border-l border-[var(--method-line)] px-6 will-change-transform sm:px-12 md:w-[70vw] md:px-20 motion-reduce:h-auto motion-reduce:w-full motion-reduce:border-l-0 motion-reduce:border-t motion-reduce:py-24"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(110px,24vh,200px)] font-bold leading-none tracking-[-0.08em] text-[var(--method-fg)] opacity-[0.06] md:right-10 md:text-[clamp(360px,60vh,720px)]"
      >
        {phase.num}
      </span>

      <div className="relative max-w-xl">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--method-muted)]">
          <span className="text-[var(--method-accent)]">{phase.num}</span> / {String(total).padStart(2, '0')} · Service
        </p>

        <h3
          data-phase-title
          className="font-display text-[clamp(2.75rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.05em] text-[var(--method-fg)]"
          aria-label={phase.title}
        >
          {phase.title.split('').map((letter, letterIndex) => (
            <span key={`${letter}-${letterIndex}`} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
              <span data-char className="inline-block will-change-transform">{letter}</span>
            </span>
          ))}
        </h3>

        <p data-phase-reveal className="mt-4 font-mono text-sm text-[var(--method-fg)] md:text-base">
          {phase.summary}
        </p>

        <hr data-phase-reveal className="my-8 h-px w-full origin-left border-0 bg-[var(--method-line)]" />

        <p data-phase-reveal className="font-mono text-[13px] leading-relaxed text-[var(--method-muted)] md:text-sm">
          {phase.description}
        </p>

        <ul className="mt-8 grid list-none gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--method-fg)] sm:grid-cols-2">
          {phase.items.map((item) => (
            <li data-phase-reveal key={item} className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-4 shrink-0 bg-[var(--method-accent)]" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          data-phase-reveal
          to={phase.to}
          className="mt-10 inline-flex items-center gap-2 border-b border-[var(--method-accent)] pb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--method-accent)] transition-colors hover:border-[#059669] hover:text-[#059669]"
        >
          {phase.cta}
          <i className="ti ti-arrow-up-right" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function MethodScroll({ phases }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const introRef = useRef(null);
  const fieldStateRef = useRef({ progress: 0, theme: 0 });
  const [fieldActive, setFieldActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(([entry]) => setFieldActive(entry.isIntersecting));
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const intro = introRef.current;
    const fieldState = fieldStateRef.current;
    if (!section || !track || !intro) return undefined;

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const horizontal = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const themeState = { progress: 0 };
      gsap.to(themeState, {
        progress: 1,
        ease: 'none',
        onUpdate: () => {
          const theme = themeState.progress < 0.5 ? LIGHT_THEME : DARK_THEME;
          const fieldTheme = theme === DARK_THEME ? 1 : 0;
          if (fieldState.theme === fieldTheme) return;
          gsap.set(section, theme);
          fieldState.theme = fieldTheme;
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(fieldState, {
        progress: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(intro, {
        autoAlpha: 0,
        scale: 0.9,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerWidth * 0.35}`,
          scrub: true,
        },
      });

      track.querySelectorAll('[data-phase]').forEach((phase) => {
        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: phase,
            containerAnimation: horizontal,
            start: 'left 75%',
            toggleActions: 'play none none reverse',
          },
        });
        reveal
          .from(phase.querySelectorAll('[data-char]'), {
            yPercent: 110,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.04,
          })
          .from(phase.querySelectorAll('[data-phase-reveal]'), {
            autoAlpha: 0,
            y: 18,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.06,
          }, '-=0.45');
      });
    });

    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(section, DARK_THEME);
    });

    return () => media.revert();
  }, [phases.length]);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="Services"
      style={METHOD_VARS}
      className="relative h-svh w-full overflow-hidden bg-[var(--method-bg)] text-[var(--method-fg)] motion-reduce:h-auto"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 motion-reduce:hidden">
        <ScatterField stateRef={fieldStateRef} active={fieldActive} />
      </div>

      <div
        ref={introRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center motion-reduce:relative motion-reduce:py-32"
      >
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--method-muted)]">
          <span className="text-[var(--method-accent)]">//</span> {String(phases.length).padStart(2, '0')} pillars · one team
        </p>
        <h2 className="font-display text-[clamp(3.5rem,13vw,13rem)] font-bold leading-[0.85] tracking-[-0.06em] text-[var(--method-fg)]">
          Services
        </h2>
        <p className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--method-muted)] motion-reduce:hidden">
          Scroll
          <span className="h-px w-10 bg-[var(--method-line)]" aria-hidden="true" />
        </p>
      </div>

      <div
        ref={trackRef}
        className="relative z-[1] flex h-svh w-max will-change-transform motion-reduce:h-auto motion-reduce:w-full motion-reduce:flex-col"
      >
        <div className="h-svh w-screen shrink-0 motion-reduce:hidden" aria-hidden="true" />
        {phases.map((phase) => (
          <MethodPhase key={phase.num} phase={phase} total={phases.length} />
        ))}
      </div>
    </section>
  );
}

export default MethodScroll;
