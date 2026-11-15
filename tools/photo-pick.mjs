#!/usr/bin/env node
/**
 * Bring chosen photos from a contact sheet into a project.
 *
 *   node tools/photo-pick.mjs <window-folder> <project-slug> <n> [more n...]
 *
 * <window-folder> is a folder written by tools/photo-index.mjs (it holds list.json).
 * <n> is the orange number under a thumbnail on a contact sheet.
 * Each photo is resized, stripped of EXIF/GPS, and written into
 * src/content/projects/<project-slug>/ by tools/prep-image.mjs.
 */
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [windowDir, slug, ...numbers] = process.argv.slice(2);
if (!windowDir || !slug || numbers.length === 0) {
  console.error('usage: node tools/photo-pick.mjs <window-folder> <project-slug> <n> [more n...]');
  process.exit(1);
}
const list = JSON.parse(await readFile(join(resolve(windowDir), 'list.json'), 'utf8'));
const paths = numbers.map((raw) => {
  const item = list.find((m) => m.n === Number(String(raw).replace('#', '')));
  if (!item) { console.error(`No photo numbered ${raw} in ${windowDir}`); process.exit(1); }
  if (item.kind !== 'image') { console.error(`#${raw} is a video; only images can be added.`); process.exit(1); }
  return item.path;
});
const prep = join(dirname(fileURLToPath(import.meta.url)), 'prep-image.mjs');
const result = spawnSync(process.execPath, [prep, slug, ...paths], { stdio: 'inherit' });
process.exit(result.status ?? 1);
