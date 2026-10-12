// TF-IDF Vectorizer with L2 normalization
// Supports incremental vocabulary building and transforming new documents.

export interface TfidfModel {
  vocabulary: Map<string, number>;
  idf: Float64Array;
  nDocs: number;
}

export function buildTfidfModel(documents: string[][]): TfidfModel {
  const docCount = documents.length;
  const df = new Map<string, number>(); // document frequency
  for (const tokens of documents) {
    const seen = new Set<string>();
    for (const t of tokens) {
      if (!seen.has(t)) {
        df.set(t, (df.get(t) || 0) + 1);
        seen.add(t);
      }
    }
  }
  const vocabulary = new Map<string, number>();
  const vocabList = Array.from(df.keys()).sort();
  vocabList.forEach((w, i) => vocabulary.set(w, i));
  const idf = new Float64Array(vocabList.length);
  for (let i = 0; i < vocabList.length; i++) {
    // smoothed idf
    idf[i] = Math.log((1 + docCount) / (1 + (df.get(vocabList[i]) || 0))) + 1;
  }
  return { vocabulary, idf, nDocs: docCount };
}

export function tfidfTransform(tokens: string[], model: TfidfModel): Float64Array {
  const vec = new Float64Array(model.vocabulary.size);
  const tf = new Map<number, number>();
  for (const t of tokens) {
    const idx = model.vocabulary.get(t);
    if (idx !== undefined) {
      tf.set(idx, (tf.get(idx) || 0) + 1);
    }
  }
  for (const [idx, count] of tf) {
    vec[idx] = count * model.idf[idx];
  }
  // L2 normalize
  let norm = 0;
  for (let i = 0; i < vec.length; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < vec.length; i++) vec[i] /= norm;
  }
  return vec;
}

export function topTfidfTerms(tokens: string[], model: TfidfModel, topN = 10): { term: string; weight: number }[] {
  const terms: { term: string; weight: number }[] = [];
  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) || 0) + 1);
  for (const [term, count] of counts) {
    const idx = model.vocabulary.get(term);
    if (idx !== undefined) {
      const weight = count * model.idf[idx];
      terms.push({ term, weight });
    }
  }
  terms.sort((a, b) => b.weight - a.weight);
  return terms.slice(0, topN);
}

export interface TfidfDetail {
  term: string;
  tf: number;
  idf: number;
  tfidf: number;
}

export function detailedTfidfTerms(tokens: string[], model: TfidfModel, topN = 15): TfidfDetail[] {
  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) || 0) + 1);
  const details: TfidfDetail[] = [];
  for (const [term, tf] of counts) {
    const idx = model.vocabulary.get(term);
    if (idx !== undefined) {
      const idf = model.idf[idx];
      details.push({ term, tf, idf, tfidf: tf * idf });
    }
  }
  details.sort((a, b) => b.tfidf - a.tfidf);
  return details.slice(0, topN);
}
