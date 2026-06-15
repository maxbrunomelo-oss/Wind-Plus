import React from 'react';

const RED = '#E30613';
const DARK = '#111111';

// ─── Grouped bar chart (previsto x recebido) ──────────────────
interface GroupedBarProps {
  data: { label: string; a: number; b: number }[];
  height?: number;
  aColor?: string;
  bColor?: string;
  aLabel?: string;
  bLabel?: string;
  unit?: string;
}
export function GroupedBarChart({ data, height = 200, aColor = DARK, bColor = RED, aLabel = 'Previsto', bLabel = 'Recebido', unit = '' }: GroupedBarProps) {
  const max = Math.max(...data.flatMap(d => [d.a, d.b]), 1);
  return (
    <div>
      <div className="flex items-end gap-4" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
            <div className="flex items-end gap-1 w-full justify-center h-full">
              <div className="w-1/3 rounded-t transition-all" style={{ height: `${(d.a / max) * 100}%`, background: aColor }} title={`${aLabel}: ${unit}${d.a}`} />
              <div className="w-1/3 rounded-t transition-all" style={{ height: `${(d.b / max) * 100}%`, background: bColor }} title={`${bLabel}: ${unit}${d.b}`} />
            </div>
            <span className="text-[10px] text-gray-500 mt-1">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 justify-center mt-3 text-xs text-gray-600">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: aColor }} />{aLabel}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: bColor }} />{bLabel}</span>
      </div>
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────
interface DonutProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string | number;
}
export function DonutChart({ data, size = 160, centerLabel, centerValue }: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f1f1" strokeWidth={14} />
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color} strokeWidth={14} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} strokeLinecap="butt" />;
          offset += len;
          return el;
        })}
      </svg>
      {(centerLabel || centerValue || data.length > 0) && (
        <div className="space-y-1.5">
          {centerValue !== undefined && <div className="mb-2"><div className="text-2xl font-bold text-gray-900">{centerValue}</div><div className="text-xs text-gray-500">{centerLabel}</div></div>}
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-sm" style={{ background: d.color }} />
              <span className="text-gray-600">{d.label}</span>
              <span className="font-semibold text-gray-900 ml-auto">{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Line chart ───────────────────────────────────────────────
interface LineProps { data: { label: string; value: number }[]; height?: number; color?: string; unit?: string; }
export function LineChart({ data, height = 140, color = RED, unit = '' }: LineProps) {
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 100;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${height - (d.value / max) * (height - 20) - 10}`);
  return (
    <div>
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth={1.5} points={pts.join(' ')} vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => {
          const [x, y] = pts[i].split(',').map(Number);
          return <circle key={i} cx={x} cy={y} r={1.6} fill={color} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <div className="flex justify-between mt-1 text-[10px] text-gray-500">
        {data.map((d, i) => <span key={i}>{d.label}{unit && i === data.length - 1 ? '' : ''}</span>)}
      </div>
    </div>
  );
}

// ─── Horizontal bar chart ─────────────────────────────────────
interface HBarProps { data: { label: string; value: number; color?: string }[]; unit?: string; max?: number; }
export function HBarChart({ data, unit = '', max }: HBarProps) {
  const m = max ?? Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-2.5">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1"><span className="text-gray-600">{d.label}</span><span className="font-semibold text-gray-900">{unit}{d.value}</span></div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(d.value / m) * 100}%`, background: d.color ?? RED }} />
          </div>
        </div>
      ))}
    </div>
  );
}
