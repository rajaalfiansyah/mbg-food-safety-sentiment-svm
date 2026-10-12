// Lexicon dictionary for MBG poisoning domain sentiment auto-labeling
// Positive = support/evaluative/solution; Negative = complaint/poisoning/anger; Neutral = news/informative

export interface LexiconEntry {
  word: string;
  weight: number;
}

export const POSITIVE_LEXICON: string[] = [
  'bagus', 'baik', 'mendukung', 'dukung', 'dukungan', 'setuju', 'mantap', 'keren', 'sip',
  'sehat', 'higienis', 'berkualitas', 'kualitas', 'standar', 'memuaskan', 'puas',
  'solusi', 'solutif', 'revisi', 'memperbaiki', 'perbaiki', 'benar', 'tanggap',
  'cepat', 'evaluasi', 'transparan', 'terbuka', 'inovatif', 'berkelanjutan',
  'berhasil', 'sukses', 'bermanfaat', 'positif', 'aman', 'terjamin', 'bersih',
  'profesional', 'akuntabel', 'rekomendasi', 'tinjau', 'perhatian', 'perhatikan',
  'membantu', 'bantuan', 'konstruktif', 'semangat', 'harap', 'harapan',
  'mudah-mudahan', 'doa', 'wajar', 'edukasi', 'sosialisasi', 'edukatif', 'informatif',
  'mengganti', 'ganti', 'menunda', 'suspend', 'tunda', 'memperketat', 'audit', 'cek', 'periksa',
  'menyalurkan', 'tersalur', 'berjalan', 'lancar', 'gratis', 'bergizi', 'berguna',
  'manfaat', 'gizi', 'nutrisi', 'seimbang', 'lanjut', 'lanjutkan', 'melanjutkan',
  'meneruskan', 'pertahankan', 'apresiasi', 'terima kasih', 'makasih',
  'mohon', 'minta', 'usul', 'usulan', 'sarankan', 'saran', 'masukan',
  'percaya', 'yakin', 'optimis', 'pro', 'membantu rakyat', 'apresiasi respons',
  'tingkatkan', 'tingkatkan pengawasan', 'mutu', 'pangan', 'higienitas',
  'pengawasan', 'memperketat standar', 'mengevaluasi', 'dievaluasi', 'diperbaiki',
  'perbaikan', 'memperbaiki sistem', 'transparansi', 'investigasi kasus',
  'menangani', 'penanganan', 'respons cepat', 'tanggap menangani',
  'jangan dibatalkan', 'jangan urungkan', 'harus lanjut', 'harus terus jalan',
  'pelajaran', 'bukan alasan cabut', 'perbaiki dan lanjutkan', 'tetap semangat',
  'sangat membantu', 'sangat positif', 'membantu rakyat', 'program bagus',
  'program sangat membantu', 'cukup ganti vendor', 'revisi ketat',
];

export const NEGATIVE_LEXICON: string[] = [
  'keracunan', 'racun', 'sakit', 'mual', 'muntah', 'diare', 'demam', 'pusing',
  'kram', 'nyeri', 'infeksi', 'kontaminasi', 'bakteri', 'virus', 'patogen',
  'toksin', 'toksik', 'beracun', 'parah', 'bahaya', 'berbahaya', 'mati',
  'meninggal', 'wafat', 'korban', 'jiwa', 'kritis', 'dirawat', 'rawat',
  'intensif', 'icu', 'rumahsakit', 'rumah sakit', 'puskesmas', 'ambulans',
  'darurat', 'emergency', 'gawat', 'kecelakaan', 'insiden', 'kejadian',
  'kasus', 'peristiwa', 'musibah', 'tragedi', 'bencana', 'malapetaka',
  'kotor', 'kuman', 'busuk', 'basi', 'kadaluarsa', 'expired', 'berbau',
  'apek', 'jamur', 'ulat', 'belatung', 'kutu', 'serangga',
  'kecewa', 'marah', 'emosi', 'geram', 'murka', 'berang', 'kesal', 'jengkel',
  'benci', 'bodoh', 'goblok', 'tolol', 'idiot', 'negatif', 'buruk', 'jelek',
  'rusak', 'gagal', 'kacau', 'berantakan', 'lambat', 'lamban', 'telat',
  'terlambat', 'mundur', 'tangguh', 'batal', 'tuntut', 'tagih', 'menagih',
  'menuntut', 'menyalahkan', 'salah', 'kesalahan', 'kelalaian', 'lalai',
  'tidak peduli', 'abaikan', 'enggan', 'menolak', 'tolak', 'protes',
  'demonstrasi', 'demo', 'moratorium', 'mogok', 'tanggungjawab', 'tanggung jawab',
  'bertanggungjawab', 'hukum', 'pidana', 'perdata', 'denda', 'sanksi',
  'hukuman', 'vonis', 'tersangka', 'pelaku', 'oknum', 'katering nakal',
  'vendor', 'pemasok', 'murahan', 'kilangan', 'tiruan', 'palsu', 'oplosan',
  'campuran', 'tidak layak', 'tidak higienis', 'tdk layak', 'jorok', 'kumuh',
  'berita buruk', 'berita duka', 'duka', 'duka cita', 'belasungkawa',
  'anarki', 'chaos', 'kacau balau', 'rusuh', 'ricuh', 'bentrok',
  'viral', 'trending', 'ramai', 'heboh', 'gempar', 'skandal',
  'bocor', 'terbongkar', 'ungkap', 'fakta', 'keluhan', 'komplain', 'aduan',
  'lapor', 'laporan', 'korupsi', 'markus', 'markup', 'pungli', 'suap',
  'pungutan', 'menipu', 'tipu', 'tipuan', 'penipuan', 'bohong', 'dusta',
  'hoax', 'hoaks', 'fitnah', 'provokasi', 'provokator', 'hasut', 'menghasut',
  'turunkan', 'undur', 'lengser', 'cabut', 'membubarkan', 'sindir', 'sarkas',
  'sindiran', 'kritik', 'kritikus', 'kritikan', 'gara-gara', 'akibat',
  'dampak buruk', 'dampak negatif', 'sembuh', 'luka', 'perih', 'gatal',
  'ruam', 'biduran', 'anak saya keracunan', 'korban keracunan', 'keracunan massal',
  'mual muntah', 'dirawat intensif', 'katering berbahaya', 'makanan kotor',
  'pelayanan buruk', 'sangat buruk', 'tidak diawasi', 'berulang',
  'menelan korban jiwa', 'banyak korban', 'korban terus bertambah',
  'berjatuhan', 'stop programnya', 'cabut saja', 'hentikan program',
  'keracunan berulang', 'katering jorok', 'katering kotor',
];

