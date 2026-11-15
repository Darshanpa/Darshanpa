---
title: Resume Builder Skill for Claude
summary: A Claude skill that tailors a resume to a job description from one experience library, under a rule that nothing is invented.
year: 2026
order: 3
role: Owner and maintainer
domain: AI Workflow
categories: [software]
section: software
tools: [Claude Skills, Prompt Design, docx (Node.js), Markdown]
objective: >-
  Tailoring a resume to each job posting by hand is slow, and a language model left unchecked
  will invent experience. The skill had to produce a recruiter-ready .docx quickly while only
  reordering and emphasizing real accomplishments.
outcome: >-
  A tailored resume comes out as a formatted .docx with every claim traceable to the library.
  The project entries on this site were filled in from the same library.
metrics:
  - { value: '1', label: 'Experience library as the single source of truth' }
  - { value: '8', label: 'Steps from job description to .docx' }
  - { value: '0', label: 'Invented claims allowed by rule' }
cover: ./resume-builder-skill/cover.svg
coverAlt: Workflow diagram from job description through analysis, matching against an experience library, formatting and quality check
---

- **One source of truth.** Every role, project, date, and metric lives in a single experience
  library inside the skill.
- **Never fabricate.** If a posting asks for something that is not in the library, the skill asks
  whether it is real or leaves it out.
- **Workflow.** Analyze the job description, match and prioritize accomplishments, write the
  summary, structure the document, format it, generate the .docx, and run a quality check.
- **Standing rules.** Phrasing rules apply to every document it produces.
- **Output.** A .docx built with the docx library, with table-aligned company and date lines.
