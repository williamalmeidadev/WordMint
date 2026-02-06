import type { GameMode } from '../game/types';

type HeaderProps = {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  colorBlindMode: boolean;
  onToggleColorBlind: () => void;
};

export default function Header({ mode, onModeChange, colorBlindMode, onToggleColorBlind }: HeaderProps) {
  return (
    <header className="flex flex-col gap-6 rounded-3xl border border-fog/10 bg-slate/70 px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-mint">WordMint</p>
          <h1 className="text-3xl font-semibold text-fog">Daily word challenge, crafted offline.</h1>
          <p className="max-w-xl text-sm text-fog/70">
            Guess the five-letter word in six tries. Play the daily puzzle or practice unlimited rounds.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onModeChange('daily')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === 'daily' ? 'bg-mint text-ink' : 'bg-ink/60 text-fog'
            }`}
          >
            Daily mode
          </button>
          <button
            type="button"
            onClick={() => onModeChange('practice')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === 'practice' ? 'bg-mint text-ink' : 'bg-ink/60 text-fog'
            }`}
          >
            Practice mode
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.35em] text-fog/60">Accessibility</p>
        <button
          type="button"
          onClick={onToggleColorBlind}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
            colorBlindMode ? 'bg-lemon text-ink' : 'bg-ink/60 text-fog'
          }`}
          aria-pressed={colorBlindMode}
        >
          Color-blind palette {colorBlindMode ? 'on' : 'off'}
        </button>
      </div>
    </header>
  );
}
