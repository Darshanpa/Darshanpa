# Handoff: what to do next, step by step

Written 2026-11-15. This file is for any model continuing the work, including a smaller one.
Every task below is small, has exact steps, and has a check that tells you it is done.

**Read first, in this order:** `CLAUDE.md` (rules), this file, then `README.md` (how projects are written).
`docs/GAME_PLAN.md` is the long-term plan. You do not need it for the tasks in this file.

**If the job is finding photos in Darshan's photo library on his PC, follow `docs/PHOTO_INTAKE.md`.**

## Three rules that override everything

1. **Never invent a fact.** If a date, number, role, or place is not in Darshan's own words or files, write `TODO(Darshan): ...` and ask him. Do not estimate. Do not "improve" a number.
2. **When unsure, stop and ask Darshan.** A question costs nothing. A wrong claim on his public site costs a lot.
3. **Do not publish other people or employers without a yes from Darshan.** That covers photos with other people's faces, the murti photos, and anything from Wolf Technical Services or CSI.

## Where things stand

| Item | State |
| --- | --- |
| Site code | Done, pushed to branch `ccr-483aa1cd-l3yf7v` |
| Live projects | 11, text from Darshan's resume library. All figures are schematic placeholders except the two site screenshots. |
| Draft projects | 3, hidden from the site until finished: `lanka-site-operations`, `week-long-food-plan`, `murti-installation` |
| Hosting and domain | Not connected yet (see `docs/GAME_PLAN.md`, Phase 1) |
| Contact email | Still `hello@darshan-patel.pw`, which does not exist |
| Darshan's photo library | At `F:\torrents\googlephotos` on his PC. Not searched yet. Run-book: `docs/PHOTO_INTAKE.md`. |

## Questions waiting on Darshan

Ask these before doing tasks 2 and 3. Record each answer in the matching Markdown file.

1. **Food plan:** answered 2026-11-15 and recorded in the draft (75 people, St. Louis mandir, guest chefs, local team only bought ingredients). Still open: are the dates Jul 29 to Aug 3, 2024, or was it the Dec 25 to 28, 2023 hangout?
2. **Murti installation (Aug 30, 2023):** what was his role? May the photos be published?
3. **Lanka projects:** he said there are several. Ask him to list them, with dates and what he did on each. The existing draft covers only the 2026 storage-yard project. Is the year 2026? May it be published?
4. **Furnace and gold melting:** no photos were found in Drive. Can he add them? The raw files in his Drive folder "Labh 2023" (Sep 1, 2023) could not be opened; can he export a few as JPG?
5. **Employer name:** is CSI "Closure Systems International" or "Crawfordsville Specialties, Inc."? His files use both. The site currently says only "CSI".
6. **Email:** which address should the site show?

## Task 1: add real photos to a project

Use this when Darshan gives you photos for a project that already exists.

1. Find the project's slug: the file name in `src/content/projects/` without `.md` (example: `fsae-brake-system`).
2. Save the photos somewhere outside the repo, for example `/tmp/photos/`.
3. If a photo shows another person's face, or is from Wolf or CSI, stop and ask Darshan first.
4. Run:
   ```sh
   node tools/prep-image.mjs <slug> /tmp/photos/a.jpg /tmp/photos/b.jpg
   ```
   This shrinks each photo, removes location data, and writes `01.jpg`, `02.jpg`, ... into `src/content/projects/<slug>/`. HEIC files do not work; ask for JPG.
5. Rename each output to say what it shows, for example `01-pedal-box-on-jig.jpg`.
6. Open `src/content/projects/<slug>.md`. Set the best photo as the cover and list the rest under `gallery`:
   ```yaml
   cover: ./<slug>/01-pedal-box-on-jig.jpg
   coverAlt: Pedal box clamped in a welding jig
   gallery:
     - src: ./<slug>/02-rotor-on-car.jpg
       alt: Brake rotor and caliper mounted on the car
       caption: Front corner, assembled
   ```
   - `coverAlt` and `alt`: describe what is visible in the photo. One plain sentence.
   - `caption`: only use words Darshan gave you. If he gave none, leave `caption` out.
7. Keep the old schematic `.svg` figures as later gallery items, or delete them if the photos cover the same thing.
8. Run the checks in Task 4.

**Done when:** the card on the page shows the real photo and the checks pass.

## Task 2: finish and publish a draft project

