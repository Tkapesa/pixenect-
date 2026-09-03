import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import './ServiceDetail.css';
import SharedHeader from './SharedHeader';
import logo from './assets/background-removed.svg';
import useRevealOnScroll from './hooks/useRevealOnScroll';

const SERVICE_DATA = {
  'ui-ux-design': {
    category: 'Design',
    icon: 'ti-layout-2',
    title: 'UI/UX Design',
    tagline: 'Interfaces that guide, engage, and convert.',
    description:
      'We design digital products that feel effortless — using in-depth user research, structured information architecture, and pixel-perfect visual execution to create experiences that keep users coming back.',
    metric: { value: '3.2×', label: 'Average increase in user task completion rates across our design projects' },
    deliverables: [
      {
        icon: 'ti-users',
        title: 'User Research',
        desc: 'Interviews, surveys, competitive analysis, and persona development to ground every design decision in real user needs.',
      },
      {
        icon: 'ti-sitemap',
        title: 'Information Architecture',
        desc: 'Logical content hierarchies, navigation structures, and user flows that make complex systems simple to navigate.',
      },
      {
        icon: 'ti-vector-bezier',
        title: 'Wireframing & Prototyping',
        desc: 'From low-fidelity sketches to interactive high-fidelity prototypes ready for stakeholder review and developer handoff.',
      },
      {
        icon: 'ti-layers-difference',
        title: 'UI Design & Design Systems',
        desc: 'Pixel-perfect interfaces with reusable component libraries, tokens, and documented design systems for consistent scale.',
      },
      {
        icon: 'ti-test-pipe',
        title: 'Usability Testing',
        desc: 'Structured testing sessions, heatmaps, and session recordings to validate designs before and after launch.',
      },
      {
        icon: 'ti-file-description',
        title: 'Handoff & Documentation',
        desc: 'Clean Figma files, annotated specs, and dev-ready assets that remove ambiguity from the build phase.',
      },
    ],
    process: [
      { num: '01', title: 'Discover', desc: 'We audit your current experience, interview users, and map competitive benchmarks to identify the highest-impact opportunities.' },
      { num: '02', title: 'Define', desc: 'We synthesise findings into clear user personas, journey maps, and design principles that anchor every decision going forward.' },
      { num: '03', title: 'Design', desc: 'We move from wireframes to fully realised interfaces, collaborating closely with your team through structured review cycles.' },
      { num: '04', title: 'Validate', desc: 'We run usability tests, iterate on findings, and deliver final assets with complete documentation for a seamless handoff.' },
    ],
    tools: ['Figma', 'FigJam', 'Maze', 'Hotjar', 'Miro', 'Notion', 'Zeplin'],
    stats: [
      { value: '4–8 wks', label: 'Typical engagement length' },
      { value: '2–3', label: 'Senior designers assigned' },
      { value: '3', label: 'Revision rounds included' },
      { value: '48 hrs', label: 'Proposal turnaround' },
    ],
    whyUs: [
      { icon: 'ti-microscope', title: 'Research-first, always', desc: 'Every layout, flow, and interaction is validated against real user data — not assumptions. We test, learn, and iterate before a single pixel goes to production.' },
      { icon: 'ti-award', title: 'Senior designers only', desc: 'No juniors handed your brief. Every project is run and reviewed by experienced design leads with deep product and domain expertise.' },
      { icon: 'ti-transfer', title: 'Seamless dev handoff', desc: 'We deliver annotated Figma files, component specs, and asset exports your development team can build from without interpretation.' },
    ],
    caseStudy: {
      tag: 'Case Study',
      client: 'Nova Finance',
      industry: 'Fintech · Enterprise Dashboard',
      result: 'A complete UX overhaul of Nova\'s analytics dashboard used by 12,000 daily active users. We identified critical workflow bottlenecks through user research, redesigned the information architecture, and rebuilt the component system — resulting in a measurable lift across every performance indicator within 60 days of launch.',
      metrics: [
        { value: '+62%', label: 'Task completion rate' },
        { value: '−41%', label: 'Support ticket volume' },
        { value: '4.8/5', label: 'User satisfaction score' },
      ],
    },
    faqs: [
      { q: 'How long does a typical UI/UX project take?', a: 'Most design engagements run 4–8 weeks depending on scope. A focused landing page or single feature can move faster; a full product redesign typically takes 8–12 weeks. We\'ll scope this precisely in the proposal after our discovery call.' },
      { q: 'Do you work with our existing development team?', a: 'Yes, regularly. We collaborate with in-house and third-party dev teams and deliver dev-ready Figma files, component documentation, and design QA support during the build phase.' },
      { q: 'What deliverables will we receive?', a: 'You\'ll receive user research summaries, user flows, wireframes, high-fidelity designs, an interactive prototype, a design system or component library, and full handoff documentation.' },
      { q: 'Can you redesign an existing product without disrupting users?', a: 'Absolutely. We conduct current-state audits first, identify what\'s working, and evolve the design iteratively to minimise disruption and protect existing user familiarity.' },
      { q: 'Do you offer ongoing retainer design support?', a: 'Yes. Many clients engage us monthly after the initial project for feature work, testing, and continuous improvement. We\'ll include retainer options in the proposal.' },
    ],
  },
  'web-development': {
    category: 'Engineering',
    icon: 'ti-code',
    title: 'Web Development',
    tagline: 'Scalable, fast, and built to last.',
    description:
      'We engineer web products with clean architecture, modern frameworks, and a relentless focus on performance and maintainability — from marketing sites to complex full-stack platforms.',
    metric: { value: '98', label: 'Average Google Lighthouse performance score across client deployments' },
    deliverables: [
      {
        icon: 'ti-topology-star-3',
        title: 'Architecture & Planning',
        desc: 'Technology selection, infrastructure scoping, and component architecture designed for your scale and team.',
      },
      {
        icon: 'ti-layout',
        title: 'Front-end Development',
        desc: 'Responsive, accessible, and performant UIs built with React, Next.js, or your preferred stack with pixel-level fidelity.',
      },
      {
        icon: 'ti-server',
        title: 'Back-end & APIs',
        desc: 'REST and GraphQL APIs, database design, authentication, and server-side logic engineered for reliability and speed.',
      },
      {
        icon: 'ti-gauge',
        title: 'Performance Optimisation',
        desc: 'Lighthouse audits, Core Web Vitals tuning, image optimisation, and delivery pipelines that keep scores high.',
      },
      {
        icon: 'ti-shield-check',
        title: 'QA & Testing',
        desc: 'Automated unit, integration, and end-to-end test coverage with documented QA checklists before every release.',
      },
      {
        icon: 'ti-rocket',
        title: 'Deployment & Support',
        desc: 'CI/CD pipelines, cloud deployments, monitoring setup, and ongoing maintenance to keep your product healthy.',
      },
    ],
    process: [
      { num: '01', title: 'Plan', desc: 'We map your technical requirements, select the right stack, and produce a detailed build roadmap with milestones.' },
      { num: '02', title: 'Build', desc: 'Our engineers work in focused sprints with regular demos, keeping stakeholders aligned throughout the development cycle.' },
      { num: '03', title: 'Review', desc: 'Rigorous QA, performance audits, and cross-browser testing ensure every edge case is handled before launch.' },
      { num: '04', title: 'Ship', desc: 'Staged deployments, post-launch monitoring, and a defined support window so launch day is smooth every time.' },
    ],
    tools: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Vercel', 'GitHub Actions'],
    stats: [
      { value: '8–16 wks', label: 'Typical build engagement' },
      { value: '3–5', label: 'Dedicated engineers' },
      { value: '99.9%', label: 'Production uptime target' },
      { value: '48 hrs', label: 'Proposal turnaround' },
    ],
    whyUs: [
      { icon: 'ti-code-dots', title: 'Clean, documented code', desc: 'We write code as if the next engineer inheriting it is a senior developer. Everything is documented, tested, and reviewable from day one.' },
      { icon: 'ti-shield-check', title: 'Security & compliance first', desc: 'OWASP standards, input sanitisation, role-based access, and regular dependency audits built into every project — not added as an afterthought.' },
      { icon: 'ti-headset', title: 'Post-launch care included', desc: 'Every engagement includes a dedicated post-launch support window with monitoring, hotfixes, and performance review built in.' },
    ],
    caseStudy: {
      tag: 'Case Study',
      client: 'Atlas Commerce Suite',
      industry: 'E-commerce · Retail Platform',
      result: 'A full rebuild of Atlas\'s storefront and checkout infrastructure on a modern React/Node.js stack. We replaced a legacy monolithic system blocking growth with a component-driven architecture capable of handling 10× traffic spikes — shipped in 14 weeks.',
      metrics: [
        { value: '+31%', label: 'Checkout conversion rate' },
        { value: '0.8s', label: 'Average page load time' },
        { value: '99.9%', label: 'Production uptime post-launch' },
      ],
    },
    faqs: [
      { q: 'Which technology stack do you use?', a: 'We select the stack based on your requirements, not preference. Most projects use React or Next.js on the front-end and Node.js, PostgreSQL, or a headless CMS on the back-end. We\'re also experienced with Vue, Svelte, and various cloud platforms.' },
      { q: 'Can you work with our existing codebase?', a: 'Yes. We conduct a codebase audit first to understand technical debt and architecture. From there we can extend, refactor, or work alongside your existing code with clear documentation.' },
      { q: 'Do you handle hosting and infrastructure?', a: 'We configure and deploy to platforms like AWS, Vercel, or Netlify, and can manage ongoing infrastructure as part of a retainer. We can also hand infrastructure over to your team with full documentation.' },
      { q: 'What does the post-launch support period include?', a: 'All projects include a 30-day post-launch window covering bug fixes, performance monitoring, and minor adjustments at no additional cost. Extended support is available as a monthly retainer.' },
      { q: 'How do you handle security?', a: 'Security is built into every stage — OWASP Top 10 compliance, dependency auditing, input validation, HTTPS enforcement, and access control reviews are standard practice on all builds.' },
    ],
  },
  'brand-identity': {
    category: 'Branding',
    icon: 'ti-palette',
    title: 'Brand Identity',
    tagline: 'Visual systems that build recognition and trust.',
    description:
      'We craft brand identities that go beyond a logo — developing complete visual languages and strategic positioning frameworks that give businesses a consistent, compelling, and ownable presence.',
    metric: { value: '40+', label: 'Brand identities delivered for startups, scale-ups, and enterprise rebrands' },
    deliverables: [
      {
        icon: 'ti-bulb',
        title: 'Brand Strategy',
        desc: 'Positioning, values, target audiences, and messaging architecture that define who you are and how you communicate.',
      },
      {
        icon: 'ti-pentagon',
        title: 'Logo & Mark Design',
        desc: 'Primary logos, secondary marks, icon variants, and responsive logo systems that work across all contexts and scales.',
      },
      {
        icon: 'ti-palette',
        title: 'Colour & Typography',
        desc: 'A refined palette and type system with clear guidance on usage, hierarchy, and accessible colour combinations.',
      },
      {
        icon: 'ti-book',
        title: 'Brand Guidelines',
        desc: 'A comprehensive brand book documenting every element — from logo clearspace to tone of voice and photography direction.',
      },
      {
        icon: 'ti-file-text',
        title: 'Marketing Collateral',
        desc: 'Business cards, letterheads, presentations, social templates, and digital assets ready for immediate use.',
      },
      {
        icon: 'ti-package',
        title: 'Digital Asset Pack',
        desc: 'All production-ready files in every required format, organised and delivered for your team and external vendors.',
      },
    ],
    process: [
      { num: '01', title: 'Research', desc: 'We analyse your market, competitors, and existing brand equity to surface clear differentiation opportunities.' },
      { num: '02', title: 'Concept', desc: 'We develop multiple strategic directions and present distinct visual concepts with clear rationale for each.' },
      { num: '03', title: 'Refine', desc: 'We develop the chosen direction with your feedback through structured rounds until every detail is right.' },
      { num: '04', title: 'Deliver', desc: 'We hand over a complete, organised asset library with the brand guidelines to maintain consistency independently.' },
    ],
    tools: ['Adobe Illustrator', 'Figma', 'Adobe InDesign', 'Photoshop', 'Notion'],
    stats: [
      { value: '3–6 wks', label: 'Typical engagement length' },
      { value: '2+', label: 'Initial concept directions' },
      { value: '3', label: 'Revision rounds included' },
      { value: 'Print + Digital', label: 'Asset coverage' },
    ],
    whyUs: [
      { icon: 'ti-chess', title: 'Strategy before aesthetics', desc: 'We never open a design tool before understanding your positioning, competitors, and audience. Every visual decision connects back to a strategic foundation.' },
      { icon: 'ti-book-2', title: 'Built for independence', desc: 'Our brand guidelines are written for teams — not designers. Your people can apply the brand consistently without calling us every time.' },
      { icon: 'ti-device-laptop', title: 'Print and digital ready', desc: 'Every asset is delivered in formats suitable for web, print, signage, and social — so you\'re covered regardless of where the brand lives.' },
    ],
    caseStudy: {
      tag: 'Case Study',
      client: 'Meridian Capital',
      industry: 'Financial Services · Rebrand',
      result: 'A complete rebrand for Meridian Capital as they expanded from a regional firm into a pan-European investment group. We developed new positioning, a refined visual language, and a full brand system deployed across offices in 14 markets within 8 weeks.',
      metrics: [
        { value: '+280%', label: 'Unaided brand recall (post-launch survey)' },
        { value: '14', label: 'Markets deployed simultaneously' },
        { value: '3', label: 'Industry design awards received' },
      ],
    },
    faqs: [
      { q: 'What if we already have a logo we want to keep?', a: 'We can work around an existing mark. We\'ll audit what you have, identify what\'s working, and build a comprehensive system around it — or refine the mark if needed.' },
      { q: 'Do you handle naming?', a: 'Yes. Brand naming is available as part of a full strategy engagement. We run naming workshops, trademark screening, and domain availability checks before any visual work begins.' },
      { q: 'How many logo concepts will we see?', a: 'We present a minimum of two distinct strategic directions, each fully rendered with rationale. Most clients choose one direction and refine from there across three structured rounds.' },
      { q: 'What file formats are included in the final delivery?', a: 'You\'ll receive SVG, AI, EPS, PNG (transparent and white/black backgrounds), and PDF versions of all brand marks, plus Figma or InDesign templates for all collateral.' },
      { q: 'Can you roll out the brand across our digital channels?', a: 'Yes. We offer a brand rollout service covering social media templates, email signatures, presentation decks, and website design to ensure consistent application across all touchpoints.' },
    ],
  },
  'growth-seo': {
    category: 'Marketing',
    icon: 'ti-trending-up',
    title: 'Growth & SEO',
    tagline: 'Predictable growth through data-led marketing.',
    description:
      'We build integrated growth programs across organic and paid channels — combining technical SEO, performance advertising, and conversion optimisation to deliver qualified traffic that turns into revenue.',
    metric: { value: '2.8×', label: 'Average increase in qualified organic traffic within 6 months of engagement' },
    deliverables: [
      {
        icon: 'ti-microscope',
        title: 'SEO Audit & Strategy',
        desc: 'Deep technical audits, keyword opportunity mapping, and a prioritised roadmap to capture organic search demand.',
      },
      {
        icon: 'ti-code',
        title: 'Technical SEO',
        desc: 'Site architecture, crawlability, Core Web Vitals, structured data, and indexability fixes that lay the SEO foundation.',
      },
      {
        icon: 'ti-article',
        title: 'Content Strategy & SEO',
        desc: 'Topic clusters, content briefs, and editorial production designed to build authority and rank for high-intent queries.',
      },
      {
        icon: 'ti-ad',
        title: 'Paid Media Campaigns',
        desc: 'Google Search, Display, and Meta ad campaigns managed with full funnel tracking, audience segmentation, and ROAS focus.',
      },
      {
        icon: 'ti-chart-arrows-vertical',
        title: 'Conversion Rate Optimisation',
        desc: 'Landing page testing, form optimisation, and A/B experiments to improve conversion at every stage of the funnel.',
      },
      {
        icon: 'ti-chart-bar',
        title: 'Analytics & Reporting',
        desc: 'Custom GA4 dashboards, attribution modelling, and monthly reports that tie marketing activity to business outcomes.',
      },
    ],
    process: [
      { num: '01', title: 'Audit', desc: 'We assess your current organic footprint, ad performance, site health, and analytics setup to establish a clear baseline.' },
      { num: '02', title: 'Strategy', desc: 'We build a channel-specific growth roadmap with clear targets, budget allocation, and 90-day milestone plan.' },
      { num: '03', title: 'Execute', desc: 'We launch campaigns, publish optimised content, and implement technical fixes with weekly progress updates.' },
      { num: '04', title: 'Optimise', desc: 'Ongoing testing and iteration based on performance data keeps results compounding over time.' },
    ],
    tools: ['Google Analytics 4', 'SEMrush', 'Ahrefs', 'Google Ads', 'Meta Ads', 'Google Search Console', 'Hotjar'],
    stats: [
      { value: '3-month', label: 'Minimum engagement term' },
      { value: 'Weekly', label: 'Performance reporting cadence' },
      { value: '90-day', label: 'Initial growth roadmap' },
      { value: '2.8×', label: 'Avg organic traffic uplift' },
    ],
    whyUs: [
      { icon: 'ti-plug-connected', title: 'Integrated, not siloed', desc: 'We run SEO, content, and paid as one connected program — not isolated tactics. Every channel feeds the others to compound results.' },
      { icon: 'ti-chart-line', title: 'No vanity metrics', desc: 'We report on revenue-tied KPIs: qualified sessions, leads, pipeline, and CAC — not impressions or keyword rankings in isolation.' },
      { icon: 'ti-zoom-money', title: 'Attribution clarity', desc: 'Every campaign includes proper GA4 setup, UTM governance, and attribution modelling so you know exactly what\'s driving returns.' },
    ],
    caseStudy: {
      tag: 'Case Study',
      client: 'Pulse Health',
      industry: 'Health Tech · Patient Acquisition',
      result: 'A 6-month integrated growth program combining technical SEO, targeted content production, and a rebuilt Google Ads funnel. We overhauled their analytics setup first, then executed a phased strategy that doubled organic reach while reducing cost-per-acquisition.',
      metrics: [
        { value: '+186%', label: 'Organic sessions (6 months)' },
        { value: '−42%', label: 'Cost per acquisition' },
        { value: '$2.4M', label: 'Attributed pipeline generated' },
      ],
    },
    faqs: [
      { q: 'How long before we see SEO results?', a: 'Technical fixes can show impact within 4–6 weeks. Content and authority-building typically compound over 3–6 months. We set realistic milestone targets and report progress weekly so there are no surprises.' },
      { q: 'Do you manage ad spend directly?', a: 'Yes. We manage Google Ads and Meta Ads accounts directly, including setup, audience configuration, creative briefing, bid management, and weekly optimisation. Ad spend sits in your billing accounts.' },
      { q: 'What analytics setup do you require?', a: 'We audit and configure GA4, Google Search Console, and any paid platforms at the start of every engagement. Proper tracking is non-negotiable — we won\'t report on data we can\'t trust.' },
      { q: 'Can you work alongside our internal marketing team?', a: 'Yes. We integrate as a specialist layer — handling technical SEO, paid management, and analytics infrastructure while your team focuses on brand and content production if preferred.' },
      { q: 'What is your minimum engagement term?', a: 'We require a 3-month initial commitment for growth programs. This gives enough runway to audit, implement, and start seeing compounding results. Monthly rolling terms are available from month 4 onwards.' },
    ],
  },
  'ecommerce-solutions': {
    category: 'Commerce',
    icon: 'ti-shopping-cart',
    title: 'E-commerce Solutions',
    tagline: 'End-to-end retail platforms built to convert.',
    description:
      'We design and build e-commerce platforms that deliver exceptional buying experiences — from storefront and catalogue through to checkout, payments, and post-purchase flows that maximise customer lifetime value.',
    metric: { value: '31%', label: 'Average checkout conversion improvement across our e-commerce rebuilds' },
    deliverables: [
      {
        icon: 'ti-building-store',
        title: 'Platform Strategy',
        desc: 'Platform selection, migration planning, and technical architecture scoped to your catalogue size, team, and growth plans.',
      },
      {
        icon: 'ti-device-desktop',
        title: 'Storefront Design & Build',
        desc: 'Custom storefront experiences on Shopify, WooCommerce, or bespoke frameworks — designed for conversion and brand.',
      },
      {
        icon: 'ti-category',
        title: 'Product Catalogue & CMS',
        desc: 'Structured product taxonomy, attributes, variants, and a CMS setup your team can manage without developer support.',
      },
      {
        icon: 'ti-credit-card',
        title: 'Checkout Optimisation',
        desc: 'Streamlined multi-step and one-page checkouts, cart recovery flows, and upsell placements that increase order value.',
      },
      {
        icon: 'ti-lock',
        title: 'Payment & Integration',
        desc: 'Secure payment gateway integrations, order management, inventory sync, and third-party fulfilment connections.',
      },
      {
        icon: 'ti-headset',
        title: 'Post-launch Support',
        desc: 'Performance monitoring, seasonal updates, A/B testing, and a dedicated support contact to keep revenue flowing.',
      },
    ],
    process: [
      { num: '01', title: 'Strategy', desc: 'We map your catalogue, customer journey, and technical requirements before any design or development begins.' },
      { num: '02', title: 'Design', desc: 'We craft mobile-first storefronts and checkout flows validated against e-commerce conversion best practices.' },
      { num: '03', title: 'Build', desc: 'Clean, well-tested storefront code with complete integrations, product data, and QA across devices and browsers.' },
      { num: '04', title: 'Launch', desc: 'Staged rollout, performance baseline, and a 30-day post-launch window to monitor, fix, and optimise.' },
    ],
    tools: ['Shopify', 'WooCommerce', 'Stripe', 'Klaviyo', 'Meta Pixel', 'Google Tag Manager', 'Algolia'],
    stats: [
      { value: '6–14 wks', label: 'Typical build timeline' },
      { value: '30-day', label: 'Post-launch support window' },
      { value: '+31%', label: 'Avg checkout conversion lift' },
      { value: 'Mobile-first', label: 'Design approach' },
    ],
    whyUs: [
      { icon: 'ti-device-mobile', title: 'Mobile-first by default', desc: 'Over 70% of e-commerce traffic is mobile. Every storefront we build is designed mobile-first and tested rigorously across all devices and screen sizes.' },
      { icon: 'ti-chart-arrows-vertical', title: 'Conversion-obsessed', desc: 'We apply CRO best practices to every page — from product listings to checkout. Every element earns its place by driving intent toward purchase.' },
      { icon: 'ti-plug-connected', title: 'Fully integrated delivery', desc: 'We handle payments, inventory, email, analytics, and fulfilment integrations as a single connected delivery — no gaps between systems.' },
    ],
    caseStudy: {
      tag: 'Case Study',
      client: 'Vanta Lifestyle',
      industry: 'Direct-to-Consumer · Fashion',
      result: 'A ground-up Shopify storefront rebuild for Vanta Lifestyle, a premium DTC fashion brand selling across 12 markets. We redesigned the entire shopping experience — from discovery through checkout — with a focus on mobile performance and product storytelling.',
      metrics: [
        { value: '+31%', label: 'Checkout conversion rate' },
        { value: '+18%', label: 'Average order value' },
        { value: '4×', label: 'Mobile revenue increase' },
      ],
    },
    faqs: [
      { q: 'Shopify or custom? How do you decide?', a: 'We recommend based on your catalogue complexity, team size, and growth trajectory. Shopify is right for most DTC brands; custom builds make sense when you need capabilities Shopify can\'t provide. We\'ll recommend what serves you best.' },
      { q: 'Can you migrate our existing store?', a: 'Yes. We handle full platform migrations including product data, customer records, order history, URL redirects, and SEO preservation. We\'ve migrated stores with 50,000+ SKUs without traffic loss.' },
      { q: 'Do you handle payment gateway setup?', a: 'Yes — Stripe, PayPal, Klarna, Afterpay, and regional gateways. We configure everything and test all payment flows thoroughly before go-live.' },
      { q: 'What happens after launch?', a: 'All builds include a 30-day support window. We monitor performance, fix any issues, and review conversion data. Many clients move onto a monthly retainer for A/B testing, feature additions, and seasonal campaigns.' },
      { q: 'Can you integrate with our warehouse / ERP system?', a: 'Yes. We have experience integrating with Linnworks, Brightpearl, NetSuite, and custom warehouse systems. Integration scope is included in the technical discovery phase.' },
    ],
  },
  'content-strategy': {
    category: 'Content',
    icon: 'ti-writing',
    title: 'Content Strategy',
    tagline: 'Content programs that build authority and drive growth.',
    description:
      'We develop and execute content strategies that do real business work — supporting SEO, educating buyers, building brand authority, and creating assets that compound in value over time.',
    metric: { value: '4.1×', label: 'Average increase in organic content-driven leads within 12 months' },
    deliverables: [
      {
        icon: 'ti-zoom-scan',
        title: 'Content Audit',
        desc: 'A thorough review of your existing content inventory, identifying gaps, underperforming assets, and quick-win opportunities.',
      },
      {
        icon: 'ti-users',
        title: 'Audience & Persona Research',
        desc: 'Detailed audience profiles and buying journey maps that ensure every piece of content reaches the right person at the right stage.',
      },
      {
        icon: 'ti-calendar',
        title: 'Editorial Calendar',
        desc: 'A prioritised, structured content calendar aligned to SEO targets, campaign moments, and sales pipeline needs.',
      },
      {
        icon: 'ti-file-text',
        title: 'Long-form & Thought Leadership',
        desc: 'Well-researched articles, guides, whitepapers, and case studies that build credibility and generate backlinks.',
      },
      {
        icon: 'ti-edit',
        title: 'Copywriting & Brand Voice',
        desc: 'Website copy, landing pages, email sequences, and ad copy delivered in a consistent tone that reflects your brand accurately.',
      },
      {
        icon: 'ti-chart-line',
        title: 'Performance Tracking',
        desc: 'Content analytics dashboards and monthly reporting that show which assets drive traffic, leads, and revenue.',
      },
    ],
    process: [
      { num: '01', title: 'Audit', desc: 'We catalogue your existing content, assess performance, and identify the most impactful gaps relative to your goals.' },
      { num: '02', title: 'Plan', desc: 'We map a content strategy to your SEO and business objectives, producing a brief for every priority asset.' },
      { num: '03', title: 'Create', desc: 'Our writers and strategists produce content with rigorous research, clear structure, and built-in SEO from the start.' },
      { num: '04', title: 'Measure', desc: 'We track performance monthly, iterate on content that underperforms, and scale what works.' },
    ],
    tools: ['SEMrush', 'Ahrefs', 'Google Analytics 4', 'Notion', 'WordPress', 'Clearscope', 'HubSpot'],
    stats: [
      { value: '3-month', label: 'Minimum engagement term' },
      { value: 'Weekly', label: 'Content calendar cadence' },
      { value: '4.1×', label: 'Avg lead increase (12 months)' },
      { value: 'Monthly', label: 'Performance reporting' },
    ],
    whyUs: [
      { icon: 'ti-search', title: 'SEO-native writing', desc: 'Every brief is informed by keyword research and search intent. We write for people first and optimise for search second — but we never ignore it.' },
      { icon: 'ti-writing', title: 'Consistent brand voice', desc: 'We build a documented tone of voice guide at the start of every engagement so every writer — internal or external — stays on-brand.' },
      { icon: 'ti-chart-line', title: 'Every piece is tracked', desc: 'We connect content directly to pipeline. Every article, guide, and landing page is tracked in GA4 with attribution so you see what\'s working.' },
    ],
    caseStudy: {
      tag: 'Case Study',
      client: 'Horizon Ventures',
      industry: 'Professional Services · B2B',
      result: 'A 12-month content program for Horizon Ventures\' investment advisory blog — moving it from a dormant asset with 800 monthly visitors to a primary lead generation channel. We built a full topic cluster strategy, produced 40+ long-form articles, and implemented proper conversion tracking throughout.',
      metrics: [
        { value: '4.1×', label: 'Content-driven leads (year-on-year)' },
        { value: '312', label: 'Keywords ranking in top 10' },
        { value: '−68%', label: 'Bounce rate reduction' },
      ],
    },
    faqs: [
      { q: 'Do you write the content or just plan it?', a: 'Both. We can produce a full strategy and brief pack for your team to execute, or we can write all content ourselves, or a hybrid of both. We adapt to your team structure and budget.' },
      { q: 'How do you ensure the content matches our brand voice?', a: 'We develop a brand voice guide as part of the onboarding process — covering tone, vocabulary, structure, and examples. Every piece of content is reviewed against it before delivery.' },
      { q: 'How many pieces of content will you produce per month?', a: 'This depends on budget and scope. Typical retainers produce 4–8 pieces of long-form content per month alongside supporting assets. We prioritise quality and strategic fit over volume.' },
      { q: 'Can you optimise our existing content?', a: 'Yes. Content optimisation — updating, expanding, and re-targeting existing pages for improved search performance — is often one of the fastest ways to see results and is included in all full-service engagements.' },
      { q: 'Do you handle content distribution?', a: 'Yes. We can manage social amplification, email newsletter content, and backlink outreach as part of the program to ensure content reaches the audiences it\'s built for.' },
    ],
  },
};

