import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  accent: 'teal' | 'red' | 'amber' | 'sky' | 'slate';
}

const ACCENTS: Record<SummaryCardProps['accent'], { bg: string; text: string; ring: string }> = {
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', ring: 'ring-teal-100' },
  red: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
  sky: { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-100' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
};

export function SummaryCard({ title, value, subtitle, icon, accent }: SummaryCardProps) {
  const a = ACCENTS[accent];
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md ${a.ring} ring-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${a.bg} ${a.text}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
