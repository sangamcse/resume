/**
 * Single source of truth for the whole site.
 *
 * index.astro (the human page), resume.json.ts (JSON Resume) and llms.txt.ts
 * (the LLM-facing summary) all read from here, so the human-readable page and
 * the machine-readable endpoints cannot drift apart.
 *
 * Every number here is measured, not estimated. See the notes on `stats`.
 */

export const site = {
  url: 'https://sangam.dev',
  title: 'Sangam Kumar — AI Platform & Infrastructure Engineer',
  tagline: 'I build the infrastructure AI products run on.',
  description:
    'Senior software engineer, seven years building agent runtimes, LLM gateways and ' +
    "the workspace platform behind HackerRank's technical assessments. Ruby, Go and " +
    'Python on AWS, GCP and Azure.',
} as const;

export const person = {
  name: 'Sangam Kumar',
  role: 'Senior Software Engineer',
  focus: 'AI Platform & Developer Infrastructure',
  location: 'Bengaluru, India',
  availability: 'Open to Senior / Lead and AI Engineer roles across APAC and EMEA.',
  email: 'sangamcse.dev@gmail.com',
  links: {
    github: 'https://github.com/sangamcse',
    linkedin: 'https://linkedin.com/in/sangamcse',
  },
  resumes: [
    { label: 'Senior / Lead Engineer', href: '/latex/SANGAM_KUMAR_SWE.pdf' },
    { label: 'AI Engineer', href: '/latex/SANGAM_KUMAR_AI_ENGINEER.pdf' },
  ],
} as const;

/**
 * Measured 2026-08-08 by slicing `gh search prs` per year — the API caps any single
 * query at 1000 results, so an unsliced query silently undercounts. Reviews include
 * open-source work; 273 of them predate HackerRank (2018 alone is 265, from the
 * coala/GSoC period), which is why the label says "incl. open source".
 */
export const stats = [
  { value: '1,412', label: 'PRs reviewed', note: 'incl. open source' },
  { value: '749', label: 'PRs authored', note: 'across 30+ repos' },
  { value: '62', label: 'repositories', note: 'reviewed in' },
  { value: '6', label: 'RFCs written', note: 'architecture & design' },
] as const;

export type CaseStudy = {
  id: string;
  name: string;
  kicker: string;
  stack: string[];
  problem: string;
  approach: string[];
  outcome: string;
  diagram: 'ade' | 'gateway' | 'consolidation';
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'ade',
    name: 'ADE — Agentic Development Environment',
    kicker: 'Giving candidates an agent, without giving away the budget.',
    stack: ['Ruby on Rails', 'Go', 'Kubernetes', 'Anthropic API', 'LiteLLM'],
    problem:
      'Technical assessment assumed a solo human in an editor. That is no longer how ' +
      'engineers work — there is an agent in the loop. Assessing that means handing a ' +
      'candidate a real coding agent inside a locked-down workspace, which raises two ' +
      'awkward questions at once: how do you keep the session contained, and what stops ' +
      'one candidate burning a month of API budget in twenty minutes?',
    approach: [
      'Led the launch across four services — the Rails monolith, workspace service, ADE ' +
        'server and interview frontend — keeping every change backward compatible so it ' +
        'could roll out in stages rather than as one cutover.',
      'Pointed the coding agent at the Anthropic API through our own LLM gateway rather ' +
        'than directly, so per-tenant budgets and rate limits apply to candidate traffic ' +
        'like any other consumer.',
      'Minted a fresh credential per session, so a session cannot outlive its own scope ' +
        'or spend past its own ceiling.',
      'Moved ADE onto its own ingress, and gated backend readiness on the editor and the ' +
        'agent setting up in parallel instead of one after the other.',
    ],
    outcome:
      'Live for candidates. The parallel-setup change removed the dead time candidates ' +
      'used to spend watching a loading state before they could type anything, and ' +
      'versioned deployments meant the agent could be updated without touching the ' +
      'workspace lifecycle around it.',
    diagram: 'ade',
  },
  {
    id: 'llm-gateway',
    name: 'LLM gateway and cost control',
    kicker: 'One governed path for every AI feature in the product.',
    stack: ['Python', 'LiteLLM', 'Portkey', 'OpenAI', 'Anthropic', 'Bedrock'],
    problem:
      'Product teams were calling model providers directly. That works right up until it ' +
      'does not: no per-team visibility, nothing preventing one feature from exhausting ' +
      'quota everyone else depends on, and spend that could not be attributed to the ' +
      'feature that caused it. A shared dependency with no shared controls.',
    approach: [
      'Introduced LiteLLM as the company LLM proxy, so every feature reaches providers ' +
        'through one path instead of many.',
      'Enforced budget, TPM and RPM limits per tenant at the tenant × model level, rather ' +
        'than one global cap that the noisiest consumer would always win.',
      'Added Portkey request metadata so cost became attributable per feature, which is ' +
        'the difference between knowing the bill and knowing why the bill.',
      'Wrote scripts that deliberately try to exhaust a budget. A limit you have never ' +
        'seen refuse a request is not a limit yet.',
    ],
    outcome:
      'Every AI-backed feature now routes through a single governed path with per-feature ' +
      'cost attribution, and the agent sessions from ADE inherit that governance for free ' +
      'rather than needing their own.',
    diagram: 'gateway',
  },
  {
    id: 'consolidation',
    name: 'Consolidating and retiring a bespoke stack',
    kicker: 'The most satisfying diff is the one that deletes a system.',
    stack: ['Ruby on Rails', 'Go', 'Kubernetes', 'AWS', 'GCP', 'Packer'],
    problem:
      'Our DevOps assessment product ran on its own provisioning lifecycle — it reached ' +
      'for EC2 directly and carried its own cron jobs and background workers, entirely ' +
      'separate from the shared workspace platform everything else used. Every runtime ' +
      'feature had to be built twice, warm capacity was paid for twice, and when something ' +
      'broke inside it there was very little to look at.',
    approach: [
      'Added support for the product inside the shared workspace layer, running on the ' +
        'multi-cloud Workspace Service across AWS and GCP, so it became one more consumer ' +
        'of a system the team already understood.',
      'Migrated assessment, interview and CodePair traffic across incrementally, which took ' +
        'time but meant there was never a flag day.',
      'Then wrote and executed the RFC to retire the old stack — gating the deploy on zero ' +
        'in-flight legacy workspaces, because an unfinished one would have lost its ' +
        'lifecycle callbacks the moment the code went away.',
      'Preserved every historical report contract, with no data migration at all. Reports ' +
        'written years earlier still resolve.',
    ],
    outcome:
      'Shut down an EKS cluster, a managed Redis, 9 production cron jobs and 6 background ' +
      'workers. One provisioning path instead of two, on infrastructure that is observable ' +
      'and already maintained.',
    diagram: 'consolidation',
  },
];

