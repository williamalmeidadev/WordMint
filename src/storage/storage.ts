import { HARD_MODE_ATTEMPTS, MAX_ATTEMPTS, WORD_LENGTH } from '../game/constants';
import type { GuessEvaluation, GameStatus, LetterState } from '../game/types';
import type { Language } from '../i18n';
const STATS_KEY = 'wordmint-stats';
const SETTINGS_KEY = 'wordmint-settings';
const GAME_STATE_KEY = 'wordmint-game-state';

export type GameStats = {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
};

export type GameSettings = {
  colorBlindMode: boolean;
  hardMode: boolean;
  theme: 'dark' | 'light';
  language: Language;
};

export type PersistedGameState = {
  solution: string;
  guesses: string[];
  evaluations: GuessEvaluation[];
  currentGuess: string;
  status: GameStatus;
  attemptIndex: number;
  colorBlindMode: boolean;
  hardMode: boolean;
  theme: 'dark' | 'light';
  language: Language;
};

export const createDefaultSettings = (): GameSettings => ({
  colorBlindMode: false,
  hardMode: false,
  theme: 'dark',
  language: 'pt'
});

export const createEmptyStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: Array.from({ length: MAX_ATTEMPTS }, () => 0)
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toSafeNonNegativeInt = (value: unknown, fallback = 0) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.trunc(value));
};

const sanitizeDistribution = (value: unknown) => {
  if (!Array.isArray(value)) return createEmptyStats().guessDistribution;
  const normalized = value
    .slice(0, MAX_ATTEMPTS)
    .map((item) => toSafeNonNegativeInt(item));
  while (normalized.length < MAX_ATTEMPTS) normalized.push(0);
  return normalized;
};

const sanitizeStats = (value: unknown): GameStats => {
  if (!isRecord(value)) return createEmptyStats();
  return {
    gamesPlayed: toSafeNonNegativeInt(value.gamesPlayed),
    gamesWon: toSafeNonNegativeInt(value.gamesWon),
    currentStreak: toSafeNonNegativeInt(value.currentStreak),
    maxStreak: toSafeNonNegativeInt(value.maxStreak),
    guessDistribution: sanitizeDistribution(value.guessDistribution)
  };
};

const sanitizeLanguage = (value: unknown): Language => (value === 'en' ? 'en' : 'pt');

const sanitizeTheme = (value: unknown): 'dark' | 'light' => (value === 'light' ? 'light' : 'dark');

const sanitizeWord = (value: unknown) =>
  typeof value === 'string'
    ? value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, WORD_LENGTH)
    : '';

const sanitizeStatus = (value: unknown): GameStatus => {
  if (value === 'won' || value === 'lost') return value;
  return 'playing';
};

const sanitizeLetterState = (value: unknown): LetterState => {
  if (value === 'correct' || value === 'present' || value === 'absent' || value === 'empty') return value;
  return 'empty';
};

const sanitizeEvaluation = (value: unknown): GuessEvaluation | null => {
  if (!isRecord(value) || !Array.isArray(value.letters) || !Array.isArray(value.states)) return null;
  if (value.letters.length !== WORD_LENGTH || value.states.length !== WORD_LENGTH) return null;

  const letters = value.letters.map((letter) => sanitizeWord(letter).slice(0, 1));
  const states = value.states.map((state) => sanitizeLetterState(state));
  return { letters, states };
};

const sanitizePersistedGameState = (value: unknown): PersistedGameState | null => {
  if (!isRecord(value)) return null;

  const solution = sanitizeWord(value.solution);
  if (solution.length !== WORD_LENGTH) return null;

  const guessesRaw = Array.isArray(value.guesses) ? value.guesses : [];
  const guesses = guessesRaw.map((guess) => sanitizeWord(guess)).filter((guess) => guess.length === WORD_LENGTH);

  const evaluationsRaw = Array.isArray(value.evaluations) ? value.evaluations : [];
  const evaluations = evaluationsRaw.map((evaluation) => sanitizeEvaluation(evaluation)).filter(Boolean) as GuessEvaluation[];

  const status = sanitizeStatus(value.status);
  const hardMode = Boolean(value.hardMode);
  const maxAttempts = hardMode ? HARD_MODE_ATTEMPTS : Number.MAX_SAFE_INTEGER;
  const cappedLength = Math.min(guesses.length, evaluations.length, maxAttempts);
  const normalizedGuesses = guesses.slice(0, cappedLength);
  const normalizedEvaluations = evaluations.slice(0, cappedLength);
  const attemptIndexBase = toSafeNonNegativeInt(value.attemptIndex, normalizedGuesses.length);
  const attemptIndex = Math.min(Math.max(attemptIndexBase, normalizedGuesses.length), maxAttempts);

  return {
    solution,
    guesses: normalizedGuesses,
    evaluations: normalizedEvaluations,
    currentGuess: status === 'playing' ? sanitizeWord(value.currentGuess) : '',
    status,
    attemptIndex: Math.max(attemptIndex, normalizedGuesses.length),
    colorBlindMode: Boolean(value.colorBlindMode),
    hardMode,
    theme: sanitizeTheme(value.theme),
    language: sanitizeLanguage(value.language)
  };
};

const sanitizeSettings = (value: unknown): GameSettings => {
  if (!isRecord(value)) return createDefaultSettings();
  return {
    colorBlindMode: Boolean(value.colorBlindMode),
    hardMode: Boolean(value.hardMode),
    theme: sanitizeTheme(value.theme),
    language: sanitizeLanguage(value.language)
  };
};

export const loadStats = (): GameStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return createEmptyStats();
    return sanitizeStats(JSON.parse(raw));
  } catch {
    return createEmptyStats();
  }
};

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const loadSettings = (): GameSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return createDefaultSettings();
    return sanitizeSettings(JSON.parse(raw));
  } catch {
    return createDefaultSettings();
  }
};

export const saveSettings = (settings: GameSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadGameState = (): PersistedGameState | null => {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return null;
    return sanitizePersistedGameState(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const saveGameState = (state: PersistedGameState) => {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
};
