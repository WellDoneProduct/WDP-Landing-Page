'use client';
import { useEffect, useRef, useState } from 'react';
import { useModal } from './ModalContext';

type FormData = { name: string; phone: string; company: string; description: string; marketing: boolean };
type Errors   = { name: string; phone: string };

const EMPTY_FORM:   FormData = { name: '', phone: '', company: '', description: '', marketing: false };
const EMPTY_ERRORS: Errors   = { name: '', phone: '' };

/* ── Validation ─────────────────────────────────────────────────── */
const validateName = (v: string): string => {
  if (!v.trim()) return '이름을 입력해 주세요.';
  if (!/^[가-힣\s]+$/.test(v.trim())) return '이름은 한글로 입력해 주세요.';
  return '';
};
const validatePhone = (v: string): string => {
  if (!v.trim()) return '연락처를 입력해 주세요.';
  if (!/^[\d\-]+$/.test(v.trim())) return '연락처는 숫자로 입력해 주세요.';
  return '';
};

/* ── Sub-components ─────────────────────────────────────────────── */
function InputField({
  label, required, optional, error, children,
}: {
  label: string; required?: boolean; optional?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold" style={{ color: '#374151' }}>
        {label}
        {required && <span className="ml-0.5" style={{ color: '#0048FF' }}>*</span>}
        {optional && <span className="ml-1 font-normal" style={{ color: '#9CA3AF' }}>(선택)</span>}
      </label>
      {children}
      {error && <p className="text-xs mt-0.5" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  );
}

function StyledInput({ hasError, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
      style={{
        border: `1.5px solid ${hasError ? '#EF4444' : '#E5E7EB'}`,
        background: hasError ? 'rgba(239,68,68,0.03)' : '#fff',
        color: '#111827',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#0048FF';
        e.currentTarget.style.background = '#fff';
        props.onFocus?.(e);
      }}
      onBlur={(e) => { props.onBlur?.(e); }}
    />
  );
}

/* ── Exit Confirm Dialog ────────────────────────────────────────── */
function ExitConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
  }, []);

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center rounded-t-2xl sm:rounded-2xl px-6"
      style={{
        background: 'rgba(17,24,39,0.45)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        opacity: animIn ? 1 : 0,
        transition: 'opacity 0.18s ease',
      }}
    >
      <div
        className="w-full max-w-xs bg-white rounded-2xl p-7 shadow-2xl text-center"
        style={{
          transform: animIn ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(8px)',
          transition: 'transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.18s ease',
          opacity: animIn ? 1 : 0,
        }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, #FFF7ED, #FED7AA)' }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 7v5M11 15h.01" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M10.29 2.86L1.82 17a1 1 0 00.86 1.5h16.64a1 1 0 00.86-1.5L11.71 2.86a1 1 0 00-1.42 0z"
              stroke="#F97316"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="text-base font-bold mb-2 leading-snug" style={{ color: '#111827' }}>
          지금 신청하면 무료로 상담받을 수 있어요!
        </h3>
        <p className="text-xs leading-relaxed mb-6" style={{ color: '#6B7280' }}>
          무료 상담은 선착순으로 마감되며, 이후에는 유료로 전환됩니다.
          <br />
          지금 닫으면 작성 중인 내용이 사라져요.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors hover:brightness-95"
            style={{ background: '#F3F4F6', color: '#6B7280' }}
          >
            종료하기
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0048FF, #3B82F6)' }}
          >
            계속 작성하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function ContactModal() {
  const { isOpen, closeModal } = useModal();
  const [show, setShow]               = useState(false);
  const [form, setForm]               = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors]           = useState<Errors>(EMPTY_ERRORS);
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isDirty = !submitted && (
    form.name !== '' || form.phone !== '' ||
    form.company !== '' || form.description !== ''
  );

  /* ── Try-close: show dirty-check dialog if needed ── */
  const tryClose = () => {
    if (isDirty) { setExitConfirm(true); }
    else { closeModal(); }
  };

  /* ── Animation ── */
  useEffect(() => {
    if (isOpen) {
      setExitConfirm(false);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
    } else {
      setShow(false);
      const t = setTimeout(() => {
        document.body.style.overflow = '';
        setForm(EMPTY_FORM);
        setErrors(EMPTY_ERRORS);
        setSubmitted(false);
        setExitConfirm(false);
      }, 320);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  /* ── Escape key ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (exitConfirm) { setExitConfirm(false); }
      else { tryClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [exitConfirm, isDirty]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr  = validateName(form.name);
    const phoneErr = validatePhone(form.phone);
    if (nameErr || phoneErr) { setErrors({ name: nameErr, phone: phoneErr }); return; }
    if (!form.description.trim()) return;

    setLoading(true);

    /* 1. 구글 시트에 저장 (Next.js API Route → Apps Script 서버사이드 전달) */
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          company: form.company || '',
          description: form.description,
        }),
      });
    } catch {
      // 시트 저장 실패해도 성공 화면은 계속 진행
    } finally {
      setLoading(false);
    }

    setSubmitted(true);
  };

  if (!isOpen && !show) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) tryClose(); }}
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:px-4"
      style={{
        background: 'rgba(0,0,0,0.48)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      {/* ── Modal card ── */}
      <div
        className="relative w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          maxHeight: '92dvh',
          transform: show ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          opacity: show ? 1 : 0,
          transition: 'transform 0.32s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.25s ease',
        }}
      >
        {/* ── Dirty-check overlay (renders inside card) ── */}
        {exitConfirm && (
          <ExitConfirmDialog
            onConfirm={() => { setExitConfirm(false); closeModal(); }}
            onCancel={() => setExitConfirm(false)}
          />
        )}

        {/* Close */}
        <button
          onClick={tryClose}
          aria-label="닫기"
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:brightness-95"
          style={{ background: '#F3F4F6', color: '#6B7280' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="overflow-y-auto flex-1">
          {submitted ? (
            /* ── Success ── */
            <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg, #0048FF, #3B82F6)' }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M5 14L11 20L23 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#111827' }}>신청이 완료됐어요!</h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280' }}>
                빠른 시일 내에 담당자가 연락드릴게요.
              </p>
              <button
                onClick={closeModal}
                className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0048FF, #3B82F6)' }}
              >
                닫기
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div className="px-8 pt-8 pb-6">
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{ background: 'rgba(0,72,255,0.08)', color: '#0048FF' }}
                >
                  무료 상담
                </div>
                <h2 className="text-xl font-bold mb-1.5" style={{ color: '#111827' }}>
                  업무 자동화 상담 신청
                </h2>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  작성 내용을 바탕으로 맞춤 상담을 드립니다.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="px-8 pb-8 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="이름" required error={errors.name}>
                    <StyledInput
                      type="text"
                      placeholder="홍길동"
                      hasError={!!errors.name}
                      value={form.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm(f => ({ ...f, name: val }));
                        if (errors.name) setErrors(prev => ({ ...prev, name: validateName(val) }));
                      }}
                      onBlur={(e) => setErrors(prev => ({ ...prev, name: validateName(e.target.value) }))}
                    />
                  </InputField>

                  <InputField label="연락처" required error={errors.phone}>
                    <StyledInput
                      type="tel"
                      placeholder="010-0000-0000"
                      hasError={!!errors.phone}
                      value={form.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm(f => ({ ...f, phone: val }));
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: validatePhone(val) }));
                      }}
                      onBlur={(e) => setErrors(prev => ({ ...prev, phone: validatePhone(e.target.value) }))}
                    />
                  </InputField>
                </div>

                <InputField label="회사명 / 팀명" optional>
                  <StyledInput
                    type="text"
                    placeholder="웰던프로덕트"
                    value={form.company}
                    onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
                  />
                </InputField>

                <InputField label="자동화하고 싶은 업무" required>
                  <textarea
                    rows={4}
                    placeholder="예) 매일 아침 엑셀 파일을 팀원들에게 이메일로 발송하는 작업을 자동화하고 싶습니다."
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{
                      border: '1.5px solid #E5E7EB',
                      color: '#111827',
                      lineHeight: '1.6',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#0048FF')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = '#E5E7EB')}
                  />
                </InputField>

                {/* 마케팅 수신 동의 */}
                <label className="flex items-start gap-3 group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={form.marketing}
                      onChange={(e) => setForm(f => ({ ...f, marketing: e.target.checked }))}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
                      style={{
                        border: form.marketing ? 'none' : '1.5px solid #D1D5DB',
                        background: form.marketing ? 'linear-gradient(135deg, #0048FF, #3B82F6)' : '#fff',
                      }}
                    >
                      {form.marketing && (
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm leading-snug" style={{ color: '#374151' }}>
                      자동화 트렌드와 성공 사례를 담은 뉴스레터를 받아볼게요.
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                      언제든지 수신 거부할 수 있어요. (선택)
                    </p>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2.5"
                  style={{ background: 'linear-gradient(135deg, #0048FF, #3B82F6)' }}
                >
                  {loading ? (
                    <>
                      <div className="three-body" style={{ '--uib-size': '20px', '--uib-color': '#ffffff' } as React.CSSProperties}>
                        <div className="three-body__dot" />
                        <div className="three-body__dot" />
                        <div className="three-body__dot" />
                      </div>
                      <span>신청 중...</span>
                    </>
                  ) : (
                    '상담 신청하기 →'
                  )}
                </button>

                <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>
                  입력하신 정보는 상담 목적으로만 활용됩니다.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
