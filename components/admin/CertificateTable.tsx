"use client";

import { useState } from "react";
import { Certificate, STATUS_LABELS, STATUS_COLORS, CertificateStatus } from "@/lib/certificates/types";
import { qrCodeUrl } from "@/lib/certificates/generateCode";

interface Props {
  initialCertificates: Certificate[];
}

export default function CertificateTable({ initialCertificates }: Props) {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CertificateStatus>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<Certificate | null>(null);

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.student_name.toLowerCase().includes(q) ||
      c.student_email.toLowerCase().includes(q) ||
      c.certificate_code.toLowerCase().includes(q) ||
      c.course_name.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: CertificateStatus) => {
    if (!confirm(`Confirma alterar o status para "${STATUS_LABELS[status]}"?`)) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/certificates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar.");
      const { certificate } = await res.json();
      setCertificates((prev) => prev.map((c) => (c.id === id ? certificate : c)));
    } catch {
      alert("Erro ao atualizar o certificado.");
    } finally {
      setLoadingId(null);
    }
  };

  // Allow adding newly created certificates from the form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (CertificateTable as any)._addCert = (cert: Certificate) => {
    setCertificates((prev) => [cert, ...prev]);
  };

  return (
    <>
      {/* QR Modal */}
      {qrModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setQrModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-gray-900 mb-1 text-center">{qrModal.student_name}</h3>
            <p className="text-xs text-gray-500 text-center mb-4">{qrModal.course_name}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl(qrModal.validation_url, 220)}
              alt="QR Code"
              width={220}
              height={220}
              className="mx-auto rounded-lg"
            />
            <code className="block text-center font-mono text-xs text-[#E30613] font-bold mt-3 bg-gray-50 rounded-lg py-2">
              {qrModal.certificate_code}
            </code>
            <a
              href={qrModal.validation_url}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-xs text-blue-600 hover:underline mt-2 break-all"
            >
              {qrModal.validation_url}
            </a>
            <div className="flex gap-2 mt-4">
              <a
                href={qrCodeUrl(qrModal.validation_url, 400)}
                download={`cert-${qrModal.certificate_code}.svg`}
                className="flex-1 text-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-xl transition-colors"
              >
                ↓ Baixar QR
              </a>
              <button
                onClick={() => setQrModal(null)}
                className="flex-1 text-xs bg-[#111111] text-white font-medium py-2 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por aluno, e-mail, curso ou código..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/40"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | CertificateStatus)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/40"
        >
          <option value="all">Todos os status</option>
          <option value="active">Válidos</option>
          <option value="revoked">Revogados</option>
          <option value="expired">Expirados</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-3">{filtered.length} certificado(s)</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🎓</p>
          <p className="font-medium">Nenhum certificado encontrado.</p>
          <p className="text-sm mt-1">Emita o primeiro usando o botão acima.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Aluno", "Curso", "Nível", "Data", "Código", "Status", "Ações"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#111111] whitespace-nowrap">{cert.student_name}</p>
                    <p className="text-xs text-gray-400">{cert.student_email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                    <p className="truncate">{cert.course_name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{cert.course_level}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(cert.issue_date + "T12:00:00").toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-[#E30613] font-semibold">
                      {cert.certificate_code}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[cert.status]}`}
                    >
                      {STATUS_LABELS[cert.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQrModal(cert)}
                        title="Ver QR Code"
                        className="text-xs text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors"
                      >
                        QR
                      </button>
                      <a
                        href={cert.validation_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                      >
                        Verificar
                      </a>
                      {cert.status === "active" && (
                        <button
                          onClick={() => updateStatus(cert.id, "revoked")}
                          disabled={loadingId === cert.id}
                          className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loadingId === cert.id ? "..." : "Revogar"}
                        </button>
                      )}
                      {cert.status === "revoked" && (
                        <button
                          onClick={() => updateStatus(cert.id, "active")}
                          disabled={loadingId === cert.id}
                          className="text-xs text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loadingId === cert.id ? "..." : "Reativar"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
