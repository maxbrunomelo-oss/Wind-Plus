'use client';
import React, { useEffect, useState } from 'react';
import { IconX } from './Icons';

// ── Base modal ────────────────────────────────────────────────
export function Modal({ open, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  children: React.ReactNode; maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8" onMouseDown={onClose}>
      <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl my-4`} onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 shrink-0"><IconX size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Schema-driven form ────────────────────────────────────────
export type FieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea' | 'multiselect';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  half?: boolean;
  help?: string;
  min?: number;
  max?: number;
  step?: string;
}

export type FormValues = Record<string, string | string[]>;
export type SubmitResult = { ok: boolean; error?: string };

const inputCls = 'w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 disabled:bg-gray-50';

export function FormModal({
  open, onClose, title, subtitle, fields, initial, submitLabel = 'Salvar', onSubmit, maxWidth,
}: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  fields: FieldDef[]; initial?: FormValues; submitLabel?: string; maxWidth?: string;
  onSubmit: (values: FormValues) => Promise<SubmitResult>;
}) {
  const buildInitial = (): FormValues => {
    const v: FormValues = {};
    for (const f of fields) {
      const iv = initial?.[f.name];
      v[f.name] = iv !== undefined && iv !== null ? iv : (f.type === 'multiselect' ? [] : '');
    }
    return v;
  };

  const [values, setValues] = useState<FormValues>(buildInitial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset when opening or switching record
  useEffect(() => { if (open) { setValues(buildInitial()); setError(null); } /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [open, initial]);

  const set = (name: string, value: string | string[]) => setValues(v => ({ ...v, [name]: value }));

  const toggleMulti = (name: string, val: string) => {
    setValues(v => {
      const cur = Array.isArray(v[name]) ? (v[name] as string[]) : [];
      return { ...v, [name]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const f of fields) {
      if (f.required) {
        const val = values[f.name];
        const empty = f.type === 'multiselect' ? !(Array.isArray(val) && val.length) : !String(val ?? '').trim();
        if (empty) { setError(`Preencha o campo "${f.label}".`); return; }
      }
    }
    setLoading(true);
    setError(null);
    try {
      const res = await onSubmit(values);
      if (res.ok) onClose();
      else setError(res.error ?? 'Não foi possível salvar. Tente novamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={loading ? () => {} : onClose} title={title} subtitle={subtitle} maxWidth={maxWidth}>
      <form onSubmit={submit}>
        <div className="px-5 py-4 grid grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto">
          {fields.map(f => (
            <div key={f.name} className={f.half ? 'col-span-1' : 'col-span-2'}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {f.label}{f.required && <span className="text-[#E30613]"> *</span>}
              </label>
              {f.type === 'select' ? (
                <select value={values[f.name] as string} onChange={e => set(f.name, e.target.value)} className={inputCls} disabled={loading}>
                  <option value="">{f.placeholder ?? 'Selecione...'}</option>
                  {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea value={values[f.name] as string} onChange={e => set(f.name, e.target.value)} rows={3} placeholder={f.placeholder} className={inputCls + ' resize-none'} disabled={loading} />
              ) : f.type === 'multiselect' ? (
                <div className="flex flex-wrap gap-1.5">
                  {f.options?.map(o => {
                    const active = Array.isArray(values[f.name]) && (values[f.name] as string[]).includes(o.value);
                    return (
                      <button type="button" key={o.value} onClick={() => toggleMulti(f.name, o.value)} disabled={loading}
                        className={`text-xs rounded-lg px-2.5 py-1.5 border font-medium transition-colors ${active ? 'bg-[#E30613] text-white border-[#E30613]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  type={f.type} value={values[f.name] as string}
                  onChange={e => set(f.name, e.target.value)}
                  placeholder={f.placeholder} className={inputCls} disabled={loading}
                  min={f.min} max={f.max} step={f.step}
                />
              )}
              {f.help && <p className="text-[11px] text-gray-400 mt-1">{f.help}</p>}
            </div>
          ))}
        </div>

        {error && <div className="mx-5 mb-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} disabled={loading} className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg disabled:opacity-50">Cancelar</button>
          <button type="submit" disabled={loading} className="text-sm bg-[#E30613] hover:bg-[#B8000D] disabled:opacity-60 text-white rounded-lg px-4 py-2 font-medium flex items-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Salvando...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
