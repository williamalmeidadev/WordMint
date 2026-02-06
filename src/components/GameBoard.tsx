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
};

export default function GameBoard({ rows, activeRowIndex }: GameBoardProps) {
  return (
    <section aria-label="Guess board" className="grid gap-3">
      {rows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-2">
          {row.letters.map((letter, index) => (
            <div
              key={`tile-${rowIndex}-${index}`}
              className={`${stateClass[row.states[index]]} ${
                rowIndex === activeRowIndex ? 'tile--active' : ''
              }`}
              aria-label={`Row ${rowIndex + 1} letter ${index + 1} ${row.states[index]}`}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
