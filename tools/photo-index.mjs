#!/usr/bin/env node
/**
 * Find portfolio photos in a large personal photo library (for example a Google
 * Photos / Takeout export) without looking at every picture.
 *
 *   node tools/photo-index.mjs <library-folder> <output-folder>
 *   node tools/photo-index.mjs <library-folder> <output-folder> --window rose-hulman --from 2023-03-01 --to 2023-03-31
 *
 * What it does:
 *   1. Reads only metadata (date and GPS) for every photo and video. Sources, in
 *      order: the Takeout .json file next to the photo, EXIF, the file name.
 *      The result is cached in <output-folder>/index.json. Add --reindex to redo it.
 *   2. For each window in tools/photo-windows.json (a place plus a date range),
 *      writes <output-folder>/<window>/list.csv, list.json and days.csv.
 *   3. Draws contact sheets (numbered thumbnail grids) for windows with at most
 *      400 photos, or for the one window named with --window.
 *
 * It never changes, moves, or uploads the library. Originals stay where they are.
 * Use tools/photo-pick.mjs afterwards to bring chosen photos into a project.
 */
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import exifr from 'exifr';
import sharp from 'sharp';

const IMAGE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tif', '.tiff', '.gif', '.avif', '.dng', '.cr2', '.cr3', '.nef', '.arw']);
const VIDEO = new Set(['.mp4', '.mov', '.m4v', '.avi', '.mkv', '.3gp', '.webm']);
const NOT_CAMERA = /screenshot|screen[_ -]?shot|screen_recording|whatsapp|received_|fb_img|snapchat|messenger|download/i;
const SHEET_LIMIT = 400;
const COLS = 5, ROWS = 4, TW = 384, TH = 288, LABEL = 34, GAP = 8;
const BG = { r: 9, g: 13, b: 22 };

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i === -1 ? undefined : args[i + 1] ?? true; };
const positional = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1]?.startsWith('--') && !['--reindex'].includes(args[i - 1])));
const [libraryArg, outArg] = positional;
if (!libraryArg || !outArg) {
  console.error('usage: node tools/photo-index.mjs <library-folder> <output-folder> [--window <id>] [--from YYYY-MM-DD] [--to YYYY-MM-DD] [--reindex]');
  process.exit(1);
}
const library = resolve(libraryArg);
const out = resolve(outArg);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (out.startsWith(repoRoot)) {
  console.error('The output folder must be outside the repository so private photos are never committed.');
  process.exit(1);
}
await mkdir(out, { recursive: true });

/* ── 1. index ─────────────────────────────────────────────── */

async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  yield { dir, files: entries.filter((e) => e.isFile()).map((e) => e.name) };
  for (const e of entries) if (e.isDirectory()) yield* walk(join(dir, e.name));
}

/** Find the Takeout sidecar for a media file. Takeout truncates and renames these in several ways. */
function sidecarFor(name, jsons) {
  const lower = name.toLowerCase();
  let hit = jsons.find((j) => j.toLowerCase().startsWith(`${lower}.`));
  if (hit) return hit;
  const dup = name.match(/^(.*)\((\d+)\)(\.\w+)$/); // IMG_1(1).jpg <-> IMG_1.jpg(1).json
  if (dup) {
    const base = `${dup[1]}${dup[3]}`.toLowerCase();
    hit = jsons.find((j) => j.toLowerCase().startsWith(base) && j.includes(`(${dup[2]})`));
    if (hit) return hit;
  }
  const stem = lower.slice(0, 46); // long names are cut to 46 characters
  return jsons.find((j) => j.toLowerCase().startsWith(stem) && lower.length > 46);
}

