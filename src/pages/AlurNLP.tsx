import { useState } from 'react';
import { useEngine } from '@/context/EngineContext';
import { POSITIVE_LEXICON, NEGATIVE_LEXICON, NEUTRAL_HINTS } from '@/lib/nlp/lexicon';
import {
  AlignLeft, Tag, Calculator, BrainCircuit, BarChart2,
  CheckCircle, X, Info,
} from 'lucide-react';

type Tab = 'pipeline' | 'lexicon' | 'tfidf' | 'svm' | 'confusion';

const TABS: { key: Tab; label: string; icon: typeof AlignLeft }[] = [
  { key: 'pipeline', label: 'Pipeline Preprocessing', icon: AlignLeft },
  { key: 'lexicon', label: 'Lexicon Dictionary', icon: Tag },
  { key: 'tfidf', label: 'Formula TF-IDF', icon: Calculator },
  { key: 'svm', label: 'Algoritma SVM', icon: BrainCircuit },
  { key: 'confusion', label: 'Confusion Matrix', icon: BarChart2 },
];

const PIPELINE_STEPS = [
  { name: 'Cleaning', desc: 'Menghapus URL, mention (@), hashtag (#), angka, dan simbol/tanda baca dari teks mentah.', example: '"Keracunan MBG #berita @kemenkes https://bit.ly/x" → "keracunan mbg berita"' },
  { name: 'Case Folding', desc: 'Mengubah seluruh huruf menjadi huruf kecil (lowercase) untuk konsistensi.', example: '"KeRaCuNAn MBG Jakarta" → "keracunan mbg jakarta"' },
  { name: 'Tokenizing', desc: 'Memecah teks menjadi token (kata-kata) berdasarkan spasi.', example: '"keracunan mbg jakarta" → ["keracunan", "mbg", "jakarta"]' },
  { name: 'Normalization', desc: 'Mengubah kata slang/informal menjadi bentuk baku Bahasa Indonesia.', example: '"gak" → "tidak", "yg" → "yang", "bgt" → "banget"' },
  { name: 'Stopword Removal', desc: 'Menghapus kata-kata tidak bermakna (konjungsi, preposisi) berdasarkan daftar stopwords Bahasa Indonesia.', example: '"anak saya sedang keracunan" → ["anak", "keracunan"]' },
  { name: 'Stemming Sastrawi', desc: 'Mengembalikan kata ke bentuk dasar dengan menghapus imbuhan (prefix/suffix).', example: '"keracunan" → "racun", "makanan" → "makan"' },
];

