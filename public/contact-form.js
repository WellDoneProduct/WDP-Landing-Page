// Delegation also handles forms mounted by client-side navigation on editorial pages.
(() => {
  const formSelector = '#contactForm';
  const pendingAttemptKey = 'wdp_pending_consultation_v1';
  const uuid = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
  let pendingAttempt = null;

  function readAttempt() {
    try {
      const attempt = JSON.parse(sessionStorage.getItem(pendingAttemptKey) || 'null');
      return attempt && uuid.test(attempt.id) && /^[a-f0-9]{64}$/.test(attempt.signature) ? attempt : null;
    } catch { return null; }
  }

  async function requestIdFor(fields) {
    const previous = pendingAttempt ?? readAttempt();
    let id = previous?.id ?? crypto.randomUUID();
    async function fingerprint(salt) {
      const encoded = new TextEncoder().encode(JSON.stringify([salt, fields]));
      const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', encoded));
      return Array.from(hash, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    let signature = null;
    try {
      signature = await fingerprint(id);
      if (previous?.signature && previous.signature !== signature) {
        id = crypto.randomUUID();
        signature = await fingerprint(id);
      }
    } catch {}
    pendingAttempt = { id, signature };
    // Retain only the request identifier and a salted fingerprint for a retry after reload.
    if (signature) {
      try { sessionStorage.setItem(pendingAttemptKey, JSON.stringify(pendingAttempt)); } catch {}
    }
    return id;
  }

  function confirmAttempt(id) {
    if (pendingAttempt?.id === id) pendingAttempt = null;
    if (readAttempt()?.id === id) {
      try { sessionStorage.removeItem(pendingAttemptKey); } catch {}
    }
  }

  function showError(input, invalid) {
    input.setAttribute('aria-invalid', String(invalid));
    input.classList.toggle('is-error', invalid);
    input.form.querySelector('#err-' + input.id)?.classList.toggle('visible', invalid);
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-consent-dialog]');
    if (trigger) {
      document.getElementById(trigger.dataset.consentDialog)?.showModal();
      return;
    }
    const dialog = event.target.closest('dialog.privacy-modal-dialog');
    if (!dialog) return;
    if (event.target.closest('[data-consent-close]')) {
      dialog.close();
    } else if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });

  document.addEventListener('input', ({ target }) => {
    if (!target.form?.matches(formSelector)) return;
    if (!target.form.querySelector('[type=submit]').disabled) {
      delete target.form.dataset.analyticsError;
    }
    if (target.id === 'phone') {
      const digits = target.value.replace(/\D/g, '').slice(0, 11);
      target.value = digits.length <= 3 ? digits : digits.length <= 7
        ? digits.slice(0, 3) + '-' + digits.slice(3)
        : [digits.slice(0, 3), digits.slice(3, -4), digits.slice(-4)].join('-');
    }
    if (target.hasAttribute('required')) showError(target, false);
  });

  document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!form.matches(formSelector)) return;
    event.preventDefault();
    const button = form.querySelector('[type=submit]');
    if (button.disabled) return;

    const value = (id) => form.elements.namedItem(id).value.trim();
    let firstInvalid = null;
    for (const field of form.querySelectorAll('[required]')) {
      const invalidEmail = field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      const invalid = !field.validity.valid || !field.value.trim() || invalidEmail;
      showError(field, invalid);
      if (invalid && !firstInvalid) firstInvalid = field;
    }
    const analytics = window.wdpAnalytics;
    const formId = 'consultation';
    const trackError = errorCode => {
      if (form.dataset.analyticsError === errorCode) return;
      if (analytics?.track('consultation_form_error', { form_id: formId, error_code: errorCode })) {
        form.dataset.analyticsError = errorCode;
      }
    };
    if (firstInvalid) {
      trackError('validation');
      firstInvalid.focus();
      return;
    }

    const fields = {
      privacy: form.elements.namedItem('agree').checked,
      company: value('company'), name: value('name'), position: value('position'),
      email: value('email'), phone: value('phone').replace(/\D/g, ''),
      serviceArea: form.elements.namedItem('serviceArea')?.value || '',
      description: value('project'), duration: value('duration'), budget: value('budget'),
      marketing: form.elements.namedItem('marketing').checked,
    };
    const label = button.textContent;
    button.disabled = true;
    button.textContent = '전송 중...';
    try {
      const requestId = await requestIdFor(fields);
      const payload = { ...fields, requestId, analytics_context: analytics?.consultationPayload?.(formId) ?? null };
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.result !== 'success') {
        trackError(response.status === 422 ? 'validation' : 'server');
        alert(data.error || '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        return;
      }
      if (payload.analytics_context) analytics?.trackConsultationSuccess?.(data);
      confirmAttempt(requestId);
      form.reset();
      delete form.dataset.analyticsError;
      const message = '상담 신청이 접수되었습니다. 영업일 1일 내 담당자가 연락드립니다.';
      form.querySelector('#formNote').textContent = message;
      alert(message);
    } catch {
      trackError('network');
      alert('네트워크 오류로 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
})();

// Keep the native select as the form value and as a fallback before enhancement.
if (!customElements.get('wdp-service-select')) {
  customElements.define('wdp-service-select', class extends HTMLElement {
    connectedCallback() {
      queueMicrotask(() => {
        if (!this.isConnected || this.querySelector('[role="combobox"]')) return;
        const select = this.querySelector('select');
        if (!select) return;
        const label = select.labels[0];
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'form-input service-select-trigger';
        trigger.id = select.id + '-trigger';
        trigger.setAttribute('role', 'combobox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'listbox');
        label.htmlFor = trigger.id;
        const menu = document.createElement('div');
        menu.className = 'native-business-panel service-select-panel';
        menu.id = select.id + '-menu';
        menu.setAttribute('role', 'listbox');
        menu.setAttribute('aria-label', label.textContent.trim());
        trigger.setAttribute('aria-controls', menu.id);
        menu.hidden = true;
        const options = Array.from(select.options, (item, index) => {
          const row = document.createElement('div');
          row.id = menu.id + '-' + index;
          row.setAttribute('role', 'option');
          row.textContent = item.text;
          menu.append(row);
          return row;
        });
        const sync = () => {
          trigger.textContent = select.selectedOptions[0].text;
          options.forEach((row, index) => row.setAttribute('aria-selected', String(index === select.selectedIndex)));
        };
        let active = select.selectedIndex;
        const highlight = index => {
          options[active].classList.remove('active');
          active = index;
          options[index].classList.add('active');
          trigger.setAttribute('aria-activedescendant', options[index].id);
          if (options[index].offsetTop < menu.scrollTop) menu.scrollTop = options[index].offsetTop;
          else if (options[index].offsetTop + options[index].offsetHeight > menu.scrollTop + menu.clientHeight)
            menu.scrollTop = options[index].offsetTop + options[index].offsetHeight - menu.clientHeight;
        };
        const outside = event => { if (!this.contains(event.target)) close(); };
        const close = () => {
          document.removeEventListener('pointerdown', outside, true);
          menu.hidden = true;
          trigger.setAttribute('aria-expanded', 'false');
          trigger.removeAttribute('aria-activedescendant');
        };
        const open = () => {
          trigger.focus({ preventScroll: true });
          document.addEventListener('pointerdown', outside, true);
          const rect = trigger.getBoundingClientRect();
          const below = innerHeight - rect.bottom;
          const above = below < 280 && rect.top > below;
          menu.classList.toggle('opens-up', above);
          menu.style.maxHeight = Math.max(80, Math.min(320, (above ? rect.top : below) - 12)) + 'px';
          menu.hidden = false;
          trigger.setAttribute('aria-expanded', 'true');
          highlight(select.selectedIndex);
        };
        const choose = index => {
          if (index !== select.selectedIndex) {
            select.selectedIndex = index;
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
          close();
        };
        this.closeMenu = close;
        trigger.onclick = () => menu.hidden ? open() : close();
        trigger.onblur = close;
        trigger.onkeydown = event => {
          const key = event.key;
          if (key === 'Escape' && !menu.hidden) { event.preventDefault(); close(); return; }
          if (key === 'Tab') { close(); return; }
          if (key === ' ' || key === 'Enter') {
            event.preventDefault();
            if (menu.hidden) open(); else choose(active);
            return;
          }
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return;
          event.preventDefault();
          if (menu.hidden) open();
          if (key === 'Home') highlight(0);
          else if (key === 'End') highlight(options.length - 1);
          else highlight(Math.min(options.length - 1, Math.max(0, active + (key === 'ArrowDown' ? 1 : -1))));
        };
        menu.onmousedown = event => event.preventDefault();
        menu.onclick = event => {
          const index = options.indexOf(event.target);
          if (index >= 0) choose(index);
        };
        select.addEventListener('change', sync);
        select.form.addEventListener('reset', () => queueMicrotask(() => { sync(); close(); }));
        select.hidden = true;
        this.append(trigger, menu);
        sync();
      });
    }
    disconnectedCallback() { this.closeMenu?.(); }
  });
}
