import { HARD_MODE_ATTEMPTS, MAX_ATTEMPTS, WORD_LENGTH } from './constants';
import type { GuessEvaluation, LetterState } from './types';
import type { Language } from '../i18n';
import { getWordList, getWordSet } from './words';

export const normalizeWord = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

export const isValidWord = (value: string, language: Language) => {
  const normalized = normalizeWord(value);
  const wordSet = getWordSet(language);
  return normalized.length === WORD_LENGTH && wordSet.has(normalized);
};

export const getRandomWord = (language: Language) => {
  const list = getWordList(language);
  return list[Math.floor(Math.random() * list.length)];
};

export const evaluateGuess = (guess: string, solution: string): GuessEvaluation => {
  const cleanGuess = normalizeWord(guess).padEnd(WORD_LENGTH, ' ');
  const cleanSolution = normalizeWord(solution);
  const letters = cleanGuess.split('').slice(0, WORD_LENGTH);

  const states: LetterState[] = Array(WORD_LENGTH).fill('absent');
  const remainingCounts: Record<string, number> = {};

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    const letter = cleanSolution[i];
    remainingCounts[letter] = (remainingCounts[letter] ?? 0) + 1;
  }

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (letters[i] === cleanSolution[i]) {
      states[i] = 'correct';
      remainingCounts[letters[i]] -= 1;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (states[i] === 'correct') continue;
    const letter = letters[i];
    if (letter === ' ') {
      states[i] = 'empty';
      continue;
    }
    if (remainingCounts[letter] > 0) {
      states[i] = 'present';
      remainingCounts[letter] -= 1;
    }
  }

  return { letters, states };
};

export const buildEmptyEvaluation = (): GuessEvaluation => ({
  letters: Array(WORD_LENGTH).fill(''),
  states: Array(WORD_LENGTH).fill('empty')
});

export const getHardModeViolation = (
  guess: string,
  evaluations: GuessEvaluation[],
  formatPosition: (position: number, letter: string) => string,
  formatInclude: (count: number, letter: string) => string
): string | null => {
  if (evaluations.length === 0) return null;

  const requiredPositions = new Map<number, string>();
  const requiredCounts: Record<string, number> = {};

  evaluations.forEach((evaluation) => {
    const countsThisGuess: Record<string, number> = {};
    evaluation.letters.forEach((letter, index) => {
      const state = evaluation.states[index];
      if (!letter) return;
      if (state === 'correct') {
        requiredPositions.set(index, letter);
      }
      if (state === 'correct' || state === 'present') {
        countsThisGuess[letter] = (countsThisGuess[letter] ?? 0) + 1;
      }
    });

    Object.entries(countsThisGuess).forEach(([letter, count]) => {
      requiredCounts[letter] = Math.max(requiredCounts[letter] ?? 0, count);
    });
  });

  const cleanGuess = normalizeWord(guess).padEnd(WORD_LENGTH, ' ').slice(0, WORD_LENGTH);
  const guessLetters = cleanGuess.split('');

  for (const [index, letter] of requiredPositions.entries()) {
    if (guessLetters[index] !== letter) {
      return formatPosition(index + 1, letter);
    }
  }

  const guessCounts: Record<string, number> = {};
  guessLetters.forEach((letter) => {
    if (!letter || letter === ' ') return;
    guessCounts[letter] = (guessCounts[letter] ?? 0) + 1;
  });

  for (const [letter, required] of Object.entries(requiredCounts)) {
    if ((guessCounts[letter] ?? 0) < required) {
      return formatInclude(required, letter);
    }
  }

  return null;
};

export const isWinningGuess = (guess: string, solution: string) =>
  normalizeWord(guess) === normalizeWord(solution);

export const isGameOver = (
  attempt: number,
  status: 'playing' | 'won' | 'lost',
  hardMode: boolean
) => {
  if (status !== 'playing') return true;
  const maxAttempts = hardMode ? HARD_MODE_ATTEMPTS : MAX_ATTEMPTS;
  return attempt >= maxAttempts;
};
