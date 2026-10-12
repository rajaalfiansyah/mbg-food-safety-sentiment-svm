import { useState, useMemo, useRef, useCallback } from 'react';
import { useEngine, useSentimentCounts } from '@/context/EngineContext';
import { useAuth } from '@/context/AuthContext';
import { SummaryCard } from '@/components/SummaryCard';
import { SentimentBadge } from '@/components/SentimentBadge';
import { lexiconLabel } from '@/lib/nlp/lexicon';
import type { RawRecord } from '@/lib/ml/dataset';
import type { SvmLabel } from '@/lib/ml/svm';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Search, Upload, Tag, Printer, Database, CheckCircle, AlertTriangle,
  Info, X, FileSpreadsheet, RefreshCw, ChevronLeft, ChevronRight,
  Trash2, Pencil, Download, Loader2,
} from 'lucide-react';

const PAGE_SIZE = 50;

// Normalize column header
function normHeader(h: string): string {
  return h.toLowerCase().trim().replace(/\s+/g, '_');
}

// Map various possible column names to our canonical fields
function mapRow(row: Record<string, string>): RawRecord | null {
  const entries = Object.entries(row);
  const map: Record<string, string> = {};
  for (const [k, v] of entries) {
    map[normHeader(k)] = (v ?? '').toString().trim();
  }
  const idTweet = map.id_tweet || map.idtweet || map.id || map.tweet_id || map.nomor || `TW${Date.now()}${Math.floor(Math.random() * 9999)}`;
  const createdAt = map.created_at || map.createdat || map.tanggal || map.tanggal_dan_waktu || map.tanggal_waktu || map.waktu || map.date || '';
  const username = map.username || map.user || map.akun || map.nama || '';
  const komentar = map.komentar_mentah || map.komentar || map.tweet || map.text || map.unggahan_tweet || map.unggahan || map.konten || map.pesan || '';
  if (!komentar) return null;
  return { id_tweet: idTweet, created_at: createdAt, username, komentar_mentah: komentar };
}

