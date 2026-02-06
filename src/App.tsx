import { useCallback, useEffect, useMemo, useReducer } from 'react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import MessageBanner from './components/MessageBanner';
import {
  MAX_ATTEMPTS,
  WORD_LENGTH,
  buildEmptyEvaluation,
  buildKeyboardState,
  evaluateGuess,
  getDailyWord,
  getRandomWord,
  isValidWord,
  isWinningGuess,
  normalizeWord
} from './game';
import { createInitialState, gameReducer } from './state/gameReducer';
import type { GuessEvaluation, GameMode } from './game/types';

const buildActiveRow = (currentGuess: string): GuessEvaluation => ({
  letters: currentGuess.padEnd(WORD_LENGTH, ' ').split('').map((letter) => letter.trim()),
  states: Array(WORD_LENGTH).fill('empty')
});

export default function App() {
  const [state, dispatch] = useReducer(
    gameReducer,
    createInitialState('daily', getDailyWord())
  );

  const { evaluations, currentGuess, attemptIndex, message, status, mode, colorBlindMode } = state;

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

    const evaluation = evaluateGuess(currentGuess, state.solution);
    const isWin = isWinningGuess(currentGuess, state.solution);
    const nextStatus = isWin ? 'won' : attemptIndex + 1 >= MAX_ATTEMPTS ? 'lost' : 'playing';
    const nextMessage = isWin
      ? `Solved in ${attemptIndex + 1} ${attemptIndex + 1 === 1 ? 'try' : 'tries'}`
      : nextStatus === 'lost'
        ? `The word was ${state.solution}`
        : null;

    dispatch({
      type: 'SUBMIT_GUESS',
      guess: normalizeWord(currentGuess),
      evaluation,
      status: nextStatus,
      message: nextMessage ?? undefined
    });
  }, [attemptIndex, currentGuess, setMessage, state.solution, status]);

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
      </div>
    </main>
  );
}
