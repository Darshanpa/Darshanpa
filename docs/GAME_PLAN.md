# Game plan: all projects, real pictures, continuous updates

Written 2026-11-15 for a Claude Opus 5.5 session picking this repo up cold.
Read `README.md` first for the file map and the frontmatter reference, and `CLAUDE.md` for the standing rules.

## Where things stand

- The site is built and pushed: Astro, static, one page, `src/content/projects/*.md` drives everything.
- 11 projects are live in the content folder. Their text comes from the experience library in Darshan's `resume-builder-skill`. Nothing is invented.
- Every figure except the two site screenshots is a schematic placeholder SVG (labelled "Placeholder · Illustrative"). Replacing these with real photos and CAD is the main job.
- Not done yet: hosting connected, domain pointed, a working contact email.
- The only branch is `ccr-483aa1cd-l3yf7v`, which is also the default branch.

## The outcome Darshan wants

1. Every real project is on the site with real pictures and CAD.
2. He drops raw files somewhere convenient and the site updates itself. He does not edit Markdown.
3. Nothing false or unapproved is ever published.

## Decisions to get from Darshan first

Ask these once, at the start. A recommended default is given for each; proceed on the default if he says "your call".

| # | Decision | Recommended default |
| --- | --- | --- |
| 1 | Where he drops files | A Google Drive folder named `Portfolio Inbox` (works from his phone, no size limit that matters, raw CAD stays out of git). Fallback: `inbox/` in this repo for small files. |
| 2 | How updates go live | Each run opens a pull request with a preview link; he merges from his phone. Move to auto-merge for photo-only updates once he trusts it. |
| 3 | Host | Cloudflare Pages (free, gives a preview URL per pull request). |
| 4 | How often the system checks the inbox | Daily at a quiet hour, plus on demand when he says "process the inbox". |
| 5 | Contact email | Set up forwarding for `hello@darshan-patel.pw`, or approve another address. His Gmail is not to be published without a yes. |
| 6 | Employer material | Wolf Technical Services and CSI work stays text-only until he confirms each employer is fine with photos or CAD being public. |

## Phase 1: go live (mostly Darshan's clicks; guide him)

1. Rename the default branch to `main` in GitHub settings. Use `main` as production from then on.
2. Connect the repo in Cloudflare Pages: build command `npm run build`, output `dist`, Node 22.
3. Add `darshan-patel.pw` as the custom domain and change DNS at Unstoppable Domains as Cloudflare instructs.
4. Fix the email link in `src/data/site.ts` per decision 5.

Done when `https://darshan-patel.pw` serves the site over HTTPS and a pull request gets its own preview URL.

## Phase 2: build the intake tooling (in this repo)

Create `tools/intake/` and an `npm run intake` entry point. Keep each step a small script that can be run alone.

**Photos**
- Accept JPG, PNG, HEIC, WebP. Convert HEIC to JPEG.
- Resize so the long edge is at most 2400 px. Astro makes the smaller sizes at build time.
- Strip EXIF, especially GPS, before the file is committed.
- Rename to `01-short-description.jpg` in shot order.
- Write alt text by looking at the image. Write captions only from his notes.
- Pick the cover: the clearest overall view that survives a 16:9 crop.

**CAD**
- Ask Darshan to export **STEP** (or STL/3MF/GLB) from SolidWorks or Creo. Native `.sldprt`, `.sldasm`, and `.prt` files cannot be opened here; if he sends those, ask for a STEP export.
- From each STEP file produce:
  - hidden-line SVG drawings (isometric plus one orthographic view) in the site palette: cobalt linework on the dark canvas. These match the existing figure style and stay tiny.
  - optionally a compressed GLB under about 3 MB for the 3D viewer in Phase 5.
- Suggested route: `build123d` (import STEP, project to viewport, export SVG and glTF). Check the current build123d docs before relying on any function name, and render one known part end to end before processing a batch.
- If a shaded render is wanted, load the GLB in a small three.js page and screenshot it with the pre-installed Playwright Chromium.

**Ledger**
- `tools/intake/ledger.json` records every source file processed: Drive file ID or path, checksum, project slug, date, output files. A run processes only what is not in the ledger or has a new checksum. This is what makes repeated runs safe.

**Schema additions** (in `src/content.config.ts`)
- `placeholder: boolean` on gallery items, so the UI can stop labelling real images as placeholders and a report can list which projects still need pictures.
- Optional `model: ./slug/part.glb` for the 3D viewer.

