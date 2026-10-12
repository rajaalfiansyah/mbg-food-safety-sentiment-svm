import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Utensils, LogIn, LogOut, Menu, X, ShieldCheck } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Beranda' },
  { to: '/simulasi', label: 'Simulasi Prediksi' },
  { to: '/dataset', label: 'Kelola Dataset', protected: true },
  { to: '/alur', label: 'Alur NLP & SVM' },
  { to: '/tentang', label: 'Tentang Penelitian' },
];

export function Navbar({ onLoginClick }: { onLoginClick: () => void }) {
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-teal-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
            <Utensils className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">Analisis Sentimen MBG UMSU</span>
          <span className="sm:hidden">MBG UMSU</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) =>
            l.protected && !isAuthenticated ? null : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {l.label}
              </NavLink>
            )
          )}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              <LogIn className="h-4 w-4" /> Login Admin
            </button>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) =>
              l.protected && !isAuthenticated ? null : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-100'}`
                  }
                >
                  {l.label}
                </NavLink>
              )
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
              >
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            ) : (
              <button
                onClick={() => { onLoginClick(); setMobileOpen(false); }}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <ShieldCheck className="h-4 w-4" /> Login Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
