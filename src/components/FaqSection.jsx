import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BlurIn, SplitEyebrow, SplitHeading } from './RevealText';

const EASE = [0.22, 1, 0.36, 1];
const EYEBROW = '[ Questions worth asking ]';

function FaqItem({ item, index, open, onToggle }) {
  const panelId = `faq-panel-${index}`;

  return (
    <BlurIn
      as="li"
      delay={0.08 * index}
      className="group relative border-b-[0.5px] border-hairline-soft first:border-t-[0.5px]"
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 h-full w-px origin-top bg-magenta transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'scale-y-100' : 'scale-y-0'}`}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-start gap-5 border-0 bg-transparent py-6 pl-5 pr-1 text-left font-mono text-fg sm:gap-8 sm:py-7"
      >
        <span className={`pt-1 text-[11px] tracking-[0.2em] transition-colors duration-300 ${open ? 'text-magenta' : 'text-[rgba(240,240,248,0.48)]'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={`flex-1 font-display text-[17px] font-semibold leading-snug tracking-[-0.01em] transition-colors duration-300 sm:text-xl ${open ? 'text-fg' : 'text-fg-secondary group-hover:text-fg'}`}
        >
          {item.q}
        </span>
        <span
          aria-hidden="true"
          className={`relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border-[0.5px] transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'rotate-45 border-magenta bg-magenta' : 'border-[rgba(240,240,248,0.2)] bg-white/[0.02] group-hover:border-[rgba(240,240,248,0.4)]'}`}
        >
          <span className="absolute h-px w-3 bg-fg" />
          <span className="absolute h-3 w-px bg-fg" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            key="panel"
            initial={{ height: 0, opacity: 0, filter: 'blur(6px)' }}
            animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }}
            exit={{ height: 0, opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-[620px] pb-7 pl-5 font-mono text-[14px] leading-relaxed text-[rgba(240,240,248,0.7)] sm:pl-[calc(1.25rem+2rem+1.25rem)]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </BlurIn>
  );
}

function FaqSection({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative overflow-hidden border-t-[0.5px] border-hairline-soft bg-[#0a0a0b] py-24 font-mono text-fg sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(700px_circle_at_15%_20%,rgba(16,185,129,0.08),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(rgba(240,240,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(240,240,248,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_60%)]"
      />

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="flex flex-col items-start gap-6 lg:sticky lg:top-32 lg:self-start">
          <SplitEyebrow text={EYEBROW} />
          <SplitHeading
            text="Before you hire us."
            delay={0.5}
            className="m-0 font-mono text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-fg"
          />
          <BlurIn as="p" delay={0.9} className="m-0 max-w-[420px] text-[15px] leading-relaxed text-[rgba(240,240,248,0.8)]">
            Good work starts with clear expectations. Here are the answers we want you to have before the first call.
          </BlurIn>
          <BlurIn delay={1.15} className="w-full max-w-[420px]">
            <a
              href="#contact"
              className="group flex w-full items-center justify-between rounded-full border-[0.5px] border-[rgba(240,240,248,0.2)] bg-transparent px-6 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-fg no-underline transition-colors duration-300 hover:border-magenta hover:bg-magenta hover:text-white"
            >
              Still unsure? Ask us directly
              <i className="ti ti-arrow-right text-base transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </BlurIn>
        </div>

        <ul className="m-0 list-none p-0">
          {items.map((item, index) => (
            <FaqItem
              key={item.q}
              item={item}
              index={index}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FaqSection;
