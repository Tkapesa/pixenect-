import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import SharedHeader from './SharedHeader';
import CtaSection from './components/CtaSection';
import DottedSphere from './components/DottedSphere';
import FaqSection from './components/FaqSection';
import GlobeHero from './components/GlobeHero';
import MethodScroll from './components/MethodScroll';
import ProcessTimeline from './components/ProcessTimeline';
import SiteFooter from './components/SiteFooter';
import WhyOneTeam from './components/WhyOneTeam';
import useLenis from './hooks/useLenis';
const SERVICES = [
  {
    num: '01',
    title: 'BUILD',
    summary: 'Turn your ideas into digital products.',
    description: 'From professional websites to custom software, we design and develop digital solutions built around your business needs.',
    items: ['Websites', 'Web Applications', 'Mobile Applications', 'Custom Software'],
    cta: 'Explore Build',
    to: '/services/web-development',
  },
  {
    num: '02',
    title: 'GROW',
    summary: 'Reach more people. Have more leads.',
    description: 'We help your business become more visible, attract the right audience, and turn digital attention into measurable growth.',
    items: ['Digital Marketing', 'Search Engine Optimization (SEO)', 'Social Media Management', 'Lead Generation'],
    cta: 'Explore Growth',
    to: '/services/growth-seo',
  },
  {
    num: '03',
    title: 'AUTOMATE',
    summary: 'Work smarter. Do more with less.',
    description: 'We replace repetitive manual processes with intelligent systems that save time, reduce errors, and improve the way your business operates.',
    items: ['Business Process Automation', 'CRM Systems', 'Workflow Automation', 'AI-Powered Business Tools'],
    cta: 'Explore Automation',
    to: '/services/content-strategy',
  },
  {
    num: '04',
    title: 'BRAND',
    summary: 'Build a brand your target market remembers.',
    description: 'We create distinctive visual identities and digital experiences that communicate your vision and value, thereby positioning your business for success.',
    items: ['Brand Identity', 'Graphic Design', 'UI/UX Design', 'Corporate Communications'],
    cta: 'Explore Branding',
    to: '/services/brand-identity',
  },
];

const CAPABILITIES = SERVICES.flatMap((service) => service.items);

const FAQS = [
  { q: 'What does Pixenect actually do day to day?', a: 'We bring strategy, brand, design, development, marketing, and content together around one business goal. Depending on what you need, we can provide individual services or the connected system.' },
  { q: 'Do you work with early-stage founders or only established businesses?', a: 'Both. We help founders build credibility quickly and help established businesses untangle a digital presence that has stalled. We will be direct about fit, scope, and what is realistic.' },
  { q: 'Why hire one team instead of a freelancer for each piece?', a: 'A freelancer may cost less per hour, but separate vendors create handoffs where context gets lost. One team means the brand, site, and growth plan start from the same brief and one group owns the result.' },
  { q: 'How is this different from hiring a bigger branding studio?', a: 'We are not competing on pedigree or a beautiful handoff. The team that shapes the direction also builds and improves what ships, so you do not need to find another partner to make the work real.' },
  { q: 'How long does a typical project take?', a: 'Timing depends on scope and how quickly decisions can be made. We work in focused delivery cycles with clear milestones, and we will give you a practical timeline before work begins.' },
  { q: 'What do you need from us during the project?', a: 'A clear decision-maker, access to the current site and analytics, and timely feedback. We structure the work so your team can stay involved without having to manage every task.' },
  { q: 'What happens after launch?', a: 'We can hand over a clean, documented system or stay involved to improve conversion, content, and performance. The right model depends on what your team needs next.' },
  { q: 'How much does this cost?', a: 'There is no useful price list without knowing the problem. Book a strategy call and we will clarify the work, the priorities, and the investment before asking you to commit.' },
];

const PROCESS_STEPS = [
  ['01', 'Discovery', 'We align on the business problem, audience, constraints, and the result that matters.'],
  ['02', 'Direction', 'We turn the findings into a clear position, structure, and delivery plan.'],
  ['03', 'Build', 'Design, development, content, and QA move together in focused cycles.'],
  ['04', 'Launch + growth', 'We ship, learn from real behavior, and keep improving what brings in business.'],
];

const SECTION_MAP = { Home: 'home', Services: 'services', Process: 'process', About: 'about', Contact: 'contact' };

function App() {
  const [activeNav, setActiveNav] = useState('Home');
  useLenis();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const targetId = decodeURIComponent(location.hash.slice(1));
    requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      if (!target) return;
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }, [location.hash, location.pathname, location.key]);

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.35;
      let closest = Infinity;
      let activeKey = null;
      Object.entries(SECTION_MAP).forEach(([key, id]) => {
        const element = document.getElementById(id);
        if (!element) return;
        const distance = Math.abs(element.getBoundingClientRect().top - threshold);
        if (distance < closest) { closest = distance; activeKey = key; }
      });
      if (activeKey) setActiveNav(activeKey);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.setAttribute('data-revealed', 'true'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (item) => {
    const target = document.getElementById(SECTION_MAP[item]);
    if (!target) return;
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    setActiveNav(item);
  };

  return (
    <main className="app-root">
      <SharedHeader activeNav={activeNav} />

      <GlobeHero onScrollTo={scrollToSection} />

      <MethodScroll phases={SERVICES} />

      <WhyOneTeam />

      <ProcessTimeline steps={PROCESS_STEPS} />

      <FaqSection items={FAQS} />

      <DottedSphere tags={CAPABILITIES} />

      <CtaSection />

      <SiteFooter />
    </main>
  );
}

export default App;
