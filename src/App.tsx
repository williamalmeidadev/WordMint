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
  getDailyWord,
  getDateKey,
  getRandomWord,
  isValidWord,
  isWinningGuess,
  normalizeWord
} from './game';
import { createInitialState, gameReducer } from './state/gameReducer';
import type { GuessEvaluation, GameMode } from './game/types';
import {
  clearDailyState,
  loadDailyState,
  loadSettings,
  loadStats,
  saveDailyState,
  saveSettings,
  saveStats
} from './storage/storage';

const buildActiveRow = (currentGuess: string): GuessEvaluation => ({
  letters: currentGuess.padEnd(WORD_LENGTH, ' ').split('').map((letter) => letter.trim()),
  states: Array(WORD_LENGTH).fill('empty')
});

const hydrateDailyState = () => {
  const dateKey = getDateKey();
  const solution = getDailyWord();
  const stored = loadDailyState();
  const settings = loadSettings();

  if (!stored || stored.dateKey !== dateKey || stored.solution !== solution) {
    clearDailyState();
    return createInitialState('daily', solution, settings.colorBlindMode);
  }

  const evaluations = stored.guesses.map((guess) => evaluateGuess(guess, stored.solution));

  return {
    ...createInitialState('daily', stored.solution, settings.colorBlindMode),
    guesses: stored.guesses,
    evaluations,
    attemptIndex: stored.guesses.length,
    status: stored.status
  };
};

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, hydrateDailyState);
  const [stats, setStats] = useState(loadStats);
  const recordedResultRef = useRef<string | null>(null);

  const { evaluations, currentGuess, attemptIndex, message, status, mode, colorBlindMode, solution, guesses } = state;
  const dateKey = useMemo(() => getDateKey(), []);

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
    saveSettings({ colorBlindMode });
  }, [colorBlindMode]);

  useEffect(() => {
    if (status === 'playing') {
      recordedResultRef.current = null;
    }
  }, [status]);

  useEffect(() => {
    if (mode !== 'daily') return;
    saveDailyState({
      dateKey,
      solution,
      guesses,
      status
    });
  }, [dateKey, guesses, mode, solution, status]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    if (status === 'playing') return;

    const resultKey = `${mode}-${dateKey}-${solution}-${guesses.length}`;
    if (recordedResultRef.current === resultKey) return;
    if (mode === 'daily' && stats.lastResultDateKey === dateKey) return;

    const nextStats = { ...stats };
    nextStats.gamesPlayed += 1;
    if (status === 'won') {
      nextStats.gamesWon += 1;
      if (evaluations.length > 0) {
        nextStats.guessDistribution[evaluations.length - 1] += 1;
      }
      if (mode === 'daily') {
        nextStats.currentStreak += 1;
        nextStats.maxStreak = Math.max(nextStats.maxStreak, nextStats.currentStreak);
      }
    } else if (mode === 'daily') {
      nextStats.currentStreak = 0;
    }

    if (mode === 'daily') {
      nextStats.lastResultDateKey = dateKey;
    }

    recordedResultRef.current = resultKey;
    setStats(nextStats);
  }, [dateKey, evaluations.length, guesses.length, mode, solution, stats, status]);

  const setMessage = useCallback((nextMessage: string | null) => {
    dispatch({ type: 'SET_MESSAGE', message: nextMessage });
  }, []);

  const submitGuess = useCallback(() => {
    if (status !== 'playing') return;
    if (currentGuess.length < WORD_LENGTH) {
      setMessage('Not enough letters');
      return;
    }
    if (!isValidWord(currentGuess)) {
      setMessage('Not in word list');
      return;
    }

    const evaluation = evaluateGuess(currentGuess, solution);
    const isWin = isWinningGuess(currentGuess, solution);
    const nextStatus = isWin ? 'won' : attemptIndex + 1 >= MAX_ATTEMPTS ? 'lost' : 'playing';
    const nextMessage = isWin
      ? `Solved in ${attemptIndex + 1} ${attemptIndex + 1 === 1 ? 'try' : 'tries'}`
      : nextStatus === 'lost'
        ? `The word was ${solution}`
        : null;

    dispatch({
      type: 'SUBMIT_GUESS',
      guess: normalizeWord(currentGuess),
      evaluation,
      status: nextStatus,
      message: nextMessage ?? undefined
    });
  }, [attemptIndex, currentGuess, setMessage, solution, status]);

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

  const handleModeChange = useCallback(
    (nextMode: GameMode) => {
      if (nextMode === mode) return;
      const nextSolution = nextMode === 'daily' ? getDailyWord() : getRandomWord();
      dispatch({ type: 'SET_MODE', mode: nextMode, solution: nextSolution });
    },
    [mode]
  );

  const resetPractice = useCallback(() => {
    if (mode !== 'practice') return;
    dispatch({ type: 'RESET_GAME', solution: getRandomWord() });
  }, [mode]);

  const shareText = useMemo(() => {
    if (status === 'playing') return '';
    return buildShareText({
      mode,
      dateKey,
      status,
      evaluations
    });
  }, [dateKey, evaluations, mode, status]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setMessage('Copied to clipboard');
    } catch {
      setMessage('Clipboard unavailable');
    }
  }, [setMessage, shareText]);

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
    <main className="min-h-screen bg-ink text-fog">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-10">
        <Header
          mode={mode}
          onModeChange={handleModeChange}
          colorBlindMode={colorBlindMode}
          onToggleColorBlind={() => dispatch({ type: 'TOGGLE_COLOR_BLIND' })}
        />

        <section className="grid gap-6 rounded-3xl border border-fog/10 bg-slate/60 px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-fog/50">{mode} mode</p>
              <p className="text-lg font-semibold">
                {status === 'playing' && 'Make your next guess'}
                {status === 'won' && 'Great work!'}
                {status === 'lost' && 'Better luck next round'}
              </p>
            </div>
            {mode === 'practice' ? (
              <button
                type="button"
                onClick={resetPractice}
                className="rounded-full border border-fog/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fog/70 transition hover:border-mint hover:text-mint"
              >
                New practice word
              </button>
            ) : null}
          </div>

          <MessageBanner message={message} />
          <GameBoard rows={rows} activeRowIndex={status === 'playing' ? evaluations.length : -1} />
        </section>

        <Keyboard
          letterStates={keyboardState}
          onLetter={handleLetter}
          onEnter={submitGuess}
          onBackspace={handleBackspace}
        />

        <StatsPanel
          stats={stats}
          mode={mode}
          status={status}
          attempts={status === 'won' ? evaluations.length : 0}
          onShare={handleShare}
          shareAvailable={status !== 'playing'}
        />
      </div>
    </main>
  );
}
