import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
import { generateSeedDataset, generateRawDataset500, deduplicateRaw, type SeedRecord } from '@/lib/ml/dataset';
import type { RawRecord } from '@/lib/ml/dataset';
import { runNlpPipeline, type NlpStepResult } from '@/lib/nlp/pipeline';
import { lexiconLabel } from '@/lib/nlp/lexicon';
import { buildTfidfModel, topTfidfTerms, detailedTfidfTerms, type TfidfModel, type TfidfDetail } from '@/lib/ml/tfidf';
import { trainSvm, predict, lexiconFallback, type MultiClassSvm, type SvmLabel, type SvmPrediction } from '@/lib/ml/svm';

export interface ProcessedRecord extends RawRecord {
  label: SvmLabel;
  nlp: NlpStepResult;
  lexicon: { positiveScore: number; negativeScore: number; neutralScore: number };
}

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'error';
}

export interface PredictSentimentResult {
  sentiment: SvmLabel;
  confidence: Record<SvmLabel, number>;
  marginScore: number;
  steps: {
    cleanedText: string;
    tokens: string[];
    normalizedTokens: string[];
    stemmedText: string;
    topTfidfTerms: { term: string; weight: number }[];
  };
  nlp: NlpStepResult;
  prediction: SvmPrediction;
  topTerms: { term: string; weight: number }[];
  tfidfDetails: TfidfDetail[];
  source: 'svm' | 'lexicon-fallback';
}

interface EngineState {
  records: ProcessedRecord[];
  tfidfModel: TfidfModel;
  svm: MultiClassSvm | null;
  toasts: ToastMessage[];
  isTraining: boolean;
  isReady: boolean;
  importRawRecords: (raw: RawRecord[]) => number;
  relabelLexicon: () => void;
  updateRecordLabel: (id: string, label: SvmLabel) => void;
  deleteRecord: (id: string) => void;
  predictText: (tokens: string[]) => SvmPrediction | null;
  predictSentiment: (textInput: string) => PredictSentimentResult | null;
  exportRawDataset500: () => void;
  pushToast: (text: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: number) => void;
}

const EngineContext = createContext<EngineState | undefined>(undefined);

function processRecord(rec: SeedRecord | RawRecord): ProcessedRecord {
  const nlp = runNlpPipeline(rec.komentar_mentah);
  const lex = lexiconLabel(nlp.stemmedTokens);
  const label: SvmLabel = 'label' in rec ? (rec as SeedRecord).label : lex.label;
  return {
    ...rec,
    label,
    nlp,
    lexicon: { positiveScore: lex.positiveScore, negativeScore: lex.negativeScore, neutralScore: lex.neutralScore },
  };
}

