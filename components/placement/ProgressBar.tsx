"use client";

type Props = { current: number; total: number };

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Questão {current} de {total}</span>
        <span className="font-medium text-[#E30613]">{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #E30613, #FF1A27)" }}
        />
      </div>
    </div>
  );
}
