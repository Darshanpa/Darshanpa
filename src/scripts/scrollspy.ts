/** Marks the sidebar link for the section currently in view with aria-current. */
export function initScrollSpy() {
  const links = new Map<string, HTMLElement>();
  for (const link of document.querySelectorAll<HTMLElement>('[data-nav]')) {
    links.set(link.dataset.nav!, link);
  }
  const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')];
  if (!links.size || !sections.length) return;

  const setCurrent = (id: string) => {
    for (const [key, link] of links) {
      if (key === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  // A section is "current" while it crosses a line one third of the way down the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      }
    },
    { rootMargin: '-33% 0px -66% 0px' },
  );

  for (const section of sections) observer.observe(section);
  setCurrent(sections[0].id);
}
