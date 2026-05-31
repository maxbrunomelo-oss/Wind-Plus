"use client";

import Link from "next/link";
import { useState } from "react";

type Result = {
  id: string;
  student_name: string;
  email: string;
  phone: string;
  age: number | null;
  objective: string | null;
  raw_score: number;
  max_score: number;
  percentage: number;
  cefr_level: string;
  writing_answer: string | null;
  created_at: string;
};

const levelBadge: Record<string, string> = {
  starter: "bg-gray-100 text-gray-700",
  A1:      "bg-red-50 text-red-700",
  A2:      "bg-red-100 text-red-800",
  B1:      "bg-orange-100 text-orange-800",
  B2:      "bg-gray-800 text-white",
  C1:      "bg-[#111111] text-white",
};

export default function PlacementResultsTable({ results }: { results: Result[] }) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const filtered = results.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.student_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q);
    const matchLevel = levelFilter === "all" || r.cefr_level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou WhatsApp..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/40"
        />
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/40">
          <option value="all">Todos os níveis</option>
          {["starter","A1","A2","B1","B2","C1"].map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <a href="/admin/placement-results/export"
          className="inline-flex items-center gap-1 bg-[#E30613] hover:bg-[#B8000D] text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
          ↓ Exportar CSV
        </a>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} resultado(s)</p>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Nome","E-mail","WhatsApp","Idade","Objetivo","Pontuação","Nível CEFR","Writing","Data","Ações"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-gray-400">Nenhum resultado encontrado.</td>
              </tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-[#111111] whitespace-nowrap">{r.student_name}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.email}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.phone}</td>
                <td className="px-4 py-3 text-gray-500 text-center">{r.age ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.objective ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {r.raw_score}/{r.max_score} <span className="text-gray-400">({r.percentage}%)</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${levelBadge[r.cefr_level] ?? "bg-gray-100 text-gray-700"}`}>
                    {r.cefr_level}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {r.writing_answer
                    ? <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pending review</span>
                    : <span className="text-gray-300 text-xs">—</span>
                  }
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                  {new Date(r.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/placement-results/${r.id}`}
                    className="text-[#E30613] hover:text-[#B8000D] font-medium text-xs underline">
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