export type AlsoBuilt = {
  name: string;
  summary: string;
  stack: string;
  link?: { href: string; label: string };
  featured?: boolean;
};

export const alsoBuilt: AlsoBuilt[] = [
  {
    name: 'Projects Question Creation API (v3)',
    summary:
      'Designed and shipped the public REST API for question creation — create and update, ' +
      'environment discovery, project-zip upload — and wrote the customer-facing ' +
      'documentation for it.',
    stack: 'Ruby on Rails · OpenAPI',
    link: {
      href: 'https://documenter.getpostman.com/view/32771566/2sBXwyFSSP',
      label: 'View API docs',
    },
    featured: true,
  },
  {
    name: 'environment-service',
    summary:
      'Built from scratch in Go. Manages 60+ assessment environments, covering the schema ' +
      'and PostgreSQL setup, container packaging, Helm charts, Jenkins pipelines and ' +
      'monitoring.',
    stack: 'Go · Gin · PostgreSQL · Helm',
  },
  {
    name: 'runtime-manager',
    summary:
      'A chunk-based runtime orchestrator that composes language and tooling layers into ' +
      'images, which brought environment onboarding down from over two months to about a week.',
    stack: 'Go · Docker · Packer',
  },
  {
    name: 'GenAI assessments',
    summary:
      'Designed and launched the Prompt Engineering question type from nothing to general ' +
      'availability, then the RAG and Agent modules, plus an OpenAI tool runtime and ' +
      'GPU-backed images. Still maintain them as models change underneath.',
    stack: 'Python · OpenAI · LlamaIndex',
  },
  {
    name: 'Azure Cloud Skills Assessment',
    summary:
      'A Go service that hands every candidate an isolated Azure account through Microsoft ' +
      'Entra ID and the Graph API, and manages the credential lifecycle, MFA reset and sign-out.',
    stack: 'Go · Azure · Entra ID · Graph API',
  },
  {
    name: 'Reliability and observability',
    summary:
      'Fixed a long-standing class of duplicate-event and transaction-race failures in the ' +
      'workspace event pipeline. Traced a provisioning slowdown that had run for weeks to a ' +
      'single NAT address silently dropping traffic on one of four addresses, which is why it ' +
      'presented as an even failure rate rather than an outage.',
    stack: 'Prometheus · Redash · OpenTelemetry',
  },
  {
    name: 'Security and compliance',
    summary:
      'Ran container-registry credential rotation across five repositories, cleared pending ' +
      'dependency vulnerabilities in Go and Ruby services, and added the infrastructure ' +
      'tagging required for compliance audits.',
    stack: 'AWS · Dependabot',
  },
];

