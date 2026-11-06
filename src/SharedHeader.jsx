import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/background-removed.svg';
import { useLoaderDone } from './lib/siteLoader';

const NAV_ITEMS = [
  { label: 'Home', to: '/#home' },
  { label: 'About', to: '/about' },
  { label: 'Services' },
  { label: 'Process', to: '/process' },
  { label: 'Contact', to: '/#contact' },
];

const SERVICE_LINKS = [
  { label: 'BUILD', to: '/services/web-development' },
  { label: 'GROW', to: '/services/growth-seo' },
  { label: 'AUTOMATE', to: '/services/content-strategy' },
  { label: 'BRANDS', to: '/services/brand-identity' },
];

const WHATSAPP_URL = 'https://wa.me/905428861113';

const FOCUS_RING = 'outline-none focus-visible:ring-2 focus-visible:ring-magenta/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink';

function SharedHeader({ activeNav = 'Home', darkBackground = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);
  const loaderDone = useLoaderDone();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setOpenDropdown(null);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const closeAll = () => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (label) => setOpenDropdown((current) => (current === label ? null : label));
  const isItemActive = (label) => activeNav === label;
  const solid = isScrolled || darkBackground || isMobileMenuOpen;

  return (
    <header
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 ${loaderDone ? 'animate-nav-in' : 'opacity-0'} px-3 pt-3 font-mono transition-opacity duration-700 ease-out sm:px-4`}
    >
      <div
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 rounded-full border pl-5 pr-2 transition-colors duration-500 ${
          solid ? 'border-white/50 bg-ink/80 backdrop-blur-xl' : 'border-white/40 bg-ink/30 backdrop-blur-md'
        }`}
      >
        <Link to="/" aria-label="Pixenect home" className={`relative block h-9 w-[156px] shrink-0 overflow-hidden rounded-md ${FOCUS_RING}`}>
          <img src={logo} alt="Pixenect" width="156" height="36" className="pointer-events-none block h-full w-full scale-[3.4] object-contain invert brightness-[1.12]" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex list-none items-center gap-5 lg:gap-8">
            {NAV_ITEMS.map((item) => {
              const hasDropdown = item.label === 'Services';
              const active = isItemActive(item.label);
              const labelClass = `group relative inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white/80 after:transition-transform after:duration-300 hover:after:scale-x-100 ${active ? 'text-white after:scale-x-100' : 'text-neutral-400'} ${FOCUS_RING}`;

              const open = openDropdown === item.label;
              return (
                <li key={item.label} className={`relative ${hasDropdown ? 'flex items-center gap-1' : ''}`}>
                  {hasDropdown && (
                    <button
                      type="button"
                      className={labelClass}
                      aria-expanded={open}
                      aria-haspopup="true"
                      onClick={() => toggleDropdown(item.label)}
                    >
                      {item.label}
                      <span className={`text-[9px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
                    </button>
                  )}
                  {!hasDropdown && (
                    <Link to={item.to} onClick={closeAll} className={labelClass}>
                      {item.label}
                    </Link>
                  )}
                  {hasDropdown && (
                    <div
                      className={`absolute left-1/2 top-full mt-5 w-72 -translate-x-1/2 rounded-2xl border border-white/20 bg-[#101112]/[0.98] p-2 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-200 ${
                        open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                      }`}
                    >
                      <p className="px-4 pb-2 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                        Explore our services
                      </p>
                      {SERVICE_LINKS.map((link) => (
                        <Link
                          key={link.to + link.label}
                          to={link.to}
                          onClick={closeAll}
                          className={`group flex items-center justify-between rounded-xl px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white ${FOCUS_RING}`}
                        >
                          {link.label}
                          <i className="ti ti-arrow-up-right text-sm text-neutral-600 transition-colors group-hover:text-white" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[#25D366] bg-[#25D366] px-4 py-2.5 text-[11px] font-semibold lowercase tracking-[0.08em] text-ink transition-colors hover:border-[#1ebe5a] hover:bg-[#1ebe5a] ${FOCUS_RING}`}
          >
            <i className="ti ti-brand-whatsapp text-base" aria-hidden="true" />
            <span className="hidden sm:inline">message us</span>
          </a>
          <button
            type="button"
            className={`flex size-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-transparent md:hidden ${FOCUS_RING}`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span className={`block h-px w-4 bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`block h-px w-4 bg-white transition-transform duration-300 ${isMobileMenuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav-panel"
        className={`mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#131313] transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? 'visible max-h-[80svh] opacity-100' : 'invisible max-h-0 opacity-0'
        }`}
      >
        <ul className="max-h-[80svh] list-none overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const hasDropdown = item.label === 'Services';
            const open = openDropdown === item.label;
            const rowClass = `flex w-full items-center justify-between rounded-2xl border-0 bg-transparent px-4 py-4 text-left font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:bg-white/[0.08] hover:text-white ${isItemActive(item.label) ? 'text-white' : 'text-neutral-300'} ${FOCUS_RING}`;

            return (
              <li key={item.label} className="border-b border-white/[0.06] last:border-b-0">
                <div className="flex items-center">
                  {hasDropdown && (
                    <button
                      type="button"
                      className={`${rowClass} flex-1`}
                      aria-expanded={open}
                      onClick={() => toggleDropdown(item.label)}
                    >
                      {item.label}
                      <span className={`text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
                    </button>
                  )}
                  {!hasDropdown && (
                    <Link to={item.to} onClick={closeAll} className={`${rowClass} flex-1 no-underline`}>
                      {item.label}
                    </Link>
                  )}
                </div>
                {hasDropdown && open && (
                  <div className="grid gap-1 px-2 pb-3">
                    {SERVICE_LINKS.map((link) => (
                      <Link
                        key={link.to + link.label}
                        to={link.to}
                        onClick={closeAll}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-neutral-400 hover:bg-white/[0.05] hover:text-white ${FOCUS_RING}`}
                      >
                        {link.label}
                        <i className="ti ti-arrow-up-right text-sm" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="border-t border-white/[0.06] p-3">
          <Link
            to="/#contact"
            onClick={closeAll}
            className={`flex w-full items-center justify-center gap-2 rounded-full border-0 bg-magenta px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white ${FOCUS_RING}`}
          >
            Book a Strategy Call
            <i className="ti ti-arrow-up-right text-sm" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default SharedHeader;
