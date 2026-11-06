import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { BlurIn, SplitEyebrow, SplitHeading } from './RevealText';

const CONTACT_LINKS = [
  { label: 'info@pixenect.com', href: 'mailto:info@pixenect.com', icon: 'ti-mail' },
  { label: '+90 542 886 1113', href: 'tel:+905428861113', icon: 'ti-phone' },
  { label: 'WhatsApp', href: 'https://wa.me/905428861113', icon: 'ti-brand-whatsapp', external: true },
];

function CtaSection() {
  const sectionRef = useRef(null);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(45);
  const glowX = useSpring(pointerX, { stiffness: 80, damping: 20 });
  const glowY = useSpring(pointerY, { stiffness: 80, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(560px circle at ${glowX}% ${glowY}%, rgba(16, 185, 129, 0.18), transparent 70%)`;

  const handlePointerMove = (event) => {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Book a strategy call"
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden border-t-[0.5px] border-hairline-soft bg-[#0a0a0b] py-28 font-mono text-fg sm:py-36"
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]" style={{ backgroundImage: glow }} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(rgba(240,240,248,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(240,240,248,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
        {[420, 640, 860].map((size, index) => (
          <span
            key={size}
            style={{ width: size, height: size, animationDelay: `${index * 1.2}s` }}
            className="absolute rounded-full border-[0.5px] border-[rgba(240,240,248,0.06)] motion-safe:animate-ring-pulse"
          />
        ))}
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-6 text-center">
        <SplitEyebrow text="[ Start with clarity ]" />

        <SplitHeading
          text="Ready to stop managing four vendors and start with one team?"
          delay={0.5}
          className="m-0 max-w-4xl font-mono text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-fg"
        />

        <BlurIn as="p" delay={1.4} className="m-0 max-w-[480px] text-[15px] leading-relaxed text-[rgba(240,240,248,0.8)]">
          Book a 30-minute strategy call. You will leave with a clear view of what your digital presence needs, whether or
          not you decide to work with us.
        </BlurIn>

        <BlurIn
          delay={1.55}
          className="flex items-center gap-3 rounded-full border-[0.5px] border-hairline-soft bg-white/[0.02] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-fg-secondary backdrop-blur-md"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-magenta" />
          </span>
          <span className="text-fg">Open</span>
          <span className="h-3 w-px bg-hairline-soft" aria-hidden="true" />
          30 min · no obligation
        </BlurIn>

        <BlurIn delay={1.7} className="pointer-events-auto w-full max-w-[420px]">
          <a
            href="mailto:info@pixenect.com?subject=Strategy%20Call"
            className="group flex w-full items-center justify-between rounded-full border-[0.5px] border-[rgba(240,240,248,0.2)] bg-fg px-6 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-ink no-underline transition-colors duration-300 hover:bg-magenta hover:text-white"
          >
            Book a Strategy Call
            <i className="ti ti-arrow-up-right text-base transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </BlurIn>

        <BlurIn as="ul" delay={1.85} className="pointer-events-auto m-0 mt-2 flex list-none flex-wrap justify-center gap-2.5 p-0">
          {CONTACT_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-[rgba(240,240,248,0.14)] bg-white/[0.03] px-4 py-2 text-[12px] tracking-[0.04em] text-fg-secondary no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors duration-300 hover:border-[rgba(16,185,129,0.6)] hover:text-fg"
              >
                <i className={`ti ${link.icon} text-sm`} aria-hidden="true" />
                {link.label}
              </a>
            </li>
          ))}
        </BlurIn>
      </div>
    </section>
  );
}

export default CtaSection;