export function AlurNLP() {
  const [tab, setTab] = useState<Tab>('pipeline');
  const { svm } = useEngine();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Landasan Teori, Formula Matematika &amp; Metrik Evaluasi</h1>
        <p className="mt-2 text-slate-500">Penjelasan komprehensif metode NLP, TF-IDF, dan Support Vector Machine yang digunakan dalam penelitian.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${tab === t.key ? 'border-teal-500 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in">
        {tab === 'pipeline' && (
          <div className="space-y-4">
            {PIPELINE_STEPS.map((s, i) => (
              <div key={s.name} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-orange-500 text-sm font-bold text-white">{i + 1}</div>
                  {i < PIPELINE_STEPS.length - 1 && <div className="mt-1 h-full w-0.5 flex-1 bg-slate-200" />}
                </div>
                <div className="flex-1 pb-4">
                  <h3 className="font-bold text-slate-800">{s.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                  <p className="mt-2 rounded-lg bg-slate-50 p-2.5 font-mono text-xs text-slate-600">{s.example}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'lexicon' && (
          <div>
            <p className="mb-4 text-sm text-slate-600">Pelabelan otomatis dilakukan dengan menghitung skor kemunculan kata dari kamus positif dan negatif domain keracunan MBG. Jika skor positif &gt; negatif → <strong>Positif</strong>, jika skor negatif &gt; positif → <strong>Negatif</strong>, jika seimbang atau nol → <strong>Netral</strong>.</p>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-teal-700"><CheckCircle className="h-5 w-5" /> Kamus Positif (Dukungan/Solusi)</h3>
                <div className="flex flex-wrap gap-1.5">
                  {POSITIVE_LEXICON.filter((w, i, a) => a.indexOf(w) === i).map((w) => (
                    <span key={w} className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 border border-teal-200">{w}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-red-700"><X className="h-5 w-5" /> Kamus Negatif (Keluhan/Keracunan)</h3>
                <div className="flex flex-wrap gap-1.5">
                  {NEGATIVE_LEXICON.filter((w, i, a) => a.indexOf(w) === i).map((w) => (
                    <span key={w} className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 border border-red-200">{w}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-amber-700"><Info className="h-5 w-5" /> Hint Netral (Berita/Informasi)</h3>
              <div className="flex flex-wrap gap-1.5">
                {NEUTRAL_HINTS.filter((w, i, a) => a.indexOf(w) === i).map((w) => (
                  <span key={w} className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 border border-amber-200">{w}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'tfidf' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-800">Term Frequency (TF)</h3>
              <p className="mt-1 text-sm text-slate-600">Frekuensi kemunculan term t dalam dokumen d.</p>
              <FormulaBox formula="TF(t, d) = f(t, d) = jumlah kemunculan term t dalam dokumen d" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Inverse Document Frequency (IDF)</h3>
              <p className="mt-1 text-sm text-slate-600">Mengukur seberapa jarang term muncul di seluruh korpus. Term yang muncul di banyak dokumen mendapat bobot lebih rendah.</p>
              <FormulaBox formula="IDF(t, D) = ln( (1 + |D|) / (1 + DF(t)) ) + 1" />
              <p className="mt-1 text-xs text-slate-400">|D| = total dokumen, DF(t) = jumlah dokumen yang mengandung term t. Smoothing +1 untuk menghindari pembagian nol.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">TF-IDF Weight</h3>
              <FormulaBox formula="TF-IDF(t, d, D) = TF(t, d) × IDF(t, D)" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">L2 Normalization</h3>
              <p className="mt-1 text-sm text-slate-600">Setiap vektor dokumen dinormalisasi agar panjangnya 1, sehingga perbandingan antar dokumen adil.</p>
              <FormulaBox formula="x_normalized = x / ||x||₂ ,   ||x||₂ = √(Σ xᵢ²" />
            </div>
          </div>
        )}

        {tab === 'svm' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-800">Hyperplane</h3>
              <p className="mt-1 text-sm text-slate-600">SVM mencari hyperplane optimal yang memisahkan kelas-kelas data dengan margin maksimal.</p>
              <FormulaBox formula="f(x) = wᵀx + b = 0" />
              <p className="mt-1 text-xs text-slate-400">w = vektor bobot (normal hyperplane), b = bias/intercept, x = vektor fitur TF-IDF.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Linear Kernel</h3>
              <p className="mt-1 text-sm text-slate-600">Untuk data teks berdimensi tinggi (TF-IDF), Linear Kernel adalah pilihan optimal dan efisien.</p>
              <FormulaBox formula="K(xᵢ, xⱼ) = xᵢᵀ xⱼ" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Maximum Margin</h3>
              <p className="mt-1 text-sm text-slate-600">Jarak margin ke titik terdekat (support vector) dimaksimalkan: 2/||w||. Optimasi: minimalkan ||w||²/2 dengan constraint yi(wᵀxi + b) ≥ 1.</p>
              <FormulaBox formula="min ½ ||w||²    s.t.   yᵢ(wᵀxᵢ + b) ≥ 1, ∀ᵢ" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Dual Formulation</h3>
              <FormulaBox formula="max  Σ αᵢ - ½ Σ Σ αᵢ αⱼ yᵢ yⱼ K(xᵢ, xⱼ)    s.t. 0 ≤ αᵢ ≤ C, Σ αᵢ yᵢ = 0" />
              <p className="mt-1 text-xs text-slate-400">Diselesaikan via Pegasos SGD (primal) dalam implementasi ini untuk efisiensi browser.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Multi-Class: One-vs-Rest (OvR)</h3>
              <p className="mt-1 text-sm text-slate-600">Tiga model SVM biner dilatih (Positif vs rest, Negatif vs rest, Netral vs rest). Prediksi = kelas dengan skor margin tertinggi.</p>
            </div>
          </div>
        )}

        {tab === 'confusion' && (
          <ConfusionMatrixTab svm={svm} />
        )}
      </div>
    </div>
  );
}

function FormulaBox({ formula }: { formula: string }) {
  return (
    <div className="mt-2 rounded-lg bg-slate-900 px-5 py-4 font-mono text-sm text-teal-300">
      {formula}
    </div>
  );
}

function ConfusionMatrixTab({ svm }: { svm: ReturnType<typeof useEngine>['svm'] }) {
  const classes: ('Positif' | 'Negatif' | 'Netral')[] = ['Positif', 'Negatif', 'Netral'];
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-slate-800">Confusion Matrix &amp; Evaluasi Model (Split 80:20)</h3>
        <p className="mt-1 text-sm text-slate-600">Matriks aktual vs prediksi dari model SVM pada data uji 20%.</p>
      </div>

      {svm ? (
        <>
          {/* Train/Test Split Summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-xs font-semibold uppercase text-teal-600">Data Latih (80%)</p>
              <p className="mt-1 text-2xl font-bold text-teal-800">{svm.trainSize} data</p>
              <div className="mt-2 space-y-1 text-sm text-teal-700">
                <p>Positif: <strong>{svm.trainDistribution.Positif}</strong> data ({((svm.trainDistribution.Positif / svm.trainSize) * 100).toFixed(1)}%)</p>
                <p>Negatif: <strong>{svm.trainDistribution.Negatif}</strong> data ({((svm.trainDistribution.Negatif / svm.trainSize) * 100).toFixed(1)}%)</p>
                <p>Netral: <strong>{svm.trainDistribution.Netral}</strong> data ({((svm.trainDistribution.Netral / svm.trainSize) * 100).toFixed(1)}%)</p>
              </div>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase text-orange-600">Data Uji (20%)</p>
              <p className="mt-1 text-2xl font-bold text-orange-800">{svm.testSize} data</p>
              <div className="mt-2 space-y-1 text-sm text-orange-700">
                <p>Positif: <strong>{svm.testDistribution.Positif}</strong> data ({((svm.testDistribution.Positif / svm.testSize) * 100).toFixed(1)}%)</p>
                <p>Negatif: <strong>{svm.testDistribution.Negatif}</strong> data ({((svm.testDistribution.Negatif / svm.testSize) * 100).toFixed(1)}%)</p>
                <p>Netral: <strong>{svm.testDistribution.Netral}</strong> data ({((svm.testDistribution.Netral / svm.testSize) * 100).toFixed(1)}%)</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-slate-500">Aktual \ Prediksi</th>
                  {classes.map((c) => (
                    <th key={c} className="px-4 py-2 text-center font-semibold text-slate-700">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map((actual, i) => (
                  <tr key={actual}>
                    <td className="px-4 py-2 font-semibold text-slate-700">{actual}</td>
                    {classes.map((_, j) => {
                      const val = svm.confusionMatrix[i][j];
                      const isDiag = i === j;
                      return (
                        <td key={j} className={`px-4 py-2 text-center font-bold ${isDiag ? 'bg-teal-50 text-teal-700' : val > 0 ? 'bg-red-50 text-red-600' : 'text-slate-400'}`}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Accuracy" value={`${(svm.accuracy * 100).toFixed(1)}%`} formula="(TP+TN) / Total" />
            {classes.map((c) => (
              <div key={c} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">{c}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-slate-700">Precision: <strong>{(svm.precision[c] * 100).toFixed(1)}%</strong></p>
                  <p className="text-slate-700">Recall: <strong>{(svm.recall[c] * 100).toFixed(1)}%</strong></p>
                  <p className="text-slate-700">F1-Score: <strong>{(svm.f1[c] * 100).toFixed(1)}%</strong></p>
                  <p className="text-slate-500">Support: <strong>{svm.support[c]}</strong></p>
                </div>
              </div>
            ))}
          </div>

          {/* Class Distribution Percentages */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="font-bold text-slate-800">Distribusi Kelas Sentimen Dataset</h4>
            <p className="mt-1 text-sm text-slate-600">Persentase pembagian kelas pada data uji (20%).</p>
            <div className="mt-4 space-y-3">
              {classes.map((c) => {
                const count = svm.testDistribution[c];
                const pct = svm.testSize > 0 ? (count / svm.testSize) * 100 : 0;
                const color = c === 'Positif' ? 'bg-teal-500' : c === 'Negatif' ? 'bg-red-500' : 'bg-amber-500';
                return (
                  <div key={c}>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-700">{c}</span>
                      <span className="text-slate-600">{count} data ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.max(2, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-slate-800">Formula Precision</h4>
              <FormulaBox formula="Precision = TP / (TP + FP)" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Formula Recall</h4>
              <FormulaBox formula="Recall = TP / (TP + FN)" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Formula F1-Score</h4>
              <FormulaBox formula="F1 = 2 × (Precision × Recall) / (Precision + Recall)" />
            </div>
          </div>
        </>
      ) : (
        <p className="text-slate-400">Model SVM sedang dimuat...</p>
      )}
    </div>
  );
}

function MetricCard({ title, value, formula }: { title: string; value: string; formula: string }) {
  return (
    <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-4">
      <p className="text-xs font-semibold uppercase text-teal-600">{title}</p>
      <p className="mt-1 text-2xl font-bold text-teal-800">{value}</p>
      <p className="mt-1 font-mono text-xs text-teal-600/70">{formula}</p>
    </div>
  );
}
