import { MAX_ATTEMPTS } from '../game/constants';
import type { GameStatus } from '../game/types';

const STATS_KEY = 'wordmint-stats';
const DAILY_KEY = 'wordmint-daily';
const SETTINGS_KEY = 'wordmint-settings';

export type GameStats = {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastResultDateKey: string | null;
};

export type StoredDailyState = {
  dateKey: string;
  solution: string;
  guesses: string[];
  status: GameStatus;
};

export type GameSettings = {
  colorBlindMode: boolean;
};

export const createDefaultSettings = (): GameSettings => ({
  colorBlindMode: false
});

export const createEmptyStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: Array.from({ length: MAX_ATTEMPTS }, () => 0),
  lastResultDateKey: null
});

export const loadStats = (): GameStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return createEmptyStats();
    const parsed = JSON.parse(raw) as GameStats;
    if (!parsed.guessDistribution || parsed.guessDistribution.length !== MAX_ATTEMPTS) {
      return createEmptyStats();
    }
    return parsed;
  } catch {
    return createEmptyStats();
  }
};

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const loadDailyState = (): StoredDailyState | null => {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredDailyState;
  } catch {
    return null;
  }
};

export const saveDailyState = (state: StoredDailyState) => {
  localStorage.setItem(DAILY_KEY, JSON.stringify(state));
};

export const clearDailyState = () => {
  localStorage.removeItem(DAILY_KEY);
};

export const loadSettings = (): GameSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return createDefaultSettings();
    const parsed = JSON.parse(raw) as GameSettings;
    if (typeof parsed.colorBlindMode !== 'boolean') return createDefaultSettings();
    return parsed;
  } catch {
    return createDefaultSettings();
  }
};

export const saveSettings = (settings: GameSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
