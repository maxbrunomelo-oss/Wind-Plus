import React from 'react';

export function EmptyState({ title, description, icon, action }: { title: string; description?: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {icon && <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-4">{icon}</div>}
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-sm text-gray-400 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#E30613] rounded-full animate-spin" />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
