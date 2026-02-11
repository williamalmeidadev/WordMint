import type { Language } from '../i18n';
import { WORDS as WORDS_EN } from '../data/words';
import { WORDS_PT } from '../data/words-pt';

const WORD_LISTS: Record<Language, string[]> = {
  en: WORDS_EN,
  pt: WORDS_PT
};

const WORD_SETS: Record<Language, Set<string>> = {
  en: new Set(WORDS_EN),
  pt: new Set(WORDS_PT)
};

export const getWordList = (language: Language) => WORD_LISTS[language] ?? WORDS_EN;

export const getWordSet = (language: Language) => WORD_SETS[language] ?? WORD_SETS.en;
