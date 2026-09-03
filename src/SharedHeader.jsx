import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from './assets/background-removed.svg';

const NAV_ITEMS = [
  { label: 'About', section: 'about' },
  { label: 'Services', section: 'services' },
  { label: 'Our Work', section: 'our-work' },
  { label: 'Process', section: 'process' },
  { label: 'Contact', section: 'contact' },
];

const SERVICE_LINKS = [
  { label: 'Web Design', to: '/services/ui-ux-design' },
  { label: 'Web Development', to: '/services/web-development' },
  { label: 'Branding', to: '/services/brand-identity' },
  { label: 'SEO', to: '/services/growth-seo' },
  { label: 'E-Commerce', to: '/services/ecommerce-solutions' },
  { label: 'Content Strategy', to: '/services/content-strategy' },
];

const ABOUT_LINKS = [
  { label: 'About Pixenect', to: '/about' },
  { label: 'Project Process', to: '/process' },
  { label: 'Why Pixenect', to: '/#about' },
  { label: 'Contact Us', to: '/#contact' },
];

function SharedHeader({ mode = 'home', activeNav = 'Home', onNavigateSection, darkBackground = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsAboutOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setIsServicesOpen(false);
        setIsAboutOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const navigateItem = (item) => {
    setIsServicesOpen(false);
    setIsAboutOpen(false);
    if (item.label === 'Process') {
      navigate('/process');
      return;
    }
    if (mode === 'home' && onNavigateSection) {
      onNavigateSection(item.label);
      return;
    }
    if (item.label === 'About') {
      navigate('/about');
      return;
    }
    if (item.label === 'Home') {
      navigate('/');
      return;
    }
    navigate(`/#${item.section}`);
  };

  const isItemActive = (itemLabel) => {
    if (mode === 'home') return activeNav === itemLabel;
    return itemLabel === activeNav;
  };

  return (
    <nav
      ref={navRef}
      className={`nav${isScrolled ? ' nav--scrolled' : ''}${isMobileMenuOpen ? ' nav--open' : ''}${darkBackground ? ' nav--solid' : ''}`}
    >
      <Link to="/" className="nav-logo" aria-label="Go to home page">
        <img src={logo} alt="Pixenect logo" width="194" height="45" className="nav-logo-image" />
      </Link>

      <button
        type="button"
        className="nav-hamburger"
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
        onClick={() => {
          setIsMobileMenuOpen((open) => {
            const next = !open;
            if (next) {
              setIsServicesOpen(false);
              setIsAboutOpen(false);
            }
            return next;
          });
        }}
      >
        <span /><span />
      </button>

      <div className={`nav-body${isMobileMenuOpen ? ' open' : ''}`}>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => {
            if (item.label === 'Services' || item.label === 'About') {
              const isServices = item.label === 'Services';
              const isOpen = isServices ? isServicesOpen : isAboutOpen;
              const links = isServices ? SERVICE_LINKS : ABOUT_LINKS;

              return (
                <div
                  key={item.label}
                  className={`nav-item nav-item--dropdown${isItemActive(item.label) ? ' nav-item--active' : ''}`}
                >
                  <button
                    type="button"
                    className={`nav-link-btn nav-link-btn--dropdown${isItemActive(item.label) ? ' nav-link-btn--dropdown-active' : ''}`}
                    aria-expanded={isOpen}
                    onClick={() => {
                      if (isMobileMenuOpen) {
                        if (isServices) {
                          setIsServicesOpen((open) => !open);
                          setIsAboutOpen(false);
                        } else {
                          setIsAboutOpen((open) => !open);
                          setIsServicesOpen(false);
                        }
                        return;
                      }

                      if (isServices) {
                        setIsServicesOpen((open) => !open);
                        setIsAboutOpen(false);
                      } else {
                        setIsAboutOpen((open) => !open);
                        setIsServicesOpen(false);
                      }
                    }}
                  >
                    {item.label}
                    <i className={`ti ti-chevron-down nav-link-icon${isOpen ? ' nav-link-icon--open' : ''}`} aria-hidden="true" />
                  </button>
                  <div className={`nav-dropdown nav-dropdown--mega${isOpen ? ' open' : ''}`}>
                    <div className="nav-dropdown-panel">
                      {links.map((serviceLink) => (
                        <Link
                          key={`${item.label}-${serviceLink.label}-${serviceLink.to}`}
                          to={serviceLink.to}
                          className="nav-dropdown-link nav-dropdown-link--card"
                          onClick={() => {
                            setIsServicesOpen(false);
                            setIsAboutOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <span>{serviceLink.label}</span>
                          <i className="ti ti-arrow-up-right nav-dropdown-arrow" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.label} className={`nav-item${isItemActive(item.label) ? ' nav-item--active' : ''}`}>
                <button
                  type="button"
                  className="nav-link-btn"
                  onClick={() => {
                    navigateItem(item);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="nav-cta-btn"
          onClick={() => {
            if (mode === 'home' && onNavigateSection) {
              onNavigateSection('Contact');
            } else {
              navigate('/#contact');
            }
            setIsMobileMenuOpen(false);
          }}
        >
          Book a Strategy Call
        </button>
      </div>
    </nav>
  );
}

export default SharedHeader;