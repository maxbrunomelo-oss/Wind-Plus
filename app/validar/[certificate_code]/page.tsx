import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import WindPlusWordmark from "@/components/ui/WindPlusWordmark";
import { Certificate, STATUS_LABELS } from "@/lib/certificates/types";
import { qrCodeUrl } from "@/lib/certificates/generateCode";

interface Props {
  params: Promise<{ certificate_code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certificate_code } = await params;
  return {
    title: `Validar Certificado ${certificate_code} — Wind Plus`,
    description: "Verifique a autenticidade deste certificado Wind Plus Escola de Inglês.",
  };
}

export default async function ValidarPage({ params }: Props) {
  const { certificate_code } = await params;
  const code = certificate_code.toUpperCase();

  const supabase = createAdminClient();
  const { data: cert, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("certificate_code", code)
    .maybeSingle();

  const notFound = error || !cert;
  const certificate = cert as Certificate | null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#222222] flex flex-col">
      {/* Top bar */}
      <nav className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-wind-plus.png"
              alt="Wind Plus"
              width={28}
              height={28}
              className="h-7 w-7 object-contain brightness-0 invert"
            />
            <WindPlusWordmark size="text-sm" windColor="text-white" plusColor="text-[#E30613]" />
            <span className="text-gray-500 text-xs hidden sm:block">Escola de Inglês</span>
          </Link>
          <span className="text-gray-500 text-xs uppercase tracking-widest">Validação de Certificado</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">

          {/* ── Not found ── */}
          {notFound && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✗</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Certificado não encontrado</h1>
              <p className="text-gray-400 mb-2">
                O código <code className="text-[#E30613] font-mono font-bold">{code}</code> não corresponde a nenhum certificado emitido pela Wind Plus.
              </p>
              <p className="text-gray-500 text-sm mb-8">
                Verifique se o código foi digitado corretamente ou entre em contato com a escola.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-400 max-w-sm mx-auto">
                <p className="font-semibold text-gray-300 mb-1">Suspeita de fraude?</p>
                <p>Entre em contato com a Wind Plus para verificar a autenticidade deste documento.</p>
              </div>
            </div>
          )}

          {/* ── Found ── */}
          {!notFound && certificate && (
            <div>
              {/* Status badge */}
              <div className="text-center mb-6">
                {certificate.status === "active" && (
                  <div className="inline-flex items-center gap-3 bg-green-500/10 border-2 border-green-500/40 rounded-2xl px-6 py-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                    <div className="text-left">
                      <p className="text-green-400 font-bold text-lg">Certificado Válido</p>
                      <p className="text-green-600 text-xs">Autenticidade confirmada pela Wind Plus</p>
                    </div>
                  </div>
                )}
                {certificate.status === "revoked" && (
                  <div className="inline-flex items-center gap-3 bg-red-500/10 border-2 border-red-500/40 rounded-2xl px-6 py-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">✗</span>
                    </div>
                    <div className="text-left">
                      <p className="text-red-400 font-bold text-lg">Certificado Revogado</p>
                      <p className="text-red-600 text-xs">Este certificado foi cancelado pela instituição</p>
                    </div>
                  </div>
                )}
                {certificate.status === "expired" && (
                  <div className="inline-flex items-center gap-3 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-2xl px-6 py-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">!</span>
                    </div>
                    <div className="text-left">
                      <p className="text-yellow-400 font-bold text-lg">Certificado Expirado</p>
                      <p className="text-yellow-600 text-xs">A validade deste certificado expirou</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Certificate card */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Certificate header */}
                <div className="bg-[#111111] px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo-wind-plus.png"
                      alt="Wind Plus"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain brightness-0 invert"
                    />
                    <div>
                      <p className="text-white font-bold">Wind Plus</p>
                      <p className="text-gray-400 text-xs">Escola de Inglês</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Certificado de Conclusão</p>
                    <p className="text-[#E30613] font-mono font-bold text-sm mt-0.5">{certificate.certificate_code}</p>
                  </div>
                </div>

                {/* Red accent stripe */}
                <div className="h-1 bg-[#E30613]" />

                {/* Content */}
                <div className="px-8 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main info */}
                    <div className="md:col-span-2 space-y-5">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Certifica que</p>
                        <h2 className="text-2xl font-bold text-[#111111]">{certificate.student_name}</h2>
                        <p className="text-gray-500 text-sm">{certificate.student_email}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">concluiu com aproveitamento o curso</p>
                        <p className="text-xl font-bold text-[#111111]">{certificate.course_name}</p>
                        <p className="text-[#E30613] font-semibold">{certificate.course_level}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Carga horária</p>
                          <p className="font-semibold text-gray-800">{certificate.workload}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Data de emissão</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(certificate.issue_date + "T12:00:00").toLocaleDateString("pt-BR", {
                              day: "2-digit", month: "long", year: "numeric"
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Professor responsável</p>
                          <p className="font-semibold text-gray-800">{certificate.teacher_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Status</p>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            certificate.status === "active"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : certificate.status === "revoked"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : "bg-gray-100 text-gray-600 border-gray-300"
                          }`}>
                            {STATUS_LABELS[certificate.status]}
                          </span>
                        </div>
                      </div>

                      {certificate.notes && (
                        <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 border border-gray-200">
                          {certificate.notes}
                        </div>
                      )}
                    </div>

                    {/* QR code */}
                    <div className="flex flex-col items-center justify-start gap-3 pt-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        Código de verificação
                      </p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCodeUrl(certificate.validation_url, 160)}
                        alt="QR Code"
                        width={160}
                        height={160}
                        className="rounded-xl border border-gray-200 p-2"
                      />
                      <code className="text-xs font-mono font-bold text-[#E30613] bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 tracking-wider text-center">
                        {certificate.certificate_code}
                      </code>
                      <p className="text-xs text-gray-400 text-center leading-relaxed">
                        Escaneie para validar a autenticidade deste certificado
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p className="text-xs text-gray-400">
                    Verificado em {new Date().toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}
                  </p>
                  <p className="text-xs text-gray-400">
                    windplus.com.br · Escola de Inglês
                  </p>
                </div>
              </div>

              {/* Share / copy */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs">
                  URL de validação:{" "}
                  <span className="text-gray-300 font-mono">{certificate.validation_url}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
