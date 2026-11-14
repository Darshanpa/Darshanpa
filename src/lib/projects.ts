import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';

export type Project = CollectionEntry<'projects'>;

/** All published projects, newest first, then by `order`. */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.year - a.data.year || a.data.order - b.data.order);
}

/** Spec-sheet ID such as DP-25-01. */
export const specId = (project: Project) =>
  `${site.idPrefix}-${String(project.data.year).slice(-2)}-${String(project.data.order).padStart(2, '0')}`;

/** DOM id for a drawer. A project can be listed in several sections, so the id carries its context. */
export const drawerId = (context: string, project: Project) => `spec-${context}-${project.id}`;

export const pad = (n: number) => String(n).padStart(2, '0');

export const entryCount = (n: number) => `${pad(n)} ${n === 1 ? 'entry' : 'entries'}`;