export type OpenSource = {
  name: string;
  href: string;
  summary: string;
};

export const openSource: OpenSource[] = [
  {
    name: 'ttyd',
    href: 'https://github.com/tsl0922/ttyd',
    summary:
      'Upstream patches to the terminal-over-websocket server: focus and blur events so ' +
      'presence could be tracked inside an iframe, and a ping interval to keep collaborative ' +
      'interview sessions alive.',
  },
  {
    name: 'coala / coala-bears',
    href: 'https://github.com/coala/coala-bears',
    summary:
      'Google Summer of Code 2018. Wrote three new static-analysis Bears for Ruby and ' +
      'Crystal, wrapping Brakeman, Fasterer and Ameba, and improved pytest coverage across ' +
      'the core. Design written up as cEP-0027.',
  },
  {
    name: 'rspec-tracer',
    href: 'https://github.com/hackerrank/rspec-tracer',
    summary:
      'Fixed a cache-correctness bug in the Ruby test-selection tool: nil cached coverage ' +
      'was not handled and a memoized value was recomputed when it should not have been.',
  },
  {
    name: 'Google Summer of Code',
    href: 'https://summerofcode.withgoogle.com/',
    summary:
      'Student developer in 2018, then returned as a student mentor in 2019, reviewing and ' +
      'guiding a contributor through their own project.',
  },
];

export type Role = {
  title: string;
  org: string;
  period: string;
  location: string;
  note: string;
};

export const roles: Role[] = [
  {
    title: 'Senior Software Engineer',
    org: 'HackerRank',
    period: 'Jul 2022 — Present',
    location: 'Bengaluru, India',
    note:
      'Agent runtimes, LLM gateways and the workspace platform. Main reviewer for the ' +
      'platform, on the system design interview panel, and author of the RFCs and RCAs ' +
      'behind most of the work above.',
  },
  {
    title: 'Software Development Engineer II',
    org: 'HackerRank',
    period: 'Jan 2021 — Jun 2022',
    location: 'Remote',
    note:
      'Scaled the DevOps assessment platform to 1,000 concurrent servers. Launched a shared ' +
      'interactive terminal for live interviews, after which usage grew 500%.',
  },
  {
    title: 'Software Development Engineer',
    org: 'HackerRank',
    period: 'Jul 2019 — Dec 2020',
    location: 'Bengaluru, India',
    note:
      'Scaled the DevOps assessment tool to handle 900% more concurrent candidate sessions, ' +
      'and set up the SLA capture and monitoring the team measured itself against.',
  },
  {
    title: 'Software Development Engineer Intern',
    org: 'HackerRank',
    period: 'Jan 2019 — Jun 2019',
    location: 'Bengaluru, India',
    note:
      'Moved legacy Backbone pages to React and built the shared UI icons library, ' +
      'generating React components from SVG automatically.',
  },
];

export const skills = [
  {
    group: 'AI engineering',
    items: [
      'LLM gateways (LiteLLM, Portkey)',
      'Anthropic & OpenAI APIs',
      'agentic runtimes',
      'RAG',
      'MCP',
      'prompt engineering',
      'guardrails',
      'token & cost budgeting',
      'LlamaIndex',
    ],
  },
  {
    group: 'Languages',
    items: ['Ruby', 'Go', 'Python', 'TypeScript', 'JavaScript', 'C++', 'Java', 'Bash'],
  },
  {
    group: 'Frameworks',
    items: ['Ruby on Rails', 'RSpec', 'Gin', 'FastAPI', 'Node', 'React', 'Next.js', 'Flutter'],
  },
  {
    group: 'Data',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch / OpenSearch', 'Redshift'],
  },
  {
    group: 'Infrastructure',
    items: [
      'AWS',
      'GCP',
      'Azure',
      'Kubernetes',
      'Docker',
      'Terraform',
      'Helm',
      'Packer',
      'Jenkins',
    ],
  },
  {
    group: 'Observability',
    items: ['Prometheus', 'Grafana', 'OpenTelemetry', 'New Relic', 'Kibana', 'Redash'],
  },
];

export const education = {
  institution: 'National Institute of Technology, Sikkim',
  degree: 'B.Tech, Computer Science and Engineering',
  period: 'Aug 2015 — May 2019',
};
