import { memo } from 'react';

type HeaderProps = {
  colorBlindMode: boolean;
  onToggleColorBlind: () => void;
  hardMode: boolean;
  onToggleHardMode: () => void;
};

function Header({ colorBlindMode, onToggleColorBlind, hardMode, onToggleHardMode }: HeaderProps) {
  return (
    <header className="panel flex flex-col gap-5 rounded-2xl border border-fog/10 bg-slate/70 px-4 py-5 sm:gap-6 sm:rounded-3xl sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-mint">WordMint</p>
          <h1 className="text-2xl font-semibold text-fog sm:text-3xl">Random word challenge, crafted offline.</h1>
          <p className="max-w-xl text-sm text-fog/70 sm:text-base">
            Guess the five-letter word in six tries. Play as many random rounds as you like.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs uppercase tracking-[0.35em] text-fog/60">Preferences</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onToggleHardMode}
            className={`control-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
              hardMode ? 'bg-mint text-ink' : 'bg-ink/60 text-fog'
            }`}
            aria-pressed={hardMode}
          >
            Hard mode {hardMode ? 'on' : 'off'}
          </button>
          <button
            type="button"
            onClick={onToggleColorBlind}
            className={`control-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
              colorBlindMode ? 'bg-lemon text-ink' : 'bg-ink/60 text-fog'
            }`}
            aria-pressed={colorBlindMode}
          >
            Color-blind palette {colorBlindMode ? 'on' : 'off'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
