// Seed dataset: synthetic but realistic Indonesian tweets about the
// MBG (Makan Bergizi Gratis) mass poisoning incident.
// 500 raw rows generated, deduplicated to ~272 unique records.

import type { SvmLabel } from '../ml/svm';

export interface RawRecord {
  id_tweet: string;
  created_at: string;
  username: string;
  komentar_mentah: string;
}

const USERNAMES = [
  'warga_jakarta', 'ibu_siti', 'bapak_budi', 'anaksekolah_id', 'guru_hartono',
  'warganet99', 'netizen_peduli', 'papaleonardo', 'infombg', 'berita_kesehatan',
  'sahabat_umsu', 'peduli_anak', 'catering_review', 'dokter_sri', 'pak_rt',
  'remaja_nagoya', 'medan_kini', 'jakarta_update', 'surabaya_pride', 'bandung_herang',
  'makassar_info', 'palembang_tribun', 'semarang_kita', 'bali_post', 'yogyakarta_kita',
  'aceh_bersuara', 'papua_merdeka', 'kalimantan_now', 'sulawesi_update', 'sumatera_news',
  'bgn_watch', 'kemenkes_ri', 'dinkes_jakarta', 'dpr_bersuara', 'pemerhati_anak',
  'ortu_peduli', 'akun_faktual', 'jurnalisme_warga', 'opini_rakyat', 'suaraprogress',
  'civitas_peduli', 'ortu_hebat', 'guru_sehat', 'medan_raya', 'anak_medan',
  'pemuda_panitia', 'warga_peduli', 'ibu_dewi', 'bapak_rizal', 'siswa_sma',
];

const LOCATIONS = [
  'Jakarta', 'Medan', 'Surabaya', 'Bandung', 'Semarang', 'Yogyakarta',
  'Makassar', 'Palembang', 'Denpasar', 'Banda Aceh', 'Pontianak', 'Manado',
  'Balikpapan', 'Pekanbaru', 'Bogor', 'Tangerang', 'Bekasi', 'Depok',
  'Cirebon', 'Malang', 'Solo', 'Cilacap', 'Sukabumi', 'Binjai',
  'Padang', 'Jambi', 'Bengkulu', 'Lampung', 'Banten', 'NTT',
];

