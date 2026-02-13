import { MAX_ATTEMPTS } from '../game/constants';
import type { Language } from '../i18n';
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
