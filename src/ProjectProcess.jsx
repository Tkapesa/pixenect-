import SharedHeader from './SharedHeader';
import './App.css';
import './ProjectProcess.css';
import SiteFooter from './components/SiteFooter';
import ServiceDotVisual from './components/ServiceDotVisual';
import DotPageBackdrop from './components/DotPageBackdrop';
import useRevealOnScroll from './hooks/useRevealOnScroll';
import { Link } from 'react-router-dom';

const PROCESS_VISUAL = {
  category: 'Our process',
  title: 'Six clear stages',
  tagline: 'From first conversation to lasting growth.',
};

const PHASES = [
  {
    step: '01',
    title: 'Client Kick-off',
    summary: 'Align goals, scope, timelines, and success metrics in one shared direction.',
    points: ['Stakeholder workshop', 'Goals and KPI mapping', 'Timeline + communication rhythm'],
  },
  {
    step: '02',
    title: 'Discovery',
    summary: 'Audit your current ecosystem and gather the insights that shape the strategy.',
    points: ['Market and competitor scan', 'User and journey analysis', 'Technical + content audit'],
  },
  {
    step: '03',
    title: 'Strategy Blueprint',
    summary: 'Translate findings into clear architecture, positioning, and execution priorities.',
    points: ['Product and content architecture', 'Feature and sprint roadmap', 'Measurement framework'],
  },
  {
    step: '04',
    title: 'Design and Prototyping',
    summary: 'Design high-impact interfaces and test interaction flows before development.',
    points: ['Wireframes and UI system', 'Interactive prototype', 'Feedback and iteration cycle'],
  },
  {
    step: '05',
    title: 'Agile Development',
    summary: 'Build in focused sprint cycles with weekly demos and transparent progress.',
    points: ['7-day sprint delivery', 'Continuous QA and code review', 'Demo + decision checkpoints'],
  },
  {
    step: '06',
    title: 'Launch and Growth',
    summary: 'Ship confidently, hand over cleanly, and optimize with real performance data.',
    points: ['Launch readiness checklist', 'Training and handover docs', 'Post-launch optimization plan'],
  },
];

const FLOW_STEPS = [
  {
    id: '01',
    title: 'Kick-off Alignment',
    detail: 'Shared goals, scope, and success metrics.',
  },
  {
    id: '02',
    title: 'Discovery Insights',
    detail: 'Research, audits, and opportunity mapping.',
  },
  {
    id: '03',
    title: 'Blueprint Strategy',
    detail: 'Clear product direction and delivery roadmap.',
  },
  {
    id: '04',
    title: 'Build and Launch',
    detail: 'Agile execution, QA, launch, and optimization.',
  },
];

function ProjectProcess() {
  useRevealOnScroll();

  return (
    <main className="app-root process-page">
      <DotPageBackdrop variant="process" />
      <SharedHeader mode="internal" activeNav="Process" />

      <section className="process-hero" data-reveal>
        <div className="process-hero-layout">
          <div className="process-hero-inner" style={{ '--reveal-delay': '40ms' }}>
            <p className="process-eyebrow"><span aria-hidden="true" /> Our process, made clear</p>
            <h1>Good work doesn&apos;t happen <span>by accident.</span></h1>
            <p className="process-hero-copy">
              A clear, collaborative path from the first conversation to a launch
              that keeps delivering. You always know what we&apos;re doing and why.
            </p>
            <div className="process-hero-actions">
              <a href="#lifecycle" className="process-primary-link">
                Explore the process <i className="ti ti-arrow-down" aria-hidden="true" />
              </a>
              <Link to="/#contact" className="process-secondary-link">
                Start a project <i className="ti ti-arrow-up-right" aria-hidden="true" />
              </Link>
            </div>
            <div className="process-hero-meta">
              <span>01 / Align</span><i aria-hidden="true" />
              <span>02 / Create</span><i aria-hidden="true" />
              <span>03 / Grow</span>
            </div>
          </div>
          <ServiceDotVisual service={PROCESS_VISUAL} variant="process" />
        </div>
      </section>

      <section className="process-flow" aria-label="Process flow diagram" data-reveal>
        <div className="process-flow-head" style={{ '--reveal-delay': '80ms' }}>
          <p className="process-section-label">Flow Diagram</p>
          <h2>How the project moves from start to finish.</h2>
        </div>

        <div className="flow-diagram" role="presentation">
          <span className="flow-line" />
          <span className="flow-pulse flow-pulse--a" />
          <span className="flow-pulse flow-pulse--b" />

          {FLOW_STEPS.map((step, index) => (
            <article
              key={step.id}
              className={`flow-node ${index % 2 ? 'flow-node--right' : 'flow-node--left'}`}
              style={{ '--node-order': index }}
            >
              <span className="flow-node-id">{step.id}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="lifecycle" className="process-lifecycle" aria-label="Project lifecycle stages" data-reveal>
        <div className="process-lifecycle-head" style={{ '--reveal-delay': '90ms' }}>
          <p className="process-section-label">Featured Lifecycle</p>
          <h2>A deliberate process. No surprises.</h2>
        </div>

        <div className="process-grid">
          {PHASES.map((phase, index) => (
            <article
              key={phase.step}
              className={`process-card ${index % 2 ? 'process-card--right' : 'process-card--left'}`}
              style={{ '--card-order': index }}
            >
              <span className="process-card-step">{phase.step}</span>
              <h3>{phase.title}</h3>
              <p>{phase.summary}</p>
              <ul>
                {phase.points.map((point) => (
                  <li key={`${phase.step}-${point}`}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="process-cta" data-reveal style={{ '--reveal-delay': '70ms' }}>
        <div className="process-cta-inner">
          <h2>Ready to move your next project forward?</h2>
          <a href="/#contact">Book a strategy call <i className="ti ti-arrow-up-right" aria-hidden="true" /></a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export default ProjectProcess;
