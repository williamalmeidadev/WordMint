import type { LetterState } from '../game/types';

const rows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

const keyStyles: Record<LetterState, string> = {
  correct: 'key key--correct',
  present: 'key key--present',
  absent: 'key key--absent',
  empty: 'key'
};

type KeyboardProps = {
  letterStates: Record<string, LetterState>;
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
};

export default function Keyboard({ letterStates, onLetter, onEnter, onBackspace }: KeyboardProps) {
  return (
    <section aria-label="On screen keyboard" className="flex flex-col gap-2">
      {rows.map((row, rowIndex) => (
        <div key={`key-row-${rowIndex}`} className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {row.map((key) => {
            if (key === 'ENTER') {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={onEnter}
                  className="key key--action"
                >
                  Enter
                </button>
              );
            }
            if (key === 'BACK') {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={onBackspace}
                  className="key key--action"
                  aria-label="Backspace"
                >
                  Back
                </button>
              );
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => onLetter(key)}
                className={keyStyles[letterStates[key] ?? 'empty']}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </section>
  );
}
