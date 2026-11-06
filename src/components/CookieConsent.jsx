import { useState } from 'react';
import { useLoaderDone } from '../lib/siteLoader';

const STORAGE_KEY = 'pixenect-cookie-consent';

function readConsent() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'accepted' || value === 'rejected' ? value : null;
  } catch {
    return null;
  }
}

function CookieConsent() {
  const [consent, setConsent] = useState(readConsent);
  const [leaving, setLeaving] = useState(false);
  const loaderDone = useLoaderDone();

  if (consent || !loaderDone) return null;

  const choose = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage can be blocked (private mode); the bar still closes for this visit.
    }
    setLeaving(true);
    window.setTimeout(() => setConsent(value), 400);
  };

  const buttonBase =
    'inline-flex h-9 items-center justify-center rounded-full px-5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-magenta/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-6 sm:pb-6">
      <section
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent"
        className={`pointer-events-auto mx-auto flex max-w-[1000px] flex-col items-center gap-6 rounded-3xl border-[0.5px] border-white/15 bg-ink/80 px-5 py-5 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-[24px] transition-all duration-400 ease-out sm:flex-row sm:px-7 ${
          leaving ? 'translate-y-4 opacity-0' : 'animate-nav-in'
        }`}
      >
        <p className="flex-1 text-center font-mono text-[12px] leading-relaxed text-neutral-400 sm:text-left">
          We use cookies to understand how visitors use pixenect.com and to improve the site. You can accept analytics
          cookies or keep only the essentials.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className={`${buttonBase} border-[0.5px] border-white/20 bg-transparent text-neutral-300 hover:border-white/50 hover:text-white`}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className={`${buttonBase} border-[0.5px] border-white bg-white text-ink hover:bg-magenta hover:text-white`}
          >
            Accept
          </button>
        </div>
      </section>
    </div>
  );
}

export default CookieConsent;
