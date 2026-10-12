// Slang / informal Indonesian word normalization dictionary (MBG-domain aware)
export const SLANG_DICT: Record<string, string> = {
  // Negation / tidak
  'gak': 'tidak', 'ga': 'tidak', 'nggak': 'tidak', 'ngga': 'tidak', 'gada': 'tidak ada',
  'tdk': 'tidak', 'dkk': 'tidak', 'kagak': 'tidak', 'ndak': 'tidak', 'kaga': 'tidak',
  // Common abbreviations
  'yg': 'yang', 'dgn': 'dengan', 'krn': 'karena', 'krna': 'karena', 'utk': 'untuk',
  'sdh': 'sudah', 'udh': 'sudah', 'udah': 'sudah', 'blm': 'belum', 'blum': 'belum',
  'bgt': 'banget', 'sngt': 'sangat', 'skali': 'sekali',
  'klo': 'kalau', 'kalo': 'kalau', 'klau': 'kalau', 'kpn': 'kapan',
  'bs': 'bisa', 'bsa': 'bisa', 'bkn': 'bukan', 'dr': 'dari', 'dlm': 'dalam', 'ttg': 'tentang',
  'trs': 'terus', 'trus': 'terus', 'jg': 'juga', 'jga': 'juga', 'tp': 'tapi', 'tpi': 'tapi',
  'ap': 'apa', 'pa': 'apa',
  // Questions
  'gimana': 'bagaimana', 'gmn': 'bagaimana', 'gimn': 'bagaimana',
  'kenapa': 'kenapa', 'knapa': 'kenapa', 'knp': 'kenapa',
  // Verbs
  'bikin': 'membuat', 'buat': 'membuat', 'ngbuat': 'membuat',
  'ngomong': 'berbicara', 'ngmg': 'berbicara', 'bilang': 'mengatakan', 'blg': 'mengatakan',
  // Feelings
  'ngeri': 'menakutkan', 'serem': 'menakutkan',
  'males': 'malas', 'mau': 'ingin', 'mw': 'ingin', 'mo': 'ingin',
  // Particles (removed)
  'nih': 'ini', 'tsb': 'tersebut', 'dsb': 'dan sebagainya', 'dll': 'dan lain lain',
  'sih': '', 'dong': '', 'donk': '',
  // Insults
  'gbk': 'bodoh', 'goblok': 'bodoh',
  // Comparisons
  'bgtu': 'begitu', 'gitu': 'begitu', 'kyk': 'seperti', 'kayak': 'seperti',
  'kyak': 'seperti', 'kaya': 'seperti', 'sampe': 'sampai', 'ampe': 'sampai',
  // Time
  'kpd': 'kepada', 'dlu': 'dulu', 'skrg': 'sekarang', 'skarang': 'sekarang',
  'td': 'tadi', 'bru': 'baru', 'br': 'baru',
  // Emphasis
  'emang': 'memang', 'mmg': 'memang',
  'n': 'dan', 'cm': 'hanya', 'cuma': 'hanya',
  'aneh': 'aneh', 'bnr': 'benar', 'bner': 'benar', 'bener': 'benar',
  'parah': 'parah', 'prh': 'parah', 'mnt': 'minta', 'mng': 'memang',
  'bnyk': 'banyak', 'byk': 'banyak',
  // Health / poisoning domain
  'skit': 'sakit', 'sick': 'sakit', 'skt': 'sakit',
  'mual': 'mual', 'muntah': 'muntah', 'demam': 'demam', 'diare': 'diare',
  'keracunan': 'keracunan', 'racun': 'racun',
  // MBG domain
  'mbg': 'makan bergizi gratis', 'katering': 'katering', 'catering': 'katering',
  'makan': 'makan', 'gratis': 'gratis', 'bergizi': 'bergizi', 'makanan': 'makanan',
  'mknan': 'makanan', 'mknn': 'makanan',
  'anak': 'anak', 'anak2': 'anak', 'anak-anak': 'anak',
  'sekolah': 'sekolah', 'sklh': 'sekolah', 'prasekolah': 'prasekolah',
  // Evaluation
  'mending': 'lebih baik', 'lbh': 'lebih',
  'wajar': 'wajar', 'wjr': 'wajar', 'salah': 'salah', 'slh': 'salah',
  'benerin': 'memperbaiki', 'perbaiki': 'memperbaiki', 'perbaikin': 'memperbaiki',
  // Government
  'org': 'orang', 'prg': 'pemerintah', 'pemrogram': 'pemerintah',
  'pemerintah': 'pemerintah', 'pmrh': 'pemerintah', 'pmpt': 'pemerintah',
  'evaluasi': 'evaluasi', 'eval': 'evaluasi', 'investigasi': 'investigasi',
  'tanggungjawab': 'tanggung jawab', 'tanggung': 'tanggung',
  'jwb': 'jawab', 'jawab': 'jawab', 'jawaban': 'jawaban',
  // Positive reactions
  'bg': 'bagus', 'bgs': 'bagus', 'bgus': 'bagus', 'bagus': 'bagus',
  'mantap': 'mantap', 'mntap': 'mantap', 'keren': 'keren',
  'sip': 'baik', 'ok': 'baik', 'oke': 'baik', 'okey': 'baik',
  'setuju': 'setuju', 'stju': 'setuju', 'dukung': 'mendukung', 'dkung': 'mendukung',
  'dukungan': 'dukungan', 'stop': 'hentikan', 'henti': 'hentikan',
  'perhatian': 'perhatian', 'perhatiin': 'perhatikan', 'phatian': 'perhatian',
  'bahaya': 'bahaya', 'bhy': 'bahaya', 'bhyaya': 'bahaya',
  'mati': 'mati', 'meninggal': 'meninggal', 'wafat': 'wafat',
  // News / neutral
  'news': 'berita', 'berita': 'berita', 'info': 'informasi', 'informasi': 'informasi',
  'laporan': 'laporan', 'lporan': 'laporan', 'dtk': 'detik', 'rebut': 'merebut',
  'jadwal': 'jadwal', 'jdw': 'jadwal', 'ramai': 'ramai', 'rmai': 'ramai',
  'viral': 'viral', 'virall': 'viral', 'trending': 'trending', 'tranding': 'trending',
  'tren': 'tren',
  // Family
  'kk': 'kakak', 'adek': 'adik', 'adik': 'adik',
  'bapak': 'bapak', 'ibu': 'ibu', 'guru': 'guru', 'ortu': 'orang tua',
  'wali': 'wali', 'murid': 'murid', 'siswa': 'siswa', 'mrd': 'murid',
  // Facilities
  'prasarana': 'prasarana', 'fasilitas': 'fasilitas', 'faslitas': 'fasilitas',
  'bersih': 'bersih', 'kotor': 'kotor', 'higiene': 'higienis', 'higienis': 'higienis',
  'baik': 'baik', 'jelek': 'jelek', 'jl': 'jelek', 'buruk': 'buruk',
  'memuaskan': 'memuaskan', 'kecewa': 'kecewa', 'kcwa': 'kecewa',
  'pelayanan': 'pelayanan', 'layan': 'pelayanan', 'mutu': 'mutu',
  'kualitas': 'kualitas', 'kw': 'kualitas', 'standar': 'standar', 'stdr': 'standar',
  'program': 'program', 'prog': 'program', 'progam': 'program',
  'negara': 'negara', 'negera': 'negara', 'bantuan': 'bantuan', 'bntuan': 'bantuan',
  'sosial': 'sosial', 'keluarga': 'keluarga', 'klrga': 'keluarga',
  'lapor': 'lapor', 'lpor': 'lapor',
  // Medical
  'puskesmas': 'puskesmas', 'rs': 'rumah sakit', 'rumahsakit': 'rumah sakit',
  'rumah': 'rumah', 'sakit': 'sakit',
  'dirawat': 'dirawat', 'rawat': 'rawat', 'perawatan': 'perawatan',
  'korban': 'korban', 'krbn': 'korban', 'jiwa': 'jiwa',
  'insiden': 'insiden', 'kejadian': 'kejadian', 'kjadian': 'kejadian',
  'kasus': 'kasus', 'kassus': 'kasus', 'peristiwa': 'peristiwa',
  'berbahaya': 'berbahaya', 'brbahaya': 'berbahaya',
  // Food
  'daging': 'daging', 'nasi': 'nasi', 'sayur': 'sayur', 'susu': 'susu',
  'telur': 'telur', 'tlur': 'telur', 'buah': 'buah', 'snack': 'snack', 'cemilan': 'cemilan',
  'expired': 'kadaluarsa', 'kadaluarsa': 'kadaluarsa', 'kadaluwarsa': 'kadaluarsa',
  'busuk': 'busuk', 'bsuk': 'busuk', 'basi': 'basi',
  'sehat': 'sehat', 'sht': 'sehat', 'fit': 'sehat',
  // Misinformation
  'covid': 'covid', 'pandemi': 'pandemi', 'endemi': 'endemi',
  'hoax': 'hoax', 'hoaks': 'hoax', 'fitnah': 'fitnah',
  'faktual': 'faktual', 'data': 'data', 'dt': 'data',
  'valid': 'valid', 'vd': 'valid', 'fakta': 'fakta', 'fkta': 'fakta',
  'audit': 'audit', 'inv': 'investigasi',
  'transparan': 'transparan', 'trnsparan': 'transparan', 'terbuka': 'terbuka',
  'publik': 'publik', 'pblk': 'publik', 'umum': 'umum', 'masyarakat': 'masyarakat',
  'msyrkt': 'masyarakat', 'rakyat': 'rakyat', 'rkyat': 'rakyat',
  // Response
  'respons': 'respons', 'respon': 'respons', 'rspn': 'respons',
  'cepat': 'cepat', 'cpt': 'cepat', 'lambat': 'lambat', 'lmbt': 'lambat',
  'tanggap': 'tanggap', 'tnggp': 'tanggap', 'mundur': 'mundur', 'mndur': 'mundur',
  // Actions
  'cabut': 'menarik', 'cbt': 'menarik', 'tarik': 'menarik', 'trik': 'menarik',
  'lanjut': 'lanjut', 'lnjt': 'lanjut', 'lanjutkan': 'melanjutkan',
  'hentikan': 'menghentikan', 'hnti': 'menghentikan',
  'suspend': 'menangguhkan', 'tunda': 'menunda', 'tnd': 'menunda',
  'selidik': 'menyelidiki', 'lidik': 'menyelidiki',
  'revision': 'revisi', 'revisi': 'revisi',
  'ganti': 'mengganti', 'gnti': 'mengganti', 'tiganti': 'mengganti',
  'tagih': 'menagih', 'tgh': 'menagih', 'tuntut': 'menuntut', 'tntut': 'menuntut',
  'tjw': 'tanggung jawab',
  // Legal
  'perdata': 'perdata', 'pidana': 'pidana', 'hukum': 'hukum', 'hkm': 'hukum',
  'adil': 'adil', 'dl': 'adil', 'hukumann': 'hukuman', 'hkmn': 'hukuman',
  // Institutions
  'bgn': 'badan gizi nasional', 'bgnas': 'badan gizi nasional',
  'bgnasional': 'badan gizi nasional', 'badangizi': 'badan gizi nasional',
  'menkominfo': 'menteri komunikasi', 'kemenkes': 'kementerian kesehatan',
  'bpom': 'bpom', 'pom': 'bpom', 'dinkes': 'dinkes kesehatan',
  // Review
  'tinjau': 'meninjau', 'tnjau': 'meninjau', 'review': 'meninjau',
  'coba': 'mencoba', 'cb': 'mencoba', 'tes': 'menguji', 'test': 'menguji',
  'uji': 'menguji', 'sample': 'sampel', 'sampel': 'sampel',
  'lab': 'laboratorium', 'laboratorium': 'laboratorium',
  'cek': 'memeriksa', 'ck': 'memeriksa', 'periksa': 'memeriksa', 'priksa': 'memeriksa',
  // Sanctions
  'sanksi': 'sanksi', 'sksi': 'sanksi', 'denda': 'denda', 'dnda': 'denda',
  // Labels
  'predikat': 'predikat', 'cap': 'cap', 'label': 'label', 'lbl': 'label',
  'positif': 'positif', 'pstf': 'positif', 'negatif': 'negatif', 'ngtf': 'negatif',
  'netral': 'netral', 'ntrl': 'netral', 'neutral': 'netral',
};

export function normalizeSlang(token: string): string {
  const lower = token.toLowerCase();
  if (SLANG_DICT[lower] !== undefined) return SLANG_DICT[lower];
  return lower;
}

export function normalizeTokens(tokens: string[]): string[] {
  return tokens
    .map(normalizeSlang)
    .filter((t) => t.length > 0);
}
