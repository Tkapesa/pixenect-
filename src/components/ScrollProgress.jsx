import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useLoaderDone } from '../lib/siteLoader';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });
  const [percent, setPercent] = useState(0);
  const loaderDone = useLoaderDone();

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setPercent(Math.round(Math.min(Math.max(value, 0), 1) * 100));
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaderDone ? 1 : 0 }}
      transition={{ duration: 0.8, delay: loaderDone ? 1.2 : 0 }}
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-3 font-mono text-[10px] tabular-nums tracking-[0.2em] text-white mix-blend-difference md:flex lg:right-8"
      aria-hidden="true"
    >
      <span className="relative block h-24 w-px bg-white/25">
        <motion.span className="absolute inset-0 origin-top bg-white" style={{ scaleY: fill }} />
      </span>
      {String(percent).padStart(3, '0')}%
    </motion.div>
  );
}

export default ScrollProgress;
