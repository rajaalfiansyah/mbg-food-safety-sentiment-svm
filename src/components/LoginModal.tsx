import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, X, LogIn } from 'lucide-react';

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) {
      setUsername(''); setPassword(''); setError('');
      onClose();
    } else {
      setError('Username atau password salah. Coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-teal-600 to-orange-600 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="h-6 w-6" />
            <h2 className="text-lg font-bold">Login Admin FIKTI</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <p className="mb-4 text-sm text-slate-600">
            Masuk untuk mengakses halaman pengelolaan dataset mentah dan auto-labeling.
          </p>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 border border-red-200">{error}</div>
          )}
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            placeholder="admin_fikti"
            autoFocus
          />
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            placeholder="••••••••"
          />
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 font-semibold text-white transition hover:bg-teal-700"
          >
            <LogIn className="h-5 w-5" /> Masuk
          </button>
          <p className="mt-4 text-center text-xs text-slate-400">
            Kredensial demo: admin_fikti / umsu2026
          </p>
        </form>
      </div>
    </div>
  );
}
