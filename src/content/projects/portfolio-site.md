---
title: 'This Site: a Markdown-Driven Portfolio'
summary: A static one-page portfolio built with Astro and Claude Code, where each project is a single Markdown file.
year: 2026
order: 4
role: Designer and editor, built with Claude Code
domain: Web & AI-Assisted Build
categories: [software]
section: software
tools: [Astro, TypeScript, Markdown, CSS, Claude Code]
objective: >-
  I wanted a portfolio I could update by committing one Markdown file, with no CMS, no page
  routes, and nothing between a visitor and the work.
outcome: >-
  Adding a project is one Markdown file and a folder of images. The build refuses to publish a
  project with a missing field or image.
metrics:
  - { value: '1 file', label: 'Per project, in Markdown' }
  - { value: '< 5 kB', label: 'JavaScript shipped' }
  - { value: '0', label: 'Client-side frameworks' }
cover: ./portfolio-site/cover.png
coverAlt: Screenshot of this site with the identity rail on the left and the project gallery on the right
gallery:
  - src: ./portfolio-site/fig-02.png
    alt: Screenshot of a project spec sheet expanded inline below its card
    caption: Inline spec-sheet drawer
  - src: ./portfolio-site/fig-03.svg
    alt: Pipeline from a Markdown file through schema check and Astro build to static HTML and deploy
    caption: Content pipeline
---

- **Content.** Projects live in an Astro content collection with a typed frontmatter schema.
- **Layout.** A fixed identity rail and a scrolling stage, with a filter bar across four numbered
  sections.
- **Interaction.** Cards and table rows expand into spec sheets in place. Each one has its own
  shareable link.
- **Build.** Fully static output, so it deploys from the repository to Cloudflare Pages or
  Vercel without a server.
- **Process.** I set the design brief and the content rules. Claude Code wrote the
  implementation.