Done when: a test folder with one HEIC photo and one STEP file turns into committed web assets, a correct ledger entry, and a passing `npm run check` and `npm run build`.

## Phase 3: backfill every project

**Inbox layout Darshan follows**

```
Portfolio Inbox/
  fsae-brake-system/        one folder per project; existing slug or a new name
    notes.md                optional but strongly preferred
    IMG_2231.heic
    pedal-box.step
```

**`notes.md` template to give him** (plain sentences are fine too)

```
project: Formula SAE brake system
cleared to publish: yes            (required for any employer's work)
what it is:
when:
my role:
real numbers:                      (only ones he can stand behind)
captions:
  IMG_2231.heic: Pedal box on the welding jig
```

**Work the list in this order.** Existing entries first, since their text is already right and they only need pictures:

| Project (slug) | Needs |
| --- | --- |
| `ls-engine-test-stand` | Photos of the stand and wiring. Employer clearance. |
| `rotor-blade-validation` | Likely text-only. Ask about clearance before anything else. |
| `packaging-defect-root-cause` | Clearance. Any shareable test photos or charts. |
| `single-part-redesign` | Clearance. Before/after CAD if allowed. A real number for cost or part count. |
| `investment-casting-molds` | Photos of molds and castings. |
| `campus-operations` | Event photos. Check faces (see rules). |
| `fsae-brake-system` | CAD of pedal box, hat, rotor. Car and test photos. |
| `human-powered-vehicle` | Fairing layup and race photos. CAD if it exists. |
| `print-ticketing-system` | A screenshot or photo of the system. What it was built in. |
| `resume-builder-skill` | Nothing, unless he wants it hidden (`draft: true`). |
| `portfolio-site` | Refresh the two screenshots after the real pictures land. |

**Then ask about projects that are not on the site yet.** These appear in his experience library or his original brief but have no entry:

- Protective boots for the wheel-end assembly (Wolf)
- Formula SAE aero and ergonomics work
- Field machinery repair and electrical work at Akshardham (currently only a Seva role)
- The museum support workflow at Akshardham
- Catering process improvement at BAPS
- Mentioned in his original brief, not in the library, so confirm they are real before writing anything: stage and prop production, build123d code-CAD, AI agents, personal car builds

For each new project, interview him with the `notes.md` questions. If answers are missing, create the entry with `draft: true` and list the open questions in the pull request. Do not fill gaps.

**As real images arrive:** the best real image becomes the cover; schematic placeholders move to the end of the gallery or are deleted. Keep `featured: true` to four or six projects so the gallery rows stay full.

Done when: every project he confirms is real has an entry, no entry he has supplied pictures for still shows a placeholder cover, and a short report lists what is still missing.

## Phase 4: the continuous update loop

**One run does this**

1. List the inbox (Drive folder, then `inbox/` in the repo). Compare with the ledger.
2. For each new or changed project folder: run the photo and CAD steps, then create or update the Markdown entry.
3. Run `npm run check` and `npm run build`. Open the built page in Chromium and screenshot the changed cards and drawers at desktop and phone width.
4. Commit on a branch named `intake/<date>` and open a pull request to `main`. The description lists: what was added, every new factual claim with the line of his notes it came from, anything held back and why, and questions for him.
5. If nothing is new, do nothing and open nothing.

**Scheduling.** Once Phases 2 and 3 work by hand, create a scheduled task that starts a fresh session on the chosen cadence with Google Drive and this repository attached. Its prompt:

> Run the intake procedure in `docs/GAME_PLAN.md` (Phase 4) for the Darshanpa/Darshanpa repo. Follow `CLAUDE.md`. Open a pull request if there is anything new; otherwise stop without changes.

**Keep the two sources in step.** When a project gains new confirmed facts, propose the matching update to the experience library in `resume-builder-skill`. When the library gains a new role or project, propose a site entry. Neither side is edited without his yes.

Done when: he drops a folder in the inbox, and within one cycle a pull request with a preview link appears without him asking.

## Phase 5: worth doing once the content is real

- 3D viewer in the spec drawer for projects with a GLB, loaded only when the drawer opens.
- Group the archive table by year once it passes about 20 rows.
- A sitemap and Cloudflare Web Analytics.
- Refresh `public/og.png` whenever the top of the page changes.

## Kickoff prompt for the Opus 5.5 session

> Read `CLAUDE.md`, `README.md`, and `docs/GAME_PLAN.md` in Darshanpa/Darshanpa. Ask me the six decisions at the top of the game plan, then start Phase 1 and Phase 2. Tell me exactly what to export and where to drop it.
