import { Link } from 'react-router-dom';
import { useSentimentCounts } from '@/context/EngineContext';
import { SummaryCard } from '@/components/SummaryCard';
import { sentimentColor } from '@/components/SentimentBadge';
import {
  Search, FileText, Database, BrainCircuit, GraduationCap, Utensils,
  Tag, Activity, ArrowRight, Layers, AlignLeft, Calculator, BookOpen,
  CheckCircle, Upload, BarChart2, PieChart as PieIcon,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
} from 'recharts';

const BADGES = [
  { label: 'Dataset 272 Unik (Dedup)', icon: Database },
  { label: 'Support Vector Machine (SVM)', icon: BrainCircuit },
  { label: 'Lexicon Auto-Labeling', icon: Tag },
  { label: 'Sastrawi Stemmer', icon: AlignLeft },
  { label: 'Split 80:20', icon: Activity },
];

const ROADMAP = [
  { step: 1, title: 'Raw CSV Input', desc: 'Unggah dataset_mentah_mbg_500.csv berisi 500 komentar mentah, lalu deduplikasi otomatis menjadi 272 data unik.', icon: Upload },
  { step: 2, title: 'Preprocessing NLP', desc: 'Cleaning, Case Folding, Tokenizing, Normalisasi Slang, Stopword Removal, Stemming Sastrawi.', icon: AlignLeft },
  { step: 3, title: 'Lexicon Auto Labeling', desc: 'Pelabelan otomatis berdasarkan kamus kata positif & negatif domain keracunan MBG.', icon: Tag },
  { step: 4, title: 'TF-IDF Matrix', desc: 'Pembobotan Term Frequency-Inverse Document Frequency dengan L2 Normalization.', icon: Calculator },
  { step: 5, title: 'Training SVM Linear', desc: 'Pelatihan model Support Vector Machine dengan Linear Kernel pada data latih 80%.', icon: BrainCircuit },
  { step: 6, title: 'Confusion Matrix', desc: 'Evaluasi Accuracy, Precision, Recall, dan F1-Score pada data uji 20%.', icon: BarChart2 },
];

export function Beranda() {
  const counts = useSentimentCounts();

  const pieData = [
    { name: 'Positif', value: counts.positif, color: sentimentColor('Positif') },
    { name: 'Negatif', value: counts.negatif, color: sentimentColor('Negatif') },
    { name: 'Netral', value: counts.netral, color: sentimentColor('Netral') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-orange-700 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <GraduationCap className="h-4 w-4" />
            Skripsi Sistem Informasi FIKTI UMSU 2026
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Sistem Analisis Sentimen Insiden Keracunan Massal Program Makan Bergizi Gratis (MBG)
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-50/90">
            Klasifikasi sentimen publik dari media sosial X terhadap insiden keracunan massal Program MBG menggunakan Natural Language Processing &amp; algoritma Support Vector Machine (SVM) Linear Kernel.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {BADGES.map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
                <b.icon className="h-4 w-4" /> {b.label}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/simulasi" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-teal-700 shadow-lg transition hover:bg-teal-50">
              <Search className="h-5 w-5" /> Uji Sentimen Teks Sekarang
            </Link>
            <Link to="/alur" className="inline-flex items-center gap-2 rounded-lg border-2 border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              <BrainCircuit className="h-5 w-5" /> Lihat Alur SVM &amp; Metrik
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Raw Data" value="500" subtitle="Deduplikasi → 272 unik" icon={<Database className="h-6 w-6" />} accent="teal" />
          <SummaryCard title="Rasio Split" value="80 : 20" subtitle="Data latih & data uji" icon={<Activity className="h-6 w-6" />} accent="sky" />
          <SummaryCard title="Tahap Preprocessing" value="6" subtitle="Cleaning s/d Stemming" icon={<AlignLeft className="h-6 w-6" />} accent="amber" />
          <SummaryCard title="Kelas Sentimen" value="3" subtitle="Positif, Negatif, Netral" icon={<Tag className="h-6 w-6" />} accent="red" />
        </div>
      </section>

      {/* Sentiment Distribution + Description */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-800">Distribusi Sentimen Dataset</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">Breakdown keseluruhan {counts.total} data unik berdasarkan kelas sentimen.</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(e) => `${e.name}: ${e.value}`}>
                    {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-bold text-slate-800">Tentang Penelitian</h2>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600"><Utensils className="h-4 w-4" /></div>
                <p><span className="font-semibold text-slate-800">Keluhan keracunan</span> &mdash; Kategori Negatif mencakuh aduan mual, muntah, diare, hingga korban jiwa akibat katering MBG.</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600"><CheckCircle className="h-4 w-4" /></div>
                <p><span className="font-semibold text-slate-800">Dukungan &amp; solusi</span> &mdash; Kategori Positif berisi dukungan kelanjutan program, evaluasi katering, dan usulan perbaikan.</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><BookOpen className="h-4 w-4" /></div>
                <p><span className="font-semibold text-slate-800">Berita netral</span> &mdash; Kategori Netral memuat laporan faktual, data korban, dan pengumuman resmi pemerintah.</p>
              </div>
            </div>
            <Link to="/tentang" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
              Lihat profil penelitian <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Alur NLP &amp; SVM Workflow</h2>
          <p className="mt-2 text-slate-500">6 tahap pipeline dari raw CSV hingga evaluasi Confusion Matrix.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAP.map((r) => (
            <div key={r.step} className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-orange-500 text-white font-bold">
                  {r.step}
                </div>
                <r.icon className="h-6 w-6 text-slate-400 group-hover:text-teal-600 transition" />
              </div>
              <h3 className="mt-3 font-bold text-slate-800">{r.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{r.desc}</p>
              {r.step < 6 && <ArrowRight className="absolute -right-2 top-1/2 hidden h-5 w-5 text-slate-300 lg:block" />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
