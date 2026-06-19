'use client';
import React, { useState } from 'react';
import { IconDownload } from '@/components/windos/Icons';
import { brl, dateBR } from '@/lib/windos/format';
import type { Payment, Student } from '@/lib/windos/types';

interface Props {
  payments: Payment[];
  students: Student[];
}

const STATUS_LABEL: Record<string, string> = {
  PAGO: 'Pago', PENDENTE: 'Pendente', ATRASADO: 'Atrasado', CANCELADO: 'Cancelado',
};
const METHOD_LABEL: Record<string, string> = {
  PIX: 'PIX', BOLETO: 'Boleto', CARTAO: 'Cartão',
  DINHEIRO: 'Dinheiro', TRANSFERENCIA: 'Transferência', OUTRO: 'Outro',
};
const MODALIDADE_LABEL: Record<string, string> = { ONLINE: 'Online', PRESENCIAL: 'Presencial' };

export default function ReportsExportButton({ payments, students }: Props) {
  const [open, setOpen] = useState(false);

  const stuMap = Object.fromEntries(students.map(s => [s.id, s]));

  // ─── Computed stats ─────────────────────────────────────────
  const activeStudents = students.filter(s =>
    ['ATIVO', 'INADIMPLENTE', 'EXPERIMENTAL'].includes(s.status));
  const previsto   = payments.filter(p => p.status !== 'CANCELADO').reduce((a, p) => a + p.finalAmount, 0);
  const recebido   = payments.filter(p => p.status === 'PAGO').reduce((a, p) => a + p.finalAmount, 0);
  const pendente   = payments.filter(p => p.status === 'PENDENTE').reduce((a, p) => a + p.finalAmount, 0);
  const atrasado   = payments.filter(p => p.status === 'ATRASADO').reduce((a, p) => a + p.finalAmount, 0);
  const overdueSet = new Set(payments.filter(p => p.status === 'ATRASADO').map(p => p.studentId));
  const inadim     = activeStudents.length
    ? Math.round((overdueSet.size / activeStudents.length) * 100) : 0;

  // ─── XLSX Export ────────────────────────────────────────────
  const exportXLSX = async () => {
    const XLSX = await import('xlsx');

    const wb = XLSX.utils.book_new();

    /* Sheet 1 — Resumo */
    const ws1 = XLSX.utils.aoa_to_sheet([
      ['RELATÓRIO FINANCEIRO — WIND PLUS'],
      ['Gerado em:', new Date().toLocaleString('pt-BR')],
      [],
      ['INDICADORES GERAIS'],
      ['Receita prevista',  brl(previsto)],
      ['Receita recebida',  brl(recebido)],
      ['Em aberto',         brl(pendente + atrasado)],
      ['Pendente',          brl(pendente)],
      ['Atrasado',          brl(atrasado)],
      ['Inadimplência',     `${inadim}%`],
      [],
      ['ALUNOS'],
      ['Total ativos',                activeStudents.length],
      ['Com pagamento atrasado',      overdueSet.size],
      ['Online',                      activeStudents.filter(s => s.modalidade === 'ONLINE').length],
      ['Presencial',                  activeStudents.filter(s => s.modalidade === 'PRESENCIAL').length],
    ]);
    ws1['!cols'] = [{ wch: 32 }, { wch: 24 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Resumo');

    /* Sheet 2 — Mensalidades detalhadas */
    const payRows = payments.map(p => {
      const stu = stuMap[p.studentId];
      return [
        stu?.fullName ?? '—',
        stu?.email ?? '—',
        stu?.whatsapp ?? '—',
        MODALIDADE_LABEL[stu?.modalidade ?? ''] ?? '—',
        p.referenceMonth,
        p.description,
        p.dueDate,
        p.amount,
        p.discountAmount,
        p.finalAmount,
        STATUS_LABEL[p.status] ?? p.status,
        p.paymentDate ?? '—',
        p.paymentMethod ? (METHOD_LABEL[p.paymentMethod] ?? p.paymentMethod) : '—',
      ];
    });
    const ws2 = XLSX.utils.aoa_to_sheet([
      ['Aluno', 'E-mail', 'WhatsApp', 'Modalidade', 'Mês Ref.', 'Descrição',
       'Vencimento', 'Valor', 'Desconto', 'Valor Final',
       'Status', 'Dt. Pagamento', 'Forma de Pagamento'],
      ...payRows,
    ]);
    ws2['!cols'] = [
      { wch: 28 }, { wch: 28 }, { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 24 },
      { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(wb, ws2, 'Mensalidades');

    /* Sheet 3 — Resumo por aluno */
    const stuRows = students.map(stu => {
      const sp = payments.filter(p => p.studentId === stu.id);
      return [
        stu.fullName,
        stu.email,
        MODALIDADE_LABEL[stu.modalidade] ?? stu.modalidade,
        stu.monthlyAmount,
        METHOD_LABEL[stu.paymentMethod] ?? stu.paymentMethod,
        stu.dueDay,
        sp.length,
        sp.filter(p => p.status === 'PAGO').reduce((a, p) => a + p.finalAmount, 0),
        sp.filter(p => p.status === 'PENDENTE').reduce((a, p) => a + p.finalAmount, 0),
        sp.filter(p => p.status === 'ATRASADO').reduce((a, p) => a + p.finalAmount, 0),
        stu.status,
      ];
    });
    const ws3 = XLSX.utils.aoa_to_sheet([
      ['Aluno', 'E-mail', 'Modalidade', 'Mensalidade Mensal (R$)', 'Forma Pag.',
       'Dia Venc.', 'Qtd. Mensalidades', 'Total Pago', 'Total Pendente', 'Total Atrasado', 'Status'],
      ...stuRows,
    ]);
    ws3['!cols'] = [
      { wch: 28 }, { wch: 28 }, { wch: 12 }, { wch: 22 }, { wch: 14 },
      { wch: 10 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, ws3, 'Por Aluno');

    /* Sheet 4 — Resumo por mês */
    const months = [...new Set(payments.map(p => p.referenceMonth))].sort();
    const monthRows = months.map(m => {
      const mp = payments.filter(p => p.referenceMonth === m);
      const ids    = new Set(mp.map(p => p.studentId));
      const lateIds = new Set(mp.filter(p => p.status === 'ATRASADO').map(p => p.studentId));
      return [
        m,
        ids.size,
        mp.filter(p => p.status !== 'CANCELADO').reduce((a, p) => a + p.finalAmount, 0),
        mp.filter(p => p.status === 'PAGO').reduce((a, p) => a + p.finalAmount, 0),
        mp.filter(p => p.status === 'PENDENTE').reduce((a, p) => a + p.finalAmount, 0),
        mp.filter(p => p.status === 'ATRASADO').reduce((a, p) => a + p.finalAmount, 0),
        ids.size ? `${Math.round((lateIds.size / ids.size) * 100)}%` : '0%',
      ];
    });
    const ws4 = XLSX.utils.aoa_to_sheet([
      ['Mês', 'Qtd. Alunos', 'Previsto (R$)', 'Recebido (R$)', 'Pendente (R$)', 'Atrasado (R$)', 'Inadimplência'],
      ...monthRows,
    ]);
    ws4['!cols'] = [
      { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    ];
    XLSX.utils.book_append_sheet(wb, ws4, 'Por Mês');

    XLSX.writeFile(wb, `relatorio-financeiro-${new Date().toISOString().slice(0, 10)}.xlsx`);
    setOpen(false);
  };

  // ─── PDF (print window) ──────────────────────────────────────
  const exportPDF = () => {
    const now = new Date().toLocaleDateString('pt-BR',
      { day: '2-digit', month: 'long', year: 'numeric' });

    const statusColor: Record<string, string> = {
      PAGO: '#16a34a', PENDENTE: '#d97706', ATRASADO: '#dc2626', CANCELADO: '#9ca3af',
    };

    const payRowsHtml = payments.map(p => {
      const stu = stuMap[p.studentId];
      const color = statusColor[p.status] ?? '#111';
      return `<tr>
        <td>${stu?.fullName ?? '—'}</td>
        <td>${MODALIDADE_LABEL[stu?.modalidade ?? ''] ?? '—'}</td>
        <td>${p.referenceMonth}</td>
        <td>${dateBR(p.dueDate)}</td>
        <td class="num">${brl(p.finalAmount)}</td>
        <td style="color:${color};font-weight:700">${STATUS_LABEL[p.status] ?? p.status}</td>
        <td>${p.paymentDate ? dateBR(p.paymentDate) : '—'}</td>
        <td>${p.paymentMethod ? (METHOD_LABEL[p.paymentMethod] ?? p.paymentMethod) : '—'}</td>
      </tr>`;
    }).join('');

    const stuRowsHtml = students.map(stu => {
      const sp = payments.filter(p => p.studentId === stu.id);
      const paid = sp.filter(p => p.status === 'PAGO').reduce((a, p) => a + p.finalAmount, 0);
      const pend = sp.filter(p => p.status === 'PENDENTE').reduce((a, p) => a + p.finalAmount, 0);
      const late = sp.filter(p => p.status === 'ATRASADO').reduce((a, p) => a + p.finalAmount, 0);
      const stColor = overdueSet.has(stu.id) ? '#dc2626' : '#16a34a';
      return `<tr>
        <td>${stu.fullName}</td>
        <td>${MODALIDADE_LABEL[stu.modalidade] ?? stu.modalidade}</td>
        <td class="num">${brl(stu.monthlyAmount)}</td>
        <td>${stu.dueDay}</td>
        <td class="num" style="color:#16a34a">${brl(paid)}</td>
        <td class="num" style="color:#d97706">${brl(pend)}</td>
        <td class="num" style="color:#dc2626">${brl(late)}</td>
        <td style="color:${stColor};font-weight:700">${stu.status}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Relatório Financeiro — Wind Plus</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;font-size:10.5px;color:#111;padding:20px}
    .header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:18px;border-bottom:3px solid #E30613;padding-bottom:10px}
    .header h1{font-size:20px;color:#E30613;font-weight:800}
    .header .meta{font-size:10px;color:#666;text-align:right}
    .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
    .kpi{border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px}
    .kpi .label{font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}
    .kpi .val{font-size:15px;font-weight:800}
    .kpi.green .val{color:#16a34a}
    .kpi.amber .val{color:#d97706}
    .kpi.red   .val{color:#dc2626}
    .kpi.dark  .val{color:#111}
    h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#E30613;margin:16px 0 6px;padding-bottom:3px;border-bottom:1px solid #fca5a5}
    table{width:100%;border-collapse:collapse;margin-bottom:4px}
    th{background:#f3f4f6;text-align:left;padding:5px 7px;border:1px solid #e5e7eb;font-size:9px;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap}
    td{padding:4px 7px;border:1px solid #e5e7eb;vertical-align:middle;font-size:10px}
    .num{text-align:right;font-variant-numeric:tabular-nums}
    tr:nth-child(even) td{background:#f9fafb}
    .footer{margin-top:24px;font-size:9px;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:8px}
    @media print{
      body{padding:8px}
      @page{margin:1cm;size:A4 landscape}
      .no-break{page-break-inside:avoid}
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Relatório Financeiro</h1>
      <div style="font-size:11px;color:#444;margin-top:2px">Wind Plus — Escola de Idiomas</div>
    </div>
    <div class="meta">Gerado em ${now}<br/>Confidencial</div>
  </div>

  <div class="kpis">
    <div class="kpi dark"><div class="label">Receita Prevista</div><div class="val">${brl(previsto)}</div></div>
    <div class="kpi green"><div class="label">Receita Recebida</div><div class="val">${brl(recebido)}</div></div>
    <div class="kpi amber"><div class="label">Em Aberto</div><div class="val">${brl(pendente + atrasado)}</div></div>
    <div class="kpi red"><div class="label">Inadimplência</div><div class="val">${inadim}%</div></div>
  </div>
  <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
    <div class="kpi dark"><div class="label">Alunos Ativos</div><div class="val">${activeStudents.length}</div></div>
    <div class="kpi red"><div class="label">Inadimplentes</div><div class="val">${overdueSet.size}</div></div>
    <div class="kpi dark"><div class="label">Online</div><div class="val">${activeStudents.filter(s => s.modalidade === 'ONLINE').length}</div></div>
    <div class="kpi dark"><div class="label">Presencial</div><div class="val">${activeStudents.filter(s => s.modalidade === 'PRESENCIAL').length}</div></div>
  </div>

  <h2>Resumo por Aluno</h2>
  <table class="no-break">
    <thead><tr>
      <th>Aluno</th><th>Modalidade</th><th>Mensalidade</th><th>Dia Venc.</th>
      <th>Total Pago</th><th>Total Pend.</th><th>Total Atrasado</th><th>Status</th>
    </tr></thead>
    <tbody>${stuRowsHtml}</tbody>
  </table>

  <h2>Detalhamento de Mensalidades</h2>
  <table>
    <thead><tr>
      <th>Aluno</th><th>Modalidade</th><th>Mês Ref.</th><th>Vencimento</th>
      <th>Valor Final</th><th>Status</th><th>Dt. Pagamento</th><th>Forma de Pag.</th>
    </tr></thead>
    <tbody>${payRowsHtml}</tbody>
  </table>

  <div class="footer">Wind Plus · Relatório Financeiro confidencial · ${now} · ${payments.length} lançamentos</div>
</body>
</html>`;

    const w = window.open('', '_blank', 'width=1200,height=850');
    if (!w) { alert('Permita pop-ups para exportar o PDF.'); return; }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 700);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 font-medium transition-colors"
      >
        <IconDownload size={15} /> Exportar
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 min-w-[180px]">
            <button
              onClick={exportXLSX}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-7 h-5 bg-green-100 text-green-700 font-bold text-[10px] rounded">XLS</span>
              Excel (.xlsx)
            </button>
            <button
              onClick={exportPDF}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-7 h-5 bg-red-100 text-red-700 font-bold text-[10px] rounded">PDF</span>
              PDF (imprimir)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
