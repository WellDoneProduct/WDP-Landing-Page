(() => {
  const form = document.querySelector('#newsletter-form');
  if (!form) return;

  const input = form.elements.namedItem('email');
  const button = form.querySelector('button[type="submit"]');
  const hint = document.querySelector('#newsletter-hint-text');
  const notice = document.querySelector('#newsletter-notice');
  const confirmation = document.querySelector('#newsletter-confirmation');
  const defaultHint = hint.textContent;
  let timer;

  function dismissToast() {
    window.clearTimeout(timer);
    notice.replaceChildren();
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
      timer = window.setTimeout(dismissToast, 2500);
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
