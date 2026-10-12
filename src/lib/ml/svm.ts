// Support Vector Machine - Linear Kernel (One-vs-Rest for multi-class)
// Trained via simplified Pegasos (primal SGD) algorithm.
// f(x) = w^T x + b  -> decision margin score

import type { TfidfModel } from './tfidf';
import { tfidfTransform } from './tfidf';
import type { LexiconResult } from '../nlp/lexicon';

export type SvmLabel = 'Positif' | 'Negatif' | 'Netral';

export interface BinarySvm {
  w: Float64Array;
  b: number;
  label: SvmLabel;
}

export interface MultiClassSvm {
  models: BinarySvm[];
  classes: SvmLabel[];
  trainAccuracy: number;
  testAccuracy: number;
  confusionMatrix: number[][]; // [actual][predicted]
  precision: Record<SvmLabel, number>;
  recall: Record<SvmLabel, number>;
  f1: Record<SvmLabel, number>;
  accuracy: number;
  trainSize: number;
  testSize: number;
  trainDistribution: Record<SvmLabel, number>;
  testDistribution: Record<SvmLabel, number>;
  support: Record<SvmLabel, number>; // test support per class
}

// Train a single binary SVM with Pegasos SGD
function trainBinarySvm(
  X: Float64Array[],
  y: number[], // +1 for positive class, -1 for negative
  lambda: number,
  epochs: number
): BinarySvm {
  const dim = X[0].length;
  const w = new Float64Array(dim);
  let b = 0;
  const n = X.length;
  const t0 = 1;
  for (let epoch = 0; epoch < epochs; epoch++) {
    // shuffle indices
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    for (let k = 0; k < n; k++) {
      const idx = indices[k];
      const t = t0 + epoch * n + k;
      const eta = 1 / (lambda * t);
      const x = X[idx];
      const yi = y[idx];
      // margin = yi * (w . x + b)
      let dot = 0;
      for (let d = 0; d < dim; d++) dot += w[d] * x[d];
      const margin = yi * (dot + b);
      // weight decay
      const scale = 1 - eta * lambda;
      for (let d = 0; d < dim; d++) w[d] *= scale;
      b *= scale;
      if (margin < 1) {
        for (let d = 0; d < dim; d++) w[d] += eta * yi * x[d];
        b += eta * yi;
      }
    }
  }
  return { w, b, label: 'Positif' }; // label assigned by caller
}

export function trainSvm(
  documents: string[][],
  labels: SvmLabel[],
  model: TfidfModel,
  options?: { testRatio?: number; lambda?: number; epochs?: number; seed?: number }
): MultiClassSvm {
  const testRatio = options?.testRatio ?? 0.2;
  const lambda = options?.lambda ?? 0.01;
  const epochs = options?.epochs ?? 50;
  const seed = options?.seed ?? 42;

  // simple seeded shuffle for reproducibility
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };

  const n = documents.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const testSize = Math.floor(n * testRatio);
  const testIdx = indices.slice(0, testSize);
  const trainIdx = indices.slice(testSize);

  const classes: SvmLabel[] = ['Positif', 'Negatif', 'Netral'];
  const models: BinarySvm[] = [];

  const XTrain = trainIdx.map((i) => tfidfTransform(documents[i], model));
  const yTrain = trainIdx.map((i) => labels[i]);

  for (const cls of classes) {
    const y = yTrain.map((l) => (l === cls ? 1 : -1));
    const m = trainBinarySvm(XTrain, y, lambda, epochs);
    m.label = cls;
    models.push(m);
  }

  // Evaluate
  const labelIndex = (l: SvmLabel) => classes.indexOf(l);
  const confusion: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let trainCorrect = 0;
  for (let i = 0; i < trainIdx.length; i++) {
    const pred = predictRaw(XTrain[i], models);
    if (pred === yTrain[i]) trainCorrect++;
  }
  let testCorrect = 0;
  for (const i of testIdx) {
    const x = tfidfTransform(documents[i], model);
    const pred = predictRaw(x, models);
    const actual = labels[i];
    if (pred === actual) testCorrect++;
    confusion[labelIndex(actual)][labelIndex(pred)]++;
  }

  const trainAccuracy = trainIdx.length > 0 ? trainCorrect / trainIdx.length : 0;
  const testAccuracy = testIdx.length > 0 ? testCorrect / testIdx.length : 0;
  const accuracy = testAccuracy;

  const precision: Record<SvmLabel, number> = { Positif: 0, Negatif: 0, Netral: 0 };
  const recall: Record<SvmLabel, number> = { Positif: 0, Negatif: 0, Netral: 0 };
  const f1: Record<SvmLabel, number> = { Positif: 0, Negatif: 0, Netral: 0 };
  const support: Record<SvmLabel, number> = { Positif: 0, Negatif: 0, Netral: 0 };
  for (let c = 0; c < 3; c++) {
    const tp = confusion[c][c];
    const fp = confusion[0][c] + confusion[1][c] + confusion[2][c] - tp;
    const fn = confusion[c][0] + confusion[c][1] + confusion[c][2] - tp;
    support[classes[c]] = confusion[c][0] + confusion[c][1] + confusion[c][2];
    precision[classes[c]] = tp + fp > 0 ? tp / (tp + fp) : 0;
    recall[classes[c]] = tp + fn > 0 ? tp / (tp + fn) : 0;
    f1[classes[c]] = precision[classes[c]] + recall[classes[c]] > 0
      ? 2 * (precision[classes[c]] * recall[classes[c]]) / (precision[classes[c]] + recall[classes[c]])
      : 0;
  }

  // Compute train/test distributions
  const trainDistribution: Record<SvmLabel, number> = { Positif: 0, Negatif: 0, Netral: 0 };
  const testDistribution: Record<SvmLabel, number> = { Positif: 0, Negatif: 0, Netral: 0 };
  for (const i of trainIdx) trainDistribution[labels[i]]++;
  for (const i of testIdx) testDistribution[labels[i]]++;

  return {
    models, classes, trainAccuracy, testAccuracy, confusionMatrix: confusion,
    precision, recall, f1, accuracy,
    trainSize: trainIdx.length, testSize: testIdx.length,
    trainDistribution, testDistribution, support,
  };
}