function downloadTemplate() {
  const sample = [
    { 'ID Tweet': 'TW000001', 'Tanggal dan Waktu': '2025-09-15 08:30', 'Username': 'warga_jakarta', 'Unggahan Tweet': 'Kasus keracunan massal MBG ini parah! Anak-anak mual muntah dan dirawat di rumah sakit #MBG' },
    { 'ID Tweet': 'TW000002', 'Tanggal dan Waktu': '2025-09-15 09:15', 'Username': 'ibu_siti', 'Unggahan Tweet': 'Program MBG tetap bagus, tingkatkan evaluasi katering agar lebih higienis dan aman untuk anak-anak' },
    { 'ID Tweet': 'TW000003', 'Tanggal dan Waktu': '2025-09-15 10:00', 'Username': 'berita_kesehatan', 'Unggahan Tweet': 'BPOM dan Kemenkes investigasi kasus keracunan massal MBG di Jakarta @kemenkes_ri' },
    { 'ID Tweet': 'TW000004', 'Tanggal dan Waktu': '2025-09-15 10:45', 'Username': 'bapak_budi', 'Unggahan Tweet': 'Kenapa katering Program Makan Bergizi Gratis tidak diperiksa? Anak saya keracunan sampai diare' },
    { 'ID Tweet': 'TW000005', 'Tanggal dan Waktu': '2025-09-15 11:30', 'Username': 'guru_hartono', 'Unggahan Tweet': 'Mendukung kelanjutan Program Makan Bergizi Gratis, semoga diperbaiki sistem distribusinya' },
  ];
  const csv = Papa.unparse(sample);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dataset_mentah_mbg_500.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function KelolaDataset() {
  const { records, importRawRecords, relabelLexicon, updateRecordLabel, deleteRecord, pushToast, svm, isTraining, exportRawDataset500 } = useEngine();
  const counts = useSentimentCounts();
  const { username } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState<SvmLabel>('Netral');

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) =>
      r.komentar_mentah.toLowerCase().includes(q) ||
      r.username.toLowerCase().includes(q) ||
      r.id_tweet.toLowerCase().includes(q)
    );
  }, [records, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRecords = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleImport = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const raw: RawRecord[] = [];
          for (const row of results.data as Record<string, string>[]) {
            const mapped = mapRow(row);
            if (mapped) raw.push(mapped);
          }
          if (raw.length === 0) {
            pushToast('Tidak ada data valid ditemukan dalam file. Pastikan kolom Unggahan Tweet ada.', 'error');
            return;
          }
          const count = importRawRecords(raw);
          pushToast(`Berhasil memproses ${raw.length} data mentah. Setelah deduplication: ${count} data unik. Auto-labeling Lexicon selesai!`, 'success');
          setShowUpload(false);
          setPage(0);
        },
        error: () => {
          pushToast('Gagal membaca file CSV. Pastikan format sesuai template.', 'error');
        },
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target!.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
          const raw: RawRecord[] = [];
          for (const row of json) {
            const mapped = mapRow(row);
            if (mapped) raw.push(mapped);
          }
          if (raw.length === 0) {
            pushToast('Tidak ada data valid ditemukan dalam file Excel.', 'error');
            return;
          }
          const count = importRawRecords(raw);
          pushToast(`Berhasil memproses ${raw.length} data mentah. Setelah deduplication: ${count} data unik. Auto-labeling Lexicon selesai!`, 'success');
          setShowUpload(false);
          setPage(0);
        } catch {
          pushToast('Gagal membaca file Excel.', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      pushToast('Format file tidak didukung. Gunakan .csv atau .xlsx', 'error');
    }
  }, [importRawRecords, pushToast]);

  const handleEdit = (id: string, current: SvmLabel) => {
    setEditingId(id);
    setEditLabel(current);
  };

  const saveEdit = () => {
    if (editingId) {
      updateRecordLabel(editingId, editLabel);
      pushToast(`Label diperbarui menjadi ${editLabel}.`, 'success');
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteRecord(id);
    pushToast('Data berhasil dihapus dari dataset.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Repositori &amp; Pengolahan Dataset Mentah</h1>
          <p className="mt-1 text-sm text-slate-500">dataset_mentah_mbg_500.csv &middot; Login sebagai: {username}</p>
        </div>
        {isTraining && (
          <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-1.5 text-sm text-orange-700">
            <Loader2 className="h-4 w-4 animate-spin" /> Melatih ulang SVM...
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Raw Data" value={counts.total} subtitle="Seluruh dataset" icon={<Database className="h-6 w-6" />} accent="slate" />
        <SummaryCard title="Total Positif" value={counts.positif} subtitle="Dukungan & solusi" icon={<CheckCircle className="h-6 w-6" />} accent="teal" />
        <SummaryCard title="Total Negatif" value={counts.negatif} subtitle="Keluhan keracunan" icon={<AlertTriangle className="h-6 w-6" />} accent="red" />
        <SummaryCard title="Total Netral" value={counts.netral} subtitle="Berita & informasi" icon={<Info className="h-6 w-6" />} accent="amber" />
      </div>

      {/* SVM Metrics bar */}
      {svm && (
        <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm">
          <p className="font-semibold text-orange-800">Metrik Evaluasi SVM &mdash; Split 80:20 (Latih: {svm.trainSize} | Uji: {svm.testSize})</p>
          <p className="mt-1 text-orange-700">Akurasi Keseluruhan: <strong>{(svm.accuracy * 100).toFixed(1)}%</strong></p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg bg-white/60 p-2">
              <p className="text-xs font-semibold text-teal-700">Positif</p>
              <p className="text-xs text-slate-600">P: {(svm.precision.Positif * 100).toFixed(1)}% | R: {(svm.recall.Positif * 100).toFixed(1)}% | F1: {(svm.f1.Positif * 100).toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-white/60 p-2">
              <p className="text-xs font-semibold text-red-700">Negatif</p>
              <p className="text-xs text-slate-600">P: {(svm.precision.Negatif * 100).toFixed(1)}% | R: {(svm.recall.Negatif * 100).toFixed(1)}% | F1: {(svm.f1.Negatif * 100).toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-white/60 p-2">
              <p className="text-xs font-semibold text-amber-700">Netral</p>
              <p className="text-xs text-slate-600">P: {(svm.precision.Netral * 100).toFixed(1)}% | R: {(svm.recall.Netral * 100).toFixed(1)}% | F1: {(svm.f1.Netral * 100).toFixed(1)}%</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-orange-700">
            <span>Distribusi Data Uji &mdash; Positif: {svm.testDistribution.Positif} ({((svm.testDistribution.Positif / svm.testSize) * 100).toFixed(1)}%)</span>
            <span>Negatif: {svm.testDistribution.Negatif} ({((svm.testDistribution.Negatif / svm.testSize) * 100).toFixed(1)}%)</span>
            <span>Netral: {svm.testDistribution.Netral} ({((svm.testDistribution.Netral / svm.testSize) * 100).toFixed(1)}%)</span>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Cari komentar, username, atau ID tweet..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          />
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700">
          <Upload className="h-4 w-4" /> Import File CSV/Excel
        </button>
        <button onClick={() => { relabelLexicon(); pushToast('Auto-labeling Lexicon dijalarkan ulang untuk seluruh data.', 'success'); }} className="flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">
          <Tag className="h-4 w-4" /> Auto-Labeling Lexicon
        </button>
        <button onClick={() => { exportRawDataset500(); pushToast('File dataset_mentah_mbg_500.csv (500 data mentah) berhasil diunduh untuk Google Colab.', 'success'); }} className="flex items-center gap-2 rounded-lg border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-100">
          <Download className="h-4 w-4" /> Export Google Colab (500)
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
          <Printer className="h-4 w-4" /> Cetak Rekap
        </button>
      </div>

      {/* Data Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3 font-semibold">No</th>
                <th className="px-3 py-3 font-semibold">ID Tweet</th>
                <th className="px-3 py-3 font-semibold">Tanggal &amp; Waktu</th>
                <th className="px-3 py-3 font-semibold">Username</th>
                <th className="px-3 py-3 font-semibold">Unggahan Tweet (Raw)</th>
                <th className="px-3 py-3 font-semibold">Cleaned Text</th>
                <th className="px-3 py-3 font-semibold">Label</th>
                <th className="px-3 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageRecords.map((r, i) => (
                <tr key={r.id_tweet} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-3 py-2.5 text-slate-400">{page * PAGE_SIZE + i + 1}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-slate-600">{r.id_tweet}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{r.created_at}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-700">{r.username}</td>
                  <td className="px-3 py-2.5 max-w-[220px]"><p className="truncate text-slate-600" title={r.komentar_mentah}>{r.komentar_mentah}</p></td>
                  <td className="px-3 py-2.5 max-w-[180px]"><p className="truncate text-slate-500" title={r.nlp.cleaned}>{r.nlp.cleaned}</p></td>
                  <td className="px-3 py-2.5">
                    {editingId === r.id_tweet ? (
                      <select value={editLabel} onChange={(e) => setEditLabel(e.target.value as SvmLabel)} className="rounded border border-slate-300 px-2 py-1 text-xs">
                        <option value="Positif">Positif</option>
                        <option value="Negatif">Negatif</option>
                        <option value="Netral">Netral</option>
                      </select>
                    ) : (
                      <SentimentBadge label={r.label} size="sm" />
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      {editingId === r.id_tweet ? (
                        <>
                          <button onClick={saveEdit} className="rounded p-1 text-teal-600 hover:bg-teal-50"><CheckCircle className="h-4 w-4" /></button>
                          <button onClick={() => setEditingId(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(r.id_tweet, r.label)} className="rounded p-1 text-orange-600 hover:bg-orange-50" title="Edit Label"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(r.id_tweet)} className="rounded p-1 text-red-500 hover:bg-red-50" title="Hapus"><Trash2 className="h-4 w-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm print:hidden">
          <p className="text-slate-500">
            Menampilkan {pageRecords.length > 0 ? page * PAGE_SIZE + 1 : 0}&ndash;{Math.min((page + 1) * PAGE_SIZE, filtered.length)} dari {filtered.length} data
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <span className="text-sm text-slate-600">Hal {page + 1} / {totalPages || 1}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onImport={handleImport} />}
    </div>
  );
}

function UploadModal({ onClose, onImport }: { onClose: () => void; onImport: (file: File) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setParsing(true);
    // Small delay for UX
    setTimeout(() => {
      onImport(file);
      setParsing(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-teal-600 to-orange-600 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white"><Upload className="h-5 w-5" /> Import Dataset Mentah</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-6">
          <p className="mb-4 text-sm text-slate-600">
            Unggah file <strong>.csv</strong> atau <strong>.xlsx</strong> berisi data mentah komentar MBG. Sistem akan otomatis menjalankan preprocessing NLP &amp; auto-labeling Lexicon.
          </p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition ${dragOver ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-slate-50 hover:border-teal-400'}`}
          >
            {parsing ? (
              <><Loader2 className="h-10 w-10 animate-spin text-teal-600" /><p className="mt-3 text-sm text-slate-600">Memproses & menjalankan pipeline NLP...</p></>
            ) : (
              <>
                <FileSpreadsheet className="h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">Drag &amp; Drop file di sini atau klik untuk memilih</p>
                <p className="mt-1 text-xs text-slate-400">Mendukung .csv dan .xlsx (PapaParse engine)</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              <Download className="h-4 w-4" /> Unduh Format Template CSV Mentah
            </button>
          </div>

          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">Kolom yang dikenali:</p>
            <p>ID Tweet / id_tweet, Tanggal dan Waktu / created_at, Username / username, Unggahan Tweet / komentar_mentah</p>
          </div>
        </div>
      </div>
    </div>
  );
}
