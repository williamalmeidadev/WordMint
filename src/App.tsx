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
  isValidWord,
  isWinningGuess,
  normalizeWord
} from './game';
import { createInitialState, gameReducer } from './state/gameReducer';
import type { GuessEvaluation } from './game/types';
import { loadSettings, loadStats, saveSettings, saveStats } from './storage/storage';

const buildActiveRow = (currentGuess: string): GuessEvaluation => ({
  letters: currentGuess.padEnd(WORD_LENGTH, ' ').split('').map((letter) => letter.trim()),
  states: Array(WORD_LENGTH).fill('empty')
});

const hydrateState = () => {
  const settings = loadSettings();
  return createInitialState(getRandomWord(), settings.colorBlindMode);
};

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, hydrateState);
  const [stats, setStats] = useState(loadStats);
  const recordedResultRef = useRef<string | null>(null);

  const { evaluations, currentGuess, attemptIndex, message, status, colorBlindMode, solution, guesses } = state;

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
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    if (status === 'playing') return;

    const resultKey = `${solution}-${guesses.length}`;
    if (recordedResultRef.current === resultKey) return;

    const nextStats = { ...stats };
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

    recordedResultRef.current = resultKey;
    setStats(nextStats);
  }, [evaluations.length, guesses.length, solution, stats, status]);

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

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME', solution: getRandomWord() });
  }, []);

  const shareText = useMemo(() => {
    if (status === 'playing') return '';
    return buildShareText({
      status,
      evaluations
    });
  }, [evaluations, status]);

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
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <Header
          colorBlindMode={colorBlindMode}
          onToggleColorBlind={() => dispatch({ type: 'TOGGLE_COLOR_BLIND' })}
        />

        <section className="grid gap-6 rounded-2xl border border-fog/10 bg-slate/60 px-4 py-5 sm:rounded-3xl sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-fog/50">random mode</p>
              <p className="text-base font-semibold sm:text-lg">
                {status === 'playing' && 'Make your next guess'}
                {status === 'won' && 'Great work!'}
                {status === 'lost' && 'Better luck next round'}
              </p>
            </div>
            <button
              type="button"
              onClick={resetGame}
              className="w-full rounded-full border border-fog/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fog/70 transition hover:border-mint hover:text-mint sm:w-auto"
            >
              New word
            </button>
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
          status={status}
          onShare={handleShare}
          shareAvailable={status !== 'playing'}
        />
      </div>
    </main>
  );
}
