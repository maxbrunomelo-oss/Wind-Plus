'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconPlus } from '@/components/windos/Icons';
import { FormModal, FieldDef } from '@/components/windos/Modal';
import { saveReport } from '@/app/wind-os/actions';

interface Props {
  students: { id: string; name: string }[];
  teachers: { id: string; name: string }[];
}

const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function ReportCreateButton({ students, teachers }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const fields: FieldDef[] = [
    { name: 'studentId', label: 'Aluno', type: 'select', required: true, half: true, options: students.map(s => ({ value: s.id, label: s.name })) },
    { name: 'teacherId', label: 'Professor', type: 'select', half: true, options: teachers.map(t => ({ value: t.id, label: t.name })) },
    { name: 'referencePeriod', label: 'Período de referência', type: 'text', half: true, placeholder: 'Ex.: Jun/2026' },
    { name: 'cefrLevel', label: 'Nível CEFR', type: 'select', half: true, options: CEFR.map(c => ({ value: c, label: c })) },
    { name: 'speakingProgress', label: 'Speaking (%)', type: 'number', half: true, min: 0, max: 100 },
    { name: 'listeningProgress', label: 'Listening (%)', type: 'number', half: true, min: 0, max: 100 },
    { name: 'readingProgress', label: 'Reading (%)', type: 'number', half: true, min: 0, max: 100 },
    { name: 'writingProgress', label: 'Writing (%)', type: 'number', half: true, min: 0, max: 100 },
    { name: 'strengths', label: 'Pontos fortes', type: 'textarea' },
    { name: 'improvementPoints', label: 'Pontos a melhorar', type: 'textarea' },
    { name: 'teacherComments', label: 'Comentários do professor', type: 'textarea' },
    { name: 'recommendations', label: 'Recomendações', type: 'textarea' },
    { name: 'status', label: 'Status', type: 'select', half: true, options: ['RASCUNHO', 'ENVIADO', 'ARQUIVADO'].map(s => ({ value: s, label: s })) },
  ];

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-sm bg-[#E30613] hover:bg-[#B8000D] text-white rounded-lg px-4 py-2 font-medium"><IconPlus size={16} /> Novo relatório</button>
      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title="Novo relatório pedagógico"
        subtitle="Registre o progresso por habilidade CEFR"
        fields={fields}
        maxWidth="max-w-2xl"
        submitLabel="Salvar relatório"
        onSubmit={async (values) => {
          const res = await saveReport(values);
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </>
  );
}
