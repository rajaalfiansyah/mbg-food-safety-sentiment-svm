import { removeStopwords } from './stopwords';
import { normalizeTokens } from './slang';
import { stemTokens } from './stemmer';

export interface NlpStepResult {
  caseFolded: string;
  cleaned: string;
  tokens: string[];
  normalizedTokens: string[];
  noStopwords: string[];
  stemmedTokens: string[];
  finalText: string;
}

// Case folding + cleaning URL/mention/hashtag/numbers/symbols
export function caseFoldAndClean(text: string): { caseFolded: string; cleaned: string } {
  const caseFolded = text.toLowerCase();
  let cleaned = caseFolded;
  cleaned = cleaned.replace(/https?:\/\/\S+/g, ' ');       // URLs
  cleaned = cleaned.replace(/www\.\S+/g, ' ');             // www URLs
  cleaned = cleaned.replace(/@\w+/g, ' ');                 // mentions
  cleaned = cleaned.replace(/#\w+/g, ' ');                 // hashtags
  cleaned = cleaned.replace(/\d+/g, ' ');                  // numbers
  cleaned = cleaned.replace(/[^\w\s]/g, ' ');              // symbols/punct
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return { caseFolded, cleaned };
}

export function tokenize(text: string): string[] {
  return text.split(/\s+/).filter((t) => t.length > 0);
}

export function runNlpPipeline(rawText: string): NlpStepResult {
  const { caseFolded, cleaned } = caseFoldAndClean(rawText);
  const tokens = tokenize(cleaned);
  const normalizedTokens = normalizeTokens(tokens);
  const noStopwords = removeStopwords(normalizedTokens);
  const stemmedTokens = stemTokens(noStopwords);
  const finalText = stemmedTokens.join(' ');
  return {
    caseFolded,
    cleaned,
    tokens,
    normalizedTokens,
    noStopwords,
    stemmedTokens,
    finalText,
  };
}
