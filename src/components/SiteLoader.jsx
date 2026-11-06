import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import logo from '../assets/background-removed.svg';
import { isGlobeReady, markLoaderDone } from '../lib/siteLoader';

const MIN_VISIBLE_MS = 1100;
const MAX_VISIBLE_MS = 4000;
const EASE = [0.76, 0, 0.24, 1];

function supportsWebGL2() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const { pathname } = useLocation();
  const barRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const waitsForGlobe = pathname === '/' && supportsWebGL2();
    let pageLoaded = document.readyState === 'complete';
    const onLoad = () => {
      pageLoaded = true;
    };
    window.addEventListener('load', onLoad);

    const start = performance.now();
    let progress = 0;
    let frame = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const ready = (waitsForGlobe ? isGlobeReady() : pageLoaded) || elapsed >= MAX_VISIBLE_MS;
      const target = ready ? 100 : Math.min(88, (elapsed / MIN_VISIBLE_MS) * 70);
      progress += (target - progress) * (ready ? 0.14 : 0.06);
      if (ready && progress > 99.4) progress = 100;

      if (barRef.current) barRef.current.style.transform = `scaleX(${progress / 100})`;
      if (counterRef.current) counterRef.current.textContent = String(Math.round(progress)).padStart(3, '0');

      if (progress === 100 && elapsed >= MIN_VISIBLE_MS) {
        markLoaderDone();
        setVisible(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('load', onLoad);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading Pixenect"
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink font-mono text-white"
          exit={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: reduceMotion ? 0.3 : 0.9, ease: EASE }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1.3px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-magenta/10 blur-[120px]"
            aria-hidden="true"
          />

          <motion.div
            className="relative flex w-[220px] flex-col items-center"
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="relative block h-11 w-[190px] overflow-hidden">
              <img
                src={logo}
                alt=""
                width="190"
                height="44"
                className="pointer-events-none block h-full w-full scale-[3.4] object-contain invert brightness-[1.12]"
              />
            </span>

            <span className="relative mt-8 block h-px w-full overflow-hidden bg-white/10" aria-hidden="true">
              <span
                ref={barRef}
                className="absolute inset-0 origin-left bg-magenta shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                style={{ transform: 'scaleX(0)' }}
              />
            </span>

            <span className="mt-4 flex w-full items-center justify-between text-[10px] uppercase tracking-[0.28em] text-neutral-500">
              <span>One team</span>
              <span className="tabular-nums text-white">
                <span ref={counterRef}>000</span>%
              </span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SiteLoader;