function dateFromName(name) {
  let m = name.match(/(20\d{2})(\d{2})(\d{2})[_-]?(\d{2})(\d{2})(\d{2})/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
  m = name.match(/(20\d{2})[-_](\d{2})[-_](\d{2})/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
  return null;
}
const okDate = (d) => d instanceof Date && !Number.isNaN(+d) && d.getUTCFullYear() >= 2000 && d.getUTCFullYear() < 2100;
const okGps = (lat, lon) => Number.isFinite(lat) && Number.isFinite(lon) && !(lat === 0 && lon === 0);

async function buildIndex() {
  const items = [];
  let seen = 0;
  for await (const { dir, files } of walk(library)) {
    const jsons = files.filter((f) => f.toLowerCase().endsWith('.json'));
    for (const name of files) {
      const ext = extname(name).toLowerCase();
      const kind = IMAGE.has(ext) ? 'image' : VIDEO.has(ext) ? 'video' : null;
      if (!kind) continue;
      const path = join(dir, name);
      let date = null, lat = null, lon = null, source = '';

      const side = sidecarFor(name, jsons);
      if (side) {
        try {
          const meta = JSON.parse(await readFile(join(dir, side), 'utf8'));
          const ts = Number(meta.photoTakenTime?.timestamp);
          if (ts > 0) { date = new Date(ts * 1000); source = 'sidecar'; }
          for (const g of [meta.geoDataExif, meta.geoData]) {
            if (g && okGps(g.latitude, g.longitude)) { lat = g.latitude; lon = g.longitude; break; }
          }
        } catch { /* unreadable sidecar: fall through */ }
      }
      if (kind === 'image' && (!okDate(date) || lat === null)) {
        try {
          const exif = await exifr.parse(path, { gps: true });
          const d = exif?.DateTimeOriginal ?? exif?.CreateDate;
          if (!okDate(date) && okDate(d)) { date = d; source = 'exif'; }
          if (lat === null && okGps(exif?.latitude, exif?.longitude)) { lat = exif.latitude; lon = exif.longitude; }
        } catch { /* no EXIF */ }
      }
      if (!okDate(date)) { const d = dateFromName(name); if (okDate(d)) { date = d; source = 'filename'; } }
      if (!okDate(date)) { date = (await stat(path)).mtime; source = 'file-modified'; }

      items.push({ path, kind, date: date.toISOString(), source, lat, lon, camera: !NOT_CAMERA.test(path) });
      if (++seen % 2000 === 0) console.log(`  indexed ${seen} files...`);
    }
  }
  items.sort((a, b) => a.date.localeCompare(b.date));
  return items;
}

const indexFile = join(out, 'index.json');
let index;
if (existsSync(indexFile) && !args.includes('--reindex')) {
  index = JSON.parse(await readFile(indexFile, 'utf8'));
  console.log(`Using cached index: ${index.length} files (add --reindex to rebuild).`);
} else {
  console.log(`Indexing ${library} (metadata only)...`);
  index = await buildIndex();
  await writeFile(indexFile, JSON.stringify(index));
  console.log(`Indexed ${index.length} files.`);
}

/* ── 2. windows ───────────────────────────────────────────── */

const km = (lat1, lon1, lat2, lon2) => {
  const r = Math.PI / 180, a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
};
const csv = (rows) => rows.map((r) => r.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n') + '\r\n';

const { windows } = JSON.parse(await readFile(join(repoRoot, 'tools/photo-windows.json'), 'utf8'));
const only = flag('window');
const from = flag('from'), to = flag('to');
if (only && !windows.some((w) => w.id === only)) {
  console.error(`No window "${only}". Choose one of: ${windows.map((w) => w.id).join(', ')}`);
  process.exit(1);
}

const summary = [];
for (const win of windows) {
  if (only && win.id !== only) continue;
  let ranges = win.ranges ?? [[win.from, win.to]];
  if (only && (from || to)) ranges = [[from ?? ranges[0][0], to ?? ranges.at(-1)[1]]];

  const matches = index.filter((item) => {
    const day = item.date.slice(0, 10);
    if (!ranges.some(([a, b]) => day >= a && day <= b)) return false;
    if (!item.camera) return false;
    if (item.lat === null) return true; // no GPS: keep, flagged below
    return win.places.some((p) => km(item.lat, item.lon, p.lat, p.lon) <= p.radiusKm);
  }).map((item, i) => ({ n: i + 1, ...item, gps: item.lat === null ? 'no' : 'yes' }));

  const dir = join(out, only && (from || to) ? `${win.id}_${ranges[0][0]}_${ranges[0][1]}` : win.id);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'list.json'), JSON.stringify(matches, null, 1));
  await writeFile(join(dir, 'list.csv'), csv([['n', 'date_utc', 'kind', 'gps', 'date_source', 'path'], ...matches.map((m) => [m.n, m.date.slice(0, 16).replace('T', ' '), m.kind, m.gps, m.source, m.path])]));
  const days = new Map();
  for (const m of matches) { const d = m.date.slice(0, 10); const e = days.get(d) ?? { all: 0, gps: 0, video: 0, first: m.n }; e.all++; if (m.gps === 'yes') e.gps++; if (m.kind === 'video') e.video++; days.set(d, e); }
  await writeFile(join(dir, 'days.csv'), csv([['day', 'files', 'with_gps', 'videos', 'first_n'], ...[...days].map(([d, e]) => [d, e.all, e.gps, e.video, e.first])]));

  /* ── 3. contact sheets ── */
  const images = matches.filter((m) => m.kind === 'image');
  let sheets = 0;
  if (images.length > 0 && (images.length <= SHEET_LIMIT || only)) {
    const per = COLS * ROWS, W = COLS * (TW + GAP) + GAP;
    for (let s = 0; s * per < images.length; s++) {
      const page = images.slice(s * per, (s + 1) * per);
      const H = Math.ceil(page.length / COLS) * (TH + LABEL + GAP) + GAP;
      const layers = [];
      let labels = '';
      for (const [i, m] of page.entries()) {
        const x = GAP + (i % COLS) * (TW + GAP), y = GAP + Math.floor(i / COLS) * (TH + LABEL + GAP);
        let ok = true;
        try {
          layers.push({ input: await sharp(m.path).rotate().resize(TW, TH, { fit: 'contain', background: BG }).jpeg({ quality: 70 }).toBuffer(), left: x, top: y });
        } catch { ok = false; }
        labels += `<rect x="${x}" y="${y}" width="${TW}" height="${TH}" fill="none" stroke="#1F2937"/>`;
        if (!ok) labels += `<text x="${x + TW / 2}" y="${y + TH / 2}" text-anchor="middle" fill="#9CA3AF" font-family="monospace" font-size="15">cannot preview ${extname(m.path)}</text>`;
        labels += `<text x="${x}" y="${y + TH + 23}" font-family="monospace" font-size="17" xml:space="preserve"><tspan fill="#F97316" font-weight="bold">#${String(m.n).padStart(4, '0')}</tspan><tspan fill="#F3F4F6">  ${m.date.slice(0, 16).replace('T', ' ')}</tspan><tspan fill="${m.gps === 'yes' ? '#3B82F6' : '#9CA3AF'}">  ${m.gps === 'yes' ? 'GPS' : 'no gps'}</tspan></text>`;
      }
      layers.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${labels}</svg>`), left: 0, top: 0 });
      await sharp({ create: { width: W, height: H, channels: 3, background: BG } }).composite(layers).jpeg({ quality: 78 }).toFile(join(dir, `sheet-${String(s + 1).padStart(3, '0')}.jpg`));
      sheets++;
    }
  }
  summary.push({ id: win.id, label: win.label, files: matches.length, images: images.length, videos: matches.length - images.length, noGps: matches.filter((m) => m.gps === 'no').length, days: days.size, sheets, dir, clearance: Boolean(win.needsClearance) });
}

let text = `Photo index summary\nLibrary: ${library}\nIndexed files: ${index.length}\n\n`;
for (const s of summary) {
  text += `${s.id}${s.clearance ? '  [EMPLOYER: needs clearance]' : ''}\n  ${s.label}\n  ${s.files} files (${s.images} images, ${s.videos} videos) on ${s.days} days; ${s.noGps} have no GPS\n  ${s.sheets ? `${s.sheets} contact sheet(s)` : s.images ? `too many for sheets: read days.csv, then rerun with --window ${s.id} --from YYYY-MM-DD --to YYYY-MM-DD` : 'nothing found'}\n  ${s.dir}\n\n`;
}
if (!only) await writeFile(join(out, 'summary.txt'), text);
console.log(`\n${text}`);