export function EngineProvider({ children }: { children: ReactNode }) {
  // Initialize with deduplicated seed dataset (~272 unique records from 500 raw)
  const [records, setRecords] = useState<ProcessedRecord[]>(() =>
    generateSeedDataset(500).map(processRecord)
  );
  const [tfidfModel, setTfidfModel] = useState<TfidfModel>(() =>
    buildTfidfModel(records.map((r) => r.nlp.stemmedTokens))
  );
  const [svm, setSvm] = useState<MultiClassSvm | null>(null);
  const [isTraining, setIsTraining] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    setIsTraining(true);
    setIsReady(false);
    const docs = records.map((r) => r.nlp.stemmedTokens);
    const labels = records.map((r) => r.label);
    const model = buildTfidfModel(docs);
    setTfidfModel(model);
    const timer = setTimeout(() => {
      const trained = trainSvm(docs, labels, model, { testRatio: 0.2, lambda: 0.01, epochs: 50, seed: 42 });
      setSvm(trained);
      setIsTraining(false);
      setIsReady(true);
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  const pushToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Import: deduplicate raw records, then replace dataset with deduped set
  const importRawRecords = useCallback((raw: RawRecord[]): number => {
    const deduped = deduplicateRaw(raw);
    const processed = deduped.map(processRecord);
    setRecords(processed);
    return processed.length;
  }, []);

  const relabelLexicon = useCallback(() => {
    setRecords((prev) =>
      prev.map((r) => {
        const lex = lexiconLabel(r.nlp.stemmedTokens);
        return { ...r, label: lex.label, lexicon: { positiveScore: lex.positiveScore, negativeScore: lex.negativeScore, neutralScore: lex.neutralScore } };
      })
    );
  }, []);

  const updateRecordLabel = useCallback((id: string, label: SvmLabel) => {
    setRecords((prev) => prev.map((r) => (r.id_tweet === id ? { ...r, label } : r)));
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id_tweet !== id));
  }, []);

  const predictText = useCallback(
    (tokens: string[]): SvmPrediction | null => {
      if (!svm || !tfidfModel) return null;
      try {
        return predict(tokens, tfidfModel, svm);
      } catch {
        return null;
      }
    },
    [svm, tfidfModel]
  );

  const predictSentiment = useCallback(
    (textInput: string): PredictSentimentResult | null => {
      if (!textInput || !textInput.trim()) return null;

      let nlp: NlpStepResult;
      try {
        nlp = runNlpPipeline(textInput);
      } catch {
        return null;
      }

      const stemmed = nlp.stemmedTokens;

      let prediction: SvmPrediction | null = null;
      let source: 'svm' | 'lexicon-fallback' = 'svm';

      if (svm && tfidfModel) {
        try {
          prediction = predict(stemmed, tfidfModel, svm);
        } catch {
          prediction = null;
        }
      }

      if (!prediction) {
        source = 'lexicon-fallback';
        const lex = lexiconLabel(stemmed);
        prediction = lexiconFallback(lex);
      }

      let topTerms: { term: string; weight: number }[] = [];
      try {
        topTerms = topTfidfTerms(stemmed, tfidfModel, 10);
      } catch {
        topTerms = [];
      }

      let tfidfDetails: TfidfDetail[] = [];
      try {
        tfidfDetails = detailedTfidfTerms(stemmed, tfidfModel, 15);
      } catch {
        tfidfDetails = [];
      }

      const marginScore = prediction.marginScores[prediction.label];

      return {
        sentiment: prediction.label,
        confidence: prediction.confidence,
        marginScore,
        steps: {
          cleanedText: nlp.cleaned,
          tokens: nlp.tokens,
          normalizedTokens: nlp.normalizedTokens,
          stemmedText: nlp.stemmedTokens.join(' '),
          topTfidfTerms: topTerms,
        },
        nlp,
        prediction,
        topTerms,
        tfidfDetails,
        source,
      };
    },
    [svm, tfidfModel]
  );

  const exportRawDataset500 = useCallback(() => {
    const raw500 = generateRawDataset500();
    const csvHeader = 'id_tweet,created_at,username,komentar_mentah,label\n';
    const csvBody = raw500.map((r) =>
      `"${r.id_tweet}","${r.created_at}","${r.username}","${r.komentar_mentah.replace(/"/g, '""')}","${r.label}"`
    ).join('\n');
    const blob = new Blob([csvHeader + csvBody], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dataset_mentah_mbg_500.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const value = useMemo(
    () => ({
      records, tfidfModel, svm, toasts, isTraining, isReady,
      importRawRecords, relabelLexicon, updateRecordLabel, deleteRecord,
      predictText, predictSentiment, exportRawDataset500, pushToast, dismissToast,
    }),
    [records, tfidfModel, svm, toasts, isTraining, isReady, importRawRecords, relabelLexicon, updateRecordLabel, deleteRecord, predictText, predictSentiment, exportRawDataset500, pushToast, dismissToast]
  );

  return <EngineContext.Provider value={value}>{children}</EngineContext.Provider>;
}

export function useEngine(): EngineState {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error('useEngine must be used within EngineProvider');
  return ctx;
}

export function useSentimentCounts() {
  const { records } = useEngine();
  return useMemo(() => {
    let positif = 0, negatif = 0, netral = 0;
    for (const r of records) {
      if (r.label === 'Positif') positif++;
      else if (r.label === 'Negatif') negatif++;
      else netral++;
    }
    return { total: records.length, positif, negatif, netral };
  }, [records]);
}
