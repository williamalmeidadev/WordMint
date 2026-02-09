import { MAX_ATTEMPTS } from '../game/constants';
const STATS_KEY = 'wordmint-stats';
const SETTINGS_KEY = 'wordmint-settings';

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
};

export const createDefaultSettings = (): GameSettings => ({
  colorBlindMode: false,
  hardMode: false,
  theme: 'dark'
});

export const createEmptyStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: Array.from({ length: MAX_ATTEMPTS }, () => 0)
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

export const loadSettings = (): GameSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return createDefaultSettings();
    const parsed = JSON.parse(raw) as GameSettings;
    if (typeof parsed.colorBlindMode !== 'boolean') return createDefaultSettings();
    if (typeof parsed.hardMode !== 'boolean') return createDefaultSettings();
    if (parsed.theme !== 'dark' && parsed.theme !== 'light') return createDefaultSettings();
    return parsed;
  } catch {
    return createDefaultSettings();
  }
};

export const saveSettings = (settings: GameSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