const POSITIVE_TEMPLATES: ((ctx: string[]) => string)[] = [
  (c) => `Program MBG tetap bagus, tingkatkan evaluasi katering agar lebih higienis dan aman untuk anak-anak ${c[0]}`,
  (c) => `Mendukung kelanjutan Program Makan Bergizi Gratis, semoga diperbaiki sistem distribusinya ${c[0]}`,
  (c) => `Jangan asumsikan buruk dulu, pemerintah pasti mengevaluasi insiden keracunan ini. MBG harus lanjut ${c[0]}`,
  (c) => `Apresiasi respons cepat pemerintah menangani kasus keracunan, perbaiki kualitas katering MBG ${c[0]}`,
  (c) => `Program bagus, tinggal memperketat standar higienitas katering. Jangan urungkan MBG ${c[0]}`,
  (c) => `Setuju MBG lanjut, tapi vendor katering harus ditangguhkan dan diaudit menyeluruh ${c[0]}`,
  (c) => `Dukung MBG, mohon evaluasi katering dan sosialisasi standar gizi yang benar ${c[0]}`,
  (c) => `Keracunan itu pelajaran, bukan alasan cabut program. Perbaiki dan lanjutkan MBG ${c[0]}`,
  (c) => `Tetap semangat Program Makan Bergizi Gratis! Tingkatkan pengawasan dan mutu pangan ${c[0]}`,
  (c) => `Pemerintah tanggap menangani korban keracunan. MBG harus terus jalan dengan perbaikan ${c[0]}`,
  (c) => `Saya percaya Badan Gizi Nasional akan memperbaiki sistem MBG agar tidak terulang ${c[0]}`,
  (c) => `Dukung penuh MBG, harap transparan dalam investigasi kasus keracunan ini ${c[0]}`,
  (c) => `Program sangat membantu rakyat, jangan dibatalkan. Cukup ganti vendor yang bermasalah ${c[0]}`,
  (c) => `Edukasi gizi untuk anak sekolah lewat MBG sangat positif, perbaiki kualitasnya saja ${c[0]}`,
  (c) => `Mending revisi ketat standar katering MBG daripada membubarkan program bagus ini ${c[0]}`,
  (c) => `MBG membantu sekali anak-anak di ${c[0]}, semoga keracunan ini jadi evaluasi bersama`,
  (c) => `Saya optimis MBG akan lebih baik setelah audit katering di ${c[0]}. Dukung terus!`,
  (c) => `Terima kasih pemerintah sudah tanggap. Anak saya dirawat dengan baik di ${c[0]}. MBG lanjut`,
  (c) => `Jangan generalisasi, katering MBG di ${c[0]} sebagian besar baik. Evaluasi yang bermasalah saja`,
  (c) => `Solusinya perbaiki standar, bukan bubarkan. Anak-anak di ${c[0]} butuh program gizi ini`,
  (c) => `Apresiasi BPOM yang sudah audit katering MBG di ${c[0]}. Semoga jadi pelajaran`,
  (c) => `Dukung kebijakan evaluasi MBG di ${c[0]}. Tingkatkan pengawasan kualitas pangan`,
  (c) => `Program gizi gratis sangat bermanfaat untuk keluarga kurang mampu di ${c[0]}. Pertahankan!`,
  (c) => `Setuju audit menyeluruh, tapi MBG jangan dihentikan. Anak sekolah di ${c[0]} butuh`,
  (c) => `Kualitas katering MBG di ${c[0]} harus dinaikkan. Dukung program tapi perbaiki sistem`,
  (c) => `Investigasi kasus keracunan di ${c[0]} harus transparan. MBG tetaplanjut dengan perbaikan`,
  (c) => `Saya yakin pemerintah ${c[0]} akan menindak tegas vendor katering nakal. MBG tetap jalan`,
  (c) => `Tingkatkan standar higienis katering MBG. Anak-anak ${c[0]} berhak makanan aman dan bergizi`,
  (c) => `Edukasi gizi lewat MBG bagus untuk anak sekolah ${c[0]}, perbaiki kualitas distribusi`,
  (c) => `Semoga keracunan di ${c[0]} jasi momentum perbaikan MBG. Jangan urungkan niat baik`,
  (c) => `Ganti vendor katering yang bermasalah di ${c[0]}, bukan bubarkan programnya. MBG lanjut!`,
  (c) => `Keracunan MBG di ${c[0]} harus jadi evaluasi. Tingkatkan pengawasan, bukan stop program`,
  (c) => `Apresiasi penanganan cepat korban keracunan MBG di ${c[0]}. Program tetap dilanjutkan`,
  (c) => `Anak-anak di ${c[0]} sangat terbantu MBG. Perbaiki kualitas, jangan batalkan`,
  (c) => `Solusi: audit rutin katering MBG ${c[0]}. Jangan ada keracunan lagi. Dukung program`,
  (c) => `MBG program baik untuk rakyat ${c[0]}. Evaluasi katering secara berkala agar aman`,
  (c) => `Pemerintah tanggap, korban keracunan MBG ${c[0]} ditangani. Tingkatkan standar katering`,
  (c) => `Saran: sosialisasi standar gizi untuk vendor MBG di ${c[0]}. Program tetap lanjut`,
  (c) => `Tetap dukung MBG meski ada insiden keracunan di ${c[0]}. Perbaiki, jangan batal`,
  (c) => `Semoga Badan Gizi Nasional audit semua katering MBG. Anak ${c[0]} butuh makanan aman`,
];

