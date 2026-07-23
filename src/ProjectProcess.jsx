import SharedHeader from './SharedHeader';
import './App.css';
import './ProjectProcess.css';
import useRevealOnScroll from './hooks/useRevealOnScroll';

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
      <SharedHeader mode="internal" activeNav="Process" />

      <section className="process-hero" data-reveal>
        <div className="process-hero-inner" style={{ '--reveal-delay': '40ms' }}>
          <p className="process-eyebrow">Project Process</p>
          <h1>
            From kick-off to growth, every stage is structured, visible, and built for momentum.
          </h1>
          <p className="process-hero-copy">
            Our lifecycle is designed to turn complex digital work into a clear journey. You always know where
            we are, what is happening next, and how each phase moves your business forward.
          </p>
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

      <section className="process-lifecycle" aria-label="Project lifecycle stages" data-reveal>
        <div className="process-lifecycle-head" style={{ '--reveal-delay': '90ms' }}>
          <p className="process-section-label">Featured Lifecycle</p>
          <h2>Numbered vertical grid with clear action phases.</h2>
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
          <h2>Ready to start your project journey?</h2>
          <a href="/#contact">Book Your Kick-off Call</a>
        </div>
      </section>
    </main>
  );
}

export default ProjectProcess;
