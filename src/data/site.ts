/**
 * Everything on the page that is not a project lives here:
 * identity, navigation, filters, principles, links, and Seva roles.
 */

export const site = {
  name: 'Darshan Patel',
  title: 'Mechanical R&D Engineer & Systems Builder',
  bio: [
    'Mechanical engineer at Wolf Technical Services, building test hardware for rotor and engine programs.',
    'Before that, two years in packaging R&D, where root cause work cut consumer defect rates by more than 80%.',
  ],
  /** Short factual lines under the bio. */
  credentials: [
    'B.S. Mechanical Engineering, Rose-Hulman, 2023',
    'Shainin RED X Apprentice certified',
  ],
  description:
    'Engineering portfolio of Darshan Patel: engine and rotor test hardware, root cause analysis, investment casting, Formula SAE brakes, AI workflows, and community service.',
  url: 'https://darshan-patel.pw',
  /** Shown in the Signal Orange pill. Set to '' to hide it. */
  status: 'Now at Wolf Technical Services',
  /** Prefix for spec IDs, e.g. DP-25-01. */
  idPrefix: 'DP',
} as const;

export const socials = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/Darshanpa' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/darshan-patel-31882a195' },
  // TODO: point this at a mailbox that exists (set up forwarding for the domain, or use another address).
  { id: 'email', label: 'Email', href: 'mailto:hello@darshan-patel.pw' },
] as const;

export const sections = [
  { id: 'builds', number: '01', nav: 'Selected Builds', heading: 'Selected Builds' },
  { id: 'archive', number: '02', nav: 'Engineering & R&D', heading: 'Engineering & R&D Archive' },
  { id: 'software', number: '03', nav: 'Software & Workflows', heading: 'Software & AI Workflows' },
  { id: 'seva', number: '04', nav: 'Seva & Community', heading: 'Seva & Community' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export const categories = [
  { id: 'hardware', label: 'Hardware & CAD' },
  { id: 'failure', label: 'Failure Analysis' },
  { id: 'software', label: 'Software & AI' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? id;

export const principles = [
  {
    code: 'OP-01',
    name: 'First-Principles Rigor',
    spec: 'Reduce the problem to physics and data before opening CAD.',
  },
  {
    code: 'OP-02',
    name: 'Selfless Execution',
    spec: 'The work serves the team and the mission. Credit is not a requirement.',
  },
  {
    code: 'OP-03',
    name: 'Continuous Mastery',
    spec: 'Every build ends with a teardown of what to do better next time.',
  },
] as const;

/** 04. Seva & Community: standing roles, listed under the project entries. */
export const seva = {
  intro:
    'Seva is selfless service. Most of mine has been with BAPS in Robbinsville, New Jersey, alongside founding and leading student organizations at Rose-Hulman.',
  roles: [
    {
      code: 'SV-01',
      name: 'Field Operations & Fabrication Volunteer',
      org: 'BAPS Swaminarayan Akshardham, Robbinsville, NJ',
      period: 'May to Jun 2026',
      spec: 'Six weeks on site during temple construction, working alongside professional fabricators and welders. Repaired field machinery from demolition saws to small bulldozers, helped an electrician install and wire panels, and supported security and visitor services.',
    },
    {
      code: 'SV-02',
      name: 'President & Co-Founder',
      org: 'Alpha Phi Omega National Service Fraternity, Terre Haute, IN',
      period: 'May 2021 to Jul 2023',
      spec: 'Co-founded a campus service organization and led it through its first years, mentoring members through event leadership and community service.',
    },
    {
      code: 'SV-03',
      name: 'Team President',
      org: 'Human Powered Vehicle Team, Rose-Hulman',
      period: 'May 2021 to Jul 2023',
      spec: 'Led the team through two competition cycles with podium finishes at three ASME competitions, and built its culture through coaching and clear accountability.',
    },
  ],
} as const;
