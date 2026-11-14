/**
 * Click-to-zoom figure viewer.
 *
 * Markup contract:
 *   [data-lightbox-group]                                     wraps one set of figures
 *   [data-lightbox data-full data-alt data-caption]           a thumbnail button
 *   dialog[data-lightbox-dialog]                              rendered once by Lightbox.astro
 */
const pad = (n: number) => String(n).padStart(2, '0');

export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  if (!dialog) return;

  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-lightbox-counter]')!;
  const nav = dialog.querySelector<HTMLElement>('[data-lightbox-nav]')!;

  let group: HTMLElement[] = [];
  let index = 0;

  const show = (next: number) => {
    index = (next + group.length) % group.length;
    const { full = '', alt = '', caption: text = '' } = group[index].dataset;
    image.src = full;
    image.alt = alt;
    caption.textContent = text;
    counter.textContent = `${pad(index + 1)} / ${pad(group.length)}`;
    nav.hidden = group.length < 2;
  };

  document.addEventListener('click', (event) => {
    const thumb = (event.target as HTMLElement).closest<HTMLElement>('[data-lightbox]');
    if (!thumb) return;
    const scope = thumb.closest('[data-lightbox-group]') ?? document;
    group = [...scope.querySelectorAll<HTMLElement>('[data-lightbox]')];
    show(group.indexOf(thumb));
    dialog.showModal();
  });

  dialog.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-lightbox-prev]')) show(index - 1);
    else if (target.closest('[data-lightbox-next]')) show(index + 1);
    // The close button, the image itself, or any empty area dismisses.
    else if (!target.closest('figcaption, [data-lightbox-counter]')) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (group.length < 2) return;
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });

  // Return focus to the thumbnail that is now showing.
  dialog.addEventListener('close', () => group[index]?.focus({ preventScroll: true }));
}
