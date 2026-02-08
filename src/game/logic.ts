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

export const isWinningGuess = (guess: string, solution: string) =>
  normalizeWord(guess) === normalizeWord(solution);

export const isGameOver = (attempt: number, status: 'playing' | 'won' | 'lost') => {
  if (status !== 'playing') return true;
  return attempt >= MAX_ATTEMPTS;
};
