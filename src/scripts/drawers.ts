/**
 * Inline spec-sheet drawers.
 *
 * Markup contract:
 *   [data-spec-trigger aria-controls="<drawer id>" data-slug="<project>"]  the button that toggles
 *   [data-spec-drawer id hidden]                                           the drawer
 *   [data-spec-close]                                                      close buttons inside it
 *   [data-row-trigger]                                                     optional: a whole row acts as the trigger
 *   [data-item]                                                            the card or row; gets .is-active
 *
 * One drawer is open at a time. The open project is mirrored to the URL
 * as #spec-<slug>, so a spec sheet can be linked to directly.
 */

const DURATION = 380; // ms; matches --drawer-ms in global.css
const HASH_PREFIX = '#spec-';

interface OpenDrawer {
  drawer: HTMLElement;
  trigger: HTMLElement;
}

export interface DrawerController {
  /** Close the open drawer if its trigger sits inside `container`. */
  closeWithin(container: Element): void;
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const stickyOffset = () =>
  (document.querySelector<HTMLElement>('[data-filter-bar]')?.offsetHeight ?? 0) + 16;

const itemOf = (trigger: HTMLElement) => trigger.closest<HTMLElement>('[data-item]') ?? trigger;

const scrollBy = (top: number, smooth: boolean) =>
  window.scrollBy({ top, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant' });

export function initDrawers(): DrawerController {
  let open: OpenDrawer | null = null;

  const setExpanded = (trigger: HTMLElement, expanded: boolean) => {
    trigger.setAttribute('aria-expanded', String(expanded));
    itemOf(trigger).classList.toggle('is-active', expanded);
  };

  const close = ({ animate = true } = {}) => {
    if (!open) return;
    const { drawer, trigger } = open;
    open = null;

    setExpanded(trigger, false);
    drawer.classList.remove('is-open');

    const hide = () => {
      if (!drawer.classList.contains('is-open')) drawer.hidden = true;
    };
    if (animate && !reducedMotion.matches) window.setTimeout(hide, DURATION);
    else hide();

    if (location.hash.startsWith(HASH_PREFIX)) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  };

  /** After opening, bring the drawer into view below the sticky filter bar. */
  const reveal = (target: OpenDrawer) => {
    if (open !== target) return;
    const offset = stickyOffset();
    const item = itemOf(target.trigger).getBoundingClientRect();
    const drawer = target.drawer.getBoundingClientRect();
    if (item.top >= offset && drawer.bottom <= window.innerHeight) return;

    // Short rows stay visible above their drawer; tall cards scroll away.
    const anchor = item.height < window.innerHeight * 0.35 ? item.top : drawer.top;
    scrollBy(anchor - offset, true);
  };

  const openDrawer = (trigger: HTMLElement, { scroll = true } = {}) => {
    const drawer = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
    if (!drawer) return;

    // Collapse any other drawer instantly and cancel the layout shift it causes,
    // so the item that was clicked does not move under the pointer.
    const before = trigger.getBoundingClientRect().top;
    close({ animate: false });
    const shift = trigger.getBoundingClientRect().top - before;
    if (shift) scrollBy(shift, false);

    drawer.hidden = false;
    void drawer.offsetHeight; // commit the collapsed state before transitioning
    drawer.classList.add('is-open');
    setExpanded(trigger, true);

    const target = { drawer, trigger };
    open = target;
    history.replaceState(null, '', `${HASH_PREFIX}${trigger.dataset.slug}`);

    if (scroll) window.setTimeout(() => reveal(target), reducedMotion.matches ? 0 : DURATION);
  };

  /** Close from inside the drawer: collapse, return focus, and put the item back in view. */
  const dismiss = () => {
    if (!open) return;
    const { trigger } = open;
    close({ animate: false });
    trigger.focus({ preventScroll: true });

    const rect = itemOf(trigger).getBoundingClientRect();
    const offset = stickyOffset();
    if (rect.top < offset || rect.bottom > window.innerHeight) scrollBy(rect.top - offset, true);
  };

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.closest('[data-spec-close]')) {
      dismiss();
      return;
    }

    let trigger = target.closest<HTMLElement>('[data-spec-trigger]');
    if (!trigger) {
      const row = target.closest<HTMLElement>('[data-row-trigger]');
      if (row && !target.closest('a, button')) trigger = row.querySelector<HTMLElement>('[data-spec-trigger]');
    }
    if (!trigger) return;

    if (open?.trigger === trigger) close();
    else openDrawer(trigger);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open && !document.querySelector('dialog[open]')) dismiss();
  });

  // Deep link: /#spec-<slug> opens that project's spec sheet on load.
  if (location.hash.startsWith(HASH_PREFIX)) {
    const slug = decodeURIComponent(location.hash.slice(HASH_PREFIX.length));
    const trigger = document.querySelector<HTMLElement>(`[data-spec-trigger][data-slug="${CSS.escape(slug)}"]`);
    if (trigger) {
      openDrawer(trigger, { scroll: false });
      itemOf(trigger).scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  return {
    closeWithin(container) {
      if (open && container.contains(open.trigger)) close({ animate: false });
    },
  };
}