function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = SERVICE_DATA[slug];
  const [openFaq, setOpenFaq] = useState(null);

  useRevealOnScroll([slug]);

  useEffect(() => {
    if (!service) {
      navigate('/');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    setOpenFaq(null);
  }, [slug, service, navigate]);

  if (!service) return null;

  const relatedServices = Object.entries(SERVICE_DATA)
    .filter(([key]) => key !== slug)
    .slice(0, 3);

  return (
    <div className="app-root">
      <SharedHeader mode="internal" activeNav="Services" darkBackground />

      {/* ── Hero ──────────────────────────────────── */}
      <section className="sd-hero" data-reveal>
        <div className="sd-hero-inner" style={{ '--reveal-delay': '30ms' }}>
          <Link to="/#services" className="sd-back">
            <i className="ti ti-arrow-left" aria-hidden="true" />
            Back to services
          </Link>
          <div className="sd-hero-cat">
            <div className="sd-hero-icon">
              <i className={`ti ${service.icon}`} aria-hidden="true" />
            </div>
            <span className="sd-cat-label">{service.category}</span>
          </div>
          <h1 className="sd-hero-title">{service.title}</h1>
          <p className="sd-hero-tagline">{service.tagline}</p>
          <p className="sd-hero-desc">{service.description}</p>
          <div className="sd-metric">
            <div className="sd-metric-num">{service.metric.value}</div>
            <div className="sd-metric-label">{service.metric.label}</div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────── */}
      <div className="sd-stats-bar" data-reveal style={{ '--reveal-delay': '60ms' }}>
        {service.stats.map((stat) => (
          <div className="sd-stat" key={stat.label}>
            <div className="sd-stat-value">{stat.value}</div>
            <div className="sd-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Deliverables ──────────────────────────── */}
      <section className="sd-section" data-reveal>
        <div className="sd-section-header" style={{ '--reveal-delay': '50ms' }}>
          <div className="section-eyebrow">What&apos;s included</div>
          <h2 className="sd-section-title">Everything you need, nothing you don&apos;t.</h2>
        </div>
        <div className="sd-deliverables-grid">
          {service.deliverables.map((item, index) => (
            <div className="sd-deliverable-card" key={item.title} data-reveal style={{ '--reveal-delay': `${80 + index * 70}ms` }}>
              <div className="sd-del-icon">
                <i className={`ti ${item.icon}`} aria-hidden="true" />
              </div>
              <h3 className="sd-del-title">{item.title}</h3>
              <p className="sd-del-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────── */}
      <section className="sd-section sd-whyus-section" data-reveal>
        <div className="sd-section-header" style={{ '--reveal-delay': '50ms' }}>
          <div className="section-eyebrow">Why Pixenect</div>
          <h2 className="sd-section-title">
            What sets our {service.category.toLowerCase()} work apart.
          </h2>
        </div>
        <div className="sd-whyus-grid">
          {service.whyUs.map((item, index) => (
            <div className="sd-whyus-card" key={item.title} data-reveal style={{ '--reveal-delay': `${100 + index * 90}ms` }}>
              <div className="sd-whyus-icon">
                <i className={`ti ${item.icon}`} aria-hidden="true" />
              </div>
              <h3 className="sd-whyus-title">{item.title}</h3>
              <p className="sd-whyus-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Case Study ────────────────────────────── */}
      <section className="sd-section sd-case-section" data-reveal>
        <div className="sd-case-inner" style={{ '--reveal-delay': '70ms' }}>
          <div className="sd-case-label">
            <span className="sd-case-tag">{service.caseStudy.tag}</span>
            <span className="sd-case-industry">{service.caseStudy.industry}</span>
          </div>
          <h2 className="sd-case-client">{service.caseStudy.client}</h2>
          <p className="sd-case-result">{service.caseStudy.result}</p>
          <div className="sd-case-metrics">
            {service.caseStudy.metrics.map((m) => (
              <div className="sd-case-metric" key={m.label}>
                <div className="sd-case-metric-val">{m.value}</div>
                <div className="sd-case-metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────── */}
      <section className="sd-section sd-section--dark" data-reveal>
        <div className="sd-section-header" style={{ '--reveal-delay': '50ms' }}>
          <div className="section-eyebrow sd-eyebrow-light">Our approach</div>
          <h2 className="sd-section-title sd-title-light">
            How we deliver {service.title}.
          </h2>
        </div>
        <div className="sd-process-grid">
          {service.process.map((step, index) => (
            <div className="sd-process-card" key={step.num} data-reveal style={{ '--reveal-delay': `${100 + index * 100}ms` }}>
              <div className="sd-process-num">{step.num}</div>
              <h3 className="sd-process-title">{step.title}</h3>
              <p className="sd-process-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────── */}
      <section className="sd-section sd-faq-section" data-reveal>
        <div className="sd-faq-layout" style={{ '--reveal-delay': '60ms' }}>
          <div className="sd-faq-left">
            <div className="section-eyebrow">Common questions</div>
            <h2 className="sd-section-title">Frequently<br />asked.</h2>
            <p className="sd-faq-sub">
              Can&apos;t find what you&apos;re looking for?{' '}
              <Link to="/#contact" className="sd-faq-contact-link">Ask us directly.</Link>
            </p>
          </div>
          <div className="sd-faq-list">
            {service.faqs.map((faq, i) => (
              <div
                className={`sd-faq-item ${openFaq === i ? 'sd-faq-item--open' : ''}`}
                key={faq.q}
              >
                <button
                  type="button"
                  className="sd-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <i
                    className={`ti ${openFaq === i ? 'ti-minus' : 'ti-plus'}`}
                    aria-hidden="true"
                  />
                </button>
                {openFaq === i && (
                  <div className="sd-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ─────────────────────────────────── */}
      <section className="sd-section sd-tools-section" data-reveal>
        <div className="sd-tools-header" style={{ '--reveal-delay': '60ms' }}>
          <div>
            <div className="section-eyebrow">Tools &amp; technologies</div>
            <h2 className="sd-section-title">
              Our {service.category.toLowerCase()} toolkit.
            </h2>
          </div>
          <div className="sd-tools-list">
            {service.tools.map((tool) => (
              <span className="sd-tool-tag" key={tool}>{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Services ──────────────────────── */}
      <section className="sd-section sd-related-section" data-reveal>
        <div className="sd-section-header" style={{ '--reveal-delay': '50ms' }}>
          <div className="section-eyebrow">Also from Pixenect</div>
          <h2 className="sd-section-title">Related services.</h2>
        </div>
        <div className="sd-related-grid">
          {relatedServices.map(([slugKey, svc], index) => (
            <Link
              to={`/services/${slugKey}`}
              className="sd-related-card"
              key={slugKey}
              data-reveal
              style={{ '--reveal-delay': `${90 + index * 90}ms` }}
            >
              <div className="sd-related-icon">
                <i className={`ti ${svc.icon}`} aria-hidden="true" />
              </div>
              <div className="sd-related-cat">{svc.category}</div>
              <h3 className="sd-related-title">{svc.title}</h3>
              <p className="sd-related-desc">{svc.tagline}</p>
              <span className="sd-related-link">
                View service <i className="ti ti-arrow-right" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="cta-section" id="contact">
        <div className="cta-inner" data-reveal style={{ '--reveal-delay': '60ms' }}>
          <div className="eyebrow cta-ew">Let&apos;s talk</div>
          <h2 className="cta-h">Let&apos;s build something<br />great.</h2>
          <a href="mailto:info@pixenect.com" className="cta-contact-btn">
            CONTACT <i className="ti ti-arrow-up-right" aria-hidden="true" />
          </a>
          <div className="cta-details">
            <a href="tel:+905428861113" className="cta-detail">+90 542 886 1113</a>
            <span className="cta-bull" aria-hidden="true">·</span>
            <a href="mailto:info@pixenect.com" className="cta-detail">info@pixenect.com</a>
          </div>
          <p className="cta-blurb">
            Ready to get started with {service.title}? Tell us about your
            project and we&apos;ll respond with a tailored proposal within 48 hours.
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-cta-band" data-reveal>
          <div className="footer-cta-text">
            <p className="footer-cta-eyebrow">Let's work together</p>
            <h2 className="footer-cta-heading">Ready to build something<br />remarkable?</h2>
          </div>
          <Link to="/#contact" className="footer-cta-action">
            Start a Project <i className="ti ti-arrow-up-right" aria-hidden="true" />
          </Link>
        </div>

        <div className="footer-shell" data-reveal style={{ '--reveal-delay': '120ms' }}>
          <section className="footer-brand-col" aria-label="Company details and contact">
            <div className="footer-brand-name" aria-label="Pixenect logo">
              <img src={logo} alt="Pixenect logo" width="194" height="45" className="footer-brand-logo" />
            </div>
            <p className="footer-brand-copy">
              We design, build, and grow high-performance digital products for
              ambitious brands that want clarity, speed, and measurable results.
            </p>

            <form className="footer-subscribe" onSubmit={(e) => e.preventDefault()}>
              <input
                className="footer-email-input"
                type="email"
                placeholder="Enter your email"
                aria-label="Enter your email"
              />
              <button type="submit" className="footer-subscribe-btn">
                Subscribe <i className="ti ti-arrow-up-right" aria-hidden="true" />
              </button>
            </form>

            <div className="footer-contact-lines">
              <a href="mailto:info@pixenect.com">info@pixenect.com</a>
              <span className="footer-contact-sep" aria-hidden="true">|</span>
              <a href="tel:+905428861113">+90 542 886 1113</a>
            </div>
          </section>

          <section className="footer-links-grid" aria-label="Footer navigation">
            <div className="footer-link-col">
              <h3>Services</h3>
              {Object.entries(SERVICE_DATA).map(([slugKey, svc]) => (
                <Link key={slugKey} to={`/services/${slugKey}`}>{svc.title}</Link>
              ))}
            </div>

            <div className="footer-link-col">
              <h3>Company</h3>
              <Link to="/about">About</Link>
              <Link to="/#services">Services</Link>
              <Link to="/#our-work">Our Work</Link>
              <Link to="/#contact">Contact</Link>
            </div>

            <div className="footer-link-col">
              <h3>Get Started</h3>
              <Link to="/#contact">Start a Project</Link>
              <a href="mailto:info@pixenect.com">Email Us</a>
              <a href="tel:+905428861113">Call Us</a>
              <Link to="/">Back to Home</Link>
            </div>

            <div className="footer-link-col footer-link-col--legal">
              <h3>Legal</h3>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">&copy; 2026 PIXENECT. ALL RIGHTS RESERVED.</div>
          <div className="footer-socials" aria-label="Social links">
            <a href="#" aria-label="Facebook"><i className="ti ti-brand-facebook" aria-hidden="true" /></a>
            <a href="#" aria-label="Instagram"><i className="ti ti-brand-instagram" aria-hidden="true" /></a>
            <a href="#" aria-label="LinkedIn"><i className="ti ti-brand-linkedin" aria-hidden="true" /></a>
            <a href="#" aria-label="X"><i className="ti ti-brand-x" aria-hidden="true" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ServiceDetail;
