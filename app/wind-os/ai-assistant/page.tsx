'use client';
import React, { useState } from 'react';
import { IconAI } from '@/components/windos/Icons';
import { students } from '@/lib/windos/mock-data';

const actions = [
  { value: 'resumir', label: 'Resumir atendimento' },
  { value: 'relatorio', label: 'Gerar relatório pedagógico' },
  { value: 'risco', label: 'Identificar risco de cancelamento' },
  { value: 'mensagem', label: 'Sugerir mensagem para responsável' },
  { value: 'plano', label: 'Sugerir plano de ação pedagógico' },
  { value: 'classificar', label: 'Classificar registro' },
];

// Mock — substituir por chamada real à API de IA quando configurada.
function mockAnalyze(action: string, studentName: string, text: string): string {
  const intro = `Aluno: ${studentName || '—'}\nAção: ${actions.find(a => a.value === action)?.label}\n\n`;
  const map: Record<string, string> = {
    resumir: `Resumo do atendimento:\n• Principais pontos abordados a partir do registro fornecido.\n• Sentimento geral identificado: neutro.\n• Próxima ação sugerida: agendar follow-up em 7 dias.`,
    relatorio: `Rascunho de relatório pedagógico:\n• Speaking: progresso consistente.\n• Listening: bom desempenho.\n• Pontos de melhoria: escrita formal.\n• Recomendações: praticar produção escrita semanal.`,
    risco: `Análise de risco:\n• Indicadores detectados no texto sugerem atenção.\n• Nível de risco estimado: MÉDIO.\n• Recomenda-se contato proativo com o responsável.`,
    mensagem: `Mensagem sugerida ao responsável:\n"Olá! Passando para compartilhar a evolução do(a) aluno(a) e alinhar os próximos passos. Podemos conversar esta semana?"`,
    plano: `Plano de ação pedagógico:\n1. Reforço nas habilidades com menor desempenho.\n2. Atividades práticas semanais.\n3. Revisão de progresso em 30 dias.`,
    classificar: `Classificação sugerida:\n• Tipo: PEDAGOGICO\n• Sentimento: NEUTRO\n• Prioridade de follow-up: média.`,
  };
  return intro + (map[action] ?? 'Resultado gerado.') + `\n\n— Conteúdo gerado por IA (mock). Configure a API para resultados reais.\n\nRegistro analisado:\n"${text.slice(0, 200)}${text.length > 200 ? '...' : ''}"`;
}

export default function AIAssistantPage() {
  const [studentId, setStudentId] = useState('');
  const [action, setAction] = useState('resumir');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult('');
    setTimeout(() => {
      const name = students.find(s => s.id === studentId)?.fullName ?? '';
      setResult(mockAnalyze(action, name, text));
      setLoading(false);
    }, 700);
  };

  const selectCls = 'w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/30';

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E30613] text-white flex items-center justify-center"><IconAI size={20} /></div>
        <div><h1 className="text-xl font-bold text-gray-900">IA Wind Assistant</h1><p className="text-sm text-gray-500">Transforme registros brutos em ações inteligentes</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Aluno</label>
              <select value={studentId} onChange={e => setStudentId(e.target.value)} className={selectCls}>
                <option value="">Selecione...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipo de ação</label>
              <select value={action} onChange={e => setAction(e.target.value)} className={selectCls}>
                {actions.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Registro bruto</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={8} placeholder="Cole aqui anotações, transcrição de áudio ou histórico do atendimento..." className={selectCls + ' resize-none'} />
          </div>
          <button onClick={analyze} disabled={loading || !text.trim()} className="w-full bg-[#E30613] hover:bg-[#B8000D] disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2">
            <IconAI size={16} /> {loading ? 'Analisando...' : 'Analisar'}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Resultado gerado</h3>
          {result ? (
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          ) : (
            <div className="text-sm text-gray-400 flex flex-col items-center justify-center h-full min-h-[200px] gap-2">
              <IconAI size={28} className="text-gray-300" />
              <p>O resultado da análise aparecerá aqui.</p>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400">Integração de IA preparada com funções mockadas. Conecte a API (ex.: Claude) para gerar conteúdo real.</p>
    </div>
  );
}
