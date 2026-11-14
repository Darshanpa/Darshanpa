/**
 * Everything on the page that is not a project lives here:
 * identity, navigation, filters, principles, links, and Seva roles.
 */

export const site = {
  name: 'Darshan Patel',
  title: 'Mechanical R&D Engineer & Systems Builder',
  bio: [
    'I design mechanical systems, find out why they fail, and write the software that makes both jobs faster.',
    'The same discipline carries into the community work I lead outside the lab.',
  ],
  description:
    'Engineering portfolio of Darshan Patel: mechanical CAD assemblies, root-cause failure analysis, automotive builds, Python and AI workflows, and community production work.',
  url: 'https://darshan-patel.pw',
  /** Shown in the Signal Orange pill. Set to '' to hide it. */
  status: 'Open to R&D collaboration',
  /** Prefix for spec IDs, e.g. DP-25-01. */
  idPrefix: 'DP',
} as const;

export const socials = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/Darshanpa' },
  // TODO: replace with your LinkedIn profile URL.
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
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
    'Seva is selfless service. I run it the way I run engineering work: clear requirements, a plan volunteers can follow, and a debrief at the end.',
  roles: [
    {
      code: 'SV-01',
      name: 'Community Leadership',
      org: 'Youth volunteer teams',
      period: '2019 to present',
      spec: 'Plan weekly activities, mentor new coordinators, and write the handoff notes so each team starts ahead of the last one.',
    },
    {
      code: 'SV-02',
      name: 'Stage & Prop Production',
      org: 'Annual cultural programs',
      period: '2021 to present',
      spec: 'Lead design, fabrication, transport, and load-in for modular stage sets built by volunteers of every skill level.',
    },
    {
      code: 'SV-03',
      name: 'Volunteer Service',
      org: 'BAPS Swaminarayan Sanstha',
      period: 'Ongoing',
      spec: 'Regular service at the mandir and at regional events: setup, logistics, and whatever the day needs.',
    },
  ],
} as const;
