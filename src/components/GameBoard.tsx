import { memo } from 'react';
import type { GuessEvaluation, LetterState } from '../game/types';

const stateClass: Record<LetterState, string> = {
  correct: 'tile tile--correct',
  present: 'tile tile--present',
  absent: 'tile tile--absent',
  empty: 'tile'
};

type GameBoardProps = {
  rows: GuessEvaluation[];
  activeRowIndex: number;
  tileAria: (row: number, col: number, state: string) => string;
  boardLabel: string;
};

function GameBoard({ rows, activeRowIndex, tileAria, boardLabel }: GameBoardProps) {
  return (
    <section aria-label={boardLabel} className="grid gap-2 sm:gap-3">
      {rows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {row.letters.map((letter, index) => (
            <div
              key={`tile-${rowIndex}-${index}`}
              className={`${stateClass[row.states[index]]} ${
                rowIndex === activeRowIndex ? 'tile--active' : ''
              }`}
              aria-label={tileAria(rowIndex + 1, index + 1, row.states[index])}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export default memo(GameBoard);
