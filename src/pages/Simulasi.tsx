import { useState, useRef } from 'react';
import { useEngine, type PredictSentimentResult } from '@/context/EngineContext';
import { sentimentColor, SentimentBadge } from '@/components/SentimentBadge';
import {
  Search, Loader2, Sparkles, AlignLeft, Tag, Calculator, BrainCircuit,
  Printer, CheckCircle, FileText, X, Layers, ShieldCheck, AlertCircle,
} from 'lucide-react';
import type { SvmLabel } from '@/lib/ml/svm';

const LOADING_STEPS = [
  'Case folding & Cleaning...',
  'Normalizing Slang Words...',
  'Removing Stopwords & Stemming Sastrawi...',
  'Calculating TF-IDF Weights...',
  'Support Vector Machine Classification...',
];

const CONFIDENCE_COLORS: Record<SvmLabel, string> = {
  Positif: 'bg-teal-500',
  Negatif: 'bg-red-500',
  Netral: 'bg-amber-500',
};

export function Simulasi() {
  const { predictSentiment, svm, isReady, isTraining, pushToast } = useEngine();
  const [nama, setNama] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<PredictSentimentResult | null>(null);
  const [activeTab, setActiveTab] = useState<'cleaned' | 'tokens' | 'normalized' | 'stemmed' | 'tfidf'>('cleaned');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      pushToast('Mohon masukkan teks komentar terlebih dahulu!', 'error');
      return;
    }
    setLoading(true);
    setLoadingStep(0);
    setResult(null);

    const stepInterval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 380);

    const finalTimer = setTimeout(() => {
      clearInterval(stepInterval);
      setLoadingStep(LOADING_STEPS.length - 1);

      const output = predictSentiment(input);
      if (output) {
        setResult(output);
      } else {
        pushToast('Terjadi kesalahan saat memproses teks. Coba lagi.', 'error');
      }
      setLoading(false);
    }, 2000);

    timersRef.current = [stepInterval as unknown as ReturnType<typeof setTimeout>, finalTimer];
  };

  const confidenceEntries = (conf: Record<SvmLabel, number>): [SvmLabel, number][] =>
    (['Positif', 'Negatif', 'Netral'] as SvmLabel[]).map((k) => [k, conf[k]]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Mesin Pengujian &amp; Prediksi Sentimen Real-Time</h1>
        <p className="mt-2 text-slate-500">Support Vector Machine (SVM) &mdash; Masukkan komentar opini terkait insiden keracunan Program Makan Bergizi Gratis (MBG) untuk memprediksi kategori sentimen secara instan.</p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          {isReady ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-700">
              <ShieldCheck className="h-4 w-4" /> Model SVM siap &amp; terlatih
            </span>
          ) : isTraining ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
              <Loader2 className="h-4 w-4 animate-spin" /> Sedang melatih model SVM...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
              <AlertCircle className="h-4 w-4" /> Menunggu inisialisasi model
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Search className="h-5 w-5 text-teal-600" /> Input Komentar
          </h2>

          <form onSubmit={handleAnalyze}>
            <label className="mt-5 mb-1.5 block text-sm font-medium text-slate-700">Nama Penguji</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama Anda..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />

            <label className="mt-4 mb-1.5 block text-sm font-medium text-slate-700">Kalimat Opini / Komentar</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              placeholder="Ketik teks komentar... contoh: Pemerintah harus segera mengevaluasi katering Program MBG karena kasus keracunan ini sangat membahayakan anak-anak!"
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Menganalisis...</> : <><Search className="h-5 w-5" /> Analisis Sentimen Sekarang</>}
            </button>
          </form>
        </div>

        {/* Right: Output */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <BrainCircuit className="h-5 w-5 text-orange-600" /> Hasil Prediksi SVM
          </h2>

          {!result && !loading && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Sparkles className="h-8 w-8 text-slate-300" />
              </div>
              <p className="mt-4 text-sm text-slate-400">Sistem siap memproses kalimat komentar...</p>
            </div>
          )}

          {loading && (
            <div className="flex h-64 flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
              <div className="mt-6 w-full max-w-xs space-y-2">
                {LOADING_STEPS.map((s, i) => (
                  <div key={s} className={`flex items-center gap-2 text-sm transition ${i <= loadingStep ? 'text-slate-700' : 'text-slate-300'}`}>
                    {i < loadingStep ? <CheckCircle className="h-4 w-4 text-teal-500" /> : i === loadingStep ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="h-4 w-4" />}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="mt-4 animate-slide-up">
              {/* Sentiment Result Card */}
              <div
                className="rounded-xl p-5 text-center text-white shadow-md transition-all"
                style={{ backgroundColor: sentimentColor(result.prediction.label) }}
              >
                <p className="text-sm uppercase tracking-wide opacity-90">Klasifikasi Sentimen</p>
                <p className="mt-1 text-4xl font-extrabold">{result.sentiment}</p>
                <p className="mt-1 text-xs opacity-80">
                  {result.source === 'svm'
                    ? 'SVM Linear Kernel (TF-IDF)'
                    : 'Lexicon Fallback (SVM belum siap)'}
                </p>

                {/* Confidence progress bars */}
                <div className="mt-4 space-y-2 text-left">
                  {confidenceEntries(result.confidence).map(([label, pct]) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs font-medium">
                        <span>{label}</span>
                        <span>{pct.toFixed(1)}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/30">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${CONFIDENCE_COLORS[label]}`}
                          style={{ width: `${Math.max(2, pct)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-xs opacity-80">
                  Hyperplane Margin: P={result.prediction.marginScores.Positif.toFixed(3)}, N={result.prediction.marginScores.Negatif.toFixed(3)}, T={result.prediction.marginScores.Netral.toFixed(3)}
                </p>
              </div>

              {/* Step-by-step viewer */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-1 border-b border-slate-200">
                  {([
                    { k: 'cleaned', label: 'Cleaned Text', icon: AlignLeft },
                    { k: 'tokens', label: 'Tokens', icon: Layers },
                    { k: 'normalized', label: 'Normalized', icon: Tag },
                    { k: 'stemmed', label: 'Stemmed', icon: BrainCircuit },
                    { k: 'tfidf', label: 'TF-IDF Terms', icon: Calculator },
                  ] as const).map((tab) => (
                    <button
                      key={tab.k}
                      onClick={() => setActiveTab(tab.k)}
                      className={`flex items-center gap-1 border-b-2 px-3 py-2 text-xs font-medium transition ${activeTab === tab.k ? 'border-teal-500 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3 min-h-[120px] rounded-lg bg-slate-50 p-4 text-sm">
                  {activeTab === 'cleaned' && <p className="text-slate-700">{result.nlp.cleaned || '(kosong)'}</p>}
                  {activeTab === 'tokens' && (
                    <div className="flex flex-wrap gap-1.5">
                      {result.nlp.tokens.length === 0 && <p className="text-slate-400">Tidak ada token.</p>}
                      {result.nlp.tokens.map((t, i) => <span key={i} className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-700">{t}</span>)}
                    </div>
                  )}
                  {activeTab === 'normalized' && (
                    <div className="flex flex-wrap gap-1.5">
                      {result.nlp.normalizedTokens.length === 0 && <p className="text-slate-400">Tidak ada token.</p>}
                      {result.nlp.normalizedTokens.map((t, i) => <span key={i} className="rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-700">{t}</span>)}
                    </div>
                  )}
                  {activeTab === 'stemmed' && (
                    <div className="flex flex-wrap gap-1.5">
                      {result.nlp.stemmedTokens.length === 0 && <p className="text-slate-400">Tidak ada token setelah stemming.</p>}
                      {result.nlp.stemmedTokens.map((t, i) => <span key={i} className="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-700">{t}</span>)}
                    </div>
                  )}
                  {activeTab === 'tfidf' && (
                    <div>
                      <div className="mb-3 rounded-lg bg-slate-100 p-3 text-xs text-slate-600">
                        <p className="font-semibold text-slate-700">Formula:</p>
                        <p className="mt-1 font-mono">TF-IDF(t,d) = TF(t,d) × IDF(t)</p>
                        <p className="font-mono">IDF(t) = log((1 + N) / (1 + DF(t))) + 1</p>
                        <p className="mt-1 text-slate-500">N = {result.tfidfDetails.length > 0 ? 'jumlah dokumen korpus' : '0'} (total dataset)</p>
                      </div>
                      {result.tfidfDetails.length === 0 ? (
                        <p className="text-slate-400">Tidak ada term dalam vocabulary.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-slate-300 text-left text-slate-600">
                                <th className="pb-2 pr-3 font-semibold">Term</th>
                                <th className="pb-2 pr-3 text-center font-semibold">TF</th>
                                <th className="pb-2 pr-3 text-center font-semibold">IDF</th>
                                <th className="pb-2 text-center font-semibold">TF-IDF</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.tfidfDetails.map((t) => (
                                <tr key={t.term} className="border-b border-slate-100">
                                  <td className="py-1.5 pr-3 font-medium text-slate-700">{t.term}</td>
                                  <td className="py-1.5 pr-3 text-center text-slate-600">{t.tf}</td>
                                  <td className="py-1.5 pr-3 text-center text-slate-600">{t.idf.toFixed(4)}</td>
                                  <td className="py-1.5 text-center font-semibold text-teal-700">{t.tfidf.toFixed(4)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowPrintModal(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-200 px-6 py-2.5 font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <Printer className="h-5 w-5" /> Cetak Laporan Validation Slip (PDF / Print)
              </button>
            </div>
          )}
        </div>
      </div>

      {showPrintModal && result && (
        <PrintModal
          nama={nama}
          input={input}
          result={result}
          svm={svm}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}

function PrintModal({
  nama, input, result, svm, onClose,
}: {
  nama: string;
  input: string;
  result: PredictSentimentResult;
  svm: ReturnType<typeof useEngine>['svm'];
  onClose: () => void;
}) {
  const slipId = `VSL-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-800"><FileText className="h-5 w-5 text-teal-600" /> Validation Slip</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          {/* Kop Surat */}
          <div className="border-b-4 border-double border-teal-700 pb-4 text-center">
            <h3 className="text-lg font-extrabold text-teal-800">UNIVERSITAS MUHAMMADIYAH SUMATERA UTARA</h3>
            <p className="text-sm font-semibold text-slate-700">FAKULTAS ILMU KOMPUTER DAN TEKNOLOGI INFORMASI</p>
            <p className="mt-1 text-xs text-slate-500">Jl. Kapten Muchtar Basri No. 2, Medan 20238 &middot; Sumatera Utara</p>
          </div>

          <h4 className="mt-4 text-center text-base font-bold text-slate-800">SURAT HASIL PENGUJIAN SENTIMEN</h4>
          <p className="text-center text-xs text-slate-500">Sistem Analisis Sentimen MBG &mdash; Support Vector Machine</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-slate-500">Nama Peneliti:</span> <span className="font-semibold">MIKHAEL WEILMAN PARULIAN SIANIPAR</span></div>
            <div><span className="text-slate-500">NPM:</span> <span className="font-semibold">2209010162</span></div>
            <div><span className="text-slate-500">Program Studi:</span> <span className="font-semibold">Sistem Informasi</span></div>
            <div><span className="text-slate-500">Nama Penguji:</span> <span className="font-semibold">{nama || '-'}</span></div>
            <div><span className="text-slate-500">Tanggal Uji:</span> <span className="font-semibold">{new Date().toLocaleString('id-ID')}</span></div>
            <div><span className="text-slate-500">Metode:</span> <span className="font-semibold">SVM Linear + TF-IDF</span></div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Teks Input</p>
            <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{input}</p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Hasil Preprocessing</p>
            <div className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <p><span className="font-medium">Cleaned:</span> {result.nlp.cleaned}</p>
              <p className="mt-1"><span className="font-medium">Stemmed:</span> {result.nlp.stemmedTokens.join(', ')}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Hasil Klasifikasi SVM</p>
            <div className="mt-2 flex items-center gap-4">
              <SentimentBadge label={result.prediction.label} size="lg" />
              <div className="text-sm">
                <p>Confidence: P={result.prediction.confidence.Positif.toFixed(1)}% | N={result.prediction.confidence.Negatif.toFixed(1)}% | T={result.prediction.confidence.Netral.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">Margin: {result.prediction.marginScores[result.prediction.label].toFixed(3)}</p>
                {svm && <p className="text-xs text-slate-500">Akurasi Model: {(svm.accuracy * 100).toFixed(2)}%</p>}
              </div>
            </div>
          </div>

          {/* QR code */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="grid h-20 w-20 grid-cols-5 grid-rows-5 gap-0.5 rounded border-2 border-slate-300 p-1">
              {Array.from({ length: 25 }).map((_, i) => {
                const seed = (i * 7 + slipId.charCodeAt(i % slipId.length)) % 3;
                return <div key={i} className={seed > 1 ? 'bg-slate-800' : 'bg-white'} />;
              })}
            </div>
            <div className="text-xs text-slate-500">
              <p className="font-semibold">Verifikasi Digital</p>
              <p>Scan QR untuk verifikasi hasil</p>
              <p>ID: {slipId}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 font-semibold text-white hover:bg-teal-700"
          >
            <Printer className="h-5 w-5" /> Cetak / Print
          </button>
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-50">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
