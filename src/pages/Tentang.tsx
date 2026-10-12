import { GraduationCap, BookOpen, Target, Lightbulb, FileText, BrainCircuit } from 'lucide-react';

export function Tentang() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Profil Penelitian Skripsi &amp; Peneliti</h1>
        <p className="mt-2 text-slate-500">Informasi akademik dan ringkasan eksekutif penelitian.</p>
      </div>

      {/* Biodata Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-teal-600 to-orange-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">MIKHAEL WEILMAN PARULIAN SIANIPAR</h2>
              <p className="text-sm text-teal-50/90">NPM 2209010162 &middot; Peneliti Skripsi</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">
          {[
            { label: 'Nama Peneliti', value: 'MIKHAEL WEILMAN PARULIAN SIANIPAR' },
            { label: 'NPM', value: '2209010162' },
            { label: 'Program Studi', value: 'Sistem Informasi' },
            { label: 'Fakultas', value: 'Ilmu Komputer dan Teknologi Informasi (FIKTI)' },
            { label: 'Perguruan Tinggi', value: 'Universitas Muhammadiyah Sumatera Utara (UMSU) Medan' },
            { label: 'Tahun', value: '2026' },
          ].map((item) => (
            <div key={item.label} className="border-b border-slate-100 pb-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className="mt-0.5 font-semibold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Judul Skripsi */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-800">Judul Skripsi</h2>
        </div>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Analisis Sentimen Publik Terhadap Insiden Keracunan Massal Program Makan Bergizi Gratis (MBG) di Indonesia Pada Tahun 2025 Berdasarkan Media Sosial Dengan Metode Support Vector Machine (SVM)
        </p>
      </div>

      {/* Executive Summary */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            <h3 className="font-bold text-slate-800">Latar Belakang</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Program Makan Bergizi Gratis (MBG) merupakan program strategis pemerintah Indonesia tahun 2025 untuk menjamin gizi anak-anak sekolah. Namun, insiden keracunan massal yang terjadi di beberapa daerah memicu reaksi publik yang masif di media sosial X (Twitter). Diperlukan analisis sentimen sistematis untuk memetakan opini publik &mdash; apakah dominan berupa keluhan, dukungan, atau berita netral &mdash; agar dapat menjadi masukan bagi Badan Gizi Nasional (BGN) dalam evaluasi kebijakan.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            <h3 className="font-bold text-slate-800">Tujuan Penelitian</h3>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><span className="text-teal-600">•</span> Mengklasifikasikan sentimen publik terhadap insiden keracunan MBG ke dalam kelas Positif, Negatif, dan Netral.</li>
            <li className="flex gap-2"><span className="text-teal-600">•</span> Menerapkan pipeline NLP lengkap (Cleaning s/d Stemming Sastrawi) untuk preprocessing teks Bahasa Indonesia.</li>
            <li className="flex gap-2"><span className="text-teal-600">•</span> Mengukur performa algoritma SVM Linear Kernel dengan pembobotan TF-IDF dan split 80:20.</li>
            <li className="flex gap-2"><span className="text-teal-600">•</span> Menyediakan masukan berbasis data untuk evaluasi kebijakan Badan Gizi Nasional (BGN).</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-orange-600" />
            <h3 className="font-bold text-slate-800">Metodologi</h3>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><span className="text-orange-600">•</span> Pengumpulan data: 500 komentar media sosial X terkait insiden keracunan MBG.</li>
            <li className="flex gap-2"><span className="text-orange-600">•</span> Preprocessing: Cleaning, Case Folding, Tokenizing, Normalisasi Slang, Stopword Removal, Stemming Sastrawi.</li>
            <li className="flex gap-2"><span className="text-orange-600">•</span> Pelabelan: Lexicon-based auto-labeling dengan kamus domain keracunan MBG.</li>
            <li className="flex gap-2"><span className="text-orange-600">•</span> Pembobotan: TF-IDF dengan L2 Normalization.</li>
            <li className="flex gap-2"><span className="text-orange-600">•</span> Klasifikasi: Support Vector Machine (SVM) Linear Kernel, One-vs-Rest, split 80:20.</li>
            <li className="flex gap-2"><span className="text-orange-600">•</span> Evaluasi: Confusion Matrix, Accuracy, Precision, Recall, F1-Score.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-teal-600" />
            <h3 className="font-bold text-slate-800">Implikasi Kebijakan</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Hasil klasifikasi sentimen memberikan gambaran proporsi keluhan keracunan versus dukungan kelanjutan program. Jika sentimen negatif dominan, BGN perlu segera memperketat standar katering, meningkatkan pengawasan higienitas, dan menindak vendor bermasalah. Sentimen positif mengindikasikan dukungan publik untuk kelanjutan MBG dengan perbaikan. Sentimen netral mencerminkan cakupan berita dan perlu dijadikan rujukan komunikasi publik yang transparan.
          </p>
        </div>
      </div>
    </div>
  );
}
