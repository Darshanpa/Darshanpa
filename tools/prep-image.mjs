#!/usr/bin/env node
/**
 * Prepare photos for the site: auto-rotate, shrink to at most 2400 px on the
 * long edge, re-encode as JPEG, and drop all metadata (EXIF, GPS).
 *
 *   node tools/prep-image.mjs <project-slug> <photo> [more photos...]
 *
 * Output goes to src/content/projects/<project-slug>/ as 01.jpg, 02.jpg, ...
 * continuing after any numbered files already there. Rename them afterwards to
 * something descriptive (01-stand-side-view.jpg) and reference them in the
 * project's Markdown file. PNG, JPEG, WebP and TIFF inputs work. HEIC does not:
 * export those as JPEG first.
 */
import { mkdir, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const [slug, ...inputs] = process.argv.slice(2);
if (!slug || inputs.length === 0) {
  console.error('usage: node tools/prep-image.mjs <project-slug> <photo> [more photos...]');
  process.exit(1);
}

const outDir = resolve('src/content/projects', slug);
await mkdir(outDir, { recursive: true });

const taken = (await readdir(outDir)).map((name) => parseInt(name, 10)).filter(Number.isFinite);
let next = Math.max(0, ...taken) + 1;

for (const input of inputs) {
  const out = join(outDir, `${String(next++).padStart(2, '0')}.jpg`);
  const info = await sharp(input)
    .rotate() // apply the camera's orientation, then discard the tag
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(out); // sharp writes no metadata unless asked to
  console.log(`${input} -> ${out} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} kB)`);
}
