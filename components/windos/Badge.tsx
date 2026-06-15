import React from 'react';

export type BadgeVariant = 'red' | 'green' | 'yellow' | 'blue' | 'gray' | 'dark' | 'orange';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variants: Record<BadgeVariant, string> = {
  red: 'bg-red-50 text-red-700 border border-red-200',
  green: 'bg-green-50 text-green-700 border border-green-200',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
  blue: 'bg-sky-50 text-sky-700 border border-sky-200',
  gray: 'bg-gray-100 text-gray-600 border border-gray-200',
  dark: 'bg-gray-900 text-white border border-gray-900',
  orange: 'bg-orange-50 text-orange-700 border border-orange-200',
};

export default function Badge({ label, variant = 'gray', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${variants[variant]} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      {label}
    </span>
  );
}

type Mapped = { label: string; variant: BadgeVariant };

export const studentStatusBadge = (s: string): Mapped => ({
  ATIVO: { label: 'Ativo', variant: 'green' as const },
  PAUSADO: { label: 'Pausado', variant: 'yellow' as const },
  CANCELADO: { label: 'Cancelado', variant: 'gray' as const },
  EXPERIMENTAL: { label: 'Experimental', variant: 'blue' as const },
  INADIMPLENTE: { label: 'Inadimplente', variant: 'red' as const },
}[s] ?? { label: s, variant: 'gray' });

export const paymentStatusBadge = (s: string): Mapped => ({
  PAGO: { label: 'Pago', variant: 'green' as const },
  PENDENTE: { label: 'Pendente', variant: 'yellow' as const },
  ATRASADO: { label: 'Atrasado', variant: 'red' as const },
  CANCELADO: { label: 'Cancelado', variant: 'gray' as const },
}[s] ?? { label: s, variant: 'gray' });

export const modalidadeBadge = (m: string): Mapped =>
  m === 'ONLINE'
    ? { label: 'Online', variant: 'blue' }
    : { label: 'Presencial', variant: 'dark' };

export const priorityBadge = (p: string): Mapped => ({
  BAIXA: { label: 'Baixa', variant: 'gray' as const },
  MEDIA: { label: 'Média', variant: 'blue' as const },
  ALTA: { label: 'Alta', variant: 'orange' as const },
  CRITICA: { label: 'Crítica', variant: 'red' as const },
}[p] ?? { label: p, variant: 'gray' });

export const alertStatusBadge = (s: string): Mapped => ({
  ABERTO: { label: 'Aberto', variant: 'red' as const },
  EM_ANDAMENTO: { label: 'Em andamento', variant: 'yellow' as const },
  RESOLVIDO: { label: 'Resolvido', variant: 'green' as const },
  IGNORADO: { label: 'Ignorado', variant: 'gray' as const },
}[s] ?? { label: s, variant: 'gray' });

export const reportStatusBadge = (s: string): Mapped => ({
  RASCUNHO: { label: 'Rascunho', variant: 'yellow' as const },
  ENVIADO: { label: 'Enviado', variant: 'green' as const },
  ARQUIVADO: { label: 'Arquivado', variant: 'gray' as const },
}[s] ?? { label: s, variant: 'gray' });

export const sentimentBadge = (s: string): Mapped => ({
  POSITIVO: { label: 'Positivo', variant: 'green' as const },
  NEUTRO: { label: 'Neutro', variant: 'gray' as const },
  NEGATIVO: { label: 'Negativo', variant: 'orange' as const },
  RISCO: { label: 'Risco', variant: 'red' as const },
}[s] ?? { label: s, variant: 'gray' });

export const entityStatusBadge = (s: string): Mapped =>
  s === 'ATIVO'
    ? { label: 'Ativo', variant: 'green' }
    : { label: 'Inativo', variant: 'gray' };

export const cefrBadge = (level: string): Mapped => {
  const map: Record<string, BadgeVariant> = { A1: 'gray', A2: 'blue', B1: 'blue', B2: 'orange', C1: 'green', C2: 'green' };
  return { label: level, variant: map[level] ?? 'gray' };
};