const NEGATIVE_TEMPLATES: ((ctx: string[]) => string)[] = [
  (c) => `Kasus keracunan massal MBG ini parah! Anak-anak mual muntah dan dirawat di rumah sakit ${c[0]}`,
  (c) => `Kenapa katering Program Makan Bergizi Gratis tidak diperiksa? Anak saya keracunan sampai diare ${c[0]}`,
  (c) => `Parah, makanan MBG basi dan berbau busuk. Korban keracunan terus bertambah ${c[0]}`,
  (c) => `Pemerintah harus bertanggung jawab! Insiden keracunan massal MBG menelan korban jiwa ${c[0]}`,
  (c) => `Tolong hentikan Program MBG dulu, kateringnya kotor dan menyebabkan keracunan massal ${c[0]}`,
  (c) => `Saya kecewa berat, anak kelas 3 keracunan setelah makan MBG. Mual muntah demam ${c[0]}`,
  (c) => `Katering MBG murahan dan tidak higienis! Bayangkan anak-anak kita keracunan massal ${c[0]}`,
  (c) => `Skandal keracunan MBG viral, katering ditemukan kadaluarsa dan berulat. Parah! ${c[0]}`,
  (c) => `Menuntut pertanggungjawaban pemerintah atas keracunan massal MBG. Jangan ada korban lagi ${c[0]}`,
  (c) => `Anak saya dirawat intensif karena keracunan makanan MBG. Katering nakal harus dituntut ${c[0]}`,
  (c) => `Gara-gara MBG, anak-anak sakit keracunan. Pelayanan katering sangat buruk dan kotor ${c[0]}`,
  (c) => `Marah! Kenapa kualitas makanan MBG tidak diawasi? Korban keracunan terus berjatuhan ${c[0]}`,
  (c) => `Keracunan massal MBG bukan kali ini saja, sudah berulang. Cabut saja programnya ${c[0]}`,
  (c) => `Katering MBG berbahaya, mengandung bakteri penyebab keracunan. Anak-anak korban ${c[0]}`,
  (c) => `Kasus keracunan MBG heboh, banyak siswa dibawa ke puskesmas. Katering jorok ${c[0]}`,
  (c) => `Duh sedih banget, anak TK keracunan makan MBG. Mual muntah parah, bagaimana ini ${c[0]}`,
  (c) => `Tuntut vendor katering MBG ke jalur hukum! Keracunan massal tidak boleh berlalu ${c[0]}`,
  (c) => `Makanan MBG kotor dan berbahaya, sudah banyak korban keracunan. Stop programnya ${c[0]}`,
  (c) => `Berita duka, ada korban jiwa akibat keracunan massal Program Makan Bergizi Gratis ${c[0]}`,
  (c) => `Anak saya kena diare dan demam setelah makan MBG di sekolah ${c[0]}. Katering busuk!`,
  (c) => `Katering MBG di ${c[0]} basi dan bau. Anak-anak keracunan massal. Parah sekali`,
  (c) => `Saya marah! Anak saya keracunan MBG di ${c[0]}. Mual muntah sampai dirawat`,
  (c) => `Keracunan MBG di ${c[0]} membuktikan katering tidak diawasi. Korban terus jatuh`,
  (c) => `Stop MBG! Banyak anak sakit di ${c[0]} karena makanan katering kotor dan berbahaya`,
  (c) => `Vendor katering MBG ${c[0]} harus dituntut! Anak-anak keracunan massal. Marah!`,
  (c) => `Kasus keracunan MBG di ${c[0]} jadi viral. Katering ditemukan berulat dan basi`,
  (c) => `Anak saya dirawat di rumah sakit ${c[0]} karena keracunan MBG. Katering jorok!`,
  (c) => `Pemerintah ${c[0]} harus bertanggung jawab! Keracunan MBG menelan korban jiwa`,
  (c) => `Katering MBG murahan, banyak anak keracunan di ${c[0]}. Hentikan program ini!`,
  (c) => `Kecewa! MBG di ${c[0]} jadi bencana. Anak-anak keracunan, katering tidak higienis`,
  (c) => `Mual muntah demam, anak saya keracunan MBG di ${c[0]}. Katering busuk dan kotor`,
  (c) => `Skandal! Katering MBG ${c[0]} kadaluarsa. Banyak siswa keracunan massal. Parah`,
  (c) => `Tuntut pertanggungjawaban! Keracunan MBG di ${c[0]} menelan banyak korban. Sedih`,
  (c) => `Keracunan MBG terus berulang di ${c[0]}. Katering nakal, pemerintah tidak peduli`,
  (c) => `Anak sekolah di ${c[0]} keracunan massal MBG. Katering berbahaya, stop sekarang!`,
  (c) => `Insiden keracunan MBG di ${c[0]} parah! Banyak anak dirawat. Katering jorok`,
  (c) => `Korban keracunan MBG di ${c[0]} terus bertambah. Katering kotor, hentikan program`,
  (c) => `Saya protes! Anak saya keracunan MBG di ${c[0]}. Makanan basi dan berbau busuk`,
  (c) => `Tragedi keracunan MBG di ${c[0]}. Banyak anak sakit, katering tidak layak konsumsi`,
  (c) => `Katering MBG ${c[0]} berbahaya! Anak saya diare dan muntah. Tutup programnya`,
];

