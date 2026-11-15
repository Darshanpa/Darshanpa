# darshan-patel.pw

Single-page engineering portfolio for Darshan Patel. Built with [Astro](https://astro.build), driven by Markdown, deployed straight from this repository.

- **Layout:** fixed identity rail (30%) and a scrolling stage (70%) with four numbered sections.
- **Interaction:** category filters, inline spec-sheet drawers, and a click-to-zoom figure viewer. No page routes.
- **Content:** one Markdown file per project in `src/content/projects/`.
- **Output:** fully static. No server, no client framework, under 5 kB of JavaScript.

## Run it

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
npm run check     # type-check Astro and TypeScript
```

Requires Node 22 (see `.nvmrc`).

## Structure

```
src/
├─ content.config.ts        Frontmatter schema for projects
├─ content/projects/        One .md per project, plus a folder of its images
├─ data/site.ts             Name, bio, nav, filters, principles, links, Seva roles
├─ lib/projects.ts          Collection query, spec IDs, small helpers
├─ layouts/Base.astro       <head>, fonts, meta tags
├─ pages/index.astro        Decides which projects each section lists
├─ components/
│  ├─ Sidebar.astro         Identity rail
│  ├─ FilterBar.astro       Category pills and live count
│  ├─ Section.astro         Numbered section shell and empty state
│  ├─ BuildGallery.astro    01: card grid
│  ├─ ProjectCard.astro     Card + its drawer
│  ├─ ArchiveTable.astro    02: index table, rows expand
│  ├─ WorkflowList.astro    03: compact rows
│  ├─ SevaRoles.astro       04: standing roles
│  ├─ SpecSheet.astro       Drawer contents
│  └─ Lightbox.astro        Shared figure viewer
├─ scripts/                 drawers.ts, filters.ts, lightbox.ts, scrollspy.ts
└─ styles/global.css        Design tokens and shared rules
```

## Add or edit a project

Create `src/content/projects/my-project.md` and a folder `src/content/projects/my-project/` for its images.

```md
---
title: Two-Stage Planetary Gearbox for a Robotic Joint
summary: One line, shown on cards and rows (160 characters max).
year: 2025
order: 1                      # two-digit sequence; spec ID becomes DP-25-01
domain: Mechanism Design      # Domain column in the archive table
categories: [hardware]        # hardware | failure | software (drives the filter bar); may be empty
section: engineering          # engineering | software | seva
featured: true                # true = card in 01. Selected Builds
tools: [SOLIDWORKS, FEA, GD&T]
org: Acme Robotics            # optional; employer or team
period: Jan 2025 to Apr 2025  # optional; shown instead of the year in the spec sheet
role: Design lead             # optional
duration: 14 weeks            # optional
status: Prototype tested      # optional
objective: >-
  The problem statement, two or three sentences.
outcome: >-
  One or two sentences on the result. Optional.
metrics:
  - { value: '36:1', label: 'Reduction in a 68 mm OD' }
cover: ./my-project/cover.jpg
coverAlt: What the cover image shows
gallery:
  - src: ./my-project/section.png
    alt: What this image shows
    caption: Axial section
---

The Markdown body is the "Engineering Approach" text in the drawer.
Paragraphs, bullet lists, and **bold** lead-ins are styled.
```

Where a project appears:

| Section | Rule |
| --- | --- |
| 01. Selected Builds | `featured: true` |
| 02. Engineering & R&D Archive | `section` is `engineering` or `software` |
| 03. Software & AI Workflows | `categories` includes `software` |
| 04. Seva & Community | `section: seva` |

Images can be JPG, PNG, WebP, AVIF, or SVG at any size. Astro resizes and converts them at build time. 16:9 works best. A missing image or a mistyped field fails the build with a message naming the file.

Set `draft: true` to keep a project out of the build.

To prepare photos (resize, strip location data), run `node tools/prep-image.mjs <project-slug> <photo...>`. Until a project has a real image, point `cover` at `./_shared/pending.svg`.

Each project has a shareable link: `https://darshan-patel.pw/#spec-<file-name>` opens that spec sheet.

## Edit everything else

Name, title, bio, status pill, social links, operating principles, section names, and Seva roles are in `src/data/site.ts`. Colours, fonts, and spacing are CSS variables at the top of `src/styles/global.css`.

To add a filter category, add it to `categories` in `src/data/site.ts` and to the `categories` enum in `src/content.config.ts`.

## Deploy

The site is static, so no adapter is needed.

**Cloudflare Pages**

1. Workers & Pages → Create → Pages → Connect to Git → pick this repository.
2. Framework preset: Astro. Build command: `npm run build`. Output directory: `dist`.
3. After the first deploy: Custom domains → Set up a domain → `darshan-patel.pw`.

**Vercel**

1. Add New → Project → import this repository. Astro is detected automatically.
2. After the first deploy: Settings → Domains → add `darshan-patel.pw`.

**DNS**

The domain is registered at Unstoppable Domains. Either change its nameservers to the pair Cloudflare gives you (simplest with Cloudflare Pages), or keep the current nameservers and add the DNS records the host shows on its domain screen. HTTPS certificates are issued automatically by both hosts.

Every push to the production branch redeploys the site. If the domain changes, update `site` in `astro.config.mjs` and `url` in `src/data/site.ts`.
