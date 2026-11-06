import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const REASONS = [
  {
    icon: 'ti-arrows-shuffle',
    title: 'One agency, zero gaps',
    description: 'Software, design, branding, and marketing handled in-house. No outsourced context or missed handoffs.',
  },
  {
    icon: 'ti-chart-dots-3',
    title: 'Built to last',
    description: 'We make decisions for the long term, not just for launch day.',
  },
  {
    icon: 'ti-eye',
    title: 'Transparent process',
    description: 'Clear milestones, visible progress, and one point of contact throughout the engagement.',
  },
  {
    icon: 'ti-target-arrow',
    title: 'Accountable for results',
    description: 'The same team owns the direction, the build, and the work that follows launch.',
  },
];

const EYEBROW = '[ Why one team ]';
const HEADING = "The cost of hiring separately isn't the invoice. It's the handoffs.";
const BODY = 'Every handoff is a place your brief gets reinterpreted or lost. We keep design, build, and growth under one team so what ships is what was meant to convert.';

const HEADING_WORDS = HEADING.split(' ');
const HEADING_DELAY = EYEBROW.length * 0.03 + 0.1;
const AFTER_HEADING_DELAY = HEADING_DELAY + HEADING_WORDS.length * 0.1 + 0.2;

const contentVariants = {
  hidden: {},
  show: {},
};

const eyebrowVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const charVariants = {
  hidden: { opacity: 0, filter: 'blur(6px)' },
  show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.25, ease: 'linear' } },
};

const headingVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: HEADING_DELAY } },
};

const wordVariants = {
  hidden: { opacity: 0, filter: 'blur(12px)', y: 10 },
  show: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.8, ease: EASE } },
};

const tailVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: AFTER_HEADING_DELAY } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
};

const reasonsVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function WhyOneTeam() {
  const sectionRef = useRef(null);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(35);
  const glowX = useSpring(pointerX, { stiffness: 80, damping: 20 });
  const glowY = useSpring(pointerY, { stiffness: 80, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${glowX}% ${glowY}%, rgba(16, 185, 129, 0.16), transparent 70%), radial-gradient(900px circle at 50% 0%, rgba(240, 240, 248, 0.05), transparent 60%)`;

  const handlePointerMove = (event) => {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="Why one team"
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden bg-[#0a0a0b] pb-20 pt-16 font-mono text-fg sm:min-h-screen"
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]" style={{ backgroundImage: glow }} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(rgba(240,240,248,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(240,240,248,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <motion.div
        variants={contentVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="pointer-events-none relative z-10 mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-6 pt-16 text-center will-change-transform sm:pt-24"
      >
        <motion.p
          variants={eyebrowVariants}
          aria-label={EYEBROW}
          className="whitespace-pre font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(240,240,248,0.48)]"
        >
          {Array.from(EYEBROW).map((char, index) => (
            <motion.span key={index} aria-hidden="true" variants={charVariants} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.p>

        <motion.h2
          variants={headingVariants}
          aria-label={HEADING}
          className="max-w-4xl font-mono text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-fg"
        >
          {HEADING_WORDS.map((word, index) => (
            <motion.div
              key={index}
              aria-hidden="true"
              variants={wordVariants}
              className="mr-[0.25em] inline-block will-change-[filter,opacity] last:mr-0"
            >
              {word}
            </motion.div>
          ))}
        </motion.h2>

        <motion.div variants={tailVariants} className="flex w-full flex-col items-center gap-6">
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-[480px] font-mono text-[15px] leading-relaxed text-[rgba(240,240,248,0.8)]"
          >
            {BODY}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 rounded-full border-[0.5px] border-hairline-soft bg-white/[0.02] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-fg-secondary"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-magenta" />
            </span>
            <span className="text-fg">Live</span>
            <span className="h-3 w-px bg-hairline-soft" aria-hidden="true" />
            4 pillars · 1 accountable team
          </motion.div>

          <motion.div variants={itemVariants} className="pointer-events-auto w-full max-w-[420px]">
            <a
              href="#contact"
              className="group flex w-full items-center justify-between rounded-full border-[0.5px] border-[rgba(240,240,248,0.2)] bg-fg px-6 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-magenta hover:text-white"
            >
              Book a Strategy Call
              <i className="ti ti-arrow-right text-base transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.ul
        variants={reasonsVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto mt-20 grid max-w-[1400px] list-none grid-cols-1 border-t-[0.5px] border-hairline-soft px-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {REASONS.map((reason, index) => (
          <motion.li
            key={reason.title}
            variants={itemVariants}
            className="group relative border-b-[0.5px] border-hairline-soft py-8 text-left sm:px-6 sm:[&:nth-child(odd)]:border-r-[0.5px] lg:border-b-0 lg:border-r-[0.5px] lg:last:border-r-0 lg:first:pl-0"
          >
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-magenta transition-transform duration-500 ease-out group-hover:scale-x-100" aria-hidden="true" />
            <div className="mb-6 flex items-center justify-between text-[11px] tracking-[0.2em] text-[rgba(240,240,248,0.48)]">
              <span>0{index + 1}</span>
              <i className={`ti ${reason.icon} text-lg text-fg-secondary transition-colors duration-300 group-hover:text-magenta`} aria-hidden="true" />
            </div>
            <h3 className="mb-3 font-display text-xl font-bold tracking-[-0.02em] text-fg">{reason.title}</h3>
            <p className="text-[13px] leading-relaxed text-fg-muted">{reason.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

export default WhyOneTeam;