const NEUTRAL_TEMPLATES: ((ctx: string[]) => string)[] = [
  (c) => `Berita: BPOM dan Kemenkes investigasi kasus keracunan massal MBG di ${c[0]}`,
  (c) => `Menurut data, terdapat 50 siswa terdampak keracunan makanan MBG di ${c[0]}`,
  (c) => `Pemerintah mengumumkan penundaan Program MBG pasca insiden keracunan di ${c[0]}`,
  (c) => `Laporan resmi: Tim medis menangani korban keracunan MBG di rumah sakit ${c[0]}`,
  (c) => `Dinkes menyatakan sedang meninjau standar katering Program MBG ${c[0]}`,
  (c) => `Jadwal distribusi MBG ditunda sementara menunggu hasil investigasi keracunan ${c[0]}`,
  (c) => `Berdasarkan informasi, katering MBG berasal dari vendor di ${c[0]}`,
  (c) => `Polisi memeriksa katering MBG terkait kasus keracunan massal di ${c[0]}`,
  (c) => `Statistik: Persentase insiden keracunan MBG tahun 2025 menurut data ${c[0]}`,
  (c) => `Badan Gizi Nasional menerbitkan siaran pers terkait keracunan MBG di ${c[0]}`,
  (c) => `Kasus keracunan MBG ramai diberitakan media, pemerintah meminta transparansi ${c[0]}`,
  (c) => `Rincian korban keracunan MBG dirilis, total 30 siswa dirawat di ${c[0]}`,
  (c) => `Kementerian menyiapkan tim audit katering MBG nasional pasca insiden ${c[0]}`,
  (c) => `Sesuai jadwal, Program MBG akan dievaluasi menyeluruh bulan depan ${c[0]}`,
  (c) => `Data sementara: keracunan MBG terjadi di 5 sekolah, rincian lokasi ${c[0]}`,
  (c) => `Laporan: Dinkes ${c[0]} menyatakan sedang meninjau standar katering MBG`,
  (c) => `Informasi: BPOM ${c[0]} memeriksa sampel katering MBG terkait keracunan massal`,
  (c) => `Pengumuman: Distribusi MBG di ${c[0]} ditunda menunggu hasil investigasi`,
  (c) => `Data resmi: 45 siswa di ${c[0]} terdampak keracunan makanan MBG`,
  (c) => `Kementerian: Tim audit katering MBG akan diterjunkan ke ${c[0]} minggu depan`,
  (c) => `Siaran pers BGN: Evaluasi menyeluruh katering MBG di ${c[0]} akan dilakukan`,
  (c) => `Polisi ${c[0]} memeriksa vendor katering MBG terkait insiden keracunan`,
  (c) => `Menurut informasi, korban keracunan MBG di ${c[0]} dirawat di rumah sakit`,
  (c) => `Berita: Pemerintah ${c[0]} menunda distribusi MBG pasca insiden keracunan`,
  (c) => `Fakta: Total 28 siswa keracunan MBG di ${c[0]} sedang dirawat intensif`,
  (c) => `Laporan media: Kasus keracunan MBG di ${c[0]} sedang dalam investigasi`,
  (c) => `Pengumuman resmi: Standar katering MBG di ${c[0]} sedang ditinjau ulang`,
  (c) => `Data: Persentase insiden keracunan MBG di ${c[0]} sesuai statistik kemenkes`,
  (c) => `Informasi: Tim medis ${c[0]} menangani korban keracunan Program MBG`,
  (c) => `Kementerian: Jadwal evaluasi katering MBG di ${c[0]} akan diumumkan`,
];

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function makeRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export interface SeedRecord extends RawRecord {
  label: SvmLabel;
}

