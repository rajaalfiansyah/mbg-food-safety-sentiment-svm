import type { SvmLabel } from '@/lib/ml/svm';

const STYLES: Record<SvmLabel, { bg: string; text: string; border: string; dot: string; label: string }> = {
  Positif: {
    bg: 'bg-teal-100',
    text: 'text-teal-700',
    border: 'border-teal-300',
    dot: 'bg-teal-500',
    label: 'Positif',
  },
  Negatif: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
    dot: 'bg-red-500',
    label: 'Negatif',
  },
  Netral: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
    label: 'Netral',
  },
};

export function SentimentBadge({ label, size = 'md' }: { label: SvmLabel; size?: 'sm' | 'md' | 'lg' }) {
  const s = STYLES[label];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-4 py-1.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${s.bg} ${s.text} ${s.border} ${sizeClass}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function sentimentColor(label: SvmLabel): string {
  return label === 'Positif' ? '#14b8a6' : label === 'Negatif' ? '#ef4444' : '#f59e0b';
}

export { STYLES as SENTIMENT_STYLES };