export const NEUTRAL_HINTS: string[] = [
  'berita', 'informasi', 'info', 'laporan', 'data', 'fakta', 'faktual', 'statistik',
  'jumlah', 'publik', 'umum', 'pengumuman', 'rilis', 'siaran', 'keterangan',
  'menyatakan', 'mengatakan', 'kata', 'ujar', 'tutur', 'sampaikan',
  'menurut', 'berdasarkan', 'sesuai', 'rincian', 'detil', 'detail',
  'jadwal', 'waktu', 'tanggal', 'tempat', 'lokasi', 'provinsi', 'kota', 'kabupaten',
  'sekolah', 'prasekolah', 'siswa', 'murid', 'guru', 'sekolah dasar',
  'kementerian', 'kemenkes', 'bgn', 'badan gizi nasional', 'pemerintah', 'pemda',
  'dinkes', 'bpom', 'polisi', 'kepolisian', 'bnpb', 'tim', 'periode', 'fase',
  'tahap', 'tahapan', 'siklus', 'gelombang', 'total', 'persentase', 'rasio',
  'hitung', 'perhitungan', 'estimasi', 'proyeksi', 'jalur', 'saluran',
  'distribusi', 'penyaluran', 'logistik', 'sebut', 'sebutkan', 'papar',
  'paparan', 'ulas', 'tinjau', 'menunggu hasil', 'ditunda sementara',
  'penundaan', 'siaran pers', 'audit katering', 'tim medis', 'menangani korban',
  'dirilis', 'memeriksa', 'menyiapkan', 'diberitakan media', 'meminta transparansi',
  'menyatakan sedang', 'meninjau standar', 'berasal dari vendor',
];

function scoreList(textTokens: string[], wordList: string[]): number {
  const tokenSet = new Set(textTokens);
  let score = 0;
  for (const w of wordList) {
    const wTokens = w.split(/\s+/);
    if (wTokens.length === 1) {
      if (tokenSet.has(wTokens[0])) score += 1;
    } else {
      for (let i = 0; i <= textTokens.length - wTokens.length; i++) {
        let match = true;
        for (let j = 0; j < wTokens.length; j++) {
          if (textTokens[i + j] !== wTokens[j]) { match = false; break; }
        }
        if (match) { score += 2; break; }
      }
    }
  }
  return score;
}

export interface LexiconResult {
  label: 'Positif' | 'Negatif' | 'Netral';
  positiveScore: number;
  negativeScore: number;
  neutralScore: number;
}

export function lexiconLabel(tokens: string[]): LexiconResult {
  const positiveScore = scoreList(tokens, POSITIVE_LEXICON);
  const negativeScore = scoreList(tokens, NEGATIVE_LEXICON);
  const neutralScore = scoreList(tokens, NEUTRAL_HINTS) * 0.5;

  let label: 'Positif' | 'Negatif' | 'Netral' = 'Netral';
  if (positiveScore > negativeScore && positiveScore > neutralScore) {
    label = 'Positif';
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    label = 'Negatif';
  } else if (positiveScore === 0 && negativeScore === 0 && neutralScore > 0) {
    label = 'Netral';
  } else if (positiveScore === negativeScore && positiveScore > 0) {
    label = 'Netral';
  }
  return { label, positiveScore, negativeScore, neutralScore };
}
