import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, amount: 0.6 };

const charVariants = {
  hidden: { opacity: 0, filter: 'blur(6px)' },
  show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.25, ease: 'linear' } },
};

const wordVariants = {
  hidden: { opacity: 0, filter: 'blur(12px)', y: 10 },
  show: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function SplitEyebrow({ text, delay = 0, className = '' }) {
  return (
    <motion.p
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: delay } } }}
      aria-label={text}
      className={`whitespace-pre font-mono text-[11px] uppercase tracking-[0.28em] text-[rgba(240,240,248,0.48)] ${className}`}
    >
      {Array.from(text).map((char, index) => (
        <motion.span key={index} aria-hidden="true" variants={charVariants} className="inline-block">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function SplitHeading({ text, as = 'h2', delay = 0, className = '' }) {
  const Tag = motion[as];
  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: delay } } }}
      aria-label={text}
      className={className}
    >
      {text.split(' ').map((word, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          variants={wordVariants}
          className="mr-[0.25em] inline-block will-change-[filter,opacity] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

export function BlurIn({ as = 'div', delay = 0, className = '', children, ...props }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
}
