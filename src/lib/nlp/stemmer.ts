// Lightweight Indonesian prefix/suffix stemmer (Sastrawi-inspired, rule-based)
// Full Sastrawi dictionary is too large for a browser bundle; this implements
// the core morphological rules covering the majority of derivational affixes.

const PARTICLES = ['lah', 'kah', 'nah', 'tah', 'pun', 'nya'];
const POSSESSIVE_PRONOUNS = ['ku', 'mu', 'nya', 'kau'];
const FIRST_ORDER_PREFIX = ['meng', 'meny', 'men', 'mem', 'me', 'peng', 'peny', 'pen', 'pem', 'di', 'ter', 'ke'];
const SECOND_ORDER_PREFIX = ['ber', 'ter', 'di', 'ke'];
const SPECIAL_SUFFIX = ['kan', 'an', 'i'];
const DERIVATIONAL_PREFIX = ['meng', 'meny', 'men', 'mem', 'me', 'peng', 'peny', 'pen', 'pem', 'ber', 'ter', 'di', 'ke', 'pe', 'se'];

function removeInflectionalSuffixes(word: string): { word: string; removed: string[] } {
  let w = word;
  const removed: string[] = [];
  // remove possessive pronouns
  for (const p of POSSESSIVE_PRONOUNS) {
    if (w.endsWith(p) && w.length > p.length + 2) {
      w = w.slice(0, -p.length);
      removed.push(p);
      break;
    }
  }
  // remove particles
  for (const p of PARTICLES) {
    if (w.endsWith(p) && w.length > p.length + 2) {
      w = w.slice(0, -p.length);
      removed.push(p);
      break;
    }
  }
  return { word: w, removed };
}

function removeDerivationalSuffix(word: string): string {
  for (const s of SPECIAL_SUFFIX) {
    if (word.endsWith(s) && word.length > s.length + 2) {
      return word.slice(0, -s.length);
    }
  }
  return word;
}

function removePrefixes(word: string): string {
  let w = word;
  for (const p of DERIVATIONAL_PREFIX) {
    if (w.startsWith(p) && w.length > p.length + 2) {
      const stem = w.slice(p.length);
      // apply phonological rules for me/men/meng/mem prefixes
      if (p === 'men' && /^[a|i|u|e|o]/.test(stem) === false) {
        // men + consonant -> keep stem (e.g. menulis -> tulis via meny? handled by meny)
        return stem;
      }
      if (p === 'meny') {
        // meny + k -> nyk? Actually menyapu -> sapu (s restored)
        return 's' + stem;
      }
      if (p === 'peny') {
        return 's' + stem;
      }
      return stem;
    }
  }
  return w;
}

export function stem(word: string): string {
  if (word.length <= 3) return word;
  const step1 = removeInflectionalSuffixes(word);
  let w = step1.word;
  // remove derivational suffix
  w = removeDerivationalSuffix(w);
  // remove prefix
  w = removePrefixes(w);
  // second pass: if still has suffix, try again
  if (w.length <= 3) return word; // too short, revert
  return w;
}

export function stemTokens(tokens: string[]): string[] {
  return tokens.map(stem);
}
