/**
 * Category filter.
 *
 * Markup contract:
 *   [data-filter="<category|all>" aria-pressed]   filter buttons
 *   [data-filter-reset]                           "show all" buttons in empty states
 *   [data-item data-categories="a b" data-slug]   anything filterable
 *   [data-filter-group]                           a section; may contain
 *       [data-group-count]                        live "03 entries" readout
 *       [data-empty hidden]                       shown when nothing in the group matches
 *       [data-filter-table]                       hidden when nothing in the group matches
 *   [data-filter-count]                           live count of matching projects
 */
import type { DrawerController } from './drawers';

const pad = (n: number) => String(n).padStart(2, '0');

export function initFilters(drawers: DrawerController) {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const items = [...document.querySelectorAll<HTMLElement>('[data-item]')];
  const groups = [...document.querySelectorAll<HTMLElement>('[data-filter-group]')];
  const total = document.querySelector<HTMLElement>('[data-filter-count]');
  if (!buttons.length) return;

  const apply = (filter: string) => {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    }

    const matching = new Set<string>();
    for (const item of items) {
      const match = filter === 'all' || (item.dataset.categories ?? '').split(' ').includes(filter);
      if (!match) drawers.closeWithin(item);
      item.hidden = !match;
      if (match && item.dataset.slug) matching.add(item.dataset.slug);
    }

    for (const group of groups) {
      const visible = group.querySelectorAll('[data-item]:not([hidden])').length;
      const count = group.querySelector<HTMLElement>('[data-group-count]');
      const empty = group.querySelector<HTMLElement>('[data-empty]');
      const table = group.querySelector<HTMLElement>('[data-filter-table]');
      if (count) count.textContent = `${pad(visible)} ${visible === 1 ? 'entry' : 'entries'}`;
      if (empty) empty.hidden = visible > 0;
      if (table) table.hidden = visible === 0;
    }

    if (total) total.textContent = pad(matching.size);
  };

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLElement>('[data-filter]');
    if (button) apply(button.dataset.filter ?? 'all');
    else if (target.closest('[data-filter-reset]')) apply('all');
  });
}
