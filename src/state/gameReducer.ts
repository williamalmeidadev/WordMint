import { HARD_MODE_ATTEMPTS, WORD_LENGTH } from '../game/constants';
import type { GameStatus, GuessEvaluation } from '../game/types';
import type { Language } from '../i18n';

export type GameState = {
  solution: string;
  guesses: string[];
  evaluations: GuessEvaluation[];
  currentGuess: string;
  status: GameStatus;
  attemptIndex: number;
  message: string | null;
  colorBlindMode: boolean;
  hardMode: boolean;
  theme: 'dark' | 'light';
  language: Language;
};

export type GameAction =
  | { type: 'ADD_LETTER'; letter: string }
  | { type: 'REMOVE_LETTER' }
  | { type: 'CLEAR_GUESS' }
  | { type: 'SUBMIT_GUESS'; guess: string; evaluation: GuessEvaluation; status: GameStatus; message?: string }
  | { type: 'SET_MESSAGE'; message: string | null }
  | { type: 'RESET_GAME'; solution: string; language?: Language }
  | { type: 'TOGGLE_COLOR_BLIND' }
  | { type: 'TOGGLE_HARD_MODE' }
  | { type: 'TOGGLE_THEME' };

export const createInitialState = (
  solution: string,
  colorBlindMode = false,
  hardMode = false,
  theme: 'dark' | 'light' = 'dark',
  language: Language = 'pt'
): GameState => ({
  solution,
  guesses: [],
  evaluations: [],
  currentGuess: '',
  status: 'playing',
  attemptIndex: 0,
  message: null,
  colorBlindMode,
  hardMode,
  theme,
  language
});

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADD_LETTER': {
      if (state.status !== 'playing') return state;
      if (state.currentGuess.length >= WORD_LENGTH) return state;
      return {
        ...state,
        currentGuess: `${state.currentGuess}${action.letter}`
      };
    }
    case 'REMOVE_LETTER': {
      if (state.status !== 'playing') return state;
      return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1)
      };
    }
    case 'CLEAR_GUESS': {
      if (state.status !== 'playing') return state;
      if (!state.currentGuess) return state;
      return {
        ...state,
        currentGuess: ''
      };
    }
    case 'SUBMIT_GUESS': {
      if (state.status !== 'playing') return state;
      if (state.hardMode && state.attemptIndex >= HARD_MODE_ATTEMPTS) return state;

      const nextGuesses = [...state.guesses, action.guess];
      const nextEvaluations = [...state.evaluations, action.evaluation];

      return {
        ...state,
        guesses: nextGuesses,
        evaluations: nextEvaluations,
        currentGuess: '',
        status: action.status,
        attemptIndex: state.hardMode
          ? Math.min(state.attemptIndex + 1, HARD_MODE_ATTEMPTS)
          : state.attemptIndex + 1,
        message: action.message ?? null
      };
    }
    case 'SET_MESSAGE':
      return { ...state, message: action.message };
    case 'RESET_GAME':
      return {
        ...state,
        solution: action.solution,
        guesses: [],
        evaluations: [],
        currentGuess: '',
        status: 'playing',
        attemptIndex: 0,
        message: null,
        language: action.language ?? state.language
      };
    case 'TOGGLE_COLOR_BLIND':
      return { ...state, colorBlindMode: !state.colorBlindMode };
    case 'TOGGLE_HARD_MODE':
      return { ...state, hardMode: !state.hardMode };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    default:
      return state;
  }
};
