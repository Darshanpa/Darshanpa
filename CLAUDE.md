# Working on this repo

Personal engineering portfolio for Darshan Patel, served at darshan-patel.pw. Astro, static, one page.
`README.md` has the file map and frontmatter reference. `docs/GAME_PLAN.md` has the current plan.

## Commands

```sh
npm run dev      # local server
npm run check    # type and content check; must pass
npm run build    # must pass before any commit
```

## Rules that always apply

1. **Never fabricate.** Project text, dates, roles, and numbers come only from Darshan's notes or the experience library in his `resume-builder-skill`. If a fact is missing, ask, or publish the entry with `draft: true`. Do not round, estimate, or embellish.
2. **Employer work needs clearance.** Do not publish photos, CAD, or new detail from Wolf Technical Services or CSI unless Darshan has said that item is cleared.
3. **Protect privacy.** Strip EXIF and GPS from photos before committing. Do not publish his Gmail address or phone number. Flag photos with identifiable faces of other people, especially children, for his review instead of publishing them.
4. **Label what is not real.** Schematic or illustrative figures stay marked as placeholders until a real image replaces them. Never draw invented measurements or data.
5. **Raw CAD stays out of git.** Commit only web assets (optimized images, SVG drawings, compressed GLB).
6. **Content changes are Markdown changes.** One file per project in `src/content/projects/`. Do not hard-code project content in components.
7. **Verify in a browser.** After a content or layout change, build, open the page, and check the changed cards and drawers at desktop and phone width.
8. **Follow the resume skill's standing rules** where they apply to wording: no "Pursuing Six Sigma Green Belt", no Minitab certification claim.

## Style

Dark theme only, tokens at the top of `src/styles/global.css`. Cobalt for technical tags and numbers, Signal Orange for active and hover states. Copy is plain and specific: short sentences, American spelling, no marketing language.
