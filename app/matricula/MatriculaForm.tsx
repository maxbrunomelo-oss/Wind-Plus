'use client';
import React, { useState } from 'react';
import { submitSelfEnrollment } from '@/app/wind-os/actions';

const inputCls = 'w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 disabled:bg-gray-50';

export default function MatriculaForm() {
  const [values, setValues] = useState<Record<string, string>>({
    fullName: '', email: '', whatsapp: '', birthDate: '', cpf: '', modalidade: 'ONLINE', goal: '', interests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = (name: string, value: string) => setValues(v => ({ ...v, [name]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.fullName.trim() || !values.email.trim() || !values.whatsapp.trim()) {
      setError('Preencha nome, e-mail e WhatsApp.');
      return;
    }
    setLoading(true);
    setError(null);
    const res = await submitSelfEnrollment(values);
    setLoading(false);
    if (res.ok) setDone(true);
    else setError(res.error ?? 'Não foi possível enviar. Tente novamente.');
  };

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <h2 className="text-lg font-bold text-gray-900">Cadastro enviado!</h2>
        <p className="text-sm text-gray-500 mt-2">Recebemos seus dados. Nossa equipe entrará em contato em breve para finalizar sua matrícula.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
      <Field label="Nome completo" required>
        <input type="text" value={values.fullName} onChange={e => set('fullName', e.target.value)} className={inputCls} disabled={loading} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="E-mail" required>
          <input type="email" value={values.email} onChange={e => set('email', e.target.value)} className={inputCls} disabled={loading} />
        </Field>
        <Field label="WhatsApp" required>
          <input type="tel" value={values.whatsapp} onChange={e => set('whatsapp', e.target.value)} className={inputCls} disabled={loading} />
        </Field>
        <Field label="Data de nascimento">
          <input type="date" value={values.birthDate} onChange={e => set('birthDate', e.target.value)} className={inputCls} disabled={loading} />
        </Field>
        <Field label="CPF">
          <input type="text" value={values.cpf} onChange={e => set('cpf', e.target.value)} className={inputCls} disabled={loading} />
        </Field>
      </div>
      <Field label="Modalidade">
        <select value={values.modalidade} onChange={e => set('modalidade', e.target.value)} className={inputCls} disabled={loading}>
          <option value="ONLINE">Online</option>
          <option value="PRESENCIAL">Presencial</option>
        </select>
      </Field>
      <Field label="Objetivo com o inglês">
        <input type="text" value={values.goal} onChange={e => set('goal', e.target.value)} className={inputCls} disabled={loading} placeholder="Ex.: viagem, trabalho, intercâmbio..." />
      </Field>
      <Field label="Interesses">
        <input type="text" value={values.interests} onChange={e => set('interests', e.target.value)} className={inputCls} disabled={loading} placeholder="Ex.: música, tecnologia, negócios..." />
      </Field>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

      <button type="submit" disabled={loading} className="w-full text-sm bg-[#E30613] hover:bg-[#B8000D] disabled:opacity-60 text-white rounded-lg px-4 py-2.5 font-medium flex items-center justify-center gap-2">
        {loading && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
        {loading ? 'Enviando...' : 'Enviar cadastro'}
      </button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}{required && <span className="text-[#E30613]"> *</span>}</label>
      {children}
    </div>
  );
}
