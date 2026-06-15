"use client";

import { useState } from "react";
import { Certificate, WIND_PLUS_COURSES, CEFR_LEVELS } from "@/lib/certificates/types";
import { qrCodeUrl } from "@/lib/certificates/generateCode";

interface Props {
  onCreated: (cert: Certificate) => void;
}

const today = new Date().toISOString().split("T")[0];

export default function CertificateForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Certificate | null>(null);

  const [form, setForm] = useState({
    student_name: "",
    student_email: "",
    course_name: "",
    course_level: "",
    workload: "",
    teacher_name: "",
    issue_date: today,
    notes: "",
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao criar certificado.");
      setCreated(data.certificate);
      onCreated(data.certificate);
      setForm({
        student_name: "", student_email: "", course_name: "",
        course_level: "", workload: "", teacher_name: "",
        issue_date: today, notes: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => { setCreated(null); setOpen(true); };

  // ── Success screen ────────────────────────────────────────────────────
  if (created) {
    const qr = qrCodeUrl(created.validation_url, 180);
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-lg">✓</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Certificado emitido com sucesso!</h3>
            <p className="text-sm text-gray-500">Guarde o código abaixo — ele é único e intransferível.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details */}
          <div className="space-y-2">
            <DetailRow label="Aluno" value={created.student_name} />
            <DetailRow label="E-mail" value={created.student_email} />
            <DetailRow label="Curso" value={created.course_name} />
            <DetailRow label="Nível" value={created.course_level} />
            <DetailRow label="Carga horária" value={created.workload} />
            <DetailRow label="Professor" value={created.teacher_name} />
            <DetailRow label="Data de emissão" value={
              new Date(created.issue_date + "T12:00:00").toLocaleDateString("pt-BR", {
                day: "2-digit", month: "long", year: "numeric"
              })
            } />
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-1">Código do certificado</p>
              <code className="block bg-[#111111] text-[#E30613] font-mono font-bold text-base px-4 py-2 rounded-xl tracking-widest">
                {created.certificate_code}
              </code>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">URL de validação</p>
              <a
                href={created.validation_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline break-all"
              >
                {created.validation_url}
              </a>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center gap-3 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">QR Code de Validação</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr}
              alt="QR Code de validação"
              width={180}
              height={180}
              className="rounded-lg"
            />
            <p className="text-xs text-gray-400 text-center">
              Escaneie para verificar a autenticidade do certificado
            </p>
            <a
              href={qr}
              download={`qr-${created.certificate_code}.svg`}
              className="text-xs text-[#E30613] hover:underline"
            >
              ↓ Baixar QR Code
            </a>
          </div>
        </div>

        <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
          <button
            onClick={handleNew}
            className="bg-[#E30613] hover:bg-[#B8000D] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            + Emitir novo certificado
          </button>
          <button
            onClick={() => setCreated(null)}
            className="border border-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  // ── Collapsed ─────────────────────────────────────────────────────────
  if (!open) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setOpen(true)}
          className="bg-[#E30613] hover:bg-[#B8000D] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
        >
          + Emitir Certificado
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900 text-lg">Emitir Novo Certificado</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Fechar"
        >×</button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nome completo do aluno *">
          <input
            type="text" required value={form.student_name}
            onChange={(e) => set("student_name", e.target.value)}
            className={inputCls} placeholder="Ex: Maria da Silva"
          />
        </FormField>

        <FormField label="E-mail do aluno *">
          <input
            type="email" required value={form.student_email}
            onChange={(e) => set("student_email", e.target.value)}
            className={inputCls} placeholder="aluno@email.com"
          />
        </FormField>

        <FormField label="Curso *">
          <select
            required value={form.course_name}
            onChange={(e) => set("course_name", e.target.value)}
            className={inputCls}
          >
            <option value="">Selecione o curso...</option>
            {WIND_PLUS_COURSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="__custom__">Outro (digitar)</option>
          </select>
          {form.course_name === "__custom__" && (
            <input
              type="text" required
              onChange={(e) => set("course_name", e.target.value)}
              className={`${inputCls} mt-2`}
              placeholder="Nome do curso"
            />
          )}
        </FormField>

        <FormField label="Nível CEFR *">
          <select
            required value={form.course_level}
            onChange={(e) => set("course_level", e.target.value)}
            className={inputCls}
          >
            <option value="">Selecione o nível...</option>
            {CEFR_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Carga horária *">
          <input
            type="text" required value={form.workload}
            onChange={(e) => set("workload", e.target.value)}
            className={inputCls} placeholder="Ex: 60 horas"
          />
        </FormField>

        <FormField label="Nome do professor *">
          <input
            type="text" required value={form.teacher_name}
            onChange={(e) => set("teacher_name", e.target.value)}
            className={inputCls} placeholder="Prof. João Santos"
          />
        </FormField>

        <FormField label="Data de emissão *">
          <input
            type="date" required value={form.issue_date}
            onChange={(e) => set("issue_date", e.target.value)}
            className={inputCls}
          />
        </FormField>

        <FormField label="Observações (opcional)">
          <input
            type="text" value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={inputCls} placeholder="Ex: Turma matutina 2025"
          />
        </FormField>

        {error && (
          <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="md:col-span-2 flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E30613] hover:bg-[#B8000D] disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            {loading ? "Gerando certificado..." : "Emitir Certificado →"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="border border-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E30613]/40 bg-white";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm py-1 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 w-36 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}
