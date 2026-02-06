import { MAX_ATTEMPTS, WORD_LENGTH } from '../game/constants';
import type { GameMode, GameStatus, GuessEvaluation } from '../game/types';

export type GameState = {
  mode: GameMode;
  solution: string;
  guesses: string[];
  evaluations: GuessEvaluation[];
  currentGuess: string;
  status: GameStatus;
  attemptIndex: number;
  message: string | null;
  colorBlindMode: boolean;
};

export type GameAction =
  | { type: 'ADD_LETTER'; letter: string }
  | { type: 'REMOVE_LETTER' }
  | { type: 'SUBMIT_GUESS'; guess: string; evaluation: GuessEvaluation; status: GameStatus; message?: string }
  | { type: 'SET_MESSAGE'; message: string | null }
  | { type: 'RESET_GAME'; solution: string }
  | { type: 'SET_MODE'; mode: GameMode; solution: string }
  | { type: 'TOGGLE_COLOR_BLIND' };

export const createInitialState = (mode: GameMode, solution: string): GameState => ({
  mode,
  solution,
  guesses: [],
  evaluations: [],
  currentGuess: '',
  status: 'playing',
  attemptIndex: 0,
  message: null,
  colorBlindMode: false
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
    case 'SUBMIT_GUESS': {
      if (state.status !== 'playing') return state;
      if (state.attemptIndex >= MAX_ATTEMPTS) return state;

      const nextGuesses = [...state.guesses, action.guess];
      const nextEvaluations = [...state.evaluations, action.evaluation];

      return {
        ...state,
        guesses: nextGuesses,
        evaluations: nextEvaluations,
        currentGuess: '',
        status: action.status,
        attemptIndex: Math.min(state.attemptIndex + 1, MAX_ATTEMPTS),
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
        message: null
      };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
        solution: action.solution,
        guesses: [],
        evaluations: [],
        currentGuess: '',
        status: 'playing',
        attemptIndex: 0,
        message: null
      };
    case 'TOGGLE_COLOR_BLIND':
      return { ...state, colorBlindMode: !state.colorBlindMode };
    default:
      return state;
  }
};
