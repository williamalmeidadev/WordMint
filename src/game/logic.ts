import { MAX_ATTEMPTS, WORD_LENGTH } from './constants';
import type { GuessEvaluation, LetterState } from './types';
import { WORDS } from '../data/words';

const WORD_SET = new Set(WORDS);

export const normalizeWord = (value: string) => value.toUpperCase().replace(/[^A-Z]/g, '');

export const isValidWord = (value: string) => {
  const normalized = normalizeWord(value);
  return normalized.length === WORD_LENGTH && WORD_SET.has(normalized);
};

export const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

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

export const getHardModeViolation = (guess: string, evaluations: GuessEvaluation[]): string | null => {
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
      return `Hard mode: position ${index + 1} must be ${letter}`;
    }
  }

  const guessCounts: Record<string, number> = {};
  guessLetters.forEach((letter) => {
    if (!letter || letter === ' ') return;
    guessCounts[letter] = (guessCounts[letter] ?? 0) + 1;
  });

  for (const [letter, required] of Object.entries(requiredCounts)) {
    if ((guessCounts[letter] ?? 0) < required) {
      const suffix = required > 1 ? `'${letter}'s` : `'${letter}'`;
      return `Hard mode: include at least ${required} ${suffix}`;
    }
  }

  return null;
};

export const isWinningGuess = (guess: string, solution: string) =>
  normalizeWord(guess) === normalizeWord(solution);

export const isGameOver = (attempt: number, status: 'playing' | 'won' | 'lost') => {
  if (status !== 'playing') return true;
  return attempt >= MAX_ATTEMPTS;
};
