# Photo intake: finding portfolio photos in Darshan's photo library

Written 2026-11-15. This is a run-book for a model working **on Darshan's Windows PC**.
A smaller model can follow it. Do the steps in order. Do not skip the stops.

Darshan's Google Photos export is at `F:\torrents\googlephotos`. It is his whole personal library.
Most of it is private and has nothing to do with the portfolio.

## Rules for this job

1. **Never open, view, or describe photos outside the contact sheets this tool makes.** The tool narrows the library to a few places and date ranges. Stay inside them.
2. **Never copy, move, rename, delete, or upload anything in `F:\torrents\googlephotos`.** Read only.
3. **Nothing from the library goes into the repo except photos Darshan approved by number.**
4. **Employer windows** (`csi-crawfordsville`, `wolf-fishers`): list what you see, but do not add any of those photos without Darshan saying yes to each one.
5. **Other people:** if a photo's main subject is another person, or shows children, do not propose it. If people are incidental (small, backs turned, hard hats), you may propose it but say "people visible" next to it.
6. **Do not guess what a photo shows.** If you cannot tell, write "unclear" and ask.
7. If any command fails twice, stop and report the exact error. Do not improvise a workaround.

## Before you start

- You must be running on the PC that has the `F:` drive. If `F:\torrents\googlephotos` does not exist where you are, stop and tell Darshan.
- The repo must be cloned on that PC. In the repo folder run `npm install` once.
- Pick an output folder **outside the repo**, for example `F:\portfolio-staging`. The tool refuses an output folder inside the repo.

## Step 1: index the library (metadata only)

```sh
node tools/photo-index.mjs "F:\torrents\googlephotos" "F:\portfolio-staging"
```

This reads dates and GPS for every file. It does not open the pictures. It can take several minutes; it prints progress every 2,000 files. The index is cached, so later runs are fast.

When it finishes it prints a summary and writes `F:\portfolio-staging\summary.txt`.

**Check:** the summary says "Indexed files:" with a number above zero. If it is zero, the folder path is wrong. Stop and ask.

## Step 2: read the summary and report it to Darshan

Each block is one window: a place plus a date range (defined in `tools/photo-windows.json`).

| Window | Place and time | Projects it feeds |
| --- | --- | --- |
| `akshardham-2023-24` | Robbinsville, NJ, Jun 2023 to May 2024 | furnace and gold casting, murti installation, campus operations |
| `akshardham-2026` | Robbinsville, NJ, May to early Jul 2026 | Lanka projects |
| `st-louis-hangouts` | St. Louis, Dec 2023 and Jul to Aug 2024 | guest chef week |
| `rose-hulman` | Terre Haute, IN, Aug 2019 to Jul 2023 | Formula SAE brakes, Human Powered Vehicle, machine shop |
| `fsae-michigan-2023` | Brooklyn, MI, May to Jun 2023 | Formula SAE competition |
| `csi-crawfordsville` | Crawfordsville, IN, May 2024 to May 2026 | EMPLOYER, needs clearance |
| `wolf-fishers` | Fishers, IN, Jul 2026 onward | EMPLOYER, needs clearance |

Tell Darshan, in one short table: window, number of files, number of days, how many contact sheets.
If a window he expects to be full is empty, say so. The usual cause is photos with no GPS and a wrong date; ask him for the real dates.

## Step 3: windows that say "too many for sheets"

A window with more than 400 photos gets no sheets. Do this instead:

1. Open `<window>\days.csv`. It lists each day and how many files it has.
2. Tell Darshan the busiest days and ask which dates matter. Good prompts: competition weekends, build nights, the weeks he remembers working on a project.
3. Make sheets for a date range he names:
   ```sh
   node tools/photo-index.mjs "F:\torrents\googlephotos" "F:\portfolio-staging" --window rose-hulman --from 2023-03-01 --to 2023-03-31
   ```
   The sheets go in a new folder named after the window and the dates.

## Step 4: review the contact sheets

Each `sheet-001.jpg` is a grid of 20 thumbnails. Under each is an orange number (`#0017`), the date, and `GPS` or `no gps`.

For each window, open each sheet, one at a time. For each photo that could serve a project, write one line:

```
#0017 | murti-installation | murti on slings above the dome floor, crew below | people visible
```

Use the "lookFor" text for the window in `tools/photo-windows.json` as your guide. A good portfolio photo shows the hardware or the work clearly, is in focus, and is not mainly a portrait.

Skip: meals with friends, selfies, family, travel scenery, screenshots, anything unrelated. Do not write lines for skipped photos.

Photos marked `no gps` matched on date only. They may have been taken somewhere else. Be stricter with them.

Videos are listed in `list.csv` but not shown. Mention to Darshan how many videos fall on the days that matter.

## Step 5: STOP. Show Darshan the picks and wait

Give him the list from step 4, grouped by project, with the sheet file path so he can look.
Ask three things:
1. Which numbers to use.
2. For each project, which photo is the cover.
3. A caption for each, in his words (optional).

**Do not continue until he answers.** Do not pick for him.

## Step 6: bring the approved photos into the repo

For each project, with the numbers he approved:

```sh
node tools/photo-pick.mjs "F:\portfolio-staging\akshardham-2023-24" investment-casting-molds 17 23 41
```

This resizes each photo, removes its location data, and writes `01.jpg`, `02.jpg`, ... into `src/content/projects/investment-casting-molds/`.

Then follow **Task 1, steps 5 to 8, in `docs/HANDOFF.md`** (rename the files, set `cover` and `gallery` in the Markdown, run the checks).

If the project is still a draft, also follow Task 2 in `docs/HANDOFF.md`.

## Step 7: save

Follow Task 5 in `docs/HANDOFF.md`. Before committing, run `git status` and confirm the only new image files are the ones Darshan approved.

## What to hand back to a stronger model

- A window is empty or wrong and Darshan cannot supply dates.
- HEIC or raw files (`.heic`, `.cr3`, `.dng`) show "cannot preview" on the sheets and he wants those photos.
- He wants a new place or date range added to `tools/photo-windows.json` and you are not sure of the coordinates.
- He names a project that does not exist yet and gives its story (a stronger model should write the entry, or use Task 3 in `docs/HANDOFF.md` with `draft: true`).