// Generate 500 raw records, then deduplicate by komentar_mentah text
export function generateSeedDataset(count = 500): SeedRecord[] {
  const rng = makeRng(20251010);
  const distribution: SvmLabel[] = [];
  for (let i = 0; i < Math.round(count * 0.4); i++) distribution.push('Negatif');
  for (let i = 0; i < Math.round(count * 0.32); i++) distribution.push('Netral');
  for (let i = 0; i < count - distribution.length; i++) distribution.push('Positif');
  for (let i = distribution.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [distribution[i], distribution[j]] = [distribution[j], distribution[i]];
  }

  const start = new Date('2025-08-01T08:00:00Z').getTime();
  const end = new Date('2025-10-31T22:00:00Z').getTime();
  const seenText = new Set<string>();
  const records: SeedRecord[] = [];

  for (let i = 0; i < count; i++) {
    const label = distribution[i];
    let text: string;
    const ctx = [pick(LOCATIONS, rng)];
    if (label === 'Positif') text = pick(POSITIVE_TEMPLATES, rng)(ctx);
    else if (label === 'Negatif') text = pick(NEGATIVE_TEMPLATES, rng)(ctx);
    else text = pick(NEUTRAL_TEMPLATES, rng)(ctx);

    if (rng() > 0.6) text += ' #MBG';
    if (rng() > 0.7) text += ' @kemenkes_ri';
    if (rng() > 0.85) text += ' https://bit.ly/mbg-news';

    // Deduplicate by raw text
    if (seenText.has(text)) continue;
    seenText.add(text);

    const ts = start + rng() * (end - start);
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    const created_at = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

    records.push({
      id_tweet: `TW${String(records.length + 1).padStart(6, '0')}`,
      created_at,
      username: pick(USERNAMES, rng),
      komentar_mentah: text,
      label,
    });
  }
  return records;
}

// Always returns 500 raw records for Google Colab export reference
export function generateRawDataset500(): SeedRecord[] {
  const rng = makeRng(20251010);
  const distribution: SvmLabel[] = [];
  for (let i = 0; i < 200; i++) distribution.push('Negatif');
  for (let i = 0; i < 160; i++) distribution.push('Netral');
  for (let i = 0; i < 140; i++) distribution.push('Positif');
  for (let i = distribution.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [distribution[i], distribution[j]] = [distribution[j], distribution[i]];
  }

  const start = new Date('2025-08-01T08:00:00Z').getTime();
  const end = new Date('2025-10-31T22:00:00Z').getTime();
  const records: SeedRecord[] = [];

  for (let i = 0; i < 500; i++) {
    const label = distribution[i];
    let text: string;
    const ctx = [pick(LOCATIONS, rng)];
    if (label === 'Positif') text = pick(POSITIVE_TEMPLATES, rng)(ctx);
    else if (label === 'Negatif') text = pick(NEGATIVE_TEMPLATES, rng)(ctx);
    else text = pick(NEUTRAL_TEMPLATES, rng)(ctx);

    if (rng() > 0.6) text += ' #MBG';
    if (rng() > 0.7) text += ' @kemenkes_ri';
    if (rng() > 0.85) text += ' https://bit.ly/mbg-news';

    const ts = start + rng() * (end - start);
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    const created_at = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

    records.push({
      id_tweet: `TW${String(i + 1).padStart(6, '0')}`,
      created_at,
      username: pick(USERNAMES, rng),
      komentar_mentah: text,
      label,
    });
  }
  return records;
}

// Deduplicate arbitrary raw records by komentar_mentah text
export function deduplicateRaw(records: RawRecord[]): RawRecord[] {
  const seen = new Set<string>();
  const out: RawRecord[] = [];
  for (const r of records) {
    const key = r.komentar_mentah.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}
