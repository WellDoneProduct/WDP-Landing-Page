// Delegation also handles forms mounted by client-side navigation on editorial pages.
(() => {
  const formSelector = '#contactForm';
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
      delete target.form.dataset.inquiryId;
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

    form.dataset.inquiryId ||= window.crypto?.randomUUID?.() || '';
    const payload = {
      requestId: form.dataset.inquiryId,
      attribution: analytics?.attribution() ?? null,
      origin: analytics?.consultationContext(formId) ?? null,
      privacy: form.elements.namedItem('agree').checked,
      company: value('company'), name: value('name'), position: value('position'),
      email: value('email'), phone: value('phone').replace(/\D/g, ''),
      description: value('project'), duration: value('duration'), budget: value('budget'),
      marketing: form.elements.namedItem('marketing').checked,
    };
    const label = button.textContent;
    button.disabled = true;
    button.textContent = '전송 중...';
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.result !== 'success') {
        trackError(response.status === 422 ? 'validation' : 'server');
        alert(data.error || '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        return;
      }
      if (data.saved === true && data.analytics_event_id) {
        analytics?.track('generate_lead', { form_id: formId, event_id: data.analytics_event_id });
      }
      form.reset();
      delete form.dataset.inquiryId;
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