The three drafts already hold every fact that could be verified. Lines starting `# TODO(Darshan)` list what is missing.

1. Get the answers from Darshan (see the questions above).
2. Open the draft file. Replace each `TODO` in `summary`, `objective`, and `metrics` with his answer, in plain short sentences.
3. Add `role`, `org`, and `outcome` if the draft lacks them and he supplied them.
4. Add photos using Task 1. If there are no photos yet, leave `cover: ./_shared/pending.svg`.
5. Delete the `# DRAFT` and `# TODO` comment lines that are now resolved.
6. Delete the line `draft: true`.
7. Run the checks in Task 4.

**Do not remove `draft: true` while any `TODO` remains in the file.**

**Done when:** the project appears on the page under 04. Seva & Community, has no `TODO` text, and the checks pass.

## Task 3: add a brand-new project

1. Copy an existing file that is similar (for hardware work, `fsae-brake-system.md`; for community work, `campus-operations.md`).
2. Name the copy `<new-slug>.md`. Use lowercase words joined by hyphens.
3. Replace every field with Darshan's facts. `README.md` explains each field.
4. Set `order` to a number not used by another project in the same `year`.
5. Set `cover: ./_shared/pending.svg` until there is a real photo.
6. If any fact is missing, add `draft: true` and a `# TODO(Darshan): ...` line, then ask him.
7. Run the checks in Task 4.

## Task 4: checks to run after every change

```sh
npm install        # only needed once per session
npm run check      # must print 0 errors
npm run build      # must end with "Complete!"
npm run preview    # then open http://localhost:4321
```

Then look at the page:
- The changed card or row shows the right title, text, and image.
- Click it. The spec sheet opens and the figures enlarge when clicked.
- Narrow the window to phone width. Nothing overflows sideways.

If `npm run check` or `npm run build` fails, read the message. It names the file and the field. Fix that field. Do not delete the project to make the error go away.

## Task 5: save the work

```sh
git add -A
git commit -m "Short description of what changed"
git push -u origin ccr-483aa1cd-l3yf7v
```

Do not open a pull request unless Darshan asks. Do not push to any other branch.

## Do not attempt these; hand them to a stronger model

- Changing `src/content.config.ts`, anything in `src/components/`, `src/scripts/`, or `src/styles/`.
- Converting CAD files (STEP, SolidWorks) into images or 3D models.
- Setting up the Drive inbox, the processing ledger, or scheduled runs (`docs/GAME_PLAN.md`, Phases 2 and 4).
- Connecting hosting or DNS.
- Anything where following these steps exactly does not work.

## What was found in Darshan's Google Drive (2026-11-15)

Titles and folders only. Darshan has the full list with links.

**Robbinsville, NJ (Akshardham)**
- Aug 30, 2023: 8 photos and a video of a murti installation lift, in folder `00_Temporary` (`IMG_20230830_*.jpg`). Draft: `murti-installation.md`.
- Sep 1, 2023: folder `Labh 2023`, 29 camera raw files. Could not be opened.
- Sep 3, 2023: folder `Akshardham Orgami`, raw files and video. Could not be opened.
- Mar 2024: `akdm working.JPG` (welding under the fabrication tent) and the `akdm trays` slides.
- 2026: `Lanka_Site_Operations_Symposium` slides and the notes doc `akdm academy presentation`. Draft: `lanka-site-operations.md`.
- Furnace and gold melting: nothing found.

**Midwest BAPS**
- `S-cubed Hangout Menu July30` (Darshan's sheet, Jul 29 to Aug 3, 2024). Draft: `week-long-food-plan.md`.
- `STL Hangout Menu` and `STL Hanout Shopping List` (Rohan's sheets, Dec 25 to 28, 2023).
- Decoration and stage files not yet opened: `pmdeco2025`, `summer 2025 deco`, `Hindilo parts`, `Master Backdrop List`, `Jyotara Scene-by-Scene Props/Materials/Costumes`.

**Terre Haute, IN (Rose-Hulman)**
- Formula SAE: `2021-22 Brake System Calculator`, `Budget/BOM Brakes 2021`, `Brake Binder`, `CSI Project Demo FSAE Pedal Box` slides (has FEA and prototype pictures), SolidWorks pedal files.
- Human Powered Vehicle: `RHIT-EHPVT-2023_DesignReport.pdf`, `HPVT22_23 safety video`.
