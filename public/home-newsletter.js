(() => {
  const form = document.querySelector('#newsletter-form');
  if (!form) return;

  const input = form.elements.namedItem('email');
  const button = form.querySelector('button[type="submit"]');
  const hint = document.querySelector('#newsletter-hint-text');
  const notice = document.querySelector('#newsletter-notice');
  const confirmation = document.querySelector('#newsletter-confirmation');
  const defaultHint = hint.textContent;
  const toastDuration = 2500;
  let timer;

  document.body.append(notice);
  notice.popover = 'manual';
  notice.style.setProperty('--newsletter-toast-duration', toastDuration + 'ms');

  function positionToast() {
    notice.style.setProperty('--newsletter-viewport-top', (window.visualViewport?.offsetTop || 0) + 'px');
  }

  function presentToast() {
    window.clearTimeout(timer);
    notice.hidden = document.hidden;
    if (document.hidden || !notice.hasChildNodes()) return;
    positionToast();
    notice.showPopover?.();
    timer = window.setTimeout(dismissToast, toastDuration);
  }

  function dismissToast() {
    window.clearTimeout(timer);
    notice.hidePopover?.();
    notice.replaceChildren();
    document.removeEventListener('visibilitychange', presentToast);
    window.visualViewport?.removeEventListener('resize', positionToast);
    window.visualViewport?.removeEventListener('scroll', positionToast);
  }

  input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    hint.textContent = defaultHint;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    dismissToast();
    input.value = input.value.trim();
    if (!input.validity.valid) {
      input.setAttribute('aria-invalid', 'true');
      hint.textContent = input.validity.valueMissing ? '이메일을 입력해 주세요.' : defaultHint;
      input.focus();
      input.reportValidity();
      return;
    }

    button.disabled = true;
    input.readOnly = true;
    form.setAttribute('aria-busy', 'true');
    button.textContent = '저장 중…';
    hint.textContent = defaultHint;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: input.value }),
      });
      if (!response.ok || (await response.json()).ok !== true) throw new Error('subscription failed');
      form.reset();
      notice.replaceChildren(confirmation.content.cloneNode(true));
      document.addEventListener('visibilitychange', presentToast);
      window.visualViewport?.addEventListener('resize', positionToast);
      window.visualViewport?.addEventListener('scroll', positionToast);
      presentToast();
    } catch {
      hint.textContent = '저장하지 못했어요. 잠시 후 다시 시도해 주세요.';
    } finally {
      form.removeAttribute('aria-busy');
      input.readOnly = false;
      button.disabled = false;
      button.textContent = '입력 완료';
    }
  });
  button.disabled = false;
})();
