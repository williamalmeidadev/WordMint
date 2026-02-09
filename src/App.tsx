import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import MessageBanner from './components/MessageBanner';
import StatsPanel from './components/StatsPanel';
import {
  MAX_ATTEMPTS,
  WORD_LENGTH,
  buildEmptyEvaluation,
  buildKeyboardState,
  buildShareText,
  evaluateGuess,
  getRandomWord,
  getHardModeViolation,
  isValidWord,
  isWinningGuess,
  normalizeWord
} from './game';
import { createInitialState, gameReducer } from './state/gameReducer';
import type { GuessEvaluation } from './game/types';
import { loadSettings, loadStats, saveSettings, saveStats } from './storage/storage';
import { getStrings } from './i18n';

const buildActiveRow = (currentGuess: string): GuessEvaluation => ({
  letters: currentGuess.padEnd(WORD_LENGTH, ' ').split('').map((letter) => letter.trim()),
  states: Array(WORD_LENGTH).fill('empty')
});

const hydrateState = () => {
  const settings = loadSettings();
  return createInitialState(
    getRandomWord(settings.language),
    settings.colorBlindMode,
    settings.hardMode,
    settings.theme,
    settings.language
  );
};

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, hydrateState);
  const [stats, setStats] = useState(loadStats);
  const recordedResultRef = useRef<string | null>(null);

  const {
    evaluations,
    currentGuess,
    attemptIndex,
    message,
    status,
    colorBlindMode,
    hardMode,
    theme,
    solution,
    guesses,
    language
  } = state;
  const strings = getStrings(language);

  const rows = useMemo(() => {
    const filledRows = evaluations.map((evaluation) => evaluation);
    const activeRow = status === 'playing' && filledRows.length < MAX_ATTEMPTS ? buildActiveRow(currentGuess) : null;
    const emptyRows = Array.from({ length: MAX_ATTEMPTS - filledRows.length - (activeRow ? 1 : 0) }, () =>
      buildEmptyEvaluation()
    );
    return [...filledRows, ...(activeRow ? [activeRow] : []), ...emptyRows];
  }, [currentGuess, evaluations, status]);

  const keyboardState = useMemo(() => buildKeyboardState(evaluations), [evaluations]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-blind', String(colorBlindMode));
  }, [colorBlindMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    saveSettings({ colorBlindMode, hardMode, theme, language });
  }, [colorBlindMode, hardMode, theme, language]);

  useEffect(() => {
    if (status === 'playing') {
      recordedResultRef.current = null;
    }
  }, [status]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    if (status === 'playing') return;

    const resultKey = `${solution}-${guesses.length}`;
    if (recordedResultRef.current === resultKey) return;
    recordedResultRef.current = resultKey;

    setStats((prev) => {
      const nextStats = { ...prev };
      nextStats.gamesPlayed += 1;
      if (status === 'won') {
        nextStats.gamesWon += 1;
        if (evaluations.length > 0) {
          nextStats.guessDistribution[evaluations.length - 1] += 1;
        }
        nextStats.currentStreak += 1;
        nextStats.maxStreak = Math.max(nextStats.maxStreak, nextStats.currentStreak);
      } else {
        nextStats.currentStreak = 0;
      }
      return nextStats;
    });
  }, [evaluations.length, guesses.length, solution, status]);

  const setMessage = useCallback((nextMessage: string | null) => {
    dispatch({ type: 'SET_MESSAGE', message: nextMessage });
  }, []);

  useEffect(() => {
    if (!message || status !== 'playing') return;
    const timer = window.setTimeout(() => setMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [message, setMessage, status]);

  const submitGuess = useCallback(() => {
    if (status !== 'playing') return;
    if (currentGuess.length < WORD_LENGTH) {
      setMessage(strings.notEnoughLetters);
      return;
    }
    if (hardMode) {
      const violation = getHardModeViolation(
        currentGuess,
        evaluations,
        strings.hardModePosition,
        strings.hardModeInclude
      );
      if (violation) {
        setMessage(violation);
        return;
      }
    }
    if (!isValidWord(currentGuess, language)) {
      setMessage(strings.notInWordList);
      return;
    }

    const evaluation = evaluateGuess(currentGuess, solution);
    const isWin = isWinningGuess(currentGuess, solution);
    const nextStatus = isWin ? 'won' : attemptIndex + 1 >= MAX_ATTEMPTS ? 'lost' : 'playing';
    const nextMessage = isWin
      ? strings.solvedIn(attemptIndex + 1)
      : nextStatus === 'lost'
        ? strings.wordWas(solution)
        : null;

    dispatch({
      type: 'SUBMIT_GUESS',
      guess: normalizeWord(currentGuess),
      evaluation,
      status: nextStatus,
      message: nextMessage ?? undefined
    });
  }, [attemptIndex, currentGuess, evaluations, hardMode, language, setMessage, solution, status, strings]);

  const handleLetter = useCallback(
    (letter: string) => {
      if (status !== 'playing') return;
      if (currentGuess.length >= WORD_LENGTH) return;
      dispatch({ type: 'ADD_LETTER', letter });
    },
    [currentGuess.length, status]
  );

  const handleBackspace = useCallback(() => {
    dispatch({ type: 'REMOVE_LETTER' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME', solution: getRandomWord(language) });
  }, [language]);

  const shareText = useMemo(() => {
    if (status === 'playing') return '';
    return buildShareText({
      status,
      evaluations,
      header: strings.shareHeader
    });
  }, [evaluations, status, strings]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setMessage(strings.copiedToClipboard);
    } catch {
      setMessage(strings.clipboardUnavailable);
    }
  }, [setMessage, shareText, strings]);

  const handleLanguageChange = useCallback(
    (nextLanguage: typeof language) => {
      if (nextLanguage === language) return;
      dispatch({
        type: 'RESET_GAME',
        solution: getRandomWord(nextLanguage),
        language: nextLanguage
      });
    },
    [language]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitGuess();
        return;
      }
    if (event.key === 'Backspace') {
      event.preventDefault();
      handleBackspace();
      return;
    }
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        handleLetter(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackspace, handleLetter, submitGuess]);

  return (
    <main className="app-shell min-h-screen text-fog">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <Header
          colorBlindMode={colorBlindMode}
          onToggleColorBlind={() => dispatch({ type: 'TOGGLE_COLOR_BLIND' })}
          hardMode={hardMode}
          onToggleHardMode={() => dispatch({ type: 'TOGGLE_HARD_MODE' })}
          theme={theme}
          onToggleTheme={() => dispatch({ type: 'TOGGLE_THEME' })}
          language={language}
          onLanguageChange={handleLanguageChange}
          strings={{
            appName: strings.appName,
            heroTitle: strings.heroTitle,
            heroSubtitle: strings.heroSubtitle,
            preferences: strings.preferences,
            themeToggle: strings.themeToggle,
            hardModeToggle: strings.hardModeToggle,
            colorBlindToggle: strings.colorBlindToggle,
            languageLabel: strings.languageLabel,
            languageOption: strings.languageOption
          }}
        />

        <section className="panel grid gap-6 rounded-2xl border border-fog/10 bg-slate/60 px-4 py-5 sm:rounded-3xl sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-fog/50">{strings.randomMode}</p>
              <p className="text-base font-semibold sm:text-lg">
                {status === 'playing' && strings.statusPlaying}
                {status === 'won' && strings.statusWon}
                {status === 'lost' && strings.statusLost}
              </p>
            </div>
            <button
              type="button"
              onClick={resetGame}
              className="control-pill w-full rounded-full border border-fog/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fog/70 transition hover:border-mint hover:text-mint sm:w-auto"
            >
              {strings.newWord}
            </button>
          </div>

          <MessageBanner message={message} />
          <GameBoard
            rows={rows}
            activeRowIndex={status === 'playing' ? evaluations.length : -1}
            tileAria={(row, col, state) => strings.tileAria(row, col, strings.stateLabel(state))}
            boardLabel={strings.guessBoard}
          />
        </section>

        <Keyboard
          letterStates={keyboardState}
          onLetter={handleLetter}
          onEnter={submitGuess}
          onBackspace={handleBackspace}
          enterLabel={strings.enterKey}
          backspaceLabel={strings.backspaceKey}
          keyboardLabel={strings.onScreenKeyboard}
        />

        <StatsPanel
          stats={stats}
          status={status}
          onShare={handleShare}
          shareAvailable={status !== 'playing'}
          strings={{
            statistics: strings.statistics,
            progressSnapshot: strings.progressSnapshot,
            shareResult: strings.shareResult,
            games: strings.games,
            winRate: strings.winRate,
            currentStreak: strings.currentStreak,
            maxStreak: strings.maxStreak,
            guessDistribution: strings.guessDistribution,
            finishRound: strings.finishRound,
            resultRecorded: strings.resultRecorded
          }}
        />
      </div>
    </main>
  );
}
