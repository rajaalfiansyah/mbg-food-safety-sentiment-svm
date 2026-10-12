import { useEngine } from '@/context/EngineContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useEngine();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
      {toasts.map((t) => {
        const Icon = t.type === 'success' ? CheckCircle : t.type === 'error' ? AlertTriangle : Info;
        const color = t.type === 'success' ? 'text-teal-600' : t.type === 'error' ? 'text-red-600' : 'text-orange-600';
        const border = t.type === 'success' ? 'border-l-teal-500' : t.type === 'error' ? 'border-l-red-500' : 'border-l-orange-500';
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-lg border border-l-4 ${border} bg-white px-4 py-3 shadow-lg ring-1 ring-slate-200 animate-toast-in`}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
            <p className="flex-1 text-sm text-slate-700">{t.text}</p>
            <button onClick={() => dismissToast(t.id)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
