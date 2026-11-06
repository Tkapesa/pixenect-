import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { markGlobeReady, useLoaderDone } from '../lib/siteLoader';
import { detectVisitorLocation, MARKERS, VISITOR_CODE } from '../lib/globeLocations';

const GlobeCanvas = lazy(() => import('./GlobeCanvas.jsx'));

const EASE = [0.22, 1, 0.36, 1];

const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.6 } },
};

const textItem = {
  hidden: { opacity: 0, y: 32, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE } },
};

function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function supportsWebGL2() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

const BADGE_INTERVAL_MS = 2800;

function buildBadgeItems(visitor) {
  const items = MARKERS
    .filter((marker) => marker.hq || marker.code !== visitor?.matchCode)
    .map((marker) => ({ code: marker.code, label: marker.hq ? 'HQ' : 'Online', city: marker.name }));
  if (visitor) items.unshift({ code: visitor.matchCode ?? VISITOR_CODE, label: 'You', city: visitor.name });
  return items;
}

function StatusBadge({ visible, item }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-[84px] z-20 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-ink/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-neutral-300 backdrop-blur-md transition-all duration-700 ease-out lg:left-auto lg:right-[187px] lg:top-[265px] lg:translate-x-0 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-magenta" />
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${item.label}-${item.city}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex items-center gap-2.5"
        >
          <span className="text-white">{item.label}</span>
          <span className="h-3 w-px bg-white/15" />
          {item.city}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function GlobeHero({ onScrollTo }) {
  const sectionRef = useRef(null);
  const [canRenderGlobe] = useState(supportsWebGL2);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeAssembled, setGlobeAssembled] = useState(false);
  const [inView, setInView] = useState(true);
  const finePointer = useMediaQuery('(pointer: fine)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const loaderDone = useLoaderDone();

  const handleGlobeReady = useCallback(() => {
    setGlobeReady(true);
    markGlobeReady();
  }, []);
  const handleGlobeAssembled = useCallback(() => setGlobeAssembled(true), []);

  const [visitor] = useState(detectVisitorLocation);
  const badgeItems = useMemo(() => buildBadgeItems(visitor), [visitor]);
  const [badgeIndex, setBadgeIndex] = useState(0);
  const cycleBadge = globeAssembled && inView && !reduceMotion;

  useEffect(() => {
    if (!cycleBadge) return undefined;
    const timer = setInterval(() => setBadgeIndex((index) => (index + 1) % badgeItems.length), BADGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [cycleBadge, badgeItems.length]);

  const badgeItem = badgeItems[badgeIndex];

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative isolate overflow-hidden bg-ink font-mono text-white"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1.3px)] bg-[size:22px_22px]"
          aria-hidden="true"
        />

        <section
          ref={sectionRef}
          id="home"
          aria-label="Hero"
          className="relative flex h-svh min-h-[560px] w-full flex-col"
        >
          <div className="relative mb-[15svh] mt-[64px] min-h-0 flex-1">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: globeReady ? 1 : 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {canRenderGlobe && (
                <Suspense fallback={null}>
                  <GlobeCanvas
                    onReady={handleGlobeReady}
                    onAssembled={handleGlobeAssembled}
                    interactive={finePointer}
                    running={inView}
                    reduceMotion={reduceMotion}
                    started={loaderDone}
                    visitor={visitor}
                    highlightCode={globeAssembled ? badgeItem.code : null}
                  />
                </Suspense>
              )}
            </motion.div>
          </div>
          <StatusBadge visible={globeAssembled || !canRenderGlobe} item={badgeItem} />
        </section>

        <motion.section
          id="intro"
          aria-label="Introduction"
          variants={textContainer}
          initial="hidden"
          animate={loaderDone ? 'show' : 'hidden'}
          className="relative z-10 -mt-[15svh] px-6 pb-28 text-center md:pb-36"
        >
          <motion.h1
            variants={textItem}
            className="mx-auto bg-linear-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-[clamp(2.2rem,5.6vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.06em] text-transparent"
          >
            <span className="block md:whitespace-nowrap">One team. Multiple services.</span>
            <span className="block md:whitespace-nowrap">Built to grow your business.</span>
          </motion.h1>

          <motion.div
            variants={textItem}
            className="mx-auto mt-14 flex max-w-5xl flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:text-left"
          >
            <div className="max-w-xl">
              <p className="mb-4 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-neutral-400 sm:text-[11px]">
                <span className="hidden text-magenta sm:inline">//</span>
                Digital partner for founders &amp; growing businesses
              </p>
              <p className="text-[13px] leading-relaxed text-neutral-400 md:text-sm">
                Pixenect designs, builds, and grows your website, brand, and marketing as one connected system.
                Nothing gets lost between a designer, a developer, and a marketer who have never spoken to each other.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 rounded-full bg-magenta px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_32px_-6px_rgba(16,185,129,0.7)] transition-colors duration-300 hover:bg-white hover:text-ink"
              >
                Book a Strategy Call
                <i className="ti ti-arrow-up-right text-sm" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => onScrollTo?.('Process')}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/50"
              >
                See How We Work
                <i className="ti ti-arrow-down text-sm" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
    </MotionConfig>
  );
}

export default GlobeHero;
