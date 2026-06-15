"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AlunoLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Mock auth — substituir por Supabase no Módulo 2
    await new Promise((r) => setTimeout(r, 800));

    if (mode === "login") {
      if (!email || !password) {
        setError("Preencha e-mail e senha.");
        setLoading(false);
        return;
      }
      router.push("/aluno/dashboard");
    } else {
      if (!name || !email || !password) {
        setError("Preencha todos os campos.");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        setLoading(false);
        return;
      }
      router.push("/aluno/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex">
      {/* Left — branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0D0D0D] border-r border-white/5 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#E31E24]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E31E24]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 text-center space-y-8 max-w-sm">
          {/* Logo */}
          <div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-white font-bold text-4xl">Wind</span>
              <span className="text-[#E31E24] font-bold text-4xl">+</span>
            </div>
            <p className="text-white/30 text-sm tracking-widest uppercase">English Platform</p>
          </div>

          {/* Course cards preview */}
          <div className="space-y-3">
            {[
              { emoji: "🗣️", title: "Fluency Course",       level: "A1 → C2" },
              { emoji: "💼", title: "Business English",      level: "A2 → C1" },
              { emoji: "🩺", title: "English for Medicine",  level: "B1 → C2" },
            ].map((c) => (
              <div key={c.title} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                <span className="text-xl">{c.emoji}</span>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{c.title}</p>
                  <p className="text-white/30 text-xs">{c.level}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-white font-bold text-xl">5</p>
              <p className="text-white/30 text-xs">Cursos</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">10+</p>
              <p className="text-white/30 text-xs">Lições A1</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">A1–C2</p>
              <p className="text-white/30 text-xs">CEFR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-1 mb-2">
            <span className="text-white font-bold text-3xl">Wind</span>
            <span className="text-[#E31E24] font-bold text-3xl">+</span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-white text-2xl font-semibold">
              {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {mode === "login"
                ? "Entre para continuar sua trilha de inglês"
                : "Comece sua jornada para a fluência"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium uppercase tracking-wider">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E31E24]/60 transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E31E24]/60 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium uppercase tracking-wider">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Mínimo 6 caracteres" : "••••••••"}
                className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E31E24]/60 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#E31E24] text-white font-medium text-sm hover:bg-[#c41920] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : mode === "login" ? (
                "Entrar na plataforma →"
              ) : (
                "Criar minha conta →"
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center">
            <p className="text-white/30 text-sm">
              {mode === "login" ? "Não tem conta ainda?" : "Já tem uma conta?"}
              {" "}
              <button
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="text-[#E31E24] font-medium hover:underline"
              >
                {mode === "login" ? "Criar conta grátis" : "Fazer login"}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-white/20 text-xs">ou</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Demo access */}
          <button
            onClick={() => router.push("/aluno/dashboard")}
            className="w-full py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white/70 transition-colors"
          >
            👀 Acessar como visitante (demo)
          </button>

          {/* Footer */}
          <p className="text-center text-white/20 text-xs">
            Wind Connection · Plataforma Wind Plus
          </p>
        </div>
      </div>
    </div>
  );
}
