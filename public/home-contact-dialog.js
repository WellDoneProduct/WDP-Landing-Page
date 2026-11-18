/* Reuse the existing form and submit handlers; never duplicate field IDs. */
(() => {
  if (location.pathname !== '/') return;
  const form = document.getElementById('contactForm');
  if (!form) return;
  const key = 'wdp-home-contact-seen';
  let shown = false;
  try { shown = sessionStorage.getItem(key) === '1'; } catch {}
  if (shown) return;
  const home = form.parentNode;
  const next = form.nextSibling;
  const privacy = document.getElementById('privacyModal');
  const privacyHome = privacy?.parentNode;
  const privacyNext = privacy?.nextSibling;
  const dialog = document.createElement('dialog');
  dialog.className = 'home-contact-dialog';
  dialog.setAttribute('aria-labelledby', 'home-contact-title');
  dialog.innerHTML = '<div class="home-contact-top"><div><h2 id="home-contact-title" tabindex="-1">어떤 일을 고민하고 계신가요?</h2><p>현재 상황을 남겨주시면 함께 살펴보겠습니다.</p></div><button type="button" class="home-contact-close" aria-label="상담 창 닫기">×</button></div><div class="home-contact-body"></div>';
  document.body.append(dialog);
  const originalNodes = [...form.childNodes];
  let previousFocus, closing = false;
  const close = () => {
    if (closing || !dialog.open) return;
    closing = true;
    dialog.classList.remove('is-visible');
    setTimeout(() => dialog.close(), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240);
  };
  dialog.querySelector('.home-contact-close').addEventListener('click', close);
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape' && privacy?.classList.contains('is-open')) {
      event.preventDefault();
      event.stopPropagation();
      privacy.querySelector('.privacy-modal-close').click();
    }
  }, true);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    if (!privacy?.classList.contains('is-open')) close();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('close', () => {
    form.replaceChildren(...originalNodes);
    home.insertBefore(form, next);
    if (privacy && privacyHome) privacyHome.insertBefore(privacy, privacyNext);
    if (previousFocus instanceof HTMLElement) previousFocus.focus({preventScroll:true});
    dialog.remove();
  });
  const check = () => {
    if (shown || window.scrollY < 100) return;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    if (distance <= 0 || window.scrollY / distance < .5) return;
    // A visitor already heading to the page's form needs no interruption.
    if (location.hash === '#cta' || form.getBoundingClientRect().top < window.innerHeight) return;
    shown = true;
    try { sessionStorage.setItem(key, '1'); } catch {}
    window.removeEventListener('scroll', check);
    previousFocus = document.activeElement;
    const fields = document.createElement('div');
    fields.className = 'home-contact-fields';
    const footer = document.createElement('div');
    footer.className = 'home-contact-footer';
    let footerStarted = false;
    originalNodes.forEach(node => {
      if (node.nodeType === 1 && node.id === 'agree-wrap') footerStarted = true;
      (footerStarted ? footer : fields).append(node);
    });
    form.append(fields, footer);
    dialog.querySelector('.home-contact-body').append(form);
    if (privacy) dialog.append(privacy);
    dialog.showModal();
    requestAnimationFrame(() => dialog.classList.add('is-visible'));
    dialog.querySelector('h2').focus({preventScroll:true});
  };
  window.addEventListener('scroll', check, {passive:true});
})();
