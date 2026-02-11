import type { GuessEvaluation, LetterState } from './types';

const rank: Record<LetterState, number> = {
  empty: 0,
  absent: 1,
  present: 2,
  correct: 3
};

export const buildKeyboardState = (evaluations: GuessEvaluation[]) => {
  const state: Record<string, LetterState> = {};
  evaluations.forEach((evaluation) => {
    evaluation.letters.forEach((letter, index) => {
      const nextState = evaluation.states[index];
      if (!letter.trim()) return;
      const prev = state[letter] ?? 'empty';
      state[letter] = rank[nextState] > rank[prev] ? nextState : prev;
    });
  });
  return state;
};
