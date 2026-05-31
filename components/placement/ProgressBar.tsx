"use client";

type Props = { current: number; total: number };

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Questão {current} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
