import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { BlurIn, SplitEyebrow, SplitHeading } from './RevealText';

function ProcessStep({ step, index, reached }) {
  const [number, title, description] = step;

  return (
    <BlurIn as="li" delay={0.12 * index} className="group relative pl-10 lg:pl-0 lg:pt-14">
      <span
        aria-hidden="true"
        className={`absolute left-0 top-6 flex size-[15px] items-center justify-center rounded-full border-[0.5px] transition-[background-color,border-color,box-shadow] duration-500 lg:top-0 ${reached ? 'border-magenta bg-magenta shadow-[0_0_0_6px_rgba(16,185,129,0.15),0_0_24px_rgba(16,185,129,0.5)]' : 'border-[rgba(240,240,248,0.3)] bg-[#0a0a0b]'}`}
      >
        <span className={`size-1 rounded-full transition-colors duration-500 ${reached ? 'bg-white' : 'bg-[rgba(240,240,248,0.3)]'}`} />
      </span>

      <article
        className={`relative h-full overflow-hidden rounded-2xl border-[0.5px] bg-white/[0.02] p-6 backdrop-blur-sm transition-[border-color,transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:bg-white/[0.035] sm:p-7 ${reached ? 'border-[rgba(240,240,248,0.16)]' : 'border-hairline-soft'}`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-magenta transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
        <div className="mb-10 flex items-center justify-between text-[11px] uppercase tracking-[0.2em]">
          <span className={`transition-colors duration-500 ${reached ? 'text-magenta' : 'text-[rgba(240,240,248,0.48)]'}`}>
            Stage {number}
          </span>
          <span
            aria-hidden="true"
            className="font-display text-[44px] font-bold leading-none tracking-[-0.06em] text-[rgba(240,240,248,0.06)] transition-colors duration-500 group-hover:text-[rgba(240,240,248,0.12)]"
          >
            {number}
          </span>
        </div>
        <h3 className="m-0 mb-3 font-display text-2xl font-bold tracking-[-0.02em] text-fg">{title}</h3>
        <p className="m-0 text-[13px] leading-relaxed text-fg-muted">{description}</p>
      </article>
    </BlurIn>
  );
}

function ProcessTimeline({ steps }) {
  const listRef = useRef(null);
  const [reachedCount, setReachedCount] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 85%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useMotionValueEvent(progress, 'change', (value) => {
    const count = value <= 0.01 ? 0 : Math.min(steps.length, Math.floor(value * (steps.length - 1) + 1.05));
    setReachedCount(count);
  });

  return (
    <section
      id="process"
      aria-label="How we work"
      className="relative overflow-hidden border-t-[0.5px] border-hairline-soft bg-[#0a0a0b] py-24 font-mono text-fg sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(800px_circle_at_85%_10%,rgba(16,185,129,0.07),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(240,240,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(240,240,248,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_60%)]"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col items-start gap-6">
            <SplitEyebrow text="[ How we work ]" />
            <SplitHeading
              text="Here's exactly what happens."
              delay={0.4}
              className="m-0 font-mono text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-fg"
            />
          </div>
          <BlurIn as="p" delay={0.8} className="m-0 max-w-[480px] text-[15px] leading-relaxed text-[rgba(240,240,248,0.8)] lg:justify-self-end">
            No mystery handoffs. No disappearing act after the proposal. The work moves from a shared problem to a shipped
            system in {steps.length} clear stages.
          </BlurIn>
        </div>

        <ol ref={listRef} className="relative m-0 mt-16 grid list-none grid-cols-1 gap-6 p-0 sm:mt-20 lg:grid-cols-4 lg:gap-5">
          <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-hairline-soft lg:hidden" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-gradient-to-b from-magenta to-[rgba(16,185,129,0.4)] lg:hidden"
          />
          <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-hairline-soft lg:block" />
          <motion.span
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-gradient-to-r from-magenta to-[rgba(16,185,129,0.4)] lg:block"
          />

          {steps.map((step, index) => (
            <ProcessStep key={step[0]} step={step} index={index} reached={index < reachedCount} />
          ))}
        </ol>

        <BlurIn
          delay={0.2}
          className="mt-14 flex flex-col items-start justify-between gap-6 border-t-[0.5px] border-hairline-soft pt-8 sm:flex-row sm:items-center"
        >
          <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[rgba(240,240,248,0.48)]">
            <span className="text-magenta">●</span>&nbsp; Stage 01 starts with one call
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full border-[0.5px] border-[rgba(240,240,248,0.2)] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-fg no-underline transition-colors duration-300 hover:border-magenta hover:bg-magenta hover:text-white"
          >
            Book a Strategy Call
            <i className="ti ti-arrow-right text-base transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </BlurIn>
      </div>
    </section>
  );
}

export default ProcessTimeline;