function predictRaw(x: Float64Array, models: BinarySvm[]): SvmLabel {
  let bestScore = -Infinity;
  let bestLabel: SvmLabel = models[0].label;
  for (const m of models) {
    let dot = 0;
    for (let d = 0; d < x.length; d++) dot += m.w[d] * x[d];
    const score = dot + m.b;
    if (score > bestScore) {
      bestScore = score;
      bestLabel = m.label;
    }
  }
  return bestLabel;
}

export interface SvmPrediction {
  label: SvmLabel;
  marginScores: Record<SvmLabel, number>;
  confidence: Record<SvmLabel, number>; // softmax-normalized percentages
}

export function predict(tokens: string[], model: TfidfModel, svm: MultiClassSvm): SvmPrediction {
  const x = tfidfTransform(tokens, model);
  const marginScores: Record<SvmLabel, number> = { Positif: 0, Negatif: 0, Netral: 0 };
  for (const m of svm.models) {
    let dot = 0;
    for (let d = 0; d < x.length; d++) dot += m.w[d] * x[d];
    marginScores[m.label] = dot + m.b;
  }
  // softmax for confidence
  const vals = svm.classes.map((c) => marginScores[c]);
  const maxV = Math.max(...vals);
  const exps = vals.map((v) => Math.exp(v - maxV));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const confidence: Record<SvmLabel, number> = { Positif: 0, Negatif: 0, Netral: 0 };
  svm.classes.forEach((c, i) => {
    confidence[c] = (exps[i] / sumExp) * 100;
  });
  let bestLabel: SvmLabel = svm.classes[0];
  let bestScore = -Infinity;
  for (const c of svm.classes) {
    if (marginScores[c] > bestScore) {
      bestScore = marginScores[c];
      bestLabel = c;
    }
  }
  return { label: bestLabel, marginScores, confidence };
}

// Fallback prediction using lexicon scores when SVM is not yet trained
export function lexiconFallback(lex: LexiconResult): SvmPrediction {
  const { label, positiveScore, negativeScore, neutralScore } = lex;
  const total = positiveScore + negativeScore + neutralScore;
  const confidence: Record<SvmLabel, number> = { Positif: 0, Negatif: 0, Netral: 0 };
  if (total > 0) {
    confidence.Positif = (positiveScore / total) * 100;
    confidence.Negatif = (negativeScore / total) * 100;
    confidence.Netral = (neutralScore / total) * 100;
  } else {
    confidence.Netral = 100;
  }
  const marginScores: Record<SvmLabel, number> = {
    Positif: positiveScore,
    Negatif: -negativeScore,
    Netral: neutralScore * 0.5,
  };
  return { label, marginScores, confidence };
}
