import { memo } from 'react';
import type { MouseEvent } from 'react';
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
  enterLabel: string;
  backspaceLabel: string;
  keyboardLabel: string;
};

function Keyboard({ letterStates, onLetter, onEnter, onBackspace, enterLabel, backspaceLabel, keyboardLabel }: KeyboardProps) {
  const handleLetterClick = (event: MouseEvent<HTMLButtonElement>) => {
    const key = event.currentTarget.dataset.key;
    if (key) onLetter(key);
  };

  return (
    <section aria-label={keyboardLabel} className="flex flex-col gap-1.5 sm:gap-2">
      {rows.map((row, rowIndex) => (
        <div
          key={`key-row-${rowIndex}`}
          className="keyboard-row flex flex-nowrap justify-center gap-1.5 sm:gap-2"
        >
          {row.map((key) => {
            if (key === 'ENTER') {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={onEnter}
                  className="key key--action key--wide"
                >
                  {enterLabel}
                </button>
              );
            }
            if (key === 'BACK') {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={onBackspace}
                  className="key key--action key--wide"
                  aria-label={backspaceLabel}
                >
                  {backspaceLabel}
                </button>
              );
            }

            return (
              <button
                key={key}
                type="button"
                data-key={key}
                onClick={handleLetterClick}
                className={`${keyStyles[letterStates[key] ?? 'empty']} key--letter`}
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

export default memo(Keyboard);
