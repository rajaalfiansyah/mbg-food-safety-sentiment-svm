import { Utensils, GraduationCap, BookOpen, Database, BrainCircuit } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-teal-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Utensils className="h-4 w-4" />
              </span>
              Analisis Sentimen MBG UMSU
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Sistem Analisis Sentimen Publik Terhadap Insiden Keracunan Massal Program Makan Bergizi Gratis Berbasis NLP &amp; Support Vector Machine.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-800">Informasi Singkat</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-orange-600" /> Support Vector Machine (SVM)</li>
              <li className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-orange-600" /> Pembobotan TF-IDF</li>
              <li className="flex items-center gap-2"><Database className="h-4 w-4 text-orange-600" /> Stemming Sastrawi</li>
              <li className="flex items-center gap-2"><Database className="h-4 w-4 text-orange-600" /> Dataset 500 Raw CSV Media Sosial X</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-800">Peneliti</h4>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
              <div>
                <p className="font-semibold text-slate-800">MIKHAEL WEILMAN PARULIAN SIANIPAR</p>
                <p>NPM 2209010162</p>
                <p>Sistem Informasi FIKTI UMSU Medan 2026</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
          Copyright 2026 &middot; Skripsi Sistem Informasi UMSU &middot; MIKHAEL WEILMAN PARULIAN SIANIPAR
        </div>
      </div>
    </footer>
  );
}
